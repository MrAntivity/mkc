import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";
import { oldEnglishFont, oldEnglishGreekFont, standardLetterFont } from "@/lib/fonts";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MKC THREADS | Custom Greek Letter Apparel",
  description:
    "MKC THREADS designs custom Greek letter apparel for fraternities and sororities. Build your look and preview it in real time before you order.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Forces Next.js to inject the Line Jacket letter-style @font-faces,
            even though they're applied via canvas (not a React class) in
            Customizer.tsx. */}
        <span aria-hidden className="sr-only">
          <span className={oldEnglishFont.className}>MKC</span>
          <span className={oldEnglishGreekFont.className}>ΑΒΓΔ</span>
          <span className={standardLetterFont.className}>ΑΒΓΔ</span>
        </span>
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
