"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { useI18n } from "@/lib/i18n";
import { categoryToSlug, getLocalizedText, getProductCategory } from "@/lib/products";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductExplorerProps = {
  products: Product[];
  initialCategory?: string;
};

export function ProductExplorer({ products, initialCategory = "All" }: ProductExplorerProps) {
  const { direction, language, t } = useI18n();
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.categoryKey))).sort()],
    [products],
  );
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    const categoryParam = new URLSearchParams(window.location.search).get("category");
    const categoryFromUrl =
      categories.find((item) => categoryToSlug(item) === categoryParam) ||
      products.find((product) => categoryToSlug(product.categoryKey) === categoryParam)?.categoryKey;

    if (categoryFromUrl) {
      const timer = window.setTimeout(() => setCategory(categoryFromUrl), 0);
      return () => window.clearTimeout(timer);
    }
  }, [categories, products]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === "All" || product.categoryKey === category;
      const searchable = [
        ...Object.values(product.name || {}),
        ...Object.values(product.category || {}),
        product.product_id,
        product.sku || "",
        ...(product.specificationTable?.rows || []).flat(),
        ...(product.specifications || []).flatMap((spec) => [
          getLocalizedText(spec.label, language),
          spec.value,
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, language, products, query]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass-panel metal-border p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-orange" size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("search.placeholder")}
              dir={direction}
              className="h-14 w-full rounded-full border border-gray-200 bg-white pe-4 ps-12 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-orange/60 focus:shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
            />
          </label>

          <div className="flex items-center gap-3 text-sm text-muted">
            <SlidersHorizontal size={18} className="text-orange" />
            <span>{t("search.productsShown", { count: filtered.length })}</span>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => {
            const categoryProduct = products.find((product) => product.categoryKey === item);
            return (
              <button
                key={item}
                type="button"
                  onClick={() => setCategory(item)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
                  category === item
                    ? "border-orange bg-graphite text-white shadow-[0_0_22px_rgba(249,115,22,0.18)]"
                    : "border-gray-200 bg-white text-muted hover:border-orange/60 hover:text-foreground",
                )}
              >
                {item === "All" ? t("search.all") : categoryProduct ? getProductCategory(categoryProduct, language) : item}
              </button>
            );
          })}
        </div>
      </div>

      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      {!filtered.length && (
        <div className="mt-12 rounded-lg border border-gray-200 bg-white p-10 text-center">
          <h2 className="font-serif text-3xl font-semibold text-foreground">{t("search.noneTitle")}</h2>
          <p className="mt-3 text-muted">{t("search.noneCopy")}</p>
        </div>
      )}
    </section>
  );
}
