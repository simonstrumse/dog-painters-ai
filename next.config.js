/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  images: {
    // Opt-in optimization: set NEXT_ENABLE_IMAGE_OPTIMIZATION="true"
    // By default we keep it unoptimized to avoid 404s on /_next/image in
    // static hosting setups. Flip the flag once your host supports the
    // Next.js Image Optimization route.
    unoptimized: process.env.NEXT_ENABLE_IMAGE_OPTIMIZATION === 'true' ? false : true,
    // Tailor generated breakpoints to our layout
    deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    imageSizes: [96, 128, 160, 192, 256, 384],
    formats: ['image/avif', 'image/webp'],
    // Also declare explicit domains for compatibility
    domains: [
      'storage.googleapis.com',
      'firebasestorage.googleapis.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Optional: common Googleusercontent domain used by some buckets
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
