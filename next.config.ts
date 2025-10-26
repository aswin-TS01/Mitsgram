import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turbo: {
      rules: {}, // keep this valid
    },
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // ❌ remove output: "standalone" — it breaks routes-manifest generation
};

export default nextConfig;



