"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface WishlistContextValue {
  ids: Set<string>;
  isLoggedIn: boolean;
  isInWishlist: (id: string) => boolean;
  toggle: (id: string) => Promise<{ added: boolean } | null>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.ids)) {
          setIds(new Set(d.ids));
          setIsLoggedIn(true);
        }
      })
      .catch(() => null);
  }, []);

  const isInWishlist = useCallback((id: string) => ids.has(id), [ids]);

  const toggle = useCallback(async (id: string) => {
    const optimistic = new Set(ids);
    const wasIn = optimistic.has(id);
    if (wasIn) optimistic.delete(id);
    else optimistic.add(id);
    setIds(optimistic);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });
      if (res.status === 401) {
        // Revert and signal to caller to redirect to login
        setIds(ids);
        setIsLoggedIn(false);
        return null;
      }
      const data = await res.json();
      return { added: data.added === true };
    } catch {
      setIds(ids); // revert
      return null;
    }
  }, [ids]);

  return (
    <WishlistContext.Provider value={{ ids, isLoggedIn, isInWishlist, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
