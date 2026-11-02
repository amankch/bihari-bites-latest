"use client";

import { useSyncExternalStore, useCallback } from "react";
import { CartItem } from "@/types";

const CART_STORAGE_KEY = "bihari_bites_cart_v1";
const FREE_SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING_FEE = 49;

// In-memory singleton state
let memoryCart: CartItem[] = [];
let hasLoaded = false;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function loadInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  if (!hasLoaded) {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        memoryCart = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse cart from localStorage:", e);
    }
    hasLoaded = true;
  }
  return memoryCart;
}

function updateCart(newItems: CartItem[]) {
  memoryCart = newItems;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }
  notify();
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY && e.newValue) {
      try {
        memoryCart = JSON.parse(e.newValue);
        callback();
      } catch {}
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getSnapshot(): CartItem[] {
  return loadInitialCart();
}

const emptySnapshot: CartItem[] = [];
function getServerSnapshot(): CartItem[] {
  return emptySnapshot;
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((item: CartItem) => {
    const current = loadInitialCart();
    const existingIndex = current.findIndex((i) => i.variantId === item.variantId);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + item.quantity,
      };
    } else {
      updated = [...current, item];
    }

    updateCart(updated);
  }, []);

  const removeItem = useCallback((variantId: string) => {
    const current = loadInitialCart();
    updateCart(current.filter((i) => i.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    const current = loadInitialCart();
    if (quantity <= 0) {
      updateCart(current.filter((i) => i.variantId !== variantId));
      return;
    }
    updateCart(
      current.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    updateCart([]);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalMrp = items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const totalSavings = Math.max(0, totalMrp - subtotal);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const finalTotal = subtotal + shippingFee;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    items,
    isInitialized: true,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    totalMrp,
    totalSavings,
    shippingFee,
    finalTotal,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    freeShippingRemaining,
  };
}
