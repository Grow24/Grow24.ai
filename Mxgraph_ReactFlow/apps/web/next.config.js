/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/Mxgraph_ReactFlow'

const nextConfig = {
  basePath,
  output: 'standalone',
  /** Large prototype/demo surface: run ESLint in CI/editor; do not block `next build`. */
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@hbmp/shared-types', '@hbmp/ui-tokens', '@hbmp/engine'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  env: {
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:3001',
    NEXT_PUBLIC_BASE_PATH: basePath
  }
}

module.exports = nextConfig