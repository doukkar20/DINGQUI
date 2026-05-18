"use client";

import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { SpecTable } from "@/components/spec-table";
import { LocalizedLink, T, useI18n } from "@/lib/i18n";
import { categoryToSlug, getProductCategory, getProductDescription, getProductImageAlt, getProductName } from "@/lib/products";
import type { Product } from "@/lib/types";

type ProductPageContentProps = {
  product: Product;
  related: Product[];
};

export function ProductPageContent({ product, related }: ProductPageContentProps) {
  const { language } = useI18n();
  const productName = getProductName(product, language);
  const productCategory = getProductCategory(product, language);
  const description = getProductDescription(product, language);

  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1fr] lg:px-8">
        <ProductGallery title={productName} imageAlt={getProductImageAlt(product, language)} images={product.images} />

        <div>
          <div className="mb-5 flex flex-wrap gap-2 text-sm text-muted">
            <LocalizedLink href="/shop" className="transition hover:text-gold">
              <T k="nav.shop" />
            </LocalizedLink>
            <span>/</span>
            <LocalizedLink href={`/shop?category=${categoryToSlug(product.categoryKey)}`} className="transition hover:text-gold">
              {productCategory}
            </LocalizedLink>
          </div>

          <p className="text-sm text-gold"><T k="product.id" />: {product.product_id}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-white lg:text-6xl">
            {productName}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            {description || <T k="product.noDescription" />}
          </p>

          <div className="mt-8">
            <ProductPurchasePanel product={product} />
          </div>

          <div className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <T k="nav.categories" />
              <span className="mt-1 block font-semibold text-white">{productCategory}</span>
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
        <SpecTable specifications={product.specificationTable} />
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm text-gold"><T k="product.related" /></p>
            <h2 className="mt-2 font-serif text-4xl font-semibold text-white">
              <T k="product.moreFrom" values={{ category: productCategory }} />
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
