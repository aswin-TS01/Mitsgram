import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: true,
  },
  // ✅ Do NOT include "output" or "distDir"
  // ✅ Do NOT include "turbo"
};

export default nextConfig;




