import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout-client";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Send WhatsApp Order",
  description: "Send your DINGQI GROS order request with name, phone number, and city through WhatsApp.",
  path: "/checkout",
  index: false,
});

export default function CheckoutPage() {
  return <CheckoutClient products={getProducts()} />;
}
