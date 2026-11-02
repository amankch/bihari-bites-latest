import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, PhoneCall, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND_HOTLINE, BRAND_WHATSAPP } from "@/lib/upi";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5EA] via-[#FFFDF7] to-white py-16 sm:py-24 border-b border-amber-900/10">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#B43422_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-bihari-terracotta/20 bg-amber-100/60 px-4 py-1.5 text-xs sm:text-sm font-semibold text-bihari-terracotta shadow-sm">
              <Sparkles className="h-4 w-4 text-bihari-haldi" />
              <span>Authentic Bihar Delicacies • Made in Shuddh Desi Ghee</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-bihari-dark leading-[1.15]">
              BIHARI BITES <br />
              <span className="text-bihari-terracotta">Swad Asli,</span>{" "}
              <span className="text-bihari-haldi">Crunch Desi</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Experience the unmatched aroma of stone-ground <strong>Chana Sattu</strong>, melt-in-mouth <strong>Khasta Thekua</strong>, tangy sun-cured <strong>Lal Mirch Bharua Aachar</strong>, and aromatic <strong>Danedar Bilona Ghee</strong> — prepared using heirloom recipes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full font-bold shadow-lg shadow-bihari-terracotta/25 gap-2">
                  Explore Delicacies <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href={`https://wa.me/${BRAND_WHATSAPP}?text=${encodeURIComponent("Pranam! I would like to place an order from BIHARI BITES.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-full border-2 border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-bold gap-2"
                >
                  <PhoneCall className="h-4 w-4 text-emerald-600" /> WhatsApp Order ({BRAND_HOTLINE})
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-amber-900/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-neutral-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-bihari-terracotta" /> 100% Desi Ghee
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-bihari-haldi" /> Heritage Wood-Pressed Oils
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-700 font-bold">✓</span> Fast UPI Checkout
              </div>
            </div>
          </div>

          {/* Right Hero Visual Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="group relative overflow-hidden rounded-2xl border border-amber-900/10 bg-white p-3 shadow-md hover:shadow-xl transition-all">
                <img
                  src="/images/products/thekua.jpg"
                  alt="Khasta Thekua"
                  className="h-40 w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="pt-3">
                  <span className="text-[10px] font-bold text-bihari-terracotta uppercase">Bestseller</span>
                  <h4 className="font-serif font-bold text-sm text-bihari-dark">Khasta Thekua</h4>
                  <p className="text-xs text-neutral-500">Pure Cow Ghee & Gur</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-amber-900/10 bg-white p-3 shadow-md hover:shadow-xl transition-all">
                <img
                  src="/images/products/lal-mirch-aachar.jpg"
                  alt="Lal Mirch Bharua Aachar"
                  className="h-32 w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="pt-3">
                  <span className="text-[10px] font-bold text-bihari-haldi uppercase">Sun Matured</span>
                  <h4 className="font-serif font-bold text-sm text-bihari-dark">Bharua Mirch Aachar</h4>
                  <p className="text-xs text-neutral-500">Kachi Ghani Mustard Oil</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="group relative overflow-hidden rounded-2xl border border-amber-900/10 bg-white p-3 shadow-md hover:shadow-xl transition-all">
                <img
                  src="/images/products/sattu.jpg"
                  alt="Chana Sattu"
                  className="h-32 w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="pt-3">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">High Protein</span>
                  <h4 className="font-serif font-bold text-sm text-bihari-dark">Roasted Chana Sattu</h4>
                  <p className="text-xs text-neutral-500">Stone Ground Superfood</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border border-amber-900/10 bg-white p-3 shadow-md hover:shadow-xl transition-all">
                <img
                  src="/images/products/desi-ghee.jpg"
                  alt="Danedar Desi Ghee"
                  className="h-40 w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="pt-3">
                  <span className="text-[10px] font-bold text-amber-600 uppercase">Vedic Bilona</span>
                  <h4 className="font-serif font-bold text-sm text-bihari-dark">Danedar Desi Ghee</h4>
                  <p className="text-xs text-neutral-500">Aromatic Village Churned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
