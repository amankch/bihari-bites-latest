"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QrCode, ShieldCheck, MapPin, Truck, AlertCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { checkoutFormSchema, CheckoutFormData } from "@/lib/validations/checkout";
import { UpiPaymentModal } from "@/components/storefront/upi-payment-modal";
import { DEFAULT_UPI_VPA } from "@/lib/upi";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, finalTotal, clearCart } = useCart();
  const createOrderMutation = useCreateOrder();

  const [paymentModalData, setPaymentModalData] = useState<{
    open: boolean;
    orderId: string;
    orderNumber: string;
    finalAmount: number;
    upiUri: string;
    qrDataUrl: string;
    customerName: string;
    deliveryAddress: string;
  }>({
    open: false,
    orderId: "",
    orderNumber: "",
    finalAmount: 0,
    upiUri: "",
    qrDataUrl: "",
    customerName: "",
    deliveryAddress: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      alternatePhone: "",
      streetAddress: "",
      landmark: "",
      city: "",
      state: "Bihar",
      pincode: "",
      paymentMethod: "UPI",
      customerNotes: "",
    },
  });

  if (items.length === 0 && !paymentModalData.open) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-bihari-dark">No Items to Checkout</h2>
        <p className="text-sm text-neutral-500">Your basket is empty. Please add items before checking out.</p>
        <Button onClick={() => router.push("/products")}>Browse Delicacies</Button>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const payload = {
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        address: data,
        customerNotes: data.customerNotes,
      };

      const result = await createOrderMutation.mutateAsync(payload);

      // Open UPI Payment Modal
      setPaymentModalData({
        open: true,
        orderId: result.order.id,
        orderNumber: result.order.orderNumber,
        finalAmount: Number(result.order.finalAmount),
        upiUri: result.upiUri,
        qrDataUrl: result.qrDataUrl,
        customerName: data.fullName,
        deliveryAddress: `${data.streetAddress}, ${data.city}, ${data.state} - ${data.pincode}`,
      });

      // Clear the local cart once order is registered
      clearCart();
    } catch (err: any) {
      alert(err.message || "Failed to initiate order. Please try again.");
    }
  };

  const handleUpiSuccess = () => {
    setPaymentModalData((prev) => ({ ...prev, open: false }));
    router.push(`/order-success/${paymentModalData.orderId}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-8 max-w-5xl">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-bihari-dark">Secure Checkout</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Deliver authentic Bihari flavours right to your doorstep.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Address & Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address Card */}
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-amber-900/10 pb-3 text-bihari-terracotta">
                <MapPin className="h-5 w-5" />
                <h3 className="font-serif font-bold text-lg text-bihari-dark">Delivery Address</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="e.g. Anand Kumar" {...register("fullName")} />
                  {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone">Mobile Number *</Label>
                  <Input id="phone" placeholder="10-digit mobile" {...register("phone")} />
                  {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="alternatePhone">Alternate Phone (Optional)</Label>
                  <Input id="alternatePhone" placeholder="Optional backup phone" {...register("alternatePhone")} />
                  {errors.alternatePhone && <p className="text-xs text-red-600">{errors.alternatePhone.message}</p>}
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label htmlFor="streetAddress">Flat / House No. / Street Address *</Label>
                  <Input id="streetAddress" placeholder="e.g. Flat 302, Maurya Vihar, Bailey Road" {...register("streetAddress")} />
                  {errors.streetAddress && <p className="text-xs text-red-600">{errors.streetAddress.message}</p>}
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label htmlFor="landmark">Landmark (Optional)</Label>
                  <Input id="landmark" placeholder="Near Dak Bungalow Chowk" {...register("landmark")} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="city">City / District *</Label>
                  <Input id="city" placeholder="e.g. Patna / Muzaffarpur" {...register("city")} />
                  {errors.city && <p className="text-xs text-red-600">{errors.city.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" placeholder="e.g. Bihar / Delhi / Maharashtra" {...register("state")} />
                  {errors.state && <p className="text-xs text-red-600">{errors.state.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="pincode">Pincode (6-digit) *</Label>
                  <Input id="pincode" placeholder="e.g. 800001" maxLength={6} {...register("pincode")} />
                  {errors.pincode && <p className="text-xs text-red-600">{errors.pincode.message}</p>}
                </div>
              </div>

              <div className="pt-2 space-y-1">
                <Label htmlFor="customerNotes">Special Packaging or Delivery Instructions</Label>
                <Textarea
                  id="customerNotes"
                  placeholder="e.g. Extra bubble wrap for glass pickle jars, deliver after 2 PM"
                  {...register("customerNotes")}
                />
              </div>
            </div>

            {/* Payment Choice Card */}
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-amber-900/10 pb-3 text-bihari-terracotta">
                <QrCode className="h-5 w-5" />
                <h3 className="font-serif font-bold text-lg text-bihari-dark">Payment Method</h3>
              </div>

              <div className="rounded-xl border-2 border-bihari-terracotta bg-amber-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      id="upi"
                      checked
                      readOnly
                      className="h-4 w-4 text-bihari-terracotta focus:ring-bihari-terracotta"
                    />
                    <label htmlFor="upi" className="font-bold text-sm text-bihari-dark">
                      Instant UPI Payment (Dynamic QR & 1-Tap App)
                    </label>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Recommended • 0% Fee
                  </span>
                </div>
                <p className="text-xs text-neutral-600 pl-6 leading-relaxed">
                  Generate instant QR code or tap to pay directly on Google Pay, PhonePe, Paytm, or BHIM. Zero convenience charges.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-5 sticky top-28">
              <h3 className="font-serif font-bold text-lg text-bihari-dark border-b border-amber-900/10 pb-3">
                Items in Order ({items.length})
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-amber-900/10">
                {items.map((item) => (
                  <div key={item.variantId} className="pt-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-neutral-800">{item.name}</p>
                      <p className="text-neutral-500">
                        {item.weight} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-bihari-dark">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-amber-900/10 space-y-2 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-bihari-dark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping:</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPrice(shippingFee)}</span>
                </div>
                <div className="pt-2 border-t border-amber-900/10 flex justify-between items-baseline">
                  <span className="font-serif font-bold text-base text-bihari-dark">Total Payable:</span>
                  <span className="text-2xl font-extrabold text-bihari-terracotta">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={createOrderMutation.isPending}
                className="w-full rounded-xl font-bold shadow-lg"
              >
                {createOrderMutation.isPending ? "Generating UPI Payment..." : `Pay ${formatPrice(finalTotal)} via UPI`}
              </Button>

              <div className="text-[11px] text-neutral-500 space-y-1">
                <p className="flex items-center gap-1 font-semibold text-neutral-700">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Secure Direct UPI Settlement
                </p>
                <p>Order details will be confirmed upon UTR receipt.</p>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Dynamic UPI Modal */}
      {paymentModalData.open && (
        <UpiPaymentModal
          open={paymentModalData.open}
          onOpenChange={(open) => setPaymentModalData((p) => ({ ...p, open }))}
          orderId={paymentModalData.orderId}
          orderNumber={paymentModalData.orderNumber}
          finalAmount={paymentModalData.finalAmount}
          upiUri={paymentModalData.upiUri}
          qrDataUrl={paymentModalData.qrDataUrl}
          customerName={paymentModalData.customerName}
          deliveryAddress={paymentModalData.deliveryAddress}
          onSuccess={handleUpiSuccess}
        />
      )}
    </div>
  );
}
