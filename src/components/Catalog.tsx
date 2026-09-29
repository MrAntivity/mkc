"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { catalog, productPath } from "@/lib/catalog";
const collections = ["All", ...new Set(catalog.map((p) => p.collection))];
const categories = ["All products", ...new Set(catalog.map((p) => p.category))];
export default function Catalog() {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("All");
  const [category, setCategory] = useState("All products");
  const [sort, setSort] = useState("featured");
  const products = catalog
    .filter(
      (p) =>
        (collection === "All" || collection === p.collection) &&
        (category === "All products" || category === p.category) &&
        p.title.toLowerCase().includes(query.toLowerCase().trim()),
    )
    .sort((a, b) =>
      sort === "price-up"
        ? a.price - b.price
        : sort === "price-down"
          ? b.price - a.price
          : sort === "name"
            ? a.title.localeCompare(b.title)
            : 0,
    );
  function reset() {
    setQuery("");
    setCollection("All");
    setCategory("All products");
  }
  return (
    <div className="catalog-page shell">
      <div className="catalog-intro">
        <div>
          <p className="eyebrow">98 PRODUCTS. ENDLESS WAYS TO MAKE IT YOURS.</p>
          <h1>Find your thread.</h1>
        </div>
        <p>
          Pick the piece. Make it personal.
          <br />
          Every product has its own colors, details, and customization options.
        </p>
      </div>
      <div className="catalog-collections" aria-label="Filter by collection">
        {collections.map((c) => (
          <button
            key={c}
            aria-pressed={collection === c}
            onClick={() => setCollection(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="catalog-controls">
        <label className="catalog-search">
          <span className="sr-only">Search products</span>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find jackets, tees, accessories…"
          />
        </label>
        <label>
          <span className="sr-only">Product type</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Sort products</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured order</option>
            <option value="price-up">Price: low to high</option>
            <option value="price-down">Price: high to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </label>
      </div>
      <div className="catalog-result-count">
        <span role="status">
          {products.length} {products.length === 1 ? "product" : "products"}
        </span>
        {(query || collection !== "All" || category !== "All products") && (
          <button onClick={reset}>Clear filters ×</button>
        )}
        <span>Choose a product to customize ↘</span>
      </div>
      <div className="product-grid catalog-grid">
        {products.map((p) => (
          <Link
            href={productPath(p.handle)}
            key={p.id}
            className="product-card"
          >
            <div className="product-image">
              <Image
                src={p.image}
                alt={p.title}
                width={600}
                height={700}
                sizes="(max-width: 580px) 45vw, (max-width: 800px) 45vw, 22vw"
              />
              <span className="product-label">
                {p.collection.toUpperCase()}
              </span>
              <span className="product-open" aria-hidden="true">
                ↗
              </span>
            </div>
            <div className="product-title">
              <h2>{p.title}</h2>
            </div>
            <div className="catalog-card-meta">
              <span>From ${p.price.toFixed(2)}</span>
              <span>{p.available ? "Customize ↗" : "View options ↗"}</span>
            </div>
          </Link>
        ))}
      </div>
      {!products.length && (
        <div className="catalog-empty">
          <h2>No threads found.</h2>
          <p>Try another search or explore the full collection.</p>
          <button className="button button-dark" onClick={reset}>
            See all products ↗
          </button>
        </div>
      )}
      <p className="catalog-source">
        Catalog and options imported from{" "}
        <a href="https://mkcthreads.com/collections/customized-1">
          MKC Threads
        </a>
        . Availability and final pricing are confirmed by MKC when ordering.
      </p>
    </div>
  );
}
