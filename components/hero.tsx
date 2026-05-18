"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, BadgeCheck, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { type MouseEvent } from "react";
import { LocalizedLink, useI18n } from "@/lib/i18n";
import { getProductCategory, getProductImageAlt, getProductName } from "@/lib/products";
import type { Product } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type HeroProps = {
  products: Product[];
};

const trustItems = [
  { icon: ShieldCheck, label: "badges.genuine" },
  { icon: Truck, label: "badges.delivery" },
  { icon: BadgeCheck, label: "badges.reseller" },
] as const;

export function Hero({ products }: HeroProps) {
  const { language, t } = useI18n();
  const heroProduct = products[0];
  const floatingProducts = products.slice(1, 4);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 24 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-9, 9]);
  const whatsappHref = buildWhatsAppUrl("السلام عليكم، بغيت نستفسر على منتجات DINGQI GROS.");

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
    event.currentTarget.style.setProperty("--hero-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--hero-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <section
      className="premium-shell relative isolate min-h-[calc(100vh-5rem)] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="hero-grid absolute inset-0" />
      <motion.div
        aria-hidden="true"
        className="hero-orange-sweep absolute inset-x-0 top-0 h-full"
        animate={{ x: ["-18%", "18%", "-18%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(520px circle at var(--hero-x, 50%) var(--hero-y, 36%), rgba(255,122,26,0.22), transparent 58%)",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-10 top-32 h-20 w-px rotate-45 bg-gradient-to-b from-transparent via-orange to-transparent opacity-70 blur-[1px]"
        animate={{ y: [-40, 420], opacity: [0, 0.75, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-1/4 top-10 h-28 w-px -rotate-45 bg-gradient-to-b from-transparent via-white to-transparent opacity-50 blur-[1px]"
        animate={{ y: [-30, 520], opacity: [0, 0.55, 0] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange/45 bg-white/8 px-4 py-2 text-sm font-semibold text-orange shadow-[0_0_32px_rgba(255,122,26,0.18)] backdrop-blur"
          >
            <BadgeCheck size={17} />
            {t("hero.badge")}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.16 }}
            className="max-w-4xl font-serif text-6xl font-black leading-none tracking-normal text-white sm:text-7xl lg:text-8xl"
          >
            DINGQI GROS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.28 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl"
          >
            {t("hero.copy")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.38 }}
            className="mt-9 flex flex-col gap-4 sm:flex-row"
          >
            <LocalizedLink href="/shop" className="btn-primary magnetic" data-cursor="cta">
              {t("hero.shop")}
              <ArrowRight size={18} />
            </LocalizedLink>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-ghost magnetic border-white/20 bg-white/10 text-white hover:text-orange" data-cursor="cta">
              <MessageCircle size={18} />
              {t("hero.whatsapp")}
            </a>
          </motion.div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.48 + index * 0.08 }}
                  className="metal-border rounded-lg bg-white/7 p-4 text-sm text-white/78 backdrop-blur-xl"
                >
                  <Icon className="mb-3 text-orange" size={20} />
                  {t(item.label)}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="relative z-10 min-h-[500px] lg:min-h-[650px]">
          <motion.div
            className="absolute inset-x-0 top-10 mx-auto aspect-square max-w-[610px] rounded-full border border-orange/25 bg-[radial-gradient(circle,rgba(255,122,26,0.22),rgba(255,255,255,0.08)_38%,transparent_66%)] shadow-[0_0_120px_rgba(249,115,22,0.2)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          />
          {heroProduct && (
            <motion.div
              data-cursor-product
              className="spotlight-card metal-border absolute left-1/2 top-10 w-[86%] max-w-[560px] -translate-x-1/2 overflow-hidden rounded-lg bg-white/94 p-5 shadow-[0_34px_100px_rgba(0,0,0,0.42)] backdrop-blur-xl"
              initial={{ opacity: 0, y: 36, rotate: -2 }}
              animate={{ opacity: 1, y: [0, -16, 0], rotate: -2 }}
              transition={{ opacity: { duration: 0.7 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
              style={{ rotateX, rotateY, transformPerspective: 1000 }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[radial-gradient(circle_at_center,#ffffff,#eef0f3)]">
                <Image
                  src={heroProduct.images[0]}
                  alt={getProductImageAlt(heroProduct, language)}
                  fill
                  preload
                  loading="eager"
                  sizes="(min-width: 1024px) 560px, 92vw"
                  className="object-contain p-7 drop-shadow-[0_24px_26px_rgba(17,24,39,0.24)]"
                />
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-orange">{getProductCategory(heroProduct, language)}</p>
                  <h2 className="mt-1 text-2xl font-black leading-8 text-foreground">
                    {getProductName(heroProduct, language)}
                  </h2>
                </div>
                <span className="rounded-full border border-orange/40 bg-orange/10 px-3 py-1 text-xs font-bold text-deep-orange">
                  {t("hero.quoteReady")}
                </span>
              </div>
            </motion.div>
          )}

          {floatingProducts.map((product, index) => (
            <motion.div
              key={product.id}
              data-cursor-product
              className="metal-border absolute hidden w-48 overflow-hidden rounded-lg bg-white/90 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:block"
              style={{
                left: index === 0 ? "0%" : index === 1 ? "70%" : "8%",
                top: index === 0 ? "7%" : index === 1 ? "56%" : "74%",
              }}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: [0, -12, 0], scale: 1 }}
              transition={{
                opacity: { duration: 0.6, delay: 0.3 + index * 0.12 },
                y: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="relative aspect-[5/4] rounded-md bg-white">
                <Image src={product.images[0]} alt={getProductImageAlt(product, language)} fill sizes="192px" className="object-contain p-3" />
              </div>
              <p className="mt-3 text-xs font-semibold text-orange">{getProductCategory(product, language)}</p>
              <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-foreground">
                {getProductName(product, language)}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
