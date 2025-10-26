/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint checks on Vercel
    output: "standalone",
    experimental: {
      turbo: false, // 👈 disable Turbopack for Vercel builds
    },
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TypeScript errors on build
  },
};

export default nextConfig;

