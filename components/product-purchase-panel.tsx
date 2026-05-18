"use client";

import { Minus, MessageCircle, Plus } from "lucide-react";
import { useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ReservationForm } from "@/components/reservation-form";
import { useI18n } from "@/lib/i18n";
import type { Product } from "@/lib/types";

type ProductPurchasePanelProps = {
  product: Product;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { t } = useI18n();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="grid gap-6 lg:sticky lg:top-28">
    <div className="glass-panel metal-border p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted">{t("product.price")}</p>
          <p className="mt-1 text-2xl font-semibold text-deep-orange">
            {product.price.trim() || t("product.priceOnRequest")}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-light-gray p-1">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-orange/10 hover:text-foreground"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-foreground">{quantity}</span>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-orange/10 hover:text-foreground"
            onClick={() => setQuantity((value) => Math.min(99, value + 1))}
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <AddToCartButton product={product} quantity={quantity} />
        <a href="#reservation-form" className="btn-ghost magnetic justify-center" data-cursor="cta">
          <MessageCircle size={18} />
          {t("product.whatsappOrder")}
        </a>
      </div>
    </div>
      <div id="reservation-form">
        <ReservationForm product={product} quantity={quantity} />
      </div>
    </div>
  );
}
