"use client";

import { use, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, MapPin, Package, PhoneCall, QrCode, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { useOrder, useSubmitUtr } from "@/hooks/use-orders";
import { BRAND_HOTLINE, BRAND_WHATSAPP, buildWhatsAppOrderLink, DEFAULT_UPI_VPA } from "@/lib/upi";

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data, isLoading, error } = useOrder(id);
  const submitUtrMutation = useSubmitUtr(id);

  const [utrInput, setUtrInput] = useState("");
  const [utrSuccessMsg, setUtrSuccessMsg] = useState("");
  const [utrError, setUtrError] = useState("");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="h-10 w-10 animate-spin border-4 border-bihari-terracotta border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm font-semibold text-neutral-600">Retrieving order confirmation...</p>
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-bihari-dark">Order Not Found</h2>
        <p className="text-sm text-neutral-500">We could not find the specified order.</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const { order, upiUri, qrDataUrl } = data;
  const isPaid = order.payment?.status === "PAID";
  const hasUtr = Boolean(order.payment?.upiTxnRef);

  const handleManualUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrInput.trim();
    if (cleanUtr.length !== 12) {
      setUtrError("UTR must be exactly 12 characters long.");
      return;
    }
    setUtrError("");

    try {
      await submitUtrMutation.mutateAsync(cleanUtr);
      setUtrSuccessMsg("UTR reference saved! Our team will verify and dispatch.");
      setUtrInput("");
    } catch (err: any) {
      setUtrError(err.message || "Failed to submit UTR.");
    }
  };

  const deliveryAddress = `${order.address.streetAddress}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`;

  const whatsappLink = buildWhatsAppOrderLink({
    orderNumber: order.orderNumber,
    customerName: order.address.fullName,
    totalAmount: Number(order.finalAmount),
    itemsSummary: order.items.map((i) => `${i.variant.product.name} (${i.variant.weight} x ${i.quantity})`).join(", "),
    upiRef: order.payment?.upiTxnRef || undefined,
    deliveryAddress,
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8 max-w-4xl">
      {/* Success Hero */}
      <div className="rounded-3xl bg-amber-50/80 border border-amber-900/15 p-8 text-center space-y-4 shadow-sm">
        <div className="flex justify-center">
          {isPaid ? (
            <div className="rounded-full bg-emerald-100 p-4 text-emerald-600">
              <CheckCircle2 className="h-12 w-12" />
            </div>
          ) : (
            <div className="rounded-full bg-amber-100 p-4 text-amber-600">
              <Clock className="h-12 w-12" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-bihari-terracotta">
            {isPaid ? "Payment Verified • Order Confirmed" : "Order Placed • Awaiting UPI Verification"}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-bihari-dark">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-neutral-600 max-w-lg mx-auto">
            Dhanyawad for choosing <strong>BIHARI BITES</strong>! We are preparing your authentic delicacies with love and sacred care.
          </p>
        </div>

        {/* WhatsApp Share CTA */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="rounded-full font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-md gap-2">
              <PhoneCall className="h-4 w-4" /> Send Confirmation on WhatsApp ({BRAND_HOTLINE})
            </Button>
          </a>
          <Link href="/products">
            <Button variant="outline" className="rounded-full border-amber-900/20 text-xs font-bold">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      {/* UPI UTR Verification Box if not yet approved */}
      {!isPaid && (
        <div className="rounded-2xl border-2 border-dashed border-bihari-terracotta/40 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-bihari-terracotta">
            <QrCode className="h-5 w-5" />
            <h3 className="font-serif font-bold text-lg text-bihari-dark">UPI Payment Status & UTR</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-amber-50/50">
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase">Payment Status</p>
              <Badge variant={hasUtr ? "warning" : "destructive"} className="mt-1 font-bold">
                {hasUtr ? "UTR Submitted • Pending Admin Audit" : "Pending UPI Payment / UTR"}
              </Badge>
              {order.payment?.upiTxnRef && (
                <p className="text-xs font-mono font-bold text-neutral-800 mt-1">
                  Submitted UTR: {order.payment.upiTxnRef}
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-xs text-neutral-500 font-bold uppercase">Payable to VPA</p>
              <p className="font-mono text-sm font-bold text-bihari-dark">{DEFAULT_UPI_VPA}</p>
            </div>
          </div>

          {/* Form to submit/update UTR */}
          <form onSubmit={handleManualUtrSubmit} className="space-y-3 pt-2">
            <label className="text-xs font-bold text-neutral-700 block">
              {hasUtr ? "Need to update your 12-digit UTR?" : "Enter 12-Digit Bank UPI Reference / UTR Number:"}
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                maxLength={12}
                placeholder="e.g. 412356789012"
                value={utrInput}
                onChange={(e) => setUtrInput(e.target.value.toUpperCase())}
                className="font-mono tracking-wider uppercase text-sm"
              />
              <Button
                type="submit"
                disabled={submitUtrMutation.isPending}
                className="font-bold shrink-0"
              >
                {submitUtrMutation.isPending ? "Submitting..." : "Submit UTR"}
              </Button>
            </div>

            {utrError && <p className="text-xs text-red-600">{utrError}</p>}
            {utrSuccessMsg && <p className="text-xs text-emerald-600 font-bold">{utrSuccessMsg}</p>}
          </form>
        </div>
      )}

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-amber-900/10 pb-2 text-bihari-terracotta">
            <MapPin className="h-4 w-4" />
            <h3 className="font-serif font-bold text-base text-bihari-dark">Shipping Destination</h3>
          </div>
          <div className="text-xs text-neutral-700 space-y-1">
            <p className="font-bold text-sm text-bihari-dark">{order.address.fullName}</p>
            <p>Phone: {order.address.phone}</p>
            <p>{order.address.streetAddress}</p>
            {order.address.landmark && <p>Landmark: {order.address.landmark}</p>}
            <p>
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-amber-900/10 pb-2 text-bihari-terracotta">
            <Package className="h-4 w-4" />
            <h3 className="font-serif font-bold text-base text-bihari-dark">Amount Breakdown</h3>
          </div>
          <div className="text-xs space-y-1.5 text-neutral-600">
            <div className="flex justify-between">
              <span>Items Total:</span>
              <span className="font-bold text-bihari-dark">{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pan-India Shipping:</span>
              <span>{Number(order.shippingFee) === 0 ? "FREE" : formatPrice(order.shippingFee)}</span>
            </div>
            <div className="pt-2 border-t border-amber-900/10 flex justify-between font-bold text-sm text-bihari-dark">
              <span>Final Total:</span>
              <span className="text-bihari-terracotta">{formatPrice(order.finalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-base text-bihari-dark border-b border-amber-900/10 pb-3">
          Items Ordered ({order.items.length})
        </h3>
        <div className="divide-y divide-amber-900/10">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-neutral-800 text-sm">{item.variant.product.name}</p>
                <p className="text-neutral-500">
                  Pack Size: <span className="font-semibold text-bihari-mustard">{item.variant.weight}</span> • Quantity: {item.quantity}
                </p>
              </div>
              <span className="font-extrabold text-sm text-bihari-dark">
                {formatPrice(Number(item.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
