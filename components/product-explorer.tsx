"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { useI18n } from "@/lib/i18n";
import { categoryToSlug } from "@/lib/products";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductExplorerProps = {
  products: Product[];
  initialCategory?: string;
};

export function ProductExplorer({ products, initialCategory = "All" }: ProductExplorerProps) {
  const { direction, t } = useI18n();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category))).sort()],
    [products],
  );
  const categoryParam = searchParams.get("category");
  const initialCategoryFromUrl =
    categories.find((item) => categoryToSlug(item) === categoryParam) ||
    products.find((product) => categoryToSlug(product.category) === categoryParam)?.category ||
    initialCategory;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const category = selectedCategory || initialCategoryFromUrl;

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const searchable = [
        product.title,
        product.category,
        product.product_id,
        ...product.specifications.rows.flat(),
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, products, query]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass-panel p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-gold" size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("search.placeholder")}
              dir={direction}
              className="h-14 w-full rounded-full border border-white/10 bg-black/60 pe-4 ps-12 text-sm text-white outline-none transition placeholder:text-muted focus:border-gold/60"
            />
          </label>

          <div className="flex items-center gap-3 text-sm text-muted">
            <SlidersHorizontal size={18} className="text-gold" />
            <span>{t("search.productsShown", { count: filtered.length })}</span>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSelectedCategory(item)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm transition",
                category === item
                  ? "border-gold bg-gold text-black"
                  : "border-white/10 bg-white/[0.03] text-muted hover:border-gold/60 hover:text-white",
              )}
            >
              {item === "All" ? t("search.all") : item}
            </button>
          ))}
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
        <div className="mt-12 rounded-lg border border-white/10 bg-white/[0.03] p-10 text-center">
          <h2 className="font-serif text-3xl font-semibold text-white">{t("search.noneTitle")}</h2>
          <p className="mt-3 text-muted">{t("search.noneCopy")}</p>
        </div>
      )}
    </section>
  );
}
