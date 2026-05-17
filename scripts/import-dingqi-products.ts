import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

type SpecificationTable = {
  headers: string[];
  rows: string[][];
  records: Record<string, string>[];
};

type ImportedProduct = {
  id: string;
  product_id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  specifications: SpecificationTable;
  images: string[];
  source_url: string;
  price: string;
  imported_at: string;
};

const ROOT_DIR = process.cwd();
const URLS_FILE = path.join(ROOT_DIR, "urls.txt");
const PRODUCTS_FILE = path.join(ROOT_DIR, "data", "products.json");
const PRODUCT_IMAGES_DIR = path.join(ROOT_DIR, "public", "products");
const ERROR_LOG = path.join(ROOT_DIR, "logs", "errors.txt");
const IMPORT_REPORT = path.join(ROOT_DIR, "logs", "import-report.txt");
const SITE_ORIGIN = "https://www.dingqitools.com";
const CATEGORY_IDS = Array.from({ length: 16 }, (_, index) => index + 1);

const requestHeaders = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36 AtlasProToolsImporter/1.0",
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
};

function cleanText(value: string): string {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function getProductId(sourceUrl: string): string {
  const id = new URL(sourceUrl).searchParams.get("id");
  if (!id) {
    throw new Error(`Missing product id in URL: ${sourceUrl}`);
  }
  return id;
}

function normalizeSourceUrl(sourceUrl: string): string {
  const url = new URL(sourceUrl);
  const id = url.searchParams.get("id");
  return id ? `${url.origin}${url.pathname}?id=${id}` : sourceUrl;
}

function normalizeSku(value: string): string {
  return cleanText(value).toUpperCase();
}

function isSkuKey(key: string): boolean {
  const normalized = cleanText(key).toLowerCase().replace(/\s+/g, " ");
  return ["sku", "code", "code#", "item", "item no", "item no.", "model", "model no", "model no."].includes(
    normalized,
  );
}

function extractSkus(product: Pick<ImportedProduct, "specifications"> & { sku?: string }): string[] {
  const skus = new Set<string>();

  if (product.sku) {
    skus.add(normalizeSku(product.sku));
  }

  for (const record of product.specifications.records || []) {
    for (const [key, value] of Object.entries(record)) {
      if (isSkuKey(key) && value) {
        skus.add(normalizeSku(value));
      }
    }
  }

  return Array.from(skus).filter(Boolean);
}

async function readExistingProducts(): Promise<ImportedProduct[]> {
  try {
    const raw = await readFile(PRODUCTS_FILE, "utf8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error("Expected data/products.json to contain an array");
    }

    return parsed as ImportedProduct[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

type DuplicateIndexes = {
  productIds: Set<string>;
  sourceUrls: Set<string>;
  skus: Set<string>;
};

function buildDuplicateIndexes(products: ImportedProduct[]): DuplicateIndexes {
  const productIds = new Set<string>();
  const sourceUrls = new Set<string>();
  const skus = new Set<string>();

  for (const product of products) {
    if (product.product_id) {
      productIds.add(product.product_id);
    }

    if (product.id) {
      productIds.add(product.id);
    }

    if (product.source_url) {
      sourceUrls.add(normalizeSourceUrl(product.source_url));
    }

    for (const sku of extractSkus(product)) {
      skus.add(sku);
    }
  }

  return { productIds, sourceUrls, skus };
}

function getDuplicateReason(
  url: string,
  parsed: (Pick<ImportedProduct, "product_id" | "id" | "source_url" | "specifications"> & { sku?: string }) | null,
  indexes: DuplicateIndexes,
): string | null {
  const productId = parsed?.product_id || getProductId(url);
  const sourceUrl = parsed?.source_url || url;

  if (indexes.productIds.has(productId)) {
    return `product_id ${productId}`;
  }

  if (indexes.sourceUrls.has(normalizeSourceUrl(sourceUrl))) {
    return `source_url ${normalizeSourceUrl(sourceUrl)}`;
  }

  if (parsed) {
    const duplicateSku = extractSkus(parsed).find((sku) => indexes.skus.has(sku));

    if (duplicateSku) {
      return `SKU ${duplicateSku}`;
    }
  }

  return null;
}

function addProductToIndexes(product: ImportedProduct, indexes: DuplicateIndexes): void {
  indexes.productIds.add(product.product_id);
  indexes.productIds.add(product.id);
  indexes.sourceUrls.add(normalizeSourceUrl(product.source_url));

  for (const sku of extractSkus(product)) {
    indexes.skus.add(sku);
  }
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: requestHeaders,
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function fetchHtmlWithPlaywright(url: string): Promise<string> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      userAgent: requestHeaders["user-agent"],
    });
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    return await page.content();
  } finally {
    await browser.close();
  }
}

async function fetchProductHtml(url: string): Promise<string> {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  if ($(".proInfo .electric").first().text().trim()) {
    return html;
  }

  return fetchHtmlWithPlaywright(url);
}

function getTableCells($: cheerio.CheerioAPI, row: Element): string[] {
  return $(row)
    .find("th,td")
    .map((_, cell) => cleanText($(cell).text()))
    .get()
    .filter(Boolean);
}

function parseSpecifications($: cheerio.CheerioAPI): SpecificationTable {
  const productRoot = $(".proInfo").first();
  const headerRow = productRoot.find(".r table").first().find("tr").first().get(0);
  const headers = headerRow ? getTableCells($, headerRow) : [];

  let rows = productRoot
    .find(".r .gd table tr")
    .toArray()
    .map((row) => getTableCells($, row))
    .filter((row) => row.length > 0);

  if (!rows.length) {
    rows = productRoot
      .find(".r table")
      .slice(1)
      .find("tr")
      .toArray()
      .map((row) => getTableCells($, row))
      .filter((row) => row.length > 0);
  }

  const records = rows.map((row) => {
    return row.reduce<Record<string, string>>((record, value, index) => {
      const label = headers[index] || `Column ${index + 1}`;
      record[label] = value;
      return record;
    }, {});
  });

  return { headers, rows, records };
}

function parseDescription($: cheerio.CheerioAPI): string {
  const materialLabel = $(".proInfo .r .list")
    .filter((_, element) =>
      cleanText($(element).text()).toLowerCase().startsWith("material description"),
    )
    .first();

  if (!materialLabel.length) {
    return "";
  }

  const chunks: string[] = [];
  let next = materialLabel.next();

  while (next.length) {
    const text = cleanText(next.text());

    if (next.hasClass("display") || /^share:?$/i.test(text)) {
      break;
    }

    if (text && !/^material description:?$/i.test(text)) {
      chunks.push(text);
    }

    next = next.next();
  }

  return chunks.join(" ");
}

function normalizeImageUrl(sourceUrl: string, rawSrc: string): string | null {
  if (!rawSrc || rawSrc.startsWith("data:")) {
    return null;
  }

  if (!rawSrc.includes("/uploads/images/")) {
    return null;
  }

  try {
    return new URL(rawSrc, sourceUrl).href;
  } catch {
    return null;
  }
}

function parseImageCategory(imageUrl: string): string {
  try {
    const url = new URL(imageUrl);
    const segments = url.pathname.split("/").map((part) => decodeURIComponent(part));
    const imageIndex = segments.findIndex((part) => part === "images");
    const category = imageIndex >= 0 ? segments[imageIndex + 1] : "";

    if (!category || /^\d{8}$/.test(category)) {
      return "";
    }

    return cleanText(
      category
        .toLowerCase()
        .split(/[\s_-]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    );
  } catch {
    return "";
  }
}

function parseProduct(
  sourceUrl: string,
  html: string,
  categoryMap: Map<string, string>,
): Omit<ImportedProduct, "images" | "imported_at"> & { sourceImageUrls: string[] } {
  const $ = cheerio.load(html);
  const productId = getProductId(sourceUrl);
  const titleFromPage = cleanText($(".proInfo .electric").first().text());
  const titleFromMeta = cleanText($("title").first().text().split("|")[0] || "");
  const title = titleFromPage || titleFromMeta;

  if (!title) {
    throw new Error("Could not extract product title");
  }

  const sourceImageUrls = unique(
    $(".proInfo .left img, .proInfo .bg img, .proInfo .show img, .proInfo .smallshow img, .proInfo .bigshow img")
      .map((_, image) => normalizeImageUrl(sourceUrl, $(image).attr("src") || ""))
      .get()
      .filter((imageUrl): imageUrl is string => Boolean(imageUrl)),
  );

  const category =
    categoryMap.get(productId) || parseImageCategory(sourceImageUrls[0] || "") || "Uncategorized";

  const slug = `${slugify(title)}-${productId}`;

  return {
    id: productId,
    product_id: productId,
    slug,
    title,
    category,
    description: parseDescription($),
    specifications: parseSpecifications($),
    source_url: sourceUrl,
    sourceImageUrls,
    price: "",
  };
}

function getImageExtension(imageUrl: string, contentType: string | null): string {
  if (contentType?.includes("png")) {
    return ".png";
  }

  if (contentType?.includes("webp")) {
    return ".webp";
  }

  if (contentType?.includes("gif")) {
    return ".gif";
  }

  const ext = path.extname(new URL(imageUrl).pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
    return ext === ".jpeg" ? ".jpg" : ext;
  }

  return ".jpg";
}

async function downloadImages(
  productId: string,
  productSlug: string,
  sourceUrl: string,
  sourceImageUrls: string[],
  warnings: string[],
): Promise<string[]> {
  const localDir = path.join(PRODUCT_IMAGES_DIR, productId);
  await mkdir(localDir, { recursive: true });

  const localImages: string[] = [];

  for (const [index, imageUrl] of sourceImageUrls.entries()) {
    try {
      const response = await fetch(imageUrl, {
        headers: {
          ...requestHeaders,
          accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          referer: sourceUrl,
        },
        signal: AbortSignal.timeout(45000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const extension = getImageExtension(imageUrl, response.headers.get("content-type"));
      const fileName = `${productSlug}-${index + 1}${extension}`;
      const filePath = path.join(localDir, fileName);
      const arrayBuffer = await response.arrayBuffer();

      await writeFile(filePath, Buffer.from(arrayBuffer));
      localImages.push(`/products/${productId}/${fileName}`);
    } catch (error) {
      warnings.push(
        `IMAGE ${productId}: ${imageUrl} - ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return localImages;
}

async function readUrls(): Promise<string[]> {
  const raw = await readFile(URLS_FILE, "utf8");
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

async function buildCategoryMap(targetProductIds: Set<string>): Promise<Map<string, string>> {
  const categoryMap = new Map<string, string>();

  for (const categoryId of CATEGORY_IDS) {
    if (categoryMap.size === targetProductIds.size) {
      break;
    }

    const firstUrl = `${SITE_ORIGIN}/pros.html?id=${categoryId}`;

    try {
      const firstHtml = await fetchHtml(firstUrl);
      const firstPage = cheerio.load(firstHtml);
      const categoryName =
        cleanText(firstPage("title").first().text().split("|")[0] || "") ||
        `Category ${categoryId}`;
      const pageNumbers = firstPage('a[href*="page="]')
        .map((_, link) => {
          const href = firstPage(link).attr("href") || "";
          return Number(new URL(href, SITE_ORIGIN).searchParams.get("page") || "1");
        })
        .get()
        .filter((page) => Number.isFinite(page) && page > 1);
      const maxPage = Math.max(1, ...pageNumbers);

      for (let page = 1; page <= maxPage; page += 1) {
        if (categoryMap.size === targetProductIds.size) {
          break;
        }

        const html =
          page === 1
            ? firstHtml
            : await fetchHtml(`${SITE_ORIGIN}/pros.html?id=${categoryId}&page=${page}`);
        const $ = cheerio.load(html);
        const productIds = unique(
          $('a[href*="proInfo.html?id="]')
            .map((_, link) => {
              const href = $(link).attr("href") || "";
              return new URL(href, SITE_ORIGIN).searchParams.get("id") || "";
            })
            .get()
            .filter(Boolean),
        );

        for (const productId of productIds) {
          if (targetProductIds.has(productId)) {
            categoryMap.set(productId, categoryName);
          }
        }
      }
    } catch (error) {
      console.warn(
        `Category ${categoryId} lookup failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return categoryMap;
}

async function main() {
  await mkdir(path.dirname(PRODUCTS_FILE), { recursive: true });
  await mkdir(PRODUCT_IMAGES_DIR, { recursive: true });
  await mkdir(path.dirname(ERROR_LOG), { recursive: true });
  await mkdir(path.dirname(IMPORT_REPORT), { recursive: true });

  const urls = await readUrls();
  const existingProducts = await readExistingProducts();
  const indexes = buildDuplicateIndexes(existingProducts);
  const duplicates: string[] = [];
  const newProducts: ImportedProduct[] = [];
  const candidateUrls: string[] = [];
  const seenIncomingIds = new Set<string>();
  const seenIncomingSourceUrls = new Set<string>();

  for (const url of urls) {
    try {
      const productId = getProductId(url);
      const normalizedUrl = normalizeSourceUrl(url);

      if (seenIncomingIds.has(productId) || seenIncomingSourceUrls.has(normalizedUrl)) {
        duplicates.push(`${url} - incoming duplicate`);
        continue;
      }

      seenIncomingIds.add(productId);
      seenIncomingSourceUrls.add(normalizedUrl);

      const duplicateReason = getDuplicateReason(url, null, indexes);

      if (duplicateReason) {
        duplicates.push(`${url} - duplicate by ${duplicateReason}`);
        continue;
      }

      candidateUrls.push(url);
    } catch (error) {
      duplicates.push(`${url} - invalid URL: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const targetProductIds = new Set(candidateUrls.map(getProductId));
  const failed: string[] = [];
  const warnings: string[] = [];

  console.log(`Reading ${urls.length} DingQi product URLs`);
  console.log(`Loaded ${existingProducts.length} existing products`);
  console.log(`Skipped ${duplicates.length} duplicates before scraping`);
  console.log("Building category map from DingQi category pages for new candidates");
  const categoryMap = await buildCategoryMap(targetProductIds);
  console.log(`Mapped ${categoryMap.size}/${targetProductIds.size} categories`);

  for (const [index, url] of candidateUrls.entries()) {
    try {
      console.log(`[${index + 1}/${candidateUrls.length}] Importing ${url}`);
      const html = await fetchProductHtml(url);
      const parsed = parseProduct(url, html, categoryMap);
      const duplicateReason = getDuplicateReason(url, parsed, indexes);

      if (duplicateReason) {
        duplicates.push(`${url} - duplicate by ${duplicateReason}`);
        console.log(`Skipping ${url}: duplicate by ${duplicateReason}`);
        continue;
      }

      const images = await downloadImages(
        parsed.product_id,
        parsed.slug,
        parsed.source_url,
        parsed.sourceImageUrls,
        warnings,
      );

      const importedProduct = {
        id: parsed.id,
        product_id: parsed.product_id,
        slug: parsed.slug,
        title: parsed.title,
        category: parsed.category,
        description: parsed.description,
        specifications: parsed.specifications,
        source_url: parsed.source_url,
        price: parsed.price,
        images,
        imported_at: new Date().toISOString(),
      };

      newProducts.push(importedProduct);
      addProductToIndexes(importedProduct, indexes);
    } catch (error) {
      const message = `${url} - ${error instanceof Error ? error.message : String(error)}`;
      failed.push(message);
      console.error(message);
    }
  }

  const products = [...existingProducts, ...newProducts];
  const reportLines = [
    `DingQi import report`,
    `Generated at: ${new Date().toISOString()}`,
    ``,
    `URLs processed: ${urls.length}`,
    `Existing products before import: ${existingProducts.length}`,
    `New products added: ${newProducts.length}`,
    ...newProducts.map((product) => `  - ${product.product_id}: ${product.title}`),
    ``,
    `Duplicates skipped: ${duplicates.length}`,
    ...duplicates.map((duplicate) => `  - ${duplicate}`),
    ``,
    `Errors: ${failed.length}`,
    ...failed.map((failure) => `  - ${failure}`),
    ``,
    `Warnings: ${warnings.length}`,
    ...warnings.map((warning) => `  - ${warning}`),
    ``,
    `Products after import: ${products.length}`,
  ];

  await writeFile(PRODUCTS_FILE, `${JSON.stringify(products, null, 2)}\n`, "utf8");
  await writeFile(ERROR_LOG, [...failed, ...warnings].join("\n"), "utf8");
  await writeFile(IMPORT_REPORT, `${reportLines.join("\n")}\n`, "utf8");

  console.log(`Imported ${newProducts.length}/${urls.length} new products`);
  console.log(`Saved products to ${path.relative(ROOT_DIR, PRODUCTS_FILE)}`);
  console.log(`Saved report to ${path.relative(ROOT_DIR, IMPORT_REPORT)}`);

  if (failed.length || warnings.length) {
    console.log(`Logged ${failed.length + warnings.length} issues to ${path.relative(ROOT_DIR, ERROR_LOG)}`);
  } else {
    console.log("No import errors");
  }
}

main().catch(async (error) => {
  await mkdir(path.dirname(ERROR_LOG), { recursive: true });
  await writeFile(ERROR_LOG, error instanceof Error ? error.stack || error.message : String(error));
  console.error(error);
  process.exitCode = 1;
});
