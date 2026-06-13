"use client";

import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Hash, MessageCircle, PackageCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { type MouseEvent } from "react";
import { MotionSection } from "@/components/motion-section";
import { LocalizedLink, useI18n } from "@/lib/i18n";
import {
  getWinningProductImage,
  getWinningProductName,
  getWinningProductPrice,
  type WinningProduct,
  winningProducts,
} from "@/lib/winning-products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

function getProductWhatsAppUrl(message: string) {
  return buildWhatsAppUrl(message);
}

export function TopWinningProducts() {
  const { t } = useI18n();

  return (
    <MotionSection className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="glass-panel metal-border mb-8 overflow-hidden p-5 sm:p-6 lg:p-7">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-orange via-neon-orange to-graphite" />
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange/35 bg-white/85 px-4 py-2 text-sm font-bold text-deep-orange shadow-[0_10px_28px_rgba(249,115,22,0.12)] backdrop-blur">
              <Sparkles size={17} />
              {t("top.eyebrow")}
            </div>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-foreground sm:text-5xl">
              {t("top.title")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              {t("top.description")}
            </p>
          </div>
          <LocalizedLink href="/shop" className="btn-ghost self-start lg:self-end">
            {t("top.catalog")}
            <ArrowRight size={18} />
          </LocalizedLink>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {winningProducts.map((product, index) => (
          <WinningProductCard key={product.ref} product={product} index={index} />
        ))}
      </div>
    </MotionSection>
  );
}

type WinningProductCardProps = {
  product: WinningProduct;
  index: number;
};

function WinningProductCard({ product, index }: WinningProductCardProps) {
  const { language, t } = useI18n();
  const productName = getWinningProductName(product, language);
  const productPrice = getWinningProductPrice(product, language);
  const whatsappMessage =
    language === "fr"
      ? `Bonjour, je souhaite commander ${productName} (Réf. : ${product.ref}) - Prix : ${productPrice}.`
      : language === "ar-MA"
        ? `السلام عليكم، أود طلب ${productName} (المرجع: ${product.ref}) - السعر: ${productPrice}.`
        : `Hello, I want to order ${productName} (REF: ${product.ref}) - Price: ${productPrice}.`;

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <motion.article
      data-cursor-product
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay: Math.min(index * 0.035, 0.22) }}
      whileHover={{ y: -10 }}
      onMouseMove={handleMouseMove}
      className="glass-card spotlight-card group flex h-full flex-col overflow-hidden"
    >
      <div className="h-1 bg-gradient-to-l from-orange via-neon-orange to-graphite" />
      <div className="relative block aspect-[1.08/1] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#f8fafc_44%,#e5e7eb_100%)] sm:aspect-[4/3]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),transparent_42%,rgba(249,115,22,0.12))]" />
        <Image
          src={getWinningProductImage(product.ref)}
          alt={`${productName} product image`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-4 drop-shadow-[0_22px_20px_rgba(17,24,39,0.2)] transition duration-700 group-hover:scale-110 sm:p-6"
        />
        <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-orange/40 bg-white/95 px-3 py-1 text-xs font-bold text-orange shadow-[0_10px_22px_rgba(17,24,39,0.1)] backdrop-blur">
          <PackageCheck size={14} />
          {t("top.inStock")}
        </span>
        <span className="absolute end-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-graphite text-xs font-black text-white shadow-[0_14px_32px_rgba(17,24,39,0.28)]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-black leading-6 text-foreground transition group-hover:text-deep-orange sm:text-xl sm:leading-7">
            {productName}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white/76 px-3 py-2">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-muted">
            <Hash size={14} className="text-orange" />
            {t("top.ref")}
          </span>
          <span className="text-sm font-black text-foreground" dir="ltr">{product.ref}</span>
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-muted">
              <BadgeCheck size={15} className="text-orange" />
              {t("top.price")}
            </span>
            <span className="text-xl font-black text-deep-orange">{productPrice}</span>
          </div>
          <a
            href={getProductWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full px-4 py-2 text-sm"
          >
            <MessageCircle size={16} />
            {t("top.order")}
          </a>
        </div>
      </div>
    </motion.article>
  );
}
