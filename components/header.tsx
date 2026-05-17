"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { LanguageSwitcher, LocalizedLink, useI18n } from "@/lib/i18n";
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
  const whatsappHref = buildWhatsAppUrl(
    "السلام عليكم، بغيت نستفسر على منتجات DINGQI GROS.",
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <LocalizedLink href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="relative h-10 w-20 overflow-hidden rounded-md border border-gold/50 bg-white shadow-[0_0_30px_rgba(212,175,55,0.18)] transition group-hover:border-soft-gold">
            <Image src="/logo.jpg" alt="DINGQI GROS" fill sizes="80px" className="object-contain p-1" />
          </span>
          <span className="leading-none">
            <span className="block font-serif text-2xl font-semibold text-white">
              DINGQI GROS
            </span>
            <span className="block text-xs text-muted">{t("brand.tagline")}</span>
          </span>
        </LocalizedLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <LocalizedLink
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-white",
                pathname === item.href && "bg-white/10 text-gold",
              )}
            >
              {t(item.label)}
            </LocalizedLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
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
            className="overflow-hidden border-t border-white/10 bg-[#070707]/95 lg:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-2 px-4 py-5 sm:px-6">
              <LanguageSwitcher compact />
              {navigation.map((item) => (
                <LocalizedLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm text-muted transition hover:bg-white/5 hover:text-white",
                    pathname === item.href && "bg-white/10 text-gold",
                  )}
                >
                  {t(item.label)}
                </LocalizedLink>
              ))}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn-gold mt-2"
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
