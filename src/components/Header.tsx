"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import Brand from "./Brand";

export default function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setMenuOpen(false);
  return (
    <>
      <div className="announcement">
        Made for your letters. Made for your people.{" "}
        <a href="https://mkcthreads.com/" target="_blank" rel="noreferrer">
          Current production times <span aria-hidden="true">↗</span>
        </a>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Brand />
          <nav aria-label="Main navigation" className="desktop-nav">
            <Link href="/#collections">Shop collections</Link>
            <Link
              href="/catalog"
              aria-current={
                pathname.startsWith("/catalog") ? "page" : undefined
              }
            >
              Catalog
            </Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/#about">Our world</Link>
          </nav>
          <div className="header-actions">
            <Link href="/catalog" className="header-cta">
              Make it yours <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href="/bag"
              className="bag-link"
              aria-label={`Shopping bag, ${count} items`}
            >
              <svg
                width="21"
                height="23"
                viewBox="0 0 24 26"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 8h16l1 15H3L4 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 9V6a4 4 0 0 1 8 0v3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span>{count}</span>
            </Link>
            <button
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Mobile navigation"
            className="mobile-nav"
          >
            <Link onClick={close} href="/#collections">
              Shop collections ↗
            </Link>
            <Link onClick={close} href="/catalog">
              Catalog ↗
            </Link>
            <Link onClick={close} href="/#how-it-works">
              How it works ↗
            </Link>
            <Link onClick={close} href="/#about">
              Our world ↗
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
