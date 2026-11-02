"use client";

import { MessageCircle } from "lucide-react";
import { BRAND_HOTLINE, BRAND_WHATSAPP } from "@/lib/upi";

export function WhatsAppCTA() {
  const whatsappUrl = `https://wa.me/${BRAND_WHATSAPP}?text=${encodeURIComponent(
    "Pranam! I am contacting you from the BIHARI BITES website for order inquiry / helpline."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-2xl hover:bg-[#1EBE5D] hover:scale-105 active:scale-95 transition-all duration-300"
        title="Direct WhatsApp Order"
      >
        <MessageCircle className="h-6 w-6 fill-white text-emerald-800" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          Order on WhatsApp <br />
          <span className="font-normal opacity-90">{BRAND_HOTLINE}</span>
        </span>
      </a>
    </div>
  );
}
