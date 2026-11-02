import Link from "next/link";
import { Phone, Mail, MapPin, Heart, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { BRAND_HOTLINE, BRAND_WHATSAPP, BRAND_ADDRESS } from "@/lib/upi";

export function Footer() {
  return (
    <footer className="bg-bihari-dark text-[#FFFDF7] pt-16 pb-12 border-t-4 border-bihari-terracotta">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Value Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 border-b border-white/10 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base">100% Shuddh & Desi</h4>
              <p className="text-xs text-neutral-300">Pure Cow Ghee, Kachi Ghani Mustard Oil & Zero Preservatives</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
              <Truck className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base">Pan-India Fresh Delivery</h4>
              <p className="text-xs text-neutral-300">Airtight sealed vacuum packaging directly from Patna, Bihar</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
              <RefreshCw className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base">Instant UPI Checkout</h4>
              <p className="text-xs text-neutral-300">Zero surcharge via GPay, PhonePe, Paytm & BHIM</p>
            </div>
          </div>
        </div>

        {/* Links & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
              BIHARI BITES
            </h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Swad Asli • Crunch Desi
            </p>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Carrying forward the timeless gastronomic heritage of Bihar. Every bite of our Khasta Thekua and spoon of Stone-Ground Sattu takes you back to grandma’s earthen courtyard.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-amber-400 text-sm uppercase tracking-wider">
              Traditional Pantry
            </h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <Link href="/products?category=sweets-snacks" className="hover:text-white transition-colors">
                  Khasta Thekua (Desi Ghee)
                </Link>
              </li>
              <li>
                <Link href="/products?category=staples-superfoods" className="hover:text-white transition-colors">
                  Roasted Chana Sattu
                </Link>
              </li>
              <li>
                <Link href="/products?category=pickles-aachar" className="hover:text-white transition-colors">
                  Bihari Lal Mirch Bharua Aachar
                </Link>
              </li>
              <li>
                <Link href="/products?category=pure-desi-ghee" className="hover:text-white transition-colors">
                  Bilona Danedar Desi Ghee
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  View All Delicacies
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Direct Orders */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-amber-400 text-sm uppercase tracking-wider">
              Direct Orders & Support
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Order directly via Phone or WhatsApp. We also cater to festive bulk orders, Chhath Prasad packages, and corporate hampers.
            </p>
            <div className="space-y-2 text-sm">
              <a
                href={`tel:${BRAND_HOTLINE}`}
                className="flex items-center gap-2 text-white hover:text-amber-400 font-bold"
              >
                <Phone className="h-4 w-4 text-amber-400" /> {BRAND_HOTLINE}
              </a>
              <a
                href={`https://wa.me/${BRAND_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:underline font-bold"
              >
                💬 WhatsApp: +91 72819 91952
              </a>
              <div className="flex items-start gap-2 text-neutral-300 text-xs pt-1">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{BRAND_ADDRESS}</span>
              </div>
            </div>
          </div>

          {/* Payment Badges */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-amber-400 text-sm uppercase tracking-wider">
              100% Secure UPI Payments
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Pay seamlessly using any UPI app with our dynamic QR code or direct payment link:
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold">Google Pay</span>
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold">PhonePe</span>
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold">Paytm UPI</span>
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold">BHIM UPI</span>
              <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold">Cred</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} BIHARI BITES. All rights reserved. Handcrafted with pride in Bihar.</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:underline">Contact Us</Link>
            <Link href="/admin" className="hover:underline">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
