"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-navy text-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-wide">
            MKC <span className="text-gold">THREADS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium tracking-wide uppercase md:flex">
          <Link href="/" className="transition hover:text-gold">
            Home
          </Link>
          <Link href="/customize" className="transition hover:text-gold">
            Customize
          </Link>
          <a href="#organizations" className="transition hover:text-gold">
            Organizations
          </a>
          <a href="#about" className="transition hover:text-gold">
            About
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/customize"
            className="hidden rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy transition hover:bg-gold-light sm:inline-block"
          >
            Start Designing
          </Link>
          <span className="relative text-sm">
            🛍
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-navy">
                {count}
              </span>
            )}
          </span>
        </div>
      </div>
    </header>
  );
}
