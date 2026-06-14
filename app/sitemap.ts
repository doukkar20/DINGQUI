import type { MetadataRoute } from "next";
import { getProductRoute, getProducts } from "@/lib/products";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dingqigros.com";
  const staticRoutes = [
    "",
    "/shop",
    "/categories",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: route === "" || route === "/shop" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.6,
    })),
    ...getProducts().map((product) => ({
      url: `${siteUrl}/products/${getProductRoute(product)}`,
      lastModified: new Date(product.imported_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
