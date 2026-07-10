# MKC THREADS

Custom Greek letter apparel storefront with a live, real-time customizer.
Built with Next.js (App Router) + TypeScript + Tailwind CSS. Runs entirely on
local mock data today; structured to connect to a real Shopify store when
you're ready.

## Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- `/` — homepage
- `/customize` — the design studio (live canvas preview)

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

## Connecting a real Shopify store

This app currently sells nothing for real — "Add to Bag" just stores the
design locally so you can build and test the customizer without a store.
To connect it to Shopify:

1. **Create a custom app** in Shopify Admin: *Settings > Apps and sales
   channels > Develop apps > Create an app*. Enable **Storefront API**
   access and install the app. Copy the Storefront API access token (the
   public one, safe for client-side use — not the Admin API token).
2. **Set environment variables.** Copy `.env.local.example` to `.env.local`
   and fill in:
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` — e.g. `your-store.myshopify.com`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN` — the Storefront API token
3. **Create matching products** in Shopify. Each garment in
   `src/lib/garments.ts` (`GARMENT_TYPES`) has a `shopifyProductHandle` —
   create a product with that handle, with one variant per size (S–XXL).
4. **Swap the cart.** Replace the local cart in `src/lib/cart-context.tsx`
   with real Shopify cart calls using `shopifyFetch` from
   `src/lib/shopify/client.ts` and the queries in
   `src/lib/shopify/queries.ts` (`cartCreate`, `cartLinesAdd`). Pass the
   customization (letters, color, font, placement) as cart line
   **attributes** so they show up on the Shopify order.
5. **Send customers to checkout** using the `checkoutUrl` returned by the
   cart mutations.

Nothing needs to change in the customizer itself — it already produces all
the data (garment, color, letters, font, placement, size, quantity, and a
PNG preview) that a real cart line needs.
