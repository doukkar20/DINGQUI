import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { SpecTable } from "@/components/spec-table";
import { LocalizedLink, T } from "@/lib/i18n";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProducts().map((product) => ({
    slug: product.slug,
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
    title: product.title,
    description:
      product.description ||
      `${product.title} in ${product.category}. Product ID ${product.product_id}.`,
    openGraph: {
      title: product.title,
      description: product.category,
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.product_id,
    category: product.category,
    image: product.images,
    description: product.description || `${product.title} specifications and source product data.`,
    url: `/products/${product.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1fr] lg:px-8">
        <ProductGallery title={product.title} images={product.images} />

        <div>
          <div className="mb-5 flex flex-wrap gap-2 text-sm text-muted">
            <LocalizedLink href="/shop" className="transition hover:text-gold">
              <T k="nav.shop" />
            </LocalizedLink>
            <span>/</span>
            <LocalizedLink href={`/shop?category=${product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="transition hover:text-gold">
              {product.category}
            </LocalizedLink>
          </div>

          <p className="text-sm text-gold"><T k="product.id" />: {product.product_id}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-white lg:text-6xl">
            {product.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            {product.description || <T k="product.noDescription" />}
          </p>

          <div className="mt-8">
            <ProductPurchasePanel product={product} />
          </div>

          <div className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <T k="nav.categories" />
              <span className="mt-1 block font-semibold text-white">{product.category}</span>
            </div>
            <a
              href={product.source_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-gold/60 hover:text-soft-gold"
            >
              <T k="product.source" />
              <span className="mt-1 block break-all text-white">{product.source_url}</span>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm text-gold"><T k="product.specifications" /></p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-white"><T k="product.specifications" /></h2>
        </div>
        <SpecTable specifications={product.specifications} />
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm text-gold"><T k="product.related" /></p>
            <h2 className="mt-2 font-serif text-4xl font-semibold text-white">
              <T k="product.moreFrom" values={{ category: product.category }} />
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
