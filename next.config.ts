import type { NextConfig } from "next";
import { TOOLS } from "./lib/constants";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return TOOLS.map((tool) => ({
      source: `/${tool.slug}`,
      destination: `/tools/${tool.slug}`,
    }));
  },
};

export default nextConfig;
