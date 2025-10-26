import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    turbo: false, // 👈 disable Turbopack for Vercel builds
  },
};

export default nextConfig;


