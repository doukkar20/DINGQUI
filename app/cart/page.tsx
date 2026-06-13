import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart-page-client";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Quote Cart",
  description: "Review selected DingQi tools from DINGQI GROS before sending a WhatsApp quote request.",
  path: "/cart",
});

export default function CartPage() {
  return <CartPageClient products={getProducts()} />;
}
