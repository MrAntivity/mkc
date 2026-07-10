/**
 * Shopify Storefront API client.
 *
 * Not wired up yet — this project runs on local mock data until a Shopify
 * store is connected. To connect one later:
 *
 * 1. In Shopify Admin: Settings > Apps and sales channels > Develop apps >
 *    create an app > enable Storefront API access > install > copy the
 *    Storefront API access token.
 * 2. Copy .env.local.example to .env.local and fill in:
 *      NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *      SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxx (or public token, see below)
 * 3. Create products in Shopify whose handles match GARMENT_TYPES in
 *    src/lib/garments.ts (e.g. "custom-greek-hoodie"), one variant per size.
 * 4. Replace the local cart in src/lib/cart-context.tsx with calls to
 *    cartCreate / cartLinesAdd using shopifyFetch + the queries in
 *    src/lib/shopify/queries.ts.
 *
 * The Storefront API token used here should be the *public* Storefront API
 * token (safe for client-side use), not the Admin API token.
 */

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION || "2025-01";

export const isShopifyConnected = Boolean(domain && token);

type ShopifyFetchArgs = {
  query: string;
  variables?: Record<string, unknown>;
};

export async function shopifyFetch<T>({ query, variables }: ShopifyFetchArgs): Promise<T> {
  if (!isShopifyConnected) {
    throw new Error(
      "Shopify is not connected yet. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and " +
        "SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local (see .env.local.example)."
    );
  }

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token as string,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join("\n"));
  }

  return json.data as T;
}
