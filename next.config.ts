/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint checks on Vercel
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TypeScript errors on build
  },
};

export default nextConfig;

