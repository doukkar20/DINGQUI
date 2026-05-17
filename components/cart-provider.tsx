"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  addItem: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "dingqi-gros-cart-v1";

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(CART_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as CartItem[];
    return parsed.filter(
      (item) =>
        typeof item.productId === "string" &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);

      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
            : item,
        );
      }

      return [...current, { productId, quantity: Math.min(Math.max(quantity, 1), 99) }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) {
        return current.filter((item) => item.productId !== productId);
      }

      return current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(Math.max(quantity, 1), 99) }
          : item,
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, totalItems, addItem, updateQuantity, removeItem, clearCart }),
    [addItem, clearCart, items, removeItem, totalItems, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
