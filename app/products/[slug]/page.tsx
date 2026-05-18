import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageContent } from "@/components/product-page-content";
import { getProductBySlug, getProductName, getProductRoute, getProductSeo, getProducts, getRelatedProducts } from "@/lib/products";

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
    openGraph: {
      title: getProductSeo(product).title,
      description: getProductSeo(product).description,
      images: product.images.slice(0, 1),
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
    category: product.categoryKey,
    image: product.images,
    description: seo.description,
    url: `/products/${getProductRoute(product)}`,
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
