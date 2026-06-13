"use client";

import { Send } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { getProductName } from "@/lib/products";
import type { Product, ReservationDetails } from "@/lib/types";
import { buildWhatsAppUrl, createReservationMessage } from "@/lib/whatsapp";

type ReservationFormProps = {
  product?: Product;
  productName?: string;
  quantity?: string | number;
  cartLines?: string[];
  title?: string;
};

function initialDetails(
  productName: string,
  quantity: string | number | undefined,
): ReservationDetails {
  return {
    fullName: "",
    phone: "",
    city: "",
    address: "",
    productName,
    quantity: quantity ? String(quantity) : "1",
    notes: "",
  };
}

export function ReservationForm({
  product,
  productName,
  quantity,
  cartLines = [],
  title,
}: ReservationFormProps) {
  const { direction, language, t } = useI18n();
  const defaultProductName = product ? getProductName(product, language) : productName || "";
  const [details, setDetails] = useState(() => initialDetails(defaultProductName, quantity));
  const hasCart = cartLines.length > 0;

  const effectiveDetails = useMemo(
    () => ({
      ...details,
      productName: details.productName || defaultProductName || (hasCart ? t("reservation.cartProduct") : ""),
    }),
    [defaultProductName, details, hasCart, t],
  );

  function updateField(field: keyof ReservationDetails, value: string) {
    setDetails((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = createReservationMessage({
      details: effectiveDetails,
      product,
      cartLines,
      language,
    });
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel metal-border p-6 sm:p-8">
      <p className="text-sm text-orange">{t("reservation.eyebrow")}</p>
      <h2 className="mt-2 font-serif text-4xl font-semibold text-foreground">
        {title || t("reservation.title")}
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted">{t("reservation.copy")}</p>

      <div className="mt-7 grid gap-5">
        <label className="grid gap-2 text-sm text-muted">
          {t("form.fullName")}
          <input
            required
            value={details.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            className="input-luxury"
            dir={direction}
            placeholder={t("form.fullNamePlaceholder")}
          />
        </label>

        <label className="grid gap-2 text-sm text-muted">
          {t("form.phone")}
          <input
            required
            value={details.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="input-luxury"
            dir="ltr"
            inputMode="tel"
            placeholder="0626-018950"
          />
        </label>

        <label className="grid gap-2 text-sm text-muted">
          {t("form.city")}
          <input
            required
            value={details.city}
            onChange={(event) => updateField("city", event.target.value)}
            className="input-luxury"
            dir={direction}
            placeholder={t("form.cityPlaceholder")}
          />
        </label>
      </div>

      <button type="submit" className="btn-whatsapp magnetic mt-7 w-full sm:w-auto" data-cursor="cta">
        <Send size={18} />
        {t("actions.sendWhatsappOrder")}
      </button>
    </form>
  );
}
