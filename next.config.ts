import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.taxgenius.tax',
        pathname: '/wp-migration/**',
      },
      {
        protocol: 'https',
        hostname: 'taxgenius.tax',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true
      },
      {
        source: '/services-offered',
        destination: '/services',
        permanent: true
      },
      {
        source: '/get-quote',
        destination: '/pricing',
        permanent: true
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true
      },
      {
        source: '/affiliate-dashboard',
        destination: '/dashboard/referrer',
        permanent: true
      },
      {
        source: '/tax-services',
        destination: '/services',
        permanent: true
      }
    ];
  },
};

export default nextConfig;