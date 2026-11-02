"use client";

import { useState } from "react";
import { Check, X, ShieldCheck, Eye, PhoneCall, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { formatPrice, formatDate } from "@/lib/utils";
import { useAdminOrders, useAdminVerifyUpi } from "@/hooks/use-orders";
import { BRAND_HOTLINE, BRAND_WHATSAPP } from "@/lib/upi";
import { Order } from "@/types";

export default function AdminOrdersPage() {
  const { data: orders, isLoading, refetch } = useAdminOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const verifyUpiMutation = useAdminVerifyUpi(selectedOrder?.id || "");

  const handleOpenAudit = (order: Order) => {
    setSelectedOrder(order);
    setAuditModalOpen(true);
  };

  const handleAction = async (action: "APPROVE" | "REJECT") => {
    if (!selectedOrder) return;
    try {
      await verifyUpiMutation.mutateAsync(action);
      setAuditModalOpen(false);
      refetch();
    } catch (err: any) {
      alert(err.message || "Failed to update UPI payment status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-bihari-terracotta">
            Order Fulfillment & UPI Settlement
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-bihari-dark">
            Customer Orders & UPI Auditing
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cross-check customer-submitted 12-digit UTR against your bank or UPI app notification.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="rounded-xl border-amber-900/20 text-xs font-bold gap-1 self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh List
        </Button>
      </div>

      <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            Loading customer orders...
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-amber-50/50 text-neutral-600 uppercase font-bold text-[10px] tracking-wider border-b border-amber-900/10">
                <tr>
                  <th className="p-3">Order No.</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment Status</th>
                  <th className="p-3">12-Digit UTR</th>
                  <th className="p-3 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/10">
                {orders.map((order) => {
                  const isPaid = order.payment?.status === "PAID";
                  const hasUtr = Boolean(order.payment?.upiTxnRef);

                  return (
                    <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-bihari-dark">
                        {order.orderNumber}
                      </td>
                      <td className="p-3 font-semibold text-neutral-800">
                        {order.address.fullName}
                      </td>
                      <td className="p-3">
                        <a
                          href={`tel:${order.address.phone}`}
                          className="text-neutral-700 hover:text-bihari-terracotta font-medium"
                        >
                          {order.address.phone}
                        </a>
                      </td>
                      <td className="p-3 text-neutral-600 max-w-[150px] truncate">
                        {order.address.city}, {order.address.state}
                      </td>
                      <td className="p-3 text-neutral-600">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items
                      </td>
                      <td className="p-3 font-bold text-bihari-dark">
                        {formatPrice(order.finalAmount)}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={isPaid ? "success" : hasUtr ? "warning" : "destructive"}
                          className="text-[10px] uppercase font-bold"
                        >
                          {isPaid ? "PAID" : hasUtr ? "UTR SUBMITTED" : "PENDING"}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono font-bold text-neutral-900">
                        {order.payment?.upiTxnRef || (
                          <span className="text-neutral-400 italic font-normal">Not Submitted</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenAudit(order)}
                          className="h-8 rounded-lg text-xs font-bold border-amber-900/20"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Reconcile
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-neutral-500">
            No orders found in the database.
          </div>
        )}
      </div>

      {/* UPI Audit & Reconciliation Dialog */}
      {selectedOrder && (
        <Dialog open={auditModalOpen} onOpenChange={setAuditModalOpen}>
          <DialogClose onClick={() => setAuditModalOpen(false)} />

          <DialogHeader>
            <DialogTitle>Reconcile UPI Payment</DialogTitle>
            <DialogDescription>
              Order <strong>#{selectedOrder.orderNumber}</strong> • Total:{" "}
              <strong>{formatPrice(selectedOrder.finalAmount)}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs">
            {/* Customer Details Box */}
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-900/10 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Customer:</span>
                <span className="font-bold text-neutral-800">{selectedOrder.address.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Phone:</span>
                <span className="font-bold text-neutral-800">{selectedOrder.address.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Delivery Address:</span>
                <span className="font-medium text-neutral-700 text-right max-w-[240px]">
                  {selectedOrder.address.streetAddress}, {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}
                </span>
              </div>
            </div>

            {/* UTR Verification Display */}
            <div className="p-4 rounded-xl border border-amber-900/15 bg-white space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                Customer-Submitted Bank UTR / Reference ID
              </span>
              <p className="font-mono text-xl font-extrabold text-bihari-dark tracking-wider">
                {selectedOrder.payment?.upiTxnRef || "NO UTR ENTERED YET"}
              </p>
              <p className="text-[11px] text-neutral-500">
                Check your UPI app / merchant SMS for a credit of{" "}
                <strong>{formatPrice(selectedOrder.finalAmount)}</strong> with this reference number.
              </p>
            </div>

            {/* Audit Decision Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="destructive"
                onClick={() => handleAction("REJECT")}
                disabled={verifyUpiMutation.isPending}
                className="rounded-xl font-bold gap-1"
              >
                <X className="h-4 w-4" /> Reject Payment
              </Button>

              <Button
                variant="success"
                onClick={() => handleAction("APPROVE")}
                disabled={verifyUpiMutation.isPending}
                className="rounded-xl font-bold gap-1 bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="h-4 w-4" /> Approve & Confirm Order
              </Button>
            </div>

            {/* Contact Customer on WhatsApp */}
            <div className="text-center pt-2">
              <a
                href={`https://wa.me/91${selectedOrder.address.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Pranam ${selectedOrder.address.fullName}! Regarding your BIHARI BITES order #${selectedOrder.orderNumber}...`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline font-bold inline-flex items-center gap-1"
              >
                <PhoneCall className="h-3 w-3" /> Contact Customer on WhatsApp
              </a>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
