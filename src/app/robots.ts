import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration (AC21)
 * Allows crawling of /locations/* paths
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/app/',
        ],
      },
    ],
    sitemap: 'https://taxgeniuspro.tax/sitemap.xml',
  };
}
