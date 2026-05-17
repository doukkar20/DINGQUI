"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { useCart } from "@/components/cart-provider";
import { LocalizedLink, useI18n } from "@/lib/i18n";
import type { Product } from "@/lib/types";

type CartPageClientProps = {
  products: Product[];
};

export function CartPageClient({ products }: CartPageClientProps) {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { t } = useI18n();
  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  const cartProducts = items
    .map((item) => ({ item, product: productMap.get(item.productId) }))
    .filter((entry): entry is { item: typeof items[number]; product: Product } => Boolean(entry.product));

  if (!cartProducts.length) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="glass-panel p-10">
          <h1 className="font-serif text-5xl font-semibold text-white">{t("cart.emptyTitle")}</h1>
          <p className="mt-4 text-muted">{t("cart.emptyCopy")}</p>
          <LocalizedLink href="/shop" className="btn-gold mt-8">
            {t("actions.browseTools")}
          </LocalizedLink>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-gold">{t("cart.eyebrow")}</p>
              <h1 className="mt-2 font-serif text-5xl font-semibold text-white">{t("cart.title")}</h1>
            </div>
            <button type="button" onClick={clearCart} className="btn-ghost self-start">
              <Trash2 size={17} />
              {t("actions.clearCart")}
            </button>
          </div>

          <div className="grid gap-4">
            {cartProducts.map(({ item, product }) => (
              <article key={product.id} className="glass-card grid gap-5 p-4 sm:grid-cols-[130px_1fr_auto] sm:items-center">
                <LocalizedLink href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden rounded-lg bg-white">
                  {product.images[0] && (
                    <Image src={product.images[0]} alt={product.title} fill sizes="130px" className="object-contain p-3" />
                  )}
                </LocalizedLink>
                <div>
                  <p className="text-sm text-gold">{product.category}</p>
                  <LocalizedLink href={`/products/${product.slug}`} className="mt-1 block font-serif text-2xl font-semibold text-white transition hover:text-soft-gold">
                    {product.title}
                  </LocalizedLink>
                  <p className="mt-2 text-sm text-muted">{t("product.id")}: {product.product_id}</p>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="mt-4 inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
                  >
                    <Trash2 size={15} />
                    {t("actions.remove")}
                  </button>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 p-1">
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-white/10 hover:text-white"
                    onClick={() => updateQuantity(product.id, item.quantity - 1)}
                    aria-label={`Decrease ${product.title} quantity`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-white">{item.quantity}</span>
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-white/10 hover:text-white"
                    onClick={() => updateQuantity(product.id, item.quantity + 1)}
                    aria-label={`Increase ${product.title} quantity`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="glass-panel h-fit p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-3xl font-semibold text-white">{t("cart.summary")}</h2>
          <div className="mt-5 grid gap-4 text-sm">
            <div className="flex justify-between border-b border-white/10 pb-4 text-muted">
              <span>{t("cart.items")}</span>
              <span>{items.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-4 text-muted">
              <span>{t("cart.pricing")}</span>
              <span className="text-soft-gold">{t("cart.manualQuote")}</span>
            </div>
            <div className="rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm leading-6 text-soft-gold">
              {t("cart.priceNote")}
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <LocalizedLink href="/checkout" className="btn-gold">
              {t("actions.continueCheckout")}
            </LocalizedLink>
            <LocalizedLink href="/checkout" className="btn-ghost justify-center">
              {t("actions.orderWhatsapp")}
            </LocalizedLink>
          </div>
        </aside>
      </div>
    </section>
  );
}
