import productsData from "@/data/products.json";
import type { Product } from "@/lib/types";

const products = productsData as Product[];

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getCategories() {
  const counts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      slug: categoryToSlug(name),
      image: products.find((product) => product.category === name)?.images[0] || "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

export function getFeaturedProducts(limit = 5): Product[] {
  return products
    .filter((product) => product.images.length > 0)
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, limit);
}
