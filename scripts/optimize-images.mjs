import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imageRoots = ["public/products", "images/products"];
const responsiveWidths = [480, 768, 1200];
const sourceExtensions = new Set([".jpg", ".jpeg", ".png"]);

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walkImages(directory) {
  if (!(await exists(directory))) {
    return [];
  }

  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return walkImages(fullPath);
      }

      const extension = path.extname(entry.name).toLowerCase();
      return sourceExtensions.has(extension) ? [fullPath] : [];
    }),
  );

  return files.flat();
}

async function optimizeImage(filePath) {
  const parsed = path.parse(filePath);
  const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);
  const avifPath = path.join(parsed.dir, `${parsed.name}.avif`);
  const image = sharp(filePath, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const sourceWidth = metadata.width || 0;

  await image.clone().webp({ quality: 92, effort: 5 }).toFile(webpPath);
  await image.clone().avif({ quality: 90, effort: 4 }).toFile(avifPath);

  await Promise.all(
    responsiveWidths
      .filter((width) => sourceWidth > width)
      .map((width) =>
        image
          .clone()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 92, effort: 5 })
          .toFile(path.join(parsed.dir, `${parsed.name}-${width}.webp`)),
      ),
  );

  return {
    source: path.relative(root, filePath).replaceAll("\\", "/"),
    webp: path.relative(root, webpPath).replaceAll("\\", "/"),
    avif: path.relative(root, avifPath).replaceAll("\\", "/"),
  };
}

async function updateProductCatalog(conversions) {
  const catalogPath = path.join(root, "data/products.json");
  if (!(await exists(catalogPath))) {
    return;
  }

  const conversionMap = new Map(
    conversions
      .filter(({ source }) => source.startsWith("public/products/"))
      .map(({ source, webp }) => [`/${source.replace(/^public\//, "")}`, `/${webp.replace(/^public\//, "")}`]),
  );
  const products = JSON.parse(await fs.readFile(catalogPath, "utf8"));
  let changed = false;

  for (const product of products) {
    if (!Array.isArray(product.images)) {
      continue;
    }

    product.images = product.images.map((imagePath) => {
      const optimizedPath = conversionMap.get(imagePath);
      if (optimizedPath) {
        changed = true;
        return optimizedPath;
      }
      return imagePath;
    });
  }

  if (changed) {
    await fs.writeFile(catalogPath, `${JSON.stringify(products, null, 2)}\n`);
  }
}

const imageFiles = (
  await Promise.all(imageRoots.map((directory) => walkImages(path.join(root, directory))))
).flat();

const conversions = [];
for (const filePath of imageFiles) {
  conversions.push(await optimizeImage(filePath));
}

await updateProductCatalog(conversions);

console.log(
  JSON.stringify(
    {
      optimizedSources: imageFiles.length,
      generatedFiles: conversions.length * 2,
      responsiveWidths,
    },
    null,
    2,
  ),
);
