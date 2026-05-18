"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BadgeInfo } from "lucide-react";
import Image from "next/image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { LocalizedLink, useI18n } from "@/lib/i18n";
import { getProductCategory, getProductImageAlt, getProductName, getProductRoute } from "@/lib/products";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { language, t } = useI18n();
  const primaryImage = product.images[0];
  const productName = getProductName(product, language);
  const productCategory = getProductCategory(product, language);
  const productRoute = getProductRoute(product);
  const specificationCount = product.specificationRows?.length || product.specifications?.length || 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.24) }}
      whileHover={{ y: -8 }}
      className="glass-card group flex h-full flex-col overflow-hidden"
    >
      <LocalizedLink href={`/products/${productRoute}`} className="relative block aspect-[4/3] overflow-hidden bg-light-gray">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={getProductImageAlt(product, language)}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-5 transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            {t("product.imageUnavailable")}
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full border border-orange/40 bg-white/95 px-3 py-1 text-xs text-orange backdrop-blur">
          {productCategory}
        </span>
      </LocalizedLink>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <LocalizedLink href={`/products/${productRoute}`} className="font-serif text-xl font-semibold leading-7 text-foreground transition group-hover:text-deep-orange">
            {productName}
          </LocalizedLink>
          <LocalizedLink
            href={`/products/${productRoute}`}
            className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gray-200 text-muted transition hover:border-orange/60 hover:text-orange"
            ariaLabel={`${t("product.view")} ${productName}`}
          >
            <ArrowUpRight size={17} />
          </LocalizedLink>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted">
          <BadgeInfo size={16} className="text-orange" />
          <span>{t("product.specRows", { count: specificationCount })}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className="text-sm font-semibold text-deep-orange">
            {product.price.trim() || t("product.priceOnRequest")}
          </span>
          <AddToCartButton product={product} compact className="min-w-28" />
        </div>
      </div>
    </motion.article>
  );
}
