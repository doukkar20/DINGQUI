import type { Metadata } from "next";
import { ProductExplorer } from "@/components/product-explorer";
import { T } from "@/lib/i18n";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shop DingQi Professional Tools",
  description: "Search and filter DingQi tools from DINGQI GROS, then request prices quickly through WhatsApp in Morocco.",
  path: "/shop",
});

export default function ShopPage() {
  const products = getProducts();

  return (
    <>
      <section className="premium-shell border-b border-white/10">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm text-orange"><T k="shop.eyebrow" /></p>
          <h1 className="mt-2 max-w-4xl text-5xl font-black leading-none text-white sm:text-6xl">
            <T k="shop.title" />
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            <T k="shop.copy" />
          </p>
        </div>
      </section>
      <ProductExplorer products={products} />
    </>
  );
}
