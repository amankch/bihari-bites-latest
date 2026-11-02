"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingBag, Check, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const variant = product.variants?.[selectedVariantIndex] || {
    id: "default",
    weight: "Standard",
    price: 0,
    mrp: 0,
    stock: 50,
    sku: "SKU",
  };

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop";

  const numPrice = Number(variant.price);
  const numMrp = Number(variant.mrp);
  const discountPercent =
    numMrp > numPrice ? Math.round(((numMrp - numPrice) / numMrp) * 100) : 0;

  const handleAddToCart = () => {
    addItem({
      variantId: variant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      weight: variant.weight,
      price: numPrice,
      mrp: numMrp,
      quantity: 1,
      imageUrl: primaryImage,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-amber-900/10 bg-white p-4 shadow-sm hover:shadow-xl transition-all duration-300">
      <div>
        {/* Product Image & Badges */}
        <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden rounded-xl bg-amber-50">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5">
              <span className="rounded-md bg-bihari-terracotta px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                {discountPercent}% OFF
              </span>
            </div>
          )}

          {product.isFeatured && (
            <div className="absolute top-2.5 right-2.5">
              <span className="flex items-center gap-1 rounded-md bg-amber-400/90 backdrop-blur-sm px-2 py-0.5 text-[11px] font-bold text-bihari-dark shadow-sm">
                <Sparkles className="h-3 w-3" /> Bestseller
              </span>
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="pt-4 space-y-1.5">
          {product.category && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-bihari-mustard">
              {product.category.name}
            </span>
          )}

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-serif text-base sm:text-lg font-bold text-bihari-dark group-hover:text-bihari-terracotta transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {product.tagline && (
            <p className="text-xs text-neutral-500 line-clamp-1">
              {product.tagline}
            </p>
          )}

          {/* Variant Weight Selector Pills */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    idx === selectedVariantIndex
                      ? "bg-bihari-terracotta text-white shadow-sm"
                      : "bg-amber-50 text-neutral-700 hover:bg-amber-100 border border-amber-900/10"
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="pt-4 mt-2 border-t border-amber-900/10 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-bihari-dark">
              {formatPrice(numPrice)}
            </span>
            {numMrp > numPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(numMrp)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-neutral-500 font-medium">
            Inclusive of all taxes
          </span>
        </div>

        <Button
          size="sm"
          onClick={handleAddToCart}
          className={`rounded-xl font-bold transition-all ${
            isAdded ? "bg-emerald-600 hover:bg-emerald-700" : ""
          }`}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4 mr-1" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 mr-1" /> Add
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
