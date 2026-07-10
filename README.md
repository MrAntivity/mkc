# MKC THREADS

Custom Greek letter apparel storefront with a live, real-time customizer.
Built with Next.js (App Router) + TypeScript + Tailwind CSS. Runs entirely on
local mock data today; structured to connect to a real Shopify store when
you're ready.


## Project structure

- `src/app` — routes (homepage, `/customize`)
- `src/components/Customizer.tsx` — the customizer UI (garment, color,
  letters, font, placement, size, quantity)
- `src/lib/garments.ts` — product data: garment types, colors, fonts, sizes,
  pricing
- `src/lib/garment-render.ts` — draws the live garment mockup + letters onto
  an HTML canvas, redrawn on every option change
- `src/lib/cart-context.tsx` — local in-memory "Add to Bag" cart, used until
  Shopify is connected
- `src/lib/shopify/` — Storefront API client + example GraphQL queries,
  not wired up yet
