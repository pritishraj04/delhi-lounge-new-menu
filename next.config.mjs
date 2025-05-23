/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  // Your existing Next.js config options here
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(js|css|woff|woff2|ttf|eot)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /\/data\/food-menu\.csv$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'menu-data',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
      },
    },
    {
      urlPattern: /\/data\/bar-menu\.csv$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'menu-data',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
      },
    },
  ],
})(nextConfig);
