# MKC Threads

Modern MKC storefront, a 98-product catalog, and individual product customization
pages. Built with Next.js App Router, TypeScript, and Tailwind CSS; exports as a
static site for GitHub Pages.

## Development

```sh
npm ci
npm run dev
npm run lint
npm run build
```

For GitHub Pages:

```sh
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/mkc npm run build
```

Keep both environment variables in the Pages workflow so assets and links resolve
under `/mkc`. The existing workflow publishes only `main`; a design branch or
pull request does not deploy the redesign.

## Routes and data

- `/` — storefront, collections, product features, brand story, process, FAQs
- `/catalog` — search, collection/type filters, and sorting for all 98 products
- `/customize` — catalog alias, replacing the generic garment picker
- `/catalog/[handle]` — each product's individually generated customization page
- `/bag` — chosen details, quantity controls, removal, and estimated subtotal
- `src/data/catalog.json` — source URL, import timestamp, titles, images, listed
  prices, availability, and handles
- `public/catalog/options` — normalized public builder configurations containing
  8,567 fields across 98 products
- `src/lib/product-options.ts` — conditional visibility, dependent selection
  cleanup, estimates, validation, and summary generation
- `src/lib/shopify` — original Storefront API scaffolding; not connected

Catalog source: https://mkcthreads.com/collections/customized-1

Run `python3 scripts/import-mkc-catalog.py` from the repo root to refresh the
snapshot. Python 3 and curl are required. The importer paginates the public
Shopify collection feed and reads each public Custom Product Builder CDN
configuration, using four concurrent requests. It fails on missing configurations
rather than silently importing a partial catalog. Package category IDs are scoped
to their panels because the source reuses IDs. Conditional options, stock flags,
input limits, and option charges are retained.

## Live product preview

Every product page uses a live canvas preview. Selecting an apparel color loads
its corresponding blank product photograph. Text, Greek organization names,
foreground/background colors, font style, stitch appearance, placement, and
uploaded images update the mockup. Front/back/sleeve controls follow the product's
customization sections; changing a section switches to the relevant view.
Packages have separate preview-item controls. The design bag captures the rendered
preview, and waits for pending image loads to finish before saving.

The importer also preserves public builder base images, view images, and placement
regions. Where the source has no matching side photo, the UI explicitly labels a
placement guide on the front photo. Fonts without usable font files use local
substitutes; stitch textures, specialty materials, and region matching are
illustrative rather than production proofs. Size and quantity affect order
specifications, not simulated garment proportions.

PNG, JPEG, GIF, WebP, SVG, and the first page of PDF artwork are rendered locally.
PDF.js loads only when needed, using its bundled worker under `public/vendor`.
When updating PDF.js, also update `public/vendor/pdfjs/pdf.worker.min.mjs` from the
same installed package version. Artwork stays in memory and is never uploaded.
Remote photos require the source CDN's CORS permission. Image failures show a
clear error and allow saving details without a preview. Outdated asynchronous
renders are discarded so rapid color changes cannot overwrite the newest design.

## Design bag and pricing

This is a design preview, not an order system. All chosen details and artwork
files (up to 20 MB each) stay in memory and clear on refresh. Artwork is not
uploaded, designs do not transfer to MKC, and checkout remains unconnected.
Per-size wholesale quantities remain fixed in the bag to preserve the selected
size breakdown; other products support quantity updates.

Estimates use imported base and option prices, including per-character charges.
MKC's custom character overrides, artwork review, final availability, and pricing
still require confirmation at the original store. The reflective jacket's
collection price ($20) differs from its builder base ($53): its card shows the
listing price, while its estimate uses the builder base. The blank jersey has a
zero builder base, so its estimate uses the $35 listing price per unit.

## Verification

With Node 22.18+ or Node 24:

```sh
node --test tests/*.test.mjs
```

Tests cover all 98 configurations and preview definitions, exact color-to-photo
selection, Greek text, lettering controls, package previews, ID isolation, conditional visibility,
color-dependent size availability, character charges, and input limits. Also run
lint and both normal and GitHub Pages builds after refreshing data. Browser visual
and interaction QA is still required; the browser tool's security-policy check
was unavailable during implementation.
