"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem } from "@/lib/types";

interface CartContextValue {
  cart: CartItem[];
  cartOpen: boolean;
  addToCart: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  updateQty: (idx: number, qty: number) => void;
  removeFromCart: (idx: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("unilubi-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("unilubi-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item: Omit<CartItem, "qty"> & { qty?: number }) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (p) => p.id === item.id && p.size === item.size && p.color === item.color
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + (item.qty ?? 1) };
        return next;
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  }, []);

  const updateQty = useCallback((idx: number, qty: number) => {
    if (qty <= 0) return setCart((prev) => prev.filter((_, i) => i !== idx));
    setCart((prev) => prev.map((it, i) => (i === idx ? { ...it, qty } : it)));
  }, []);

  const removeFromCart = useCallback((idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  return (
    <CartContext.Provider value={{ cart, cartOpen, addToCart, updateQty, removeFromCart, clearCart, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
