"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/storefront/product-card";
import { useProducts } from "@/hooks/use-products";

const CATEGORY_TABS = [
  { label: "All Items", value: "" },
  { label: "Khasta Thekua", value: "sweets-snacks" },
  { label: "Chana Sattu", value: "staples-superfoods" },
  { label: "Bharua Aachar", value: "pickles-aachar" },
  { label: "Desi Ghee", value: "pure-desi-ghee" },
];

function ProductsCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading } = useProducts({
    category: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-bihari-terracotta">
          Authentic Pantry Selection
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-bihari-dark">
          Our Handcrafted Delicacies
        </h1>
        <p className="text-sm text-neutral-600 max-w-2xl">
          Every product is prepared fresh on order using traditional culinary practices, pure Cow Desi Ghee, and cold-pressed mustard oil.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pt-2">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === tab.value
                  ? "bg-bihari-terracotta text-white shadow-md"
                  : "bg-white text-neutral-700 hover:bg-amber-50 border border-amber-900/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search Thekua, Sattu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full bg-white border-amber-900/20"
          />
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-amber-50/70 animate-pulse" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-amber-900/10 p-8 space-y-3">
          <p className="font-serif text-lg font-bold text-neutral-700">No delicacies found matching your search</p>
          <p className="text-xs text-neutral-500">Try selecting another category or clear your search query.</p>
          <button
            onClick={() => {
              setSelectedCategory("");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-bihari-terracotta hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading catalogue...</div>}>
      <ProductsCatalog />
    </Suspense>
  );
}
