import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack config (Next.js 16 default bundler)
  // pdf-parse uses canvas as an optional dependency — alias to empty module
  turbopack: {
    resolveAlias: {
      canvas: "@/lib/canvas-stub",
    },
  },
};

export default nextConfig;
