"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Phone, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { LanguageSwitcher, LocalizedLink, useI18n } from "@/lib/i18n";
import { publicAssetPath } from "@/lib/assets";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "nav.home" },
  { href: "/shop", label: "nav.shop" },
  { href: "/categories", label: "nav.categories" },
  { href: "/about", label: "nav.about" },
  { href: "/contact", label: "nav.contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const whatsappHref = buildWhatsAppUrl("السلام عليكم، أود الاستفسار عن منتجات DINGQI GROS.");

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-white/15 bg-graphite/86 shadow-[0_18px_46px_rgba(17,24,39,0.24)] backdrop-blur-2xl"
          : "border-white/60 bg-white/78 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <LocalizedLink href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="relative h-12 w-24 overflow-hidden rounded-md border border-orange/50 bg-white shadow-[0_0_34px_rgba(249,115,22,0.22)] transition group-hover:border-soft-orange">
            <Image src={publicAssetPath("/logo.jpg")} alt="DINGQI GROS" fill sizes="96px" className="object-contain p-1" />
          </span>
          <span className="leading-none">
            <span className={cn("block font-serif text-2xl font-semibold transition", scrolled ? "text-white" : "text-foreground")}>
              DINGQI GROS
            </span>
            <span className={cn("block text-xs transition", scrolled ? "text-white/62" : "text-muted")}>{t("brand.tagline")}</span>
          </span>
        </LocalizedLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <LocalizedLink
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm transition hover:bg-orange/10",
                scrolled ? "text-white/70 hover:text-white" : "text-muted hover:text-foreground",
                pathname === item.href && "bg-orange/10 text-orange",
              )}
            >
              {t(item.label)}
              {pathname === item.href && (
                <motion.span
                  layoutId="active-nav"
                  className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-orange shadow-[0_0_14px_rgba(255,122,26,0.9)]"
                />
              )}
            </LocalizedLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((value) => !value)}
              className="btn-ghost h-11 px-4"
              aria-label={t("language.label")}
            >
              {t("language.label")}
              <ChevronDown size={16} />
            </button>
            <AnimatePresence>
              {languageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute end-0 mt-3 w-48 rounded-lg border border-white/70 bg-white/96 p-2 shadow-[0_20px_55px_rgba(17,24,39,0.2)] backdrop-blur-xl"
                >
                  <LanguageSwitcher compact onChange={() => setLanguageOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost magnetic"
            data-cursor="cta"
            aria-label={t("hero.whatsapp")}
          >
            <Phone size={17} />
            {t("brand.phone")}
          </a>
          <LocalizedLink href="/cart" className="btn-icon" ariaLabel={t("nav.cart")}>
            <ShoppingBag size={19} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </LocalizedLink>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LocalizedLink href="/cart" className="btn-icon" ariaLabel={t("nav.cart")}>
            <ShoppingBag size={19} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </LocalizedLink>
          <button
            type="button"
            className="btn-icon"
            aria-label={t("language.label")}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/15 bg-graphite/96 text-white lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-2 px-4 py-5 sm:px-6">
              <LanguageSwitcher compact onChange={() => setOpen(false)} />
              {navigation.map((item) => (
                <LocalizedLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm text-white/70 transition hover:bg-orange/10 hover:text-white",
                    pathname === item.href && "bg-orange/10 text-orange",
                  )}
                >
                  {t(item.label)}
                </LocalizedLink>
              ))}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn-primary magnetic mt-2"
                data-cursor="cta"
                onClick={() => setOpen(false)}
              >
                <Phone size={18} />
                {t("hero.whatsapp")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
