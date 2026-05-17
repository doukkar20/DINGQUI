import type { Metadata } from "next";
import { ProductExplorer } from "@/components/product-explorer";
import { T } from "@/lib/i18n";
import { categoryToSlug, getCategories, getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Search and filter the DINGQI GROS DingQi product collection.",
};

type ShopPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const products = getProducts();
  const params = await searchParams;
  const categories = getCategories();
  const initialCategory =
    categories.find((category) => category.slug === params?.category)?.name ||
    products.find((product) => categoryToSlug(product.category) === params?.category)?.category ||
    "All";

  return (
    <>
      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm text-gold"><T k="shop.eyebrow" /></p>
          <h1 className="mt-2 max-w-4xl font-serif text-6xl font-semibold leading-none text-white">
            <T k="shop.title" />
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            <T k="shop.copy" />
          </p>
        </div>
      </section>
      <ProductExplorer products={products} initialCategory={initialCategory} />
    </>
  );
}
