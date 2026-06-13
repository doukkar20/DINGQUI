import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageContent } from "@/components/product-page-content";
import { getProductBySlug, getProductName, getProductRoute, getProductSeo, getProducts, getRelatedProducts } from "@/lib/products";
import { publicAssetPath } from "@/lib/assets";
import { siteName, siteUrl } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProducts().map((product) => ({
    slug: getProductRoute(product),
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: getProductSeo(product).title,
    description: getProductSeo(product).description,
    alternates: {
      canonical: `/products/${getProductRoute(product)}`,
    },
    openGraph: {
      title: getProductSeo(product).title,
      description: getProductSeo(product).description,
      type: "website",
      url: `/products/${getProductRoute(product)}`,
      siteName,
      images: product.images.slice(0, 1).map((image) => ({
        url: publicAssetPath(image),
        alt: getProductName(product),
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: getProductSeo(product).title,
      description: getProductSeo(product).description,
      images: product.images.slice(0, 1).map((image) => publicAssetPath(image)),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);
  const seo = getProductSeo(product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: getProductName(product),
    sku: product.sku || product.product_id,
    brand: {
      "@type": "Brand",
      name: "DingQi",
    },
    category: product.categoryKey,
    image: product.images.map((image) => `${siteUrl}${publicAssetPath(image)}`),
    description: seo.description,
    url: `${siteUrl}/products/${getProductRoute(product)}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "MAD",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/products/${getProductRoute(product)}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageContent product={product} related={related} />
    </>
  );
}
