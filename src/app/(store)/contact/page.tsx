"use client";

import { Phone, MessageCircle, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_HOTLINE, BRAND_WHATSAPP, BRAND_ADDRESS } from "@/lib/upi";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-12 max-w-4xl">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-bihari-terracotta">
          We Are Here To Serve You
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-bihari-dark">
          Contact & Customer Helpline
        </h1>
        <p className="text-sm text-neutral-600 max-w-xl mx-auto">
          Have questions about our authentic ingredients, bulk orders for weddings, or festive Chhath Mahaparv thekua packages? Reach out directly!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone & Direct Call Card */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4 text-center sm:text-left">
          <div className="rounded-2xl bg-amber-100 p-3 w-12 h-12 flex items-center justify-center text-bihari-terracotta mx-auto sm:mx-0">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-bihari-dark">Direct Phone Helpline</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Call for orders, tracking, or bulk inquiries</p>
          </div>
          <p className="font-serif text-2xl font-extrabold text-bihari-terracotta">
            {BRAND_HOTLINE}
          </p>
          <a href={`tel:${BRAND_HOTLINE}`} className="block">
            <Button className="w-full rounded-xl font-bold">
              Call Now ({BRAND_HOTLINE})
            </Button>
          </a>
        </div>

        {/* WhatsApp Card */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-6 shadow-sm space-y-4 text-center sm:text-left">
          <div className="rounded-2xl bg-emerald-100 p-3 w-12 h-12 flex items-center justify-center text-emerald-600 mx-auto sm:mx-0">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-bihari-dark">WhatsApp Quick Orders</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Chat directly with our kitchen in Bihar</p>
          </div>
          <p className="font-serif text-2xl font-extrabold text-emerald-700">
            +91 72819 91952
          </p>
          <a
            href={`https://wa.me/${BRAND_WHATSAPP}?text=${encodeURIComponent("Pranam! I would like to order authentic delicacies from BIHARI BITES.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full rounded-xl font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white">
              Chat on WhatsApp
            </Button>
          </a>
        </div>
      </div>

      {/* Heritage Kitchen Info */}
      <div className="rounded-3xl bg-amber-50/70 border border-amber-900/10 p-8 space-y-6">
        <h3 className="font-serif font-bold text-xl text-bihari-dark">
          Kitchen Address & Dispatch Hub
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-700">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-bihari-dark">
              <MapPin className="h-4 w-4 text-bihari-terracotta shrink-0" /> Official Address
            </div>
            <p className="font-semibold text-neutral-900">{BRAND_ADDRESS}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-bihari-dark">
              <Clock className="h-4 w-4 text-bihari-haldi" /> Kitchen Hours
            </div>
            <p>Monday - Sunday: 8:00 AM – 9:00 PM IST</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-bihari-dark">
              <ShieldCheck className="h-4 w-4 text-emerald-700" /> Pan-India Packaging
            </div>
            <p>Triple-layer airtight food grade vacuum seal for pan-India shipment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
