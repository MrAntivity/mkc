// Prefixes root-relative asset paths with the app's basePath. Needed for
// plain string paths (e.g. product photos in garments.ts) since Next.js only
// rewrites basePath automatically for next/image, next/link, and CSS.
export function withBasePath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
