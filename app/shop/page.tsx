import type { Metadata } from "next";
import { ProductExplorer } from "@/components/product-explorer";
import { T } from "@/lib/i18n";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Search and filter the DINGQI GROS DingQi product collection.",
};

export default function ShopPage() {
  const products = getProducts();

  return (
    <>
      <section className="border-b border-gray-200 bg-light-gray">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm text-orange"><T k="shop.eyebrow" /></p>
          <h1 className="mt-2 max-w-4xl font-serif text-6xl font-semibold leading-none text-foreground">
            <T k="shop.title" />
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            <T k="shop.copy" />
          </p>
        </div>
      </section>
      <ProductExplorer products={products} />
    </>
  );
}
