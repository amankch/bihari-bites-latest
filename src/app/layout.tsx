import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Navbar } from "@/components/storefront/navbar";
import { Footer } from "@/components/storefront/footer";
import { WhatsAppCTA } from "@/components/storefront/whatsapp-cta";

function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  // If explicitly defined and NOT localhost, use it
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.startsWith("http") ? envUrl.replace(/\/$/, "") : `https://${envUrl.replace(/\/$/, "")}`;
  }
  // Vercel production system variables
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  // Default canonical production URL
  return "https://bihari-bites-latest.vercel.app";
}

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BIHARI BITES: Swad Asli • Crunch Desi | Artisanal Bihari Delicacies",
    template: "%s | BIHARI BITES: Swad Asli • Crunch Desi",
  },
  description:
    "Order traditional authentic Bihari delicacies: Khasta Thekua made in pure Desi Ghee, Stone-ground Chana Sattu, Sun-cured Lal Mirch Bharua Aachar, and Bilona Danedar Ghee. Fast Pan-India delivery with seamless UPI payment.",
  keywords: [
    "Bihari Bites",
    "Khasta Thekua",
    "Chana Sattu",
    "Bharua Lal Mirch Aachar",
    "Danedar Desi Ghee",
    "Chhath Puja Prasad",
    "Bihari Sweets",
    "Authentic Bihar Food",
    "Traditional Bihar Recipes",
    "Desi Ghee Snacks Patna",
  ],
  authors: [{ name: "BIHARI BITES" }],
  creator: "BIHARI BITES",
  publisher: "BIHARI BITES",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo-emblem.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "BIHARI BITES: Swad Asli • Crunch Desi",
    description:
      "Handcrafted authentic Bihari delicacies: Khasta Thekua in pure Desi Ghee, Stone-ground Sattu, and Sun-cured Bharua Aachar. Direct from Patna to your doorstep.",
    url: siteUrl,
    siteName: "BIHARI BITES: Swad Asli • Crunch Desi",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        secureUrl: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "BIHARI BITES: Swad Asli • Crunch Desi",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIHARI BITES: Swad Asli • Crunch Desi",
    description:
      "Handcrafted authentic Bihari delicacies: Khasta Thekua in pure Desi Ghee, Stone-ground Sattu, and Sun-cured Bharua Aachar. Direct from Patna to your doorstep.",
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col justify-between antialiased selection:bg-amber-200 selection:text-bihari-dark">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppCTA />
        </QueryProvider>
      </body>
    </html>
  );
}
