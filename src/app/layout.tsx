import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Navbar } from "@/components/storefront/navbar";
import { Footer } from "@/components/storefront/footer";
import { WhatsAppCTA } from "@/components/storefront/whatsapp-cta";

export const metadata: Metadata = {
  title: "BIHARI BITES | Swad Asli Crunch Desi | Artisanal Bihari Delicacies",
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
  ],
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
