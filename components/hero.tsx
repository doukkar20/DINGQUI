"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { type MouseEvent, useEffect, useMemo, useState } from "react";
import { LocalizedLink, useI18n } from "@/lib/i18n";
import {
  getWinningProductImage,
  getWinningProductName,
  getWinningProductPrice,
  winningProducts,
} from "@/lib/winning-products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const trustItems = [
  { icon: ShieldCheck, label: "badges.genuine" },
  { icon: Truck, label: "badges.delivery" },
  { icon: BadgeCheck, label: "badges.reseller" },
] as const;

const AUTOPLAY_MS = 5200;

export function Hero() {
  const { direction, language, t } = useI18n();
  const slides = useMemo(() => winningProducts, []);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = slides[activeIndex];
  const activeProductName = activeProduct ? getWinningProductName(activeProduct, language) : "";
  const activeProductPrice = activeProduct ? getWinningProductPrice(activeProduct, language) : "";
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 110, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 110, damping: 24 });
  const imageX = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const imageY = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);
  const glowX = useTransform(smoothX, [-0.5, 0.5], ["36%", "64%"]);
  const glowY = useTransform(smoothY, [-0.5, 0.5], ["30%", "54%"]);
  const whatsappHref = buildWhatsAppUrl("Assalamu alaikum, I want to ask about DINGQI GROS products.");

  useEffect(() => {
    if (slides.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
    event.currentTarget.style.setProperty("--hero-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--hero-y", `${event.clientY - bounds.top}px`);
  }

  function goToSlide(index: number) {
    setActiveIndex((index + slides.length) % slides.length);
  }

  function goToPrevious() {
    goToSlide(activeIndex - 1);
  }

  function goToNext() {
    goToSlide(activeIndex + 1);
  }

  return (
    <section
      className="premium-shell relative isolate overflow-hidden lg:min-h-[calc(100vh-5rem)]"
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
            "radial-gradient(620px circle at var(--hero-x, 52%) var(--hero-y, 34%), rgba(255,122,26,0.26), transparent 58%)",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20"
        >
          <motion.div
            initial={{ opacity: 0, clipPath: direction === "rtl" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange/45 bg-white/8 px-4 py-2 text-sm font-semibold text-orange shadow-[0_0_32px_rgba(255,122,26,0.18)] backdrop-blur lg:mb-6"
          >
            <BadgeCheck size={17} />
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.16 }}
            className="max-w-4xl font-serif text-5xl font-black leading-none tracking-normal text-white sm:text-7xl lg:text-8xl"
          >
            DINGQI GROS
          </motion.h1>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct?.ref || "empty-copy"}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.42 }}
              className="mt-5 min-h-[6.25rem] lg:mt-6 lg:min-h-[7.5rem]"
            >
              <p className="max-w-2xl text-base leading-7 text-white/72 sm:text-xl sm:leading-8">{t("hero.copy")}</p>
              {activeProduct && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-orange/35 bg-orange/10 px-4 py-2 text-sm font-bold text-orange">
                    {t("top.inStock")}
                  </span>
                  <span className="max-w-xl text-base font-bold text-white">
                    {activeProductName}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.34 }}
            className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-8 lg:gap-4"
          >
            <LocalizedLink href="/shop" className="btn-primary magnetic" data-cursor="cta">
              {t("hero.shop")}
              <ArrowRight size={18} />
            </LocalizedLink>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost magnetic border-white/20 bg-white/10 text-white hover:text-orange"
              data-cursor="cta"
            >
              <MessageCircle size={18} />
              {t("hero.whatsapp")}
            </a>
          </motion.div>

          <div className="mt-10 hidden gap-3 sm:grid sm:grid-cols-3">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.46 + index * 0.08 }}
                  className="metal-border rounded-lg bg-white/7 p-4 text-sm text-white/78 backdrop-blur-xl"
                >
                  <Icon className="mb-3 text-orange" size={20} />
                  {t(item.label)}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="relative z-10 mx-auto min-h-[700px] w-full max-w-[650px] sm:min-h-[610px] lg:min-h-[650px]">
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-10 mx-auto aspect-square w-[92%] max-w-[560px] rounded-full border border-orange/20"
            style={{
              background: `radial-gradient(circle at ${glowX.get()} ${glowY.get()}, rgba(255,122,26,0.38), rgba(255,255,255,0.1) 34%, transparent 68%)`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-16 h-[330px] w-[330px] -translate-x-1/2 rounded-full border border-white/10 sm:h-[470px] sm:w-[470px]"
            animate={{ scale: [0.94, 1.05, 0.94], opacity: [0.35, 0.72, 0.35] }}
            transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-20 flex justify-center gap-3">
            <button
              type="button"
              onClick={goToPrevious}
              className="btn-icon border-white/20 bg-white/10 text-white hover:text-orange"
              aria-label="Previous product"
              disabled={slides.length < 2}
            >
              {direction === "rtl" ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="btn-icon border-white/20 bg-white/10 text-white hover:text-orange"
              aria-label="Next product"
              disabled={slides.length < 2}
            >
              {direction === "rtl" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          <div className="relative z-10 mx-auto mt-4 h-[430px] max-w-[590px] overflow-hidden rounded-lg border border-white/12 bg-white/[0.06] shadow-[0_42px_110px_rgba(0,0,0,0.42)] backdrop-blur-xl lg:mt-6 lg:h-[470px]">
            <AnimatePresence mode="wait">
              {activeProduct && (
                <motion.div
                  key={activeProduct.ref}
                  data-cursor-product
                  className="absolute inset-0 grid overflow-hidden grid-rows-[1fr_auto] lg:grid-cols-[0.92fr_1.08fr] lg:grid-rows-none"
                  initial={{ opacity: 0, x: direction === "rtl" ? -64 : 64, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction === "rtl" ? 64 : -64, scale: 0.98 }}
                  transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative flex min-h-[142px] items-center justify-center bg-[radial-gradient(circle_at_center,#ffffff,#eef0f3)] sm:min-h-[250px]">
                    <motion.div
                      className="relative h-[82%] w-[82%]"
                      style={{ x: imageX, y: imageY }}
                      initial={{ rotate: -2 }}
                      animate={{ rotate: [-2, 1.5, -2] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Image
                        src={getWinningProductImage(activeProduct.ref)}
                        alt={`${activeProductName} product image`}
                        fill
                        priority
                        sizes="(min-width: 1024px) 320px, 82vw"
                        className="object-contain p-4 drop-shadow-[0_28px_30px_rgba(17,24,39,0.28)]"
                      />
                    </motion.div>
                  </div>

                  <div className="flex flex-col justify-between p-4 sm:p-6 lg:p-8">
                    <div>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.14 }}
                        className="text-sm font-bold text-orange"
                      >
                        {activeProduct.ref}
                      </motion.p>
                      <motion.h2
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2 line-clamp-2 text-xl font-black leading-tight text-white sm:mt-3 sm:text-4xl"
                      >
                        {activeProductName}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.26 }}
                        className="mt-3 hidden text-sm leading-7 text-white/64 sm:block"
                      >
                        {activeProductPrice}
                      </motion.p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-7">
                      <LocalizedLink
                        href="/shop"
                        className="btn-primary magnetic"
                        data-cursor="cta"
                      >
                        {t("hero.shop")}
                        <ArrowRight size={18} />
                      </LocalizedLink>
                      <span className="rounded-full border border-white/14 px-4 py-3 text-sm font-bold text-white/72">
                        {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative z-20 mx-auto mt-4 grid max-w-[590px] grid-cols-4 gap-2 sm:grid-cols-8">
            {slides.map((product, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={product.ref}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className="group relative min-h-[58px] overflow-hidden rounded-lg border border-white/12 bg-white/[0.07] p-1.5 text-start backdrop-blur-xl transition hover:border-orange/60 sm:min-h-[92px] sm:p-2"
                  aria-label={`Show product ${index + 1}`}
                >
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-md bg-white">
                    <Image
                      src={getWinningProductImage(product.ref)}
                      alt={`${getWinningProductName(product, language)} product image`}
                      fill
                      sizes="120px"
                      className="object-contain p-2 transition duration-300 group-hover:scale-105"
                    />
                  </span>
                  <span className="mt-2 block h-1 overflow-hidden rounded-full bg-white/12">
                    {isActive && (
                      <motion.span
                        className="block h-full rounded-full bg-orange"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
