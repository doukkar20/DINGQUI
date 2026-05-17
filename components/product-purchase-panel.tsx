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
    <div className="grid gap-6">
    <div className="glass-panel p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted">{t("product.price")}</p>
          <p className="mt-1 text-2xl font-semibold text-soft-gold">
            {product.price.trim() || t("product.priceOnRequest")}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 p-1">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-white/10 hover:text-white"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-white">{quantity}</span>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-muted transition hover:bg-white/10 hover:text-white"
            onClick={() => setQuantity((value) => Math.min(99, value + 1))}
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <AddToCartButton product={product} quantity={quantity} />
        <a href="#reservation-form" className="btn-ghost justify-center">
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
