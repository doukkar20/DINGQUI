import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dingqi-gros.vercel.app";
  const now = new Date();
  const staticRoutes = [
    "",
    "/shop",
    "/categories",
    "/cart",
    "/checkout",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
    })),
    ...getProducts().map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: new Date(product.imported_at),
    })),
  ];
}
