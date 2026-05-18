"use client";

import { ArrowUpRight, BadgeCheck, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { LocalizedLink, useI18n } from "@/lib/i18n";
import { publicAssetPath } from "@/lib/assets";
import { buildWhatsAppUrl, displayPhoneNumber } from "@/lib/whatsapp";

const footerLinks = [
  { href: "/shop", label: "nav.shop" },
  { href: "/categories", label: "nav.categories" },
  { href: "/cart", label: "nav.cart" },
  { href: "/checkout", label: "nav.checkout" },
  { href: "/privacy-policy", label: "nav.privacy" },
  { href: "/terms-and-conditions", label: "nav.terms" },
] as const;

const trust = [
  { icon: ShieldCheck, label: "badges.genuine" },
  { icon: Truck, label: "badges.nationwide" },
  { icon: BadgeCheck, label: "badges.reseller" },
] as const;

export function Footer() {
  const { t } = useI18n();
  const whatsappHref = buildWhatsAppUrl("السلام عليكم، بغيت نستفسر على منتجات DINGQI GROS.");

  return (
    <footer className="premium-shell border-t border-white/10">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.25fr_1fr_1fr] lg:px-8">
        <div>
          <LocalizedLink href="/" className="flex items-center gap-3">
            <span className="relative h-12 w-24 overflow-hidden rounded-md border border-orange/50 bg-white shadow-[0_0_34px_rgba(249,115,22,0.22)]">
              <Image src={publicAssetPath("/logo.jpg")} alt="DINGQI GROS" fill sizes="96px" className="object-contain p-1" />
            </span>
            <span>
              <span className="block text-2xl font-black text-white">
                DINGQI GROS
              </span>
              <span className="block text-sm text-white/62">
                {t("brand.value")}
              </span>
            </span>
          </LocalizedLink>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/66">
            {t("footer.copy")}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {trust.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-white/10 bg-white/6 p-3 text-xs font-semibold text-white/72">
                  <Icon className="mb-2 text-orange" size={18} />
                  {t(item.label)}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black text-white">{t("footer.store")}</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {footerLinks.map((link) => (
              <LocalizedLink key={link.href} href={link.href} className="text-white/62 transition hover:text-orange">
                {t(link.label)}
              </LocalizedLink>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black text-white">{t("footer.orders")}</h2>
          <p className="mt-4 text-sm leading-7 text-white/66">
            {t("footer.ordersCopy")}
          </p>
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-primary magnetic mt-5" data-cursor="cta">
            <MessageCircle size={17} />
            {t("hero.whatsapp")}
            <ArrowUpRight size={16} />
          </a>
          <p className="mt-4 text-sm font-black text-orange">{displayPhoneNumber}</p>
        </div>
      </div>
      <div className="relative z-10 border-t border-white/10 px-4 py-5 text-center text-xs text-white/50">
        Copyright {new Date().getFullYear()} DINGQI GROS. {t("footer.rights")}
      </div>
    </footer>
  );
}
