"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, BadgeInfo, Eye } from "lucide-react";
import Image from "next/image";
import { type MouseEvent } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { LocalizedLink, useI18n } from "@/lib/i18n";
import { getProductCategory, getProductImageAlt, getProductName, getProductRoute } from "@/lib/products";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 180, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 180, damping: 22 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <motion.article
      data-cursor-product
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.48, delay: Math.min(index * 0.035, 0.22) }}
      whileHover={{ y: -10 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="glass-card spotlight-card group flex h-full flex-col overflow-hidden"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
    >
      <div className="h-1 bg-gradient-to-l from-orange via-neon-orange to-graphite" />
      <LocalizedLink href={`/products/${productRoute}`} className="relative block aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_center,#ffffff,#eef0f3)]">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={getProductImageAlt(product, language)}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-5 drop-shadow-[0_20px_18px_rgba(17,24,39,0.18)] transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            {t("product.imageUnavailable")}
          </div>
        )}
        <span className="absolute start-4 top-4 rounded-full border border-orange/40 bg-white/95 px-3 py-1 text-xs font-bold text-orange backdrop-blur">
          {productCategory}
        </span>
        <span className="absolute end-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-graphite text-white opacity-0 shadow-[0_12px_30px_rgba(17,24,39,0.28)] transition group-hover:opacity-100">
          <Eye size={17} />
        </span>
      </LocalizedLink>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <LocalizedLink href={`/products/${productRoute}`} className="text-xl font-black leading-7 text-foreground transition group-hover:text-deep-orange">
            {productName}
          </LocalizedLink>
          <LocalizedLink
            href={`/products/${productRoute}`}
            className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gray-200 text-muted transition hover:border-orange/60 hover:bg-orange hover:text-white"
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
          <span className="text-sm font-black text-deep-orange">
            {formatPrice(product.price, t("product.priceOnRequest"))}
          </span>
          <AddToCartButton product={product} compact className="min-w-28" />
        </div>
      </div>
    </motion.article>
  );
}
