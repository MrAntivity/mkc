import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? "/mkc" : undefined,
  assetPrefix: isGithubPages ? "/mkc/" : undefined,
};

export default nextConfig;
