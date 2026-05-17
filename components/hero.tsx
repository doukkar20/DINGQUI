"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import { LocalizedLink, useI18n } from "@/lib/i18n";
import type { Product } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type HeroProps = {
  products: Product[];
};

export function Hero({ products }: HeroProps) {
  const { t } = useI18n();
  const heroProduct = products[0];
  const floatingProducts = products.slice(1, 4);
  const whatsappHref = buildWhatsAppUrl(
    "السلام عليكم، بغيت نستفسر على منتجات DINGQI GROS.",
  );

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <div className="hero-grid absolute inset-0" />
      <motion.div
        aria-hidden="true"
        className="hero-gold-sweep absolute inset-x-0 top-0 h-full"
        animate={{ x: ["-18%", "18%", "-18%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto grid min-h-[86vh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <div className="mb-6 inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-soft-gold">
            {t("hero.badge")}
          </div>
          <h1 className="max-w-4xl font-serif text-6xl font-semibold leading-none text-white sm:text-7xl lg:text-8xl">
            DINGQI GROS
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
            {t("hero.copy")}
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <LocalizedLink href="/shop" className="btn-gold">
              {t("hero.shop")}
              <ArrowRight size={18} />
            </LocalizedLink>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-ghost">
              <Phone size={18} />
              {t("hero.whatsapp")}
            </a>
          </div>
        </motion.div>

        <div className="relative z-10 min-h-[430px] lg:min-h-[560px]">
          <motion.div
            className="absolute inset-x-0 top-8 mx-auto aspect-square max-w-[520px] rounded-full border border-gold/25 bg-[linear-gradient(145deg,rgba(212,175,55,0.16),rgba(255,255,255,0.02),rgba(5,5,5,0.2))] shadow-[0_0_90px_rgba(212,175,55,0.16)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
          />
          {heroProduct && (
            <motion.div
              className="absolute left-1/2 top-10 w-[82%] max-w-[520px] -translate-x-1/2 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl"
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              animate={{ opacity: 1, y: [0, -14, 0], rotate: -2 }}
              transition={{ opacity: { duration: 0.7 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-white">
                <Image
                  src={heroProduct.images[0]}
                  alt={heroProduct.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 520px, 90vw"
                  className="object-contain p-7"
                />
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-gold">{heroProduct.category}</p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold text-white">
                    {heroProduct.title}
                  </h2>
                </div>
                <span className="rounded-full border border-gold/40 px-3 py-1 text-xs text-soft-gold">
                  {t("hero.quoteReady")}
                </span>
              </div>
            </motion.div>
          )}

          {floatingProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="absolute hidden w-48 overflow-hidden rounded-lg border border-white/10 bg-black/55 p-3 shadow-xl backdrop-blur-xl sm:block"
              style={{
                left: index === 0 ? "0%" : index === 1 ? "66%" : "8%",
                top: index === 0 ? "4%" : index === 1 ? "58%" : "70%",
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.3 + index * 0.12 },
                y: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="relative aspect-[5/4] rounded-md bg-white">
                <Image src={product.images[0]} alt={product.title} fill sizes="192px" className="object-contain p-3" />
              </div>
              <p className="mt-3 text-xs text-muted">{product.category}</p>
              <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-white">
                {product.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
