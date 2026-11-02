"use client";

import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";

interface UseProductsParams {
  category?: string;
  search?: string;
  featured?: boolean;
}

export function useProducts(params?: UseProductsParams) {
  return useQuery<Product[]>({
    queryKey: ["products", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set("category", params.category);
      if (params?.search) searchParams.set("search", params.search);
      if (params?.featured !== undefined) searchParams.set("featured", String(params.featured));

      const res = await fetch(`/api/products?${searchParams.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await res.json();
      return data.products;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await res.json();
      return data.product;
    },
    enabled: Boolean(slug),
  });
}
