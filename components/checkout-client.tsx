"use client";

import { useMemo } from "react";
import { useCart } from "@/components/cart-provider";
import { ReservationForm } from "@/components/reservation-form";
import { LocalizedLink, useI18n } from "@/lib/i18n";
import { getProductName } from "@/lib/products";
import type { Product } from "@/lib/types";
import { createCartLines } from "@/lib/whatsapp";

type CheckoutClientProps = {
  products: Product[];
};

export function CheckoutClient({ products }: CheckoutClientProps) {
  const { items, clearCart } = useCart();
  const { language, t } = useI18n();
  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  const cartProducts = items
    .map((item) => ({ item, product: productMap.get(item.productId) }))
    .filter((entry): entry is { item: typeof items[number]; product: Product } => Boolean(entry.product));
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const cartLines = createCartLines(items, products);

  if (!items.length) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="glass-panel p-10">
          <h1 className="font-serif text-5xl font-semibold text-foreground">{t("checkout.readyTitle")}</h1>
          <p className="mt-4 text-muted">{t("checkout.readyCopy")}</p>
          <LocalizedLink href="/shop" className="btn-primary mt-8">
            {t("hero.shop")}
          </LocalizedLink>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <ReservationForm
          productName={t("reservation.cartProduct")}
          quantity={totalQuantity}
          cartLines={cartLines}
          title={t("checkout.title")}
        />

        <aside className="glass-panel h-fit p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-3xl font-semibold text-foreground">{t("cart.summary")}</h2>
          <div className="mt-6 grid gap-4">
            {cartProducts.map(({ item, product }) => (
              <div key={product.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between gap-4">
                  <p className="text-sm font-semibold leading-6 text-foreground">{getProductName(product, language)}</p>
                  <span className="text-sm text-orange">x{item.quantity}</span>
                </div>
                <p className="mt-1 text-xs text-muted">{t("product.id")}: {product.product_id}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-orange/30 bg-orange/10 p-4 text-sm leading-6 text-deep-orange">
            {t("checkout.finalPricing")}
          </div>
          <button type="button" onClick={clearCart} className="btn-ghost mt-5 w-full">
            {t("actions.clearCart")}
          </button>
        </aside>
      </div>
    </section>
  );
}
