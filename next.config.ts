import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import bundleAnalyzer from "@next/bundle-analyzer";
import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('@next/bundle-analyzer').BundleAnalyzer} */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('@ducanh2912/next-pwa').PwaAdapter} */
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  output: 'standalone',

  // Prevent webpack from bundling native addons
  serverExternalPackages: ['better-sqlite3', '@opentelemetry/instrumentation', '@sentry/node'],

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ansertech.com" }],
        destination: "https://ansertech.com/:path*",
        permanent: true,
      },
      {
        source: "/dashboard/:path*",
        has: [{ type: "host", value: "ansertech.com" }],
        destination: "https://dashboard.ansertech.com/:path*",
        permanent: true,
      },
      {
        source: "/dashboard",
        has: [{ type: "host", value: "ansertech.com" }],
        destination: "https://dashboard.ansertech.com",
        permanent: true,
      },
      {
        source: "/login",
        has: [{ type: "host", value: "ansertech.com" }],
        destination: "https://auth.ansertech.com/login",
        permanent: true,
      },
      {
        source: "/register",
        has: [{ type: "host", value: "ansertech.com" }],
        destination: "https://auth.ansertech.com/register",
        permanent: true,
      },
      {
        source: "/forgot-password",
        has: [{ type: "host", value: "ansertech.com" }],
        destination: "https://auth.ansertech.com/forgot-password",
        permanent: true,
      },
      {
        source: "/reset-password",
        has: [{ type: "host", value: "ansertech.com" }],
        destination: "https://auth.ansertech.com/reset-password",
        permanent: true,
      },
    ];
  },

  // Add caching headers for static assets and security headers for all routes
  async headers() {
    return [
      {
        source: '/dashboard/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/login',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/register',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/forgot-password',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/reset-password',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/onboarding',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/billing',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/analytics',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/auth/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        // Security headers for all routes
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

// Export the configuration wrapped with all active features
export default withSentryConfig(
  withBundleAnalyzer(withPWA(nextConfig)),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-javascript/blob/master/packages/nextjs/src/config/types.ts

    // Suppresses source map uploading logs during build
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    // Hides source maps from visitors by deleting them after upload
    sourcemaps: {
      deleteSourcemapsAfterUpload: true,
    },

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    webpack: {
      treeshake: {
        removeDebugLogging: true,
      },
    },

    // tunnelRoute: "/monitoring",
    // NOTE: tunnelRoute was removed to reduce server CPU load.
    // It proxied every browser Sentry request through Next.js server-side,
    // causing unnecessary overhead on a 2-core production VPS.
    // Sentry SDK will send directly to sentry.io instead.

    // Enables automatic instrumentation of Vercel Cron Monitors via span-based approach
    // Compatible with Turbopack and App Router without build-time route wrapping:
    // https://docs.sentry.io/product/crons/
    _experimental: {
      vercelCronsMonitoring: true,
    },
  }
);
