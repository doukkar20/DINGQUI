import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout-client";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Send a DINGQI GROS reservation request for selected DingQi products.",
};

export default function CheckoutPage() {
  return <CheckoutClient products={getProducts()} />;
}
