"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

type AddToCartButtonProps = {
  product: Product;
  quantity?: number;
  className?: string;
  compact?: boolean;
};

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  compact = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { t } = useI18n();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product.id, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  }

  return (
    <motion.button
      type="button"
      onClick={handleAdd}
      whileTap={{ scale: 0.97 }}
      className={cn("btn-gold relative overflow-hidden", compact && "px-4 py-3", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span
            key="added"
            className="flex items-center justify-center gap-2"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
          >
            <Check size={18} />
            {t("actions.added")}
          </motion.span>
        ) : (
          <motion.span
            key="add"
            className="flex items-center justify-center gap-2"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -18, opacity: 0 }}
          >
            <ShoppingBag size={18} />
            {compact ? t("actions.add") : t("actions.addToCart")}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
