import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { catalog } from "@/lib/catalog";
import type { ProductOptions } from "@/lib/product-options";
import ProductConfigurator from "@/components/ProductConfigurator";
export function generateStaticParams() {
  return catalog.map((p) => ({ handle: p.handle }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  return {
    title: `${catalog.find((p) => p.handle === handle)?.title ?? "Product"} | MKC Threads`,
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = catalog.find((p) => p.handle === handle);
  if (!product) notFound();
  const options: ProductOptions = JSON.parse(
    await readFile(
      path.join(
        process.cwd(),
        "public/catalog/options",
        `${product.handle}.json`,
      ),
      "utf8",
    ),
  );
  return (
    <ProductConfigurator
      key={product.handle}
      product={product}
      config={options}
    />
  );
}
