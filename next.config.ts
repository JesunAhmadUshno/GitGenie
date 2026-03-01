import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/gitgenie',
  assetPrefix: '/gitgenie/',
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  env: {
    NEXT_PUBLIC_API_URL: 'https://api.github.com',
    NEXT_PUBLIC_GITHUB_OWNER: 'yourusername',
    NEXT_PUBLIC_GITHUB_REPO: 'gitgenie',
  },
}

export default nextConfig
