"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Order, AdminStats } from "@/types";
import { CheckoutFormData } from "@/lib/validations/checkout";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      items: Array<{ variantId: string; quantity: number }>;
      address: CheckoutFormData;
      customerNotes?: string;
      guestEmail?: string;
    }) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create order");
      }

      return res.json() as Promise<{
        order: Order;
        upiUri: string;
        qrDataUrl: string;
      }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useOrder(orderId: string) {
  return useQuery<{ order: Order; upiUri: string; qrDataUrl: string }>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch order details");
      }
      return res.json();
    },
    enabled: Boolean(orderId),
  });
}

export function useSubmitUtr(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (utr: string) => {
      const res = await fetch(`/api/orders/${orderId}/submit-utr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ utr }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit UTR");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

export function useAdminVerifyUpi(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (action: "APPROVE" | "REJECT") => {
      const res = await fetch(`/api/admin/orders/${orderId}/verify-upi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to verify UPI payment");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useAdminOrders(status?: string) {
  return useQuery<Order[]>({
    queryKey: ["admin", "orders", status],
    queryFn: async () => {
      const url = status ? `/api/admin/orders?status=${status}` : "/api/admin/orders";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch admin orders");
      const data = await res.json();
      return data.orders;
    },
    refetchInterval: 15000, // Poll every 15s for pending UPI approvals
  });
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch admin stats");
      return res.json();
    },
    refetchInterval: 30000,
  });
}
