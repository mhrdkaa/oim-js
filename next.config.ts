import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [],
  },
  // Disable Edge Runtime untuk compatibility dengan bcryptjs/prisma
  runtime: 'nodejs',
};

export default nextConfig;
