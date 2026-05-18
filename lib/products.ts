import productsData from "@/data/products.json";
import { publicAssetPath } from "@/lib/assets";
import type { LanguageCode, LocalizedSpecification, LocalizedText, Product } from "@/lib/types";

export const defaultProductLanguage: LanguageCode = "ar-MA";

const products = (productsData as Product[]).map((product) => ({
  ...product,
  images: product.images.map(publicAssetPath),
}));

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  const decodedSlug = decodeURIComponent(slug);
  return products.find((product) => {
    const slugs = typeof product.slug === "object" ? Object.values(product.slug) : [product.slug];
    return product.route_slug === decodedSlug || slugs.includes(decodedSlug);
  });
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getCategories() {
  const counts = products.reduce<Record<string, number>>((acc, product) => {
    const key = product.categoryKey || getLocalizedText(product.category, "en");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([key, count]) => {
      const firstProduct = products.find((product) => (product.categoryKey || getLocalizedText(product.category, "en")) === key);

      return {
      key,
      name: firstProduct?.category || { en: key, fr: key, "ar-MA": key },
      count,
      slug: categoryToSlug(key),
      image: firstProduct?.images[0] || "",
      };
    })
    .sort((a, b) => getLocalizedText(a.name, "en").localeCompare(getLocalizedText(b.name, "en")));
}

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => (product.categoryKey || getLocalizedText(product.category, "en")) === category);
}

export function getFeaturedProducts(limit = 5): Product[] {
  return products
    .filter((product) => product.images.length > 0)
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((item) => item.id !== product.id && item.categoryKey === product.categoryKey)
    .slice(0, limit);
}

export function getLocalizedText(
  value: LocalizedText | string | undefined,
  language: LanguageCode = defaultProductLanguage,
  fallback = "",
): string {
  if (!value) {
    return fallback;
  }

  if (typeof value === "string") {
    return value || fallback;
  }

  return value[language] || value.en || value["ar-MA"] || value.fr || fallback;
}

export function getProductRoute(product: Product): string {
  return product.route_slug || getLocalizedText(product.slug, "en") || product.id;
}

export function getProductName(product: Product, language: LanguageCode = defaultProductLanguage): string {
  return getLocalizedText(product.name, language, product.original_title || product.product_id);
}

export function getProductCategory(product: Product, language: LanguageCode = defaultProductLanguage): string {
  return getLocalizedText(product.category, language, product.original_category || product.categoryKey);
}

export function getProductDescription(product: Product, language: LanguageCode = defaultProductLanguage): string {
  return getLocalizedText(product.description, language);
}

export function getProductShortDescription(product: Product, language: LanguageCode = defaultProductLanguage): string {
  return getLocalizedText(product.shortDescription, language, getProductDescription(product, language));
}

export function getProductImageAlt(
  product: Product,
  language: LanguageCode = defaultProductLanguage,
  index?: number,
): string {
  const base = getLocalizedText(product.imageAlt, language, getProductName(product, language));
  return typeof index === "number" ? `${base} ${index + 1}` : base;
}

export function getProductSeo(product: Product, language: LanguageCode = defaultProductLanguage) {
  const name = getProductName(product, language);
  const category = getProductCategory(product, language);

  return {
    title: getLocalizedText(product.seo?.title, language, `${name} | DINGQI GROS`),
    description: getLocalizedText(
      product.seo?.description,
      language,
      `${name} - ${category}. Product ID ${product.product_id}.`,
    ),
  };
}

export function getLocalizedSpecLabel(
  specification: LocalizedSpecification,
  language: LanguageCode = defaultProductLanguage,
): string {
  return getLocalizedText(specification.label, language);
}
