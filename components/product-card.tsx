"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BadgeInfo } from "lucide-react";
import Image from "next/image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { LocalizedLink, useI18n } from "@/lib/i18n";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useI18n();
  const primaryImage = product.images[0];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.24) }}
      whileHover={{ y: -8 }}
      className="glass-card group flex h-full flex-col overflow-hidden"
    >
      <LocalizedLink href={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#0b0b0b]">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-5 transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            {t("product.imageUnavailable")}
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full border border-gold/40 bg-black/70 px-3 py-1 text-xs text-gold backdrop-blur">
          {product.category}
        </span>
      </LocalizedLink>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <LocalizedLink href={`/products/${product.slug}`} className="font-serif text-xl font-semibold leading-7 text-white transition group-hover:text-soft-gold">
            {product.title}
          </LocalizedLink>
          <LocalizedLink
            href={`/products/${product.slug}`}
            className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-muted transition hover:border-gold/60 hover:text-gold"
            ariaLabel={`${t("product.view")} ${product.title}`}
          >
            <ArrowUpRight size={17} />
          </LocalizedLink>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted">
          <BadgeInfo size={16} className="text-gold" />
          <span>{t("product.specRows", { count: product.specifications.rows.length })}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className="text-sm font-semibold text-soft-gold">{formatPrice(product.price)}</span>
          <AddToCartButton product={product} compact className="min-w-28" />
        </div>
      </div>
    </motion.article>
  );
}
