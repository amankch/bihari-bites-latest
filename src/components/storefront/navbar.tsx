"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, PhoneCall, ShieldCheck, User, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { BRAND_HOTLINE, BRAND_WHATSAPP } from "@/lib/upi";
import { useSession, signOut } from "@/lib/auth-client";

export function Navbar() {
  const { itemCount } = useCart();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-900/10 bg-[#FFFDF7]/95 backdrop-blur-md">
      {/* Top Banner Notice */}
      <div className="bg-bihari-terracotta px-4 py-1.5 text-center text-xs font-medium text-white tracking-wide">
        <div className="container mx-auto flex items-center justify-between">
          <span className="hidden sm:inline">🌾 Authentic Desi Ghee & Stone-Ground Pantry Staples</span>
          <span className="mx-auto sm:mx-0 font-semibold tracking-wider">
            FREE Delivery on Orders Above ₹500 across India 🇮🇳
          </span>
          <a
            href={`https://wa.me/${BRAND_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 hover:underline font-semibold"
          >
            <PhoneCall className="h-3 w-3" /> Help: {BRAND_HOTLINE}
          </a>
        </div>
      </div>

      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex flex-col group">
          <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-bihari-terracotta group-hover:text-bihari-haldi transition-colors">
            BIHARI BITES
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-bihari-mustard">
            Swad Asli • Crunch Desi
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-neutral-800">
          <Link href="/" className="hover:text-bihari-terracotta transition-colors">
            Home
          </Link>
          <Link href="/products" className="hover:text-bihari-terracotta transition-colors">
            All Delicacies
          </Link>
          <Link href="/products?category=sweets-snacks" className="hover:text-bihari-terracotta transition-colors">
            Khasta Thekua
          </Link>
          <Link href="/products?category=staples-superfoods" className="hover:text-bihari-terracotta transition-colors">
            Chana Sattu
          </Link>
          <Link href="/products?category=pickles-aachar" className="hover:text-bihari-terracotta transition-colors">
            Bharua Aachar
          </Link>
          <Link href="/contact" className="hover:text-bihari-terracotta transition-colors">
            Helpline
          </Link>
        </nav>

        {/* Right Actions: Cart & Auth */}
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <Link href="/cart">
            <Button
              variant="outline"
              className="relative rounded-full border-amber-900/20 bg-amber-50/60 hover:bg-amber-100 text-bihari-dark px-3 sm:px-4"
            >
              <ShoppingBag className="h-5 w-5 text-bihari-terracotta" />
              <span className="hidden sm:inline font-semibold text-xs ml-1.5">Cart</span>
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-bihari-terracotta text-[11px] font-bold text-white shadow-md">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* User Sign In / Profile */}
          {session?.user ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-700">
                Hi, {session.user.name?.split(" ")[0]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-xs text-neutral-500 hover:text-bihari-terracotta"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-block">
              <Button variant="default" size="sm" className="rounded-full shadow-sm text-xs font-semibold">
                <User className="h-3.5 w-3.5 mr-1.5" /> Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-neutral-700 hover:bg-amber-100 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-amber-900/10 bg-white px-6 py-5 shadow-xl space-y-4">
          <div className="flex flex-col space-y-3 font-semibold text-neutral-800">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-bihari-terracotta"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-bihari-terracotta"
            >
              All Delicacies
            </Link>
            <Link
              href="/products?category=sweets-snacks"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-bihari-terracotta"
            >
              Thekua (Shuddh Ghee)
            </Link>
            <Link
              href="/products?category=staples-superfoods"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-bihari-terracotta"
            >
              Roasted Chana Sattu
            </Link>
            <Link
              href="/products?category=pickles-aachar"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-bihari-terracotta"
            >
              Bihari Bharua Aachar
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 hover:text-bihari-terracotta"
            >
              Contact & Helpline (+917281991952)
            </Link>
          </div>

          <div className="pt-3 border-t border-amber-900/10">
            {session?.user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{session.user.name}</span>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">Sign In with OTP / Google</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
