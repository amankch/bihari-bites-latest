import Link from "next/link";
import { Sparkles, ArrowRight, Flame, HeartHandshake, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBanner } from "@/components/storefront/hero-banner";
import { ProductCard } from "@/components/storefront/product-card";
import { BRAND_HOTLINE, BRAND_WHATSAPP } from "@/lib/upi";
import prisma from "@/lib/prisma";
import { getCached, setCached } from "@/lib/cache";
import { Product } from "@/types";

const CATEGORIES = [
  {
    name: "Khasta Thekua",
    slug: "sweets-snacks",
    tagline: "Shuddh Desi Ghee & Gur",
    image: "/images/products/thekua.jpg",
  },
  {
    name: "Chana Sattu",
    slug: "staples-superfoods",
    tagline: "Roasted Bengal Gram Superfood",
    image: "/images/products/sattu.jpg",
  },
  {
    name: "Bihari Bharua Aachar",
    slug: "pickles-aachar",
    tagline: "Sun-Cured Stuffed Red Chilli",
    image: "/images/products/lal-mirch-aachar.jpg",
  },
  {
    name: "Danedar Desi Ghee",
    slug: "pure-desi-ghee",
    tagline: "Vedic Bilona Churned Butter",
    image: "/images/products/desi-ghee.jpg",
  },
];

async function getFeaturedProducts(): Promise<Product[]> {
  const cacheKey = "products:featured:home";
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    const rawProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: true,
        variants: {
          orderBy: { price: "asc" },
        },
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const products = JSON.parse(JSON.stringify(rawProducts)) as Product[];
    return setCached(cacheKey, products, 300);
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export const revalidate = 60; // ISR cache revalidation every 60s

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Shop By Category */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-bihari-terracotta">
            Our Traditional Kitchen
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-bihari-dark">
            Taste the Authentic Heritage of Bihar
          </h2>
          <p className="text-sm text-neutral-600">
            Handcrafted with sacred culinary traditions, pure Cow Ghee, and zero artificial preservatives.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-amber-900/10 bg-white p-3 sm:p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-amber-50 mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-bihari-dark group-hover:text-bihari-terracotta transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-neutral-500 line-clamp-1">{cat.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Bestsellers */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-bihari-haldi">
              Handpicked Bestsellers
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-bihari-dark">
              Most Loved Delicacies
            </h2>
          </div>
          <Link href="/products">
            <Button variant="outline" className="rounded-full text-xs font-semibold gap-1.5 border-amber-900/20">
              View All ({products.length}) <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Brand Heritage Story */}
      <section className="bg-amber-100/40 border-y border-amber-900/10 py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-bihari-terracotta">
                Why BIHARI BITES?
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-bihari-dark leading-tight">
                Crafted with Sacred Heritage, <br />
                Served with Desi Pride
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                In our kitchen, <strong>Thekua</strong> isn’t just a sweet; it’s an emotion deeply rooted in Chhath Puja reverence. We knead wholesome wheat atta with organic country jaggery (gur) and deep fry only in pure aromatic Cow Desi Ghee.
              </p>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                Our <strong>Chana Sattu</strong> is dry-roasted over sand kilns and pulverized using stone flour mills, preserving 100% of the fiber and high-protein content without any industrial shortcuts.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-bihari-terracotta/10 p-2 text-bihari-terracotta">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-bihari-dark">Pure Desi Ghee</h4>
                    <p className="text-xs text-neutral-500">Zero dalda, palm oil, or refined adulteration.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-bihari-haldi/10 p-2 text-bihari-haldi">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-bihari-dark">Grandma&apos;s Pickles</h4>
                    <p className="text-xs text-neutral-500">21-day sun-cured Banarasi red chillies.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl border-4 border-white">
                <img
                  src="/images/products/lal-mirch-aachar.jpg"
                  alt="Traditional Bihari Pickles and Thekua"
                  className="h-[420px] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-amber-900/10 max-w-xs hidden sm:block">
                <p className="font-serif font-bold text-sm text-bihari-dark">“Swad Asli • Crunch Desi”</p>
                <p className="text-xs text-neutral-500 mt-0.5">Dispatched directly from Patna, Bihar to your doorstep across India.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. UPI Order Workflow Callout */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-bihari-dark text-[#FFFDF7] p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Zero Payment Gateway Fees
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Instant 1-Tap UPI Payment & Delivery
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Scan our dynamic QR code or tap the direct UPI link on mobile using Google Pay, PhonePe, Paytm, or BHIM. Enter your 12-digit UTR reference, and we dispatch your order with live WhatsApp tracking on <strong>{BRAND_HOTLINE}</strong>!
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/products">
                <Button size="lg" className="rounded-full font-bold bg-bihari-terracotta hover:bg-[#9a2b1c] text-white">
                  Order Now via UPI
                </Button>
              </Link>
              <a
                href={`https://wa.me/${BRAND_WHATSAPP}?text=${encodeURIComponent("Pranam! I would like to place an order directly.")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="rounded-full font-bold border-white/30 text-white hover:bg-white/10 gap-2">
                  <PhoneCall className="h-4 w-4 text-emerald-400" /> Helpline: {BRAND_HOTLINE}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
