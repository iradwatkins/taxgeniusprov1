import { Metadata } from 'next';

const SITE_NAME = 'Tax Genius Pro';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://taxgeniuspro.tax';
const DEFAULT_DESCRIPTION =
  'Professional tax preparation and filing services. Expert tax preparers, guaranteed accuracy, maximum refunds. Personal and business tax services available nationwide.';

export interface PageMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'product.group';
  noindex?: boolean;
}

/**
 * Generate Next.js metadata for SEO optimization
 */
export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [],
  image,
  url,
  type = 'website',
  noindex = false,
}: PageMetadata): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const ogImage = image || `${SITE_URL}/og-image.png`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    ...(noindex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

/**
 * Generate metadata for tax service pages
 */
export function generateTaxServiceMetadata(
  serviceName: string,
  serviceSlug: string,
  description?: string,
  metaTitle?: string,
  keywords?: string[],
  imageUrl?: string
): Metadata {
  const title = metaTitle || `${serviceName} | Tax Genius Pro`;
  const desc =
    description ||
    `Expert ${serviceName.toLowerCase()} services. IRS-certified tax professionals, guaranteed accuracy, maximum refunds. Get started today!`;

  return generateMetadata({
    title,
    description: desc,
    keywords: keywords || [
      serviceName.toLowerCase(),
      `${serviceName.toLowerCase()} services`,
      'tax preparation',
      'tax filing',
      'tax professional',
    ],
    image: imageUrl,
    url: `/services/${serviceSlug}`,
    type: 'website',
  });
}

/**
 * Generate metadata for location pages
 */
export function generateLocationMetadata(
  cityName: string,
  stateName: string,
  stateAbbrev: string,
  description?: string,
  imageUrl?: string
): Metadata {
  const title = `Tax Preparation in ${cityName}, ${stateAbbrev} | Tax Genius Pro`;
  const desc =
    description ||
    `Professional tax preparation services in ${cityName}, ${stateName}. Expert tax preparers, maximum refunds, IRS-certified. Personal and business tax filing available.`;

  return generateMetadata({
    title,
    description: desc,
    keywords: [
      `tax preparation ${cityName}`,
      `tax services ${cityName}`,
      `${cityName} tax preparer`,
      `tax filing ${cityName} ${stateAbbrev}`,
      'professional tax services',
      'tax expert near me',
    ],
    image: imageUrl,
    url: `/locations/${cityName.toLowerCase().replace(/\s+/g, '-')}-${stateAbbrev.toLowerCase()}`,
    type: 'website',
  });
}

/**
 * Generate title template for consistent page titles
 */
export function createTitleTemplate(template: string): string {
  return template.replace('%s', SITE_NAME);
}

/**
 * Truncate text to specified length (for meta descriptions)
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Generate keywords array from category and product data
 */
export function generateKeywords(mainKeyword: string, additionalKeywords: string[] = []): string[] {
  const base = [
    mainKeyword,
    `${mainKeyword} printing`,
    `custom ${mainKeyword}`,
    `${mainKeyword} online`,
    'printing services',
    'online printing',
  ];

  return [...new Set([...base, ...additionalKeywords])];
}
