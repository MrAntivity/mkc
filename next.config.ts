import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/mkc" : "";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: basePath || undefined,
  assetPrefix: isGithubPages ? "/mkc/" : undefined,
};

export default nextConfig;
