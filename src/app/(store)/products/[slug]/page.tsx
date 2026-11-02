"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, Heart, Share2, Sparkles, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useProduct } from "@/hooks/use-products";
import { useCart } from "@/hooks/use-cart";
import { BRAND_HOTLINE, BRAND_WHATSAPP } from "@/lib/upi";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const { data: product, isLoading, error } = useProduct(slug);
  const { addItem } = useCart();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="h-10 w-10 animate-spin border-4 border-bihari-terracotta border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm font-semibold text-neutral-600">Loading delicacy details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-bihari-dark">Delicacy Not Found</h2>
        <p className="text-sm text-neutral-500">The product you are looking for may have been moved or is out of stock.</p>
        <Link href="/products">
          <Button variant="default">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

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
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop";

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
      quantity: quantity,
      imageUrl: primaryImage,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-bihari-terracotta transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Delicacies
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-amber-50/60 border border-amber-900/10 shadow-lg">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 rounded-xl bg-bihari-terracotta px-3 py-1 text-xs font-bold text-white shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            {product.isFeatured && (
              <span className="absolute top-4 right-4 flex items-center gap-1 rounded-xl bg-amber-400 px-3 py-1 text-xs font-bold text-bihari-dark shadow-md">
                <Sparkles className="h-3.5 w-3.5" /> Bestseller
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            {product.category && (
              <Badge variant="secondary" className="font-bold text-xs uppercase tracking-wider">
                {product.category.name}
              </Badge>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-bihari-dark tracking-tight">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-base text-neutral-600 italic">
                “{product.tagline}”
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-900/10">
            <span className="text-3xl font-extrabold text-bihari-dark">
              {formatPrice(numPrice)}
            </span>
            {numMrp > numPrice && (
              <span className="text-lg text-neutral-400 line-through">
                {formatPrice(numMrp)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Save {formatPrice(numMrp - numPrice)}
              </span>
            )}
            <span className="ml-auto text-xs text-neutral-500">
              Tax included • Fast UPI Checkout
            </span>
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                Select Pack Size / Weight:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      idx === selectedVariantIndex
                        ? "bg-bihari-terracotta text-white border-bihari-terracotta shadow-md scale-105"
                        : "bg-white text-neutral-800 hover:bg-amber-50 border-amber-900/15"
                    }`}
                  >
                    {v.weight} — {formatPrice(Number(v.price))}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-amber-900/20 rounded-xl bg-white px-2 py-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2 py-1 text-sm font-bold text-neutral-700 hover:text-bihari-terracotta"
              >
                -
              </button>
              <span className="px-3 text-sm font-bold text-bihari-dark">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2 py-1 text-sm font-bold text-neutral-700 hover:text-bihari-terracotta"
              >
                +
              </button>
            </div>

            <Button
              size="lg"
              onClick={handleAddToCart}
              className={`flex-1 rounded-xl font-bold shadow-lg transition-all ${
                isAdded ? "bg-emerald-600 hover:bg-emerald-700" : ""
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="h-5 w-5 mr-2" /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5 mr-2" /> Add {quantity} to Cart • {formatPrice(numPrice * quantity)}
                </>
              )}
            </Button>
          </div>

          {/* WhatsApp Direct Order Button */}
          <div className="pt-2">
            <a
              href={`https://wa.me/${BRAND_WHATSAPP}?text=${encodeURIComponent(
                `Pranam! I would like to order ${quantity}x ${product.name} (${variant.weight}). Please assist.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                variant="outline"
                className="w-full rounded-xl border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-bold gap-2"
              >
                <PhoneCall className="h-4 w-4 text-emerald-600" /> Direct Order via WhatsApp ({BRAND_HOTLINE})
              </Button>
            </a>
          </div>

          {/* Features Checklist */}
          {product.features && product.features.length > 0 && (
            <div className="pt-4 border-t border-amber-900/10 space-y-2">
              <h4 className="font-serif font-bold text-sm text-bihari-dark">Authenticity Guarantees</h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-neutral-700">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-emerald-700 font-bold">✓</span> {feat}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description & Ingredients */}
          <div className="space-y-4 pt-4 border-t border-amber-900/10 text-sm">
            <div>
              <h4 className="font-serif font-bold text-sm text-bihari-dark mb-1">Traditional Preparation</h4>
              <p className="text-neutral-600 leading-relaxed">{product.description}</p>
            </div>

            {product.ingredients && (
              <div>
                <h4 className="font-serif font-bold text-sm text-bihari-dark mb-1">Pure Ingredients</h4>
                <p className="text-neutral-600 leading-relaxed">{product.ingredients}</p>
              </div>
            )}

            {product.shelfLife && (
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                <span className="text-bihari-mustard font-bold">Shelf Life:</span> {product.shelfLife} (Store in an airtight jar in a cool, dry place)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
