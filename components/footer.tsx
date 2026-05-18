"use client";

import { ArrowUpRight } from "lucide-react";
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

export function Footer() {
  const { t } = useI18n();
  const whatsappHref = buildWhatsAppUrl(
    "السلام عليكم، بغيت نستفسر على منتجات DINGQI GROS.",
  );

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <LocalizedLink href="/" className="flex items-center gap-3">
            <span className="relative h-10 w-20 overflow-hidden rounded-md border border-orange/50 bg-white">
              <Image src={publicAssetPath("/logo.jpg")} alt="DINGQI GROS" fill sizes="80px" className="object-contain p-1" />
            </span>
            <span>
              <span className="block font-serif text-2xl font-semibold text-foreground">
                DINGQI GROS
              </span>
              <span className="block text-sm text-muted">
                {t("brand.value")}
              </span>
            </span>
          </LocalizedLink>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">
            {t("footer.copy")}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">{t("footer.store")}</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {footerLinks.map((link) => (
              <LocalizedLink key={link.href} href={link.href} className="text-muted transition hover:text-orange">
                {t(link.label)}
              </LocalizedLink>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">{t("footer.orders")}</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            {t("footer.ordersCopy")}
          </p>
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange">
            {t("hero.whatsapp")}
            <ArrowUpRight size={16} />
          </a>
          <p className="mt-3 text-sm font-semibold text-deep-orange">{displayPhoneNumber}</p>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 text-center text-xs text-muted">
        Copyright {new Date().getFullYear()} DINGQI GROS. {t("footer.rights")}
      </div>
    </footer>
  );
}
