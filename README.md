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

## Storefront redesign

The storefront uses an ivory, charcoal, and terracotta palette, original product
photos already in this repository, responsive collection panels, and links to
MKC's existing graduation, apparel, and promotional-product portals.

- `/` — storefront, collections, featured garments, brand story, process, FAQs
- `/customize?garment=lineJacket` — studio with a preselected garment; also accepts
  `tee`, `hoodie`, `crewneck`, and `quarterZip`
- `/bag` — review designs, change quantities, or remove items

The bag remains in memory and resets on refresh. It does not submit orders or
transfer designs to the live MKC store. Product prices are the existing prototype
prices from `src/lib/garments.ts`; confirm them before connecting checkout.
The hero lettering is illustrative. Product renders are not production proofs.

### Development and verification

```sh
npm ci
npm run dev
npm run lint
npm run build
```

To verify the GitHub Pages deployment configuration:

```sh
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/mkc npm run build
```

Keep both environment variables in the Pages workflow so product photos and
navigation resolve under `/mkc`. The existing workflow publishes only `main`;
a design branch or pull request does not deploy the redesign.
