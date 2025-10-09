# Performance Targets

**Parent:** [Tech Stack](./README.md)
**Last Updated:** October 9, 2025

---

## Overview

Performance targets and optimization strategies for the Tax Genius platform to ensure fast, responsive user experience.

---

## Application Performance Metrics

### Core Web Vitals

| Metric | Target | Good | Needs Improvement | Poor | Current |
|--------|--------|------|-------------------|------|---------|
| **Time to First Byte (TTFB)** | < 200ms | < 200ms | 200-600ms | > 600ms | 📊 To measure |
| **First Contentful Paint (FCP)** | < 1.5s | < 1.8s | 1.8-3.0s | > 3.0s | 📊 To measure |
| **Largest Contentful Paint (LCP)** | < 2.5s | < 2.5s | 2.5-4.0s | > 4.0s | 📊 To measure |
| **Cumulative Layout Shift (CLS)** | < 0.1 | < 0.1 | 0.1-0.25 | > 0.25 | 📊 To measure |
| **Time to Interactive (TTI)** | < 3.5s | < 3.8s | 3.9-7.3s | > 7.3s | 📊 To measure |
| **First Input Delay (FID)** | < 100ms | < 100ms | 100-300ms | > 300ms | 📊 To measure |

### Additional Metrics

| Metric | Target | Purpose |
|--------|--------|---------|
| **Total Blocking Time (TBT)** | < 200ms | Measure main thread blocking |
| **Speed Index** | < 3.0s | How quickly content is visually displayed |
| **Bundle Size (Initial)** | < 200KB | JavaScript bundle size (gzipped) |
| **Bundle Size (Total)** | < 1MB | Total JavaScript loaded |

---

## Database Performance

### PostgreSQL

| Metric | Target | Notes |
|--------|--------|-------|
| **Query time (avg)** | < 50ms | For common queries |
| **Query time (p95)** | < 200ms | 95th percentile |
| **Query time (p99)** | < 500ms | 99th percentile |
| **Connection pool size** | 10-20 | Based on load |
| **Connection time** | < 10ms | Time to get connection |
| **Transaction time** | < 100ms | Average transaction duration |

**Query Optimization:**
```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_tax_returns_status ON tax_returns(status);
CREATE INDEX idx_tax_returns_preparer_id ON tax_returns(preparer_id);

-- Composite indexes for common query patterns
CREATE INDEX idx_documents_user_created ON documents(user_id, created_at DESC);
CREATE INDEX idx_tax_returns_user_status ON tax_returns(user_id, status);
```

**Prisma Query Optimization:**
```typescript
// Bad - N+1 query problem
const users = await prisma.user.findMany();
for (const user of users) {
  const documents = await prisma.document.findMany({
    where: { userId: user.id },
  });
}

// Good - Use include to fetch relations in single query
const users = await prisma.user.findMany({
  include: {
    documents: true,
  },
});

// Better - Use select to fetch only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    documents: {
      select: {
        id: true,
        fileName: true,
      },
    },
  },
});
```

### Redis Caching

| Metric | Target | Notes |
|--------|--------|-------|
| **Cache hit rate** | > 80% | Percentage of requests served from cache |
| **Cache response time** | < 5ms | Time to retrieve from cache |
| **Memory usage** | < 256MB | Redis memory consumption |
| **Eviction rate** | < 5% | Percentage of keys evicted |

**Caching Strategy:**
```typescript
// lib/cache.ts
import { redis } from './redis';

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Try to get from cache
  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached) as T;
  }

  // Fetch from source
  const data = await fetcher();

  // Store in cache
  await redis.set(key, JSON.stringify(data), 'EX', ttl);

  return data;
}

// Usage
const user = await getCached(
  `user:${userId}`,
  () => prisma.user.findUnique({ where: { id: userId } }),
  3600 // 1 hour TTL
);
```

**Cache Invalidation:**
```typescript
// lib/cache.ts
export async function invalidateCache(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

// Usage
await invalidateCache(`user:${userId}:*`);
```

---

## API Response Times

### Target Response Times

| Endpoint Type | Target | Acceptable | Poor |
|---------------|--------|------------|------|
| **Static pages** | < 100ms | < 200ms | > 500ms |
| **Dynamic pages** | < 200ms | < 500ms | > 1000ms |
| **API routes (read)** | < 100ms | < 200ms | > 500ms |
| **API routes (write)** | < 200ms | < 500ms | > 1000ms |
| **File uploads** | < 1s | < 3s | > 5s |
| **Reports/exports** | < 2s | < 5s | > 10s |

### API Optimization

```typescript
// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCached } from '@/lib/cache';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Use caching for GET requests
  const user = await getCached(
    `user:${params.id}`,
    () => prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        // Only select needed fields
      },
    }),
    300 // 5 minutes
  );

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}
```

---

## Frontend Performance

### JavaScript Bundle Optimization

**Target Sizes:**
- Initial bundle: < 200KB (gzipped)
- Total JavaScript: < 1MB (gzipped)
- CSS: < 50KB (gzipped)

**Optimization Techniques:**

1. **Code Splitting:**
```typescript
// app/dashboard/page.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const AnalyticsChart = dynamic(() => import('@/components/analytics-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Don't render on server
});

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <AnalyticsChart />
    </div>
  );
}
```

2. **Tree Shaking:**
```typescript
// Good - only imports what you need
import { format } from 'date-fns';

// Bad - imports entire library
import * as dateFns from 'date-fns';
```

3. **Image Optimization:**
```typescript
import Image from 'next/image';

<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  quality={75}
  loading="lazy"
  placeholder="blur"
/>
```

### React Component Optimization

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive components
export const ExpensiveComponent = memo(({ data }: Props) => {
  // Component code
});

// Memoize expensive calculations
function MyComponent({ items }: Props) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  // Memoize callbacks
  const handleClick = useCallback(() => {
    // Handle click
  }, []);

  return <div>{/* ... */}</div>;
}
```

### Font Optimization

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Use font-display: swap
  preload: true,
  variable: '--font-inter',
});

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Network Performance

### HTTP/2 Configuration

Nginx configuration for HTTP/2:
```nginx
server {
    listen 443 ssl http2;
    # ... rest of config
}
```

### Compression

```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml+rss
    application/rss+xml
    font/truetype
    font/opentype
    application/vnd.ms-fontobject
    image/svg+xml;
```

### CDN (Future)

When scaling, consider adding CDN for static assets:
- Cloudflare CDN
- AWS CloudFront
- Fastly

---

## Monitoring & Measurement

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
```

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm start',
      url: ['http://localhost:3005/', 'http://localhost:3005/dashboard'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

### Real User Monitoring (Future)

Consider adding when traffic grows:
```typescript
// lib/analytics/web-vitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics endpoint
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

---

## Performance Checklist

### Build Time

- [ ] Enable Next.js SWC compiler (faster than Babel)
- [ ] Use TypeScript's incremental compilation
- [ ] Enable Prisma binary caching
- [ ] Optimize asset processing

### Runtime

- [ ] Enable React Strict Mode for development
- [ ] Use Server Components by default
- [ ] Implement proper caching strategy
- [ ] Optimize database queries with indexes
- [ ] Use connection pooling for database
- [ ] Enable Redis for session storage
- [ ] Implement rate limiting

### Assets

- [ ] Optimize images with Next.js Image component
- [ ] Use modern image formats (WebP, AVIF)
- [ ] Enable lazy loading for images
- [ ] Minimize CSS/JS bundles
- [ ] Use font-display: swap for custom fonts
- [ ] Preload critical resources

### Network

- [ ] Enable HTTP/2
- [ ] Enable gzip/brotli compression
- [ ] Set appropriate cache headers
- [ ] Use CDN for static assets (when scaling)
- [ ] Implement service worker for offline support (PWA)

---

## Browser Support & Performance

### Supported Browsers

| Browser | Minimum Version | Performance Target |
|---------|----------------|-------------------|
| **Chrome** | Last 2 versions | Full performance |
| **Firefox** | Last 2 versions | Full performance |
| **Safari** | Last 2 versions | Full performance |
| **Edge** | Last 2 versions | Full performance |
| **Mobile Safari** | iOS 14+ | Optimized for mobile |
| **Chrome Android** | Last 2 versions | Optimized for mobile |

### Progressive Enhancement

- ✅ Core functionality works without JavaScript
- ✅ Enhanced experience with JavaScript enabled
- ✅ PWA features for modern browsers
- ✅ Graceful degradation for older browsers

---

## Performance Budget

### Budget Limits

| Resource | Budget | Actual | Status |
|----------|--------|--------|--------|
| **JavaScript** | 200KB | 📊 To measure | - |
| **CSS** | 50KB | 📊 To measure | - |
| **Fonts** | 100KB | 📊 To measure | - |
| **Images** | 500KB | 📊 To measure | - |
| **Total** | 850KB | 📊 To measure | - |

### Enforcement

Add to CI/CD pipeline:
```bash
# Check bundle size
npm run build
npx bundlesize
```

```json
// package.json
{
  "bundlesize": [
    {
      "path": ".next/static/chunks/main-*.js",
      "maxSize": "200 kB"
    },
    {
      "path": ".next/static/css/*.css",
      "maxSize": "50 kB"
    }
  ]
}
```

---

## Related Documentation

- [Tech Stack Overview](./README.md)
- [Infrastructure Setup](./infrastructure.md)
- [Development Workflow](./development.md)
- [Architecture](../architecture/README.md)

---

**Document Status:** ✅ Active
