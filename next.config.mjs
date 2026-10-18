/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Prisma on Vercel serverless
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
  },
}

export default nextConfig
