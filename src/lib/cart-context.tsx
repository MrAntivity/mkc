"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type CartLine = {
  id: string;
  garmentName: string;
  garmentColorName: string;
  letters: string;
  letterColorName: string;
  fontLabel: string;
  placement: string;
  size: string;
  quantity: number;
  price: number;
  previewDataUrl?: string;
  stitchLabel?: string;
  backgroundColorName?: string;
};

type CartContextValue = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "id">) => void;
  removeLine: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

// NOTE: this is a local, in-memory cart so the customizer works before a
// Shopify store is connected. Once the Storefront API is wired up (see
// src/lib/shopify/client.ts), swap addLine/removeLine for cartLinesAdd /
// cartLinesRemove mutations against a real Shopify cart id.
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addLine = (line: Omit<CartLine, "id">) => {
    setLines((prev) => [...prev, { ...line, id: crypto.randomUUID() }]);
  };

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setLines((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, quantity: Math.max(1, quantity) } : line
      )
    );
  };

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines]
  );

  const count = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{ lines, addLine, removeLine, updateQuantity, subtotal, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
