# Core Technologies

**Parent:** [Tech Stack](./README.md)
**Last Updated:** October 9, 2025

## Framework & Runtime

| Technology | Version | Status | Rationale |
|------------|---------|--------|-----------|
| **Next.js** | 15.5.3+ | ✅ Active | Best-in-class React framework with App Router, Server Components, and excellent DX |
| **React** | 19.1.0+ | ✅ Active | Industry-standard UI library with concurrent features |
| **Node.js** | 20 LTS | ✅ Active | Long-term support, stable, widely adopted |
| **TypeScript** | 5+ | ✅ Active | Type safety, better IDE support, fewer runtime errors |

## Why Next.js 15?

### vs Vite/React
- ✅ Server Components reduce client bundle size
- ✅ Built-in API routes simplify architecture
- ✅ Excellent SEO with dynamic metadata
- ✅ Production-ready out of the box
- ✅ Better suited for SaaS applications

### Key Features We Use

**1. App Router**
- File-based routing with layouts
- Nested layouts for dashboard structure
- Loading and error boundaries
- Parallel routes for complex UIs

**2. Server Components**
- Reduce client bundle size
- Direct database access
- Better SEO
- Automatic code splitting

**3. API Routes**
- Built-in API endpoints
- Edge runtime support
- Streaming responses
- Route handlers with TypeScript

**4. Server Actions**
- Form submissions without API routes
- Progressive enhancement
- Type-safe mutations
- Automatic revalidation

**5. Image Optimization**
- Automatic image optimization
- WebP/AVIF conversion
- Responsive images
- Lazy loading

## Application Structure

### App Directory Layout
```
app/
├── (marketing)/          # Public pages (minimal layout)
│   ├── page.tsx         # Homepage
│   ├── pricing/         # Pricing page
│   └── about/           # About page
├── auth/                # Authentication pages
│   ├── sign-in/         # Login
│   ├── sign-up/         # Registration
│   └── verify/          # Email verification
├── dashboard/           # Protected dashboards
│   ├── client/          # Client dashboard
│   ├── preparer/        # Tax preparer dashboard
│   └── referrer/        # Referrer dashboard
├── locations/           # Dynamic landing pages
│   └── [city]/          # City-specific pages
├── admin/               # Admin tools
│   ├── users/           # User management
│   └── analytics/       # Analytics dashboard
├── api/                 # API routes
│   ├── auth/            # Auth endpoints
│   ├── users/           # User CRUD
│   └── webhooks/        # Webhook handlers
└── layout.tsx           # Root layout
```

### Component Organization
```
components/
├── ui/                  # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── features/            # Feature-specific components
│   ├── auth/           # Auth components
│   ├── dashboard/      # Dashboard components
│   └── referrals/      # Referral components
├── layout/             # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
└── shared/             # Shared utility components
    ├── loading-spinner.tsx
    └── error-boundary.tsx
```

## TypeScript Configuration

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Type Safety Practices

**1. Strict Mode Enabled**
```typescript
// tsconfig.json
"strict": true,
"noImplicitAny": true,
"strictNullChecks": true,
"strictFunctionTypes": true
```

**2. Type-Safe Environment Variables**
```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
```

**3. Shared Types**
```typescript
// src/types/index.ts
export type UserRole = 'client' | 'preparer' | 'referrer' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
```

## Next.js Configuration

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    domains: ['minio.taxgeniuspro.tax'],
    formats: ['image/avif', 'image/webp'],
  },

  // Output standalone for PM2
  output: 'standalone',

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## Performance Optimizations

### 1. Server Components by Default
```typescript
// app/dashboard/page.tsx
// This is a Server Component by default
export default async function DashboardPage() {
  const data = await fetchData(); // Direct database call
  return <DashboardView data={data} />;
}
```

### 2. Client Components When Needed
```typescript
'use client';

// Only use 'use client' when you need:
// - useState, useEffect, etc.
// - Browser APIs
// - Event handlers
// - Custom hooks

import { useState } from 'react';

export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 3. Dynamic Imports
```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // Disable SSR if not needed
});
```

### 4. Metadata API
```typescript
// app/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tax Genius - Professional Tax Services',
  description: 'Connect with expert tax preparers in your area',
  openGraph: {
    title: 'Tax Genius',
    description: 'Professional Tax Services',
    images: ['/og-image.png'],
  },
};
```

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Server runs on http://localhost:3005

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Start production server
npm run start
```

### Environment Variables
```bash
# .env.local (development)
DATABASE_URL="postgresql://user:pass@localhost:5432/taxgenius"
NEXT_PUBLIC_APP_URL="http://localhost:3005"
CLERK_SECRET_KEY="sk_test_..."
RESEND_API_KEY="re_..."
```

## Production Build

### Build Configuration
```json
{
  "scripts": {
    "dev": "next dev -p 3005",
    "build": "next build",
    "start": "next start -p 3005",
    "type-check": "tsc --noEmit",
    "lint": "next lint"
  }
}
```

### Output
- Build creates `.next` directory
- Standalone output for PM2: `.next/standalone`
- Static assets in `.next/static`
- Public files copied to standalone

## Related Documentation

- [Frontend Stack](./frontend.md)
- [Backend Stack](./backend.md)
- [Development Workflow](./development.md)
- [Performance Optimization](./performance.md)

---

**Document Status:** ✅ Active
**Last Updated:** October 9, 2025
**Maintained By:** Development Team
