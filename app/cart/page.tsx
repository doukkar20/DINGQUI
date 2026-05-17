import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart-page-client";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review selected DINGQI GROS products before sending a WhatsApp order.",
};

export default function CartPage() {
  return <CartPageClient products={getProducts()} />;
}
