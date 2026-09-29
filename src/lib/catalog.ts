import snapshot from "@/data/catalog.json";
export const catalog = snapshot.products;
export type CatalogProduct = (typeof catalog)[number];
export const catalogImportedAt = snapshot.importedAt;
export function productPath(handle: string) {
  return `/catalog/${handle}`;
}
