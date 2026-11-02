"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const {
    items,
    isInitialized,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    shippingFee,
    finalTotal,
    totalSavings,
    freeShippingThreshold,
    freeShippingRemaining,
  } = useCart();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isInitialized) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-sm font-semibold text-neutral-600">Loading your shopping basket...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center space-y-5">
        <div className="rounded-full bg-amber-100/60 p-6 w-24 h-24 mx-auto flex items-center justify-center text-bihari-terracotta">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="font-serif text-3xl font-extrabold text-bihari-dark">Your Basket is Empty</h2>
        <p className="text-sm text-neutral-600">
          Looks like you haven't added any of our authentic Bihari delicacies yet.
        </p>
        <Link href="/products" className="inline-block pt-2">
          <Button size="lg" className="rounded-full font-bold">
            Explore Handcrafted Delicacies
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-bihari-dark">Your Shopping Basket</h1>
        <p className="text-xs text-neutral-500 mt-1">Review your items before proceeding to instant UPI checkout.</p>
      </div>

      {/* Free Shipping Alert Banner */}
      <div className="rounded-2xl bg-amber-50 border border-amber-900/10 p-4">
        {freeShippingRemaining > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-neutral-700">
              Add <strong className="text-bihari-terracotta">{formatPrice(freeShippingRemaining)}</strong> more to get{" "}
              <strong className="text-emerald-700">FREE Pan-India Delivery!</strong>
            </p>
            <div className="h-2 w-full rounded-full bg-amber-200 overflow-hidden">
              <div
                className="h-full bg-bihari-terracotta transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <Truck className="h-4 w-4 text-emerald-600" />
            <span>🎉 Congratulations! You have unlocked FREE Pan-India Delivery!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-amber-900/10 bg-white divide-y divide-amber-900/10 shadow-sm overflow-hidden">
            {items.map((item) => (
              <div key={item.variantId} className="p-4 sm:p-5 flex items-center gap-4">
                {/* Image */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-amber-50">
                  <img
                    src={item.imageUrl || "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-bihari-dark hover:text-bihari-terracotta transition-colors truncate">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-xs font-semibold text-neutral-500 mt-0.5">
                    Pack: <span className="text-bihari-mustard font-bold">{item.weight}</span>
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-extrabold text-bihari-dark">{formatPrice(item.price)}</span>
                    {item.mrp > item.price && (
                      <span className="text-xs text-neutral-400 line-through">{formatPrice(item.mrp)}</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-amber-900/20 rounded-xl bg-amber-50/50 px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="px-2 text-xs font-bold text-neutral-700 hover:text-bihari-terracotta"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold text-bihari-dark">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="px-2 text-xs font-bold text-neutral-700 hover:text-bihari-terracotta"
                  >
                    +
                  </button>
                </div>

                {/* Item Subtotal & Delete */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-bihari-dark">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-xs text-red-600 hover:text-red-700 p-1 mt-1 inline-flex items-center gap-1"
                    title="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={clearCart}
              className="text-xs text-neutral-500 hover:text-red-600 font-semibold"
            >
              Clear Basket
            </button>
            <Link href="/products" className="text-xs text-bihari-terracotta hover:underline font-bold">
              + Add More Delicacies
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-5 sticky top-28">
            <h3 className="font-serif font-bold text-lg text-bihari-dark border-b border-amber-900/10 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-bihari-dark">{formatPrice(subtotal)}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Total Discount:</span>
                  <span>- {formatPrice(totalSavings)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Pan-India Shipping:</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-amber-900/10 flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-bihari-dark">Total Payable:</span>
                <span className="text-2xl font-extrabold text-bihari-terracotta">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full">
              <Button size="lg" className="w-full rounded-xl font-bold shadow-lg gap-2">
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className="pt-3 border-t border-amber-900/10 space-y-1.5 text-[11px] text-neutral-500">
              <p className="flex items-center gap-1.5 font-semibold text-neutral-700">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% Secure Instant UPI Checkout
              </p>
              <p>Supports Google Pay, PhonePe, Paytm, BHIM & all UPI apps.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
