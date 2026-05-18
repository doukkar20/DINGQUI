"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { LocalizedLink, T, useI18n } from "@/lib/i18n";
import { categoryToSlug, getLocalizedText, getProductName } from "@/lib/products";
import type { LocalizedText, Product } from "@/lib/types";

type CategoryCardProps = {
  category: {
    key: string;
    name: LocalizedText;
    count: number;
    slug: string;
    image: string;
  };
  products?: Product[];
  compact?: boolean;
};

export function CategoryCard({ category, products = [], compact = false }: CategoryCardProps) {
  const { language } = useI18n();
  const name = getLocalizedText(category.name, language, category.key);
  const href = `/shop?category=${category.slug || categoryToSlug(category.key)}`;

  if (compact) {
    return (
      <LocalizedLink href={href} className="glass-card group grid grid-cols-[96px_1fr] items-center gap-4 p-4">
        <div className="relative aspect-square overflow-hidden rounded-md bg-white">
          {category.image && (
            <Image src={category.image} alt={name} fill sizes="96px" className="object-contain p-2" />
          )}
        </div>
        <div>
          <h3 className="font-serif text-2xl font-semibold text-white transition group-hover:text-soft-gold">
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted"><T k="home.productsCount" values={{ count: category.count }} /></p>
        </div>
      </LocalizedLink>
    );
  }

  return (
    <article className="glass-card overflow-hidden">
      <LocalizedLink href={href} className="grid gap-0 sm:grid-cols-[210px_1fr]">
        <div className="relative min-h-56 bg-white">
          {category.image && (
            <Image src={category.image} alt={name} fill sizes="(min-width: 768px) 210px, 100vw" className="object-contain p-5" />
          )}
        </div>
        <div className="p-6">
          <p className="text-sm text-gold"><T k="home.productsCount" values={{ count: category.count }} /></p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-white">{name}</h2>
          <div className="mt-5 grid gap-2">
            {products.slice(0, 3).map((product) => (
              <p key={product.id} className="line-clamp-1 text-sm text-muted">
                {getProductName(product, language)}
              </p>
            ))}
          </div>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold">
            <T k="categories.view" />
            <ArrowRight size={16} />
          </span>
        </div>
      </LocalizedLink>
    </article>
  );
}
