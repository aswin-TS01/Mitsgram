import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ensures Vercel gets the right output
  output: "standalone",

  // disable lint & type check during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // experimental options
  experimental: {
    turbo: {
      rules: {}, // ✅ expects an object, not false
    },
  },
};

export default nextConfig;


