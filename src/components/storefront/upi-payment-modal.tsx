"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, QrCode, ShieldCheck, AlertCircle } from "lucide-react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { DEFAULT_UPI_VPA, MERCHANT_NAME, BRAND_HOTLINE, buildWhatsAppOrderLink } from "@/lib/upi";
import { useSubmitUtr } from "@/hooks/use-orders";

interface UpiPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderNumber: string;
  finalAmount: number;
  upiUri: string;
  qrDataUrl?: string;
  customerName: string;
  deliveryAddress: string;
  onSuccess: () => void;
}

export function UpiPaymentModal({
  open,
  onOpenChange,
  orderId,
  orderNumber,
  finalAmount,
  upiUri,
  qrDataUrl,
  customerName,
  deliveryAddress,
  onSuccess,
}: UpiPaymentModalProps) {
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const submitUtrMutation = useSubmitUtr(orderId);

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(DEFAULT_UPI_VPA);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utr.trim();

    if (cleanUtr.length !== 12) {
      setUtrError("Please enter the 12-character bank UPI reference (UTR / RRN).");
      return;
    }
    setUtrError("");

    try {
      await submitUtrMutation.mutateAsync(cleanUtr);
      onSuccess();
    } catch (err: any) {
      setUtrError(err.message || "Failed to submit UTR. Please try again.");
    }
  };

  const whatsappLink = buildWhatsAppOrderLink({
    orderNumber,
    customerName,
    totalAmount: finalAmount,
    itemsSummary: "Artisanal Bihari Delicacies",
    upiRef: utr || undefined,
    deliveryAddress,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose onClick={() => onOpenChange(false)} />

      <DialogHeader>
        <div className="flex items-center justify-center gap-2 text-bihari-terracotta mb-1">
          <QrCode className="h-6 w-6" />
          <DialogTitle>Pay via UPI</DialogTitle>
        </div>
        <DialogDescription className="text-center text-xs">
          Order <strong>#{orderNumber}</strong> • Total Payable:{" "}
          <strong className="text-bihari-dark text-sm">{formatPrice(finalAmount)}</strong>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Dynamic QR Code Card */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-50/60 border border-amber-900/10">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="UPI QR Code"
              className="h-52 w-52 rounded-xl shadow-md border-2 border-white"
            />
          ) : (
            <div className="h-52 w-52 flex items-center justify-center rounded-xl bg-neutral-200">
              <span className="text-xs text-neutral-500">Generating QR...</span>
            </div>
          )}

          <p className="text-[11px] font-semibold text-neutral-600 mt-2 text-center">
            Scan using any UPI App: GPay, PhonePe, Paytm, BHIM, Cred
          </p>

          {/* 1-Tap Mobile Intent Link */}
          <div className="w-full pt-3">
            <a href={upiUri} className="block w-full">
              <Button
                variant="default"
                className="w-full rounded-xl font-bold bg-bihari-terracotta hover:bg-[#9a2b1c] shadow-md gap-2"
              >
                <ExternalLink className="h-4 w-4" /> Tap to Pay via UPI App
              </Button>
            </a>
          </div>
        </div>

        {/* Manual VPA Copy Box */}
        <div className="rounded-xl border border-amber-900/10 bg-white p-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-bold">Merchant UPI VPA</span>
            <span className="font-mono font-bold text-bihari-dark text-sm">{DEFAULT_UPI_VPA}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyVpa}
            className="rounded-lg text-xs border-amber-900/20"
          >
            {copiedVpa ? <Check className="h-3.5 w-3.5 text-emerald-600 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
            {copiedVpa ? "Copied" : "Copy VPA"}
          </Button>
        </div>

        {/* Step 2: Enter 12-Digit UTR */}
        <form onSubmit={handleSubmitUtr} className="space-y-3 pt-2 border-t border-amber-900/10">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Enter 12-Digit Bank UTR / UPI Ref ID
            </label>
            <Input
              type="text"
              maxLength={12}
              placeholder="e.g. 412356789012"
              value={utr}
              onChange={(e) => setUtr(e.target.value.toUpperCase())}
              className="font-mono tracking-wider uppercase text-sm"
            />
            {utrError && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" /> {utrError}
              </p>
            )}
            <p className="text-[10px] text-neutral-500 mt-1">
              Found in your UPI app payment receipt / SMS.
            </p>
          </div>

          <Button
            type="submit"
            disabled={submitUtrMutation.isPending}
            className="w-full rounded-xl font-bold bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            {submitUtrMutation.isPending ? "Verifying..." : "Confirm & Submit UTR"}
          </Button>
        </form>

        {/* WhatsApp Assist */}
        <div className="text-center pt-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-700 hover:underline font-semibold inline-flex items-center gap-1"
          >
            💬 Share Payment Screenshot on WhatsApp (+91 72819 91952)
          </a>
        </div>
      </div>
    </Dialog>
  );
}
