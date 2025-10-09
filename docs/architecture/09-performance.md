# Tax Genius Platform - Performance Optimization

**Version:** 3.0 FINAL
**Date:** October 9, 2025
**Status:** Active - Single Source of Truth
**Part:** 9 of 11

[↑ Back to Architecture Index](./README.md)

---

## 12. Performance Optimization

### 12.1 Caching Strategy

```typescript
// Redis caching patterns
import { redis } from '@/lib/redis';

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch and cache
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

// Usage
const stats = await getCachedData(
  `referrer:${userId}:stats`,
  () => fetchReferrerStats(userId),
  300 // 5 minutes
);
```

### 12.2 Next.js Optimization

```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  images: {
    domains: ['localhost', 'taxgeniuspro.tax'],
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },

  // PWA support
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
};

export default nextConfig;
```

---

## Caching Strategies

### Multi-Level Caching

```typescript
// src/lib/cache/multi-level-cache.ts
import { redis } from '@/lib/redis';

interface CacheOptions {
  ttl: number;
  staleWhileRevalidate?: number;
}

const inMemoryCache = new Map<string, { data: any; expiry: number }>();

export async function getWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  const { ttl, staleWhileRevalidate = 0 } = options;

  // Level 1: In-memory cache (fastest)
  const memCached = inMemoryCache.get(key);
  if (memCached && Date.now() < memCached.expiry) {
    return memCached.data;
  }

  // Level 2: Redis cache (fast)
  const redisCached = await redis.get(key);
  if (redisCached) {
    const data = JSON.parse(redisCached);

    // Update in-memory cache
    inMemoryCache.set(key, {
      data,
      expiry: Date.now() + ttl * 1000,
    });

    return data;
  }

  // Level 3: Fetch from source (slow)
  const data = await fetcher();

  // Update both caches
  await redis.setex(key, ttl + staleWhileRevalidate, JSON.stringify(data));
  inMemoryCache.set(key, {
    data,
    expiry: Date.now() + ttl * 1000,
  });

  return data;
}

// Clear cache
export async function clearCache(key: string) {
  inMemoryCache.delete(key);
  await redis.del(key);
}
```

### Cache Invalidation

```typescript
// src/lib/cache/invalidation.ts
import { redis } from '@/lib/redis';

export enum CacheTag {
  USER = 'user',
  CLIENT = 'client',
  PREPARER = 'preparer',
  REFERRER = 'referrer',
  DOCUMENT = 'document',
  REFERRAL = 'referral',
}

export async function invalidateCache(tag: CacheTag, id: string) {
  const pattern = `${tag}:${id}:*`;
  const keys = await redis.keys(pattern);

  if (keys.length > 0) {
    await redis.del(...keys);
    console.log(`Invalidated ${keys.length} cache entries for ${pattern}`);
  }
}

// Usage after data mutation
await prisma.client.update({ ... });
await invalidateCache(CacheTag.CLIENT, clientId);
```

---

## Database Optimization

### Query Optimization

```typescript
// src/lib/db/optimized-queries.ts
import { prisma } from '@/lib/db';

// Bad: N+1 query problem
export async function getBadClientList(preparerId: string) {
  const clients = await prisma.client.findMany({
    where: { preparerId },
  });

  // This triggers a separate query for each client!
  for (const client of clients) {
    client.user = await prisma.user.findUnique({
      where: { id: client.userId },
    });
  }

  return clients;
}

// Good: Use include to fetch related data
export async function getOptimizedClientList(preparerId: string) {
  return prisma.client.findMany({
    where: { preparerId },
    include: {
      user: true,
      documents: {
        orderBy: { uploadedAt: 'desc' },
        take: 5,
      },
    },
  });
}

// Best: Use select to fetch only needed fields
export async function getEfficientClientList(preparerId: string) {
  return prisma.client.findMany({
    where: { preparerId },
    select: {
      id: true,
      pipelineStage: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      documents: {
        select: {
          id: true,
          filename: true,
          uploadedAt: true,
        },
        orderBy: { uploadedAt: 'desc' },
        take: 5,
      },
    },
  });
}
```

### Database Indexing

```prisma
// prisma/schema.prisma

model Client {
  id              String    @id @default(cuid())
  userId          String    @unique
  preparerId      String?
  organizationId  String
  pipelineStage   PipelineStage @default(NEW)

  // Strategic indexes for common queries
  @@index([preparerId])           // Filter by preparer
  @@index([organizationId])       // Filter by organization
  @@index([pipelineStage])        // Filter by stage
  @@index([preparerId, pipelineStage]) // Composite index for filtering
}
```

---

## Image Optimization

### Next.js Image Component

```typescript
// src/components/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,..."
      quality={85}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

---

## Code Splitting & Lazy Loading

### Dynamic Imports

```typescript
// src/app/dashboard/client/page.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const DocumentUploader = dynamic(() => import('@/components/features/DocumentUploader'), {
  loading: () => <p>Loading uploader...</p>,
  ssr: false, // Disable SSR for client-only components
});

const ChartComponent = dynamic(() => import('@/components/features/Chart'), {
  loading: () => <div>Loading chart...</div>,
});

export default function ClientDashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DocumentUploader />
      <ChartComponent />
    </div>
  );
}
```

### Route-based Code Splitting

```typescript
// next.config.mjs
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
    ],
  },
};
```

---

## API Response Optimization

### Pagination

```typescript
// src/lib/pagination.ts
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function paginate<T>(
  model: any,
  where: any,
  params: PaginationParams,
  include?: any
): Promise<PaginatedResponse<T>> {
  const { page, limit } = params;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      skip,
      take: limit,
      include,
    }),
    model.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Usage
const result = await paginate(
  prisma.client,
  { preparerId },
  { page: 1, limit: 20 },
  { user: true }
);
```

### Response Compression

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Enable compression for API responses
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Content-Encoding', 'gzip');
  }

  return response;
}
```

---

## Bundle Size Optimization

### Analyze Bundle Size

```bash
# Install bundle analyzer
npm install -D @next/bundle-analyzer

# Update next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### Tree Shaking

```typescript
// Import only what you need
// Bad:
import _ from 'lodash';

// Good:
import debounce from 'lodash/debounce';

// Bad:
import * as RadixIcons from '@radix-ui/react-icons';

// Good:
import { ChevronDownIcon, CrossIcon } from '@radix-ui/react-icons';
```

---

## Server Component Optimization

### Static vs Dynamic Rendering

```typescript
// Static page (pre-rendered at build time)
export default async function StaticPage() {
  const data = await fetch('https://api.example.com/static-data', {
    cache: 'force-cache', // Cache indefinitely
  });

  return <div>{data}</div>;
}

// Dynamic page (rendered on each request)
export const dynamic = 'force-dynamic';

export default async function DynamicPage() {
  const data = await fetch('https://api.example.com/dynamic-data', {
    cache: 'no-store', // Never cache
  });

  return <div>{data}</div>;
}

// Incremental Static Regeneration (ISR)
export const revalidate = 3600; // Revalidate every hour

export default async function ISRPage() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 },
  });

  return <div>{data}</div>;
}
```

---

## Performance Monitoring

### Web Vitals Tracking

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Custom Performance Metrics

```typescript
// src/lib/performance.ts
export function measurePerformance(label: string) {
  const start = performance.now();

  return {
    end: () => {
      const duration = performance.now() - start;
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
      return duration;
    },
  };
}

// Usage
const perf = measurePerformance('Database query');
const data = await prisma.client.findMany();
perf.end();
```

---

## Performance Checklist

- ✅ Enable Redis caching for frequently accessed data
- ✅ Use Next.js Image component for all images
- ✅ Implement pagination for large data sets
- ✅ Optimize database queries with proper indexes
- ✅ Use code splitting and lazy loading
- ✅ Enable compression for API responses
- ✅ Minimize bundle size with tree shaking
- ✅ Use Server Components where possible
- ✅ Implement ISR for semi-static pages
- ✅ Monitor Web Vitals and Core Web Vitals
- ✅ Optimize third-party script loading
- ✅ Use CDN for static assets

---

## Performance Targets

### Core Web Vitals Goals

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTFB (Time to First Byte):** < 600ms

---

## Related Documentation

- [Deployment Architecture](./08-deployment.md) - Production setup
- [Database Schema](./02-database-schema.md) - Database optimization
- [Monitoring & Observability](./11-monitoring.md) - Performance monitoring
- [Overview](./01-overview.md) - System architecture

---

**Navigation:**
[← Previous: Deployment Architecture](./08-deployment.md) | [Next: AI Content Generation →](./10-ai-content.md)

---

**Document Version:** 3.0 FINAL
**Last Updated:** October 9, 2025
**Next Review:** November 9, 2025
**Maintained By:** Development Team
