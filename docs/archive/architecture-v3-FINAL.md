# Tax Genius Platform - Architecture Document v3 (FINAL)

**Version:** 3.0 FINAL
**Date:** October 9, 2025
**Status:** Active - Single Source of Truth
**Platform:** taxgeniuspro.tax (Port 3005)

---

## 1. Executive Summary

This document defines the **authoritative architecture** for the Tax Genius Platform, a SaaS application connecting tax clients, preparers, and referrers through a comprehensive web platform. This version consolidates all previous architectural decisions and aligns with the MVP requirements defined in `/docs/prd/mvp-requirements.md`.

### Key Architectural Decisions

- **Framework:** Next.js 15+ with App Router (Server Components + Server Actions)
- **Deployment:** Self-hosted on VPS (72.60.28.175:3005)
- **Database:** PostgreSQL 15+ with Prisma ORM
- **Authentication:** Clerk.com (migrating from Lucia)
- **Storage:** MinIO (self-hosted S3-compatible)
- **Email:** Resend (already installed, activating)
- **Real-time:** Socket.io + Web Push Notifications

---

## 2. System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[PWA/Mobile Browser]
    end

    subgraph "Application Layer - VPS 72.60.28.175:3005"
        C[Nginx Reverse Proxy]
        D[Next.js 15 App Router]
        E[Socket.io Server]
        F[PM2 Process Manager]
    end

    subgraph "Data Layer"
        G[(PostgreSQL 15)]
        H[(Redis Cache)]
        I[MinIO Object Storage]
    end

    subgraph "External Services"
        J[Clerk.com Auth]
        K[Resend Email]
        L[Square Payments]
        M[LLM API - Gemini/Claude]
    end

    A --> C
    B --> C
    C --> D
    D --> E
    D --> G
    D --> H
    D --> I
    D --> J
    D --> K
    D --> L
    D --> M
    F --> D
```

---

## 3. Technology Stack (Definitive)

### 3.1 Core Framework

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|----------|
| **Framework** | Next.js | 15.5.3+ | React framework with App Router |
| **Runtime** | Node.js | 20 LTS | Server runtime |
| **Language** | TypeScript | 5+ | Type-safe development |
| **UI Library** | React | 19.1.0+ | Component library |
| **Build Tool** | Turbopack | Built-in | Fast refresh & builds |

### 3.2 Frontend Stack

| Component | Technology | Purpose |
|-----------|-----------|----------|
| **Styling** | Tailwind CSS 4+ | Utility-first CSS |
| **Components** | shadcn/ui + Radix UI | Accessible component primitives |
| **Icons** | Lucide React | Icon library |
| **Forms** | React Hook Form + Zod | Form state + validation |
| **State Management** | @tanstack/react-query | Server state management |
| **Client State** | React Context | Global client state (minimal) |
| **Animation** | Framer Motion | UI animations |

### 3.3 Backend & Database

| Component | Technology | Purpose |
|-----------|-----------|----------|
| **Database** | PostgreSQL 15+ | Primary relational database |
| **ORM** | Prisma 6+ | Type-safe database client |
| **Cache** | Redis 7+ (ioredis) | Session storage & caching |
| **Storage** | MinIO | S3-compatible object storage |
| **Queue** | Bull + Redis | Background job processing |

### 3.4 Authentication & Security

| Component | Technology | Purpose |
|-----------|-----------|----------|
| **Auth Provider** | Clerk.com | Authentication & user management |
| **Session** | Clerk sessions (JWT) | Secure session management |
| **Encryption** | node:crypto | PII/SSN encryption |
| **Password Hashing** | scrypt (built-in) | Secure password storage |
| **Rate Limiting** | Next.js middleware | API protection |

### 3.5 Communication & Real-time

| Component | Technology | Purpose |
|-----------|-----------|----------|
| **Email Service** | Resend | Transactional emails |
| **Email Templates** | @react-email/components | React-based email templates |
| **Real-time** | Socket.io | Live notifications & chat |
| **Push Notifications** | web-push | PWA push notifications |

### 3.6 Payments & Billing

| Component | Technology | Purpose |
|-----------|-----------|----------|
| **Payment Gateway** | Square | Payment processing |
| **Subscriptions** | Square Subscriptions API | Recurring billing |
| **Checkout** | Square Web Payments SDK | Hosted checkout |

### 3.7 DevOps & Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|----------|
| **Hosting** | Self-hosted VPS | Production environment |
| **Process Manager** | PM2 | Node.js process management |
| **Reverse Proxy** | Nginx | SSL termination & routing |
| **SSL** | Let's Encrypt | HTTPS certificates |
| **CI/CD** | GitHub Actions | Automated deployment |
| **Monitoring** | PM2 logs | Application monitoring |

### 3.8 Testing & Quality

| Component | Technology | Purpose |
|-----------|-----------|----------|
| **Unit Tests** | Jest + React Testing Library | Component & unit testing |
| **E2E Tests** | Playwright | End-to-end testing |
| **Linting** | ESLint 9 | Code quality |
| **Formatting** | Prettier | Code formatting |

### 3.9 AI & Content Generation

| Component | Technology | Purpose |
|-----------|-----------|----------|
| **LLM Provider** | Google Gemini API | AI content generation |
| **Alternative** | Claude API (Anthropic) | Backup LLM provider |
| **Content Storage** | PostgreSQL | Generated content storage |

---

## 4. Project Structure

```
/root/websites/taxgeniuspro/
├── docs/                           # Documentation (this file!)
│   ├── architecture-v3-FINAL.md    # This document
│   ├── tech-stack-v3.md           # Detailed tech stack
│   ├── migration-guide.md         # Migration instructions
│   ├── prd/                       # Product requirements
│   │   ├── mvp-requirements.md    # MVP specification
│   │   ├── epic-1-core-foundation.md
│   │   ├── epic-2-referrer-engine.md
│   │   ├── epic-3-client-preparer-workflow.md
│   │   └── epic-4-marketing-growth.md
│   └── archive/                   # Archived docs
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (marketing)/          # Public marketing pages
│   │   ├── auth/                 # Authentication pages
│   │   ├── dashboard/            # Role-based dashboards
│   │   │   ├── client/
│   │   │   ├── preparer/
│   │   │   └── referrer/
│   │   ├── admin/                # Admin tools
│   │   │   └── content-generator/  # AI content tool
│   │   ├── locations/            # Dynamic landing pages
│   │   │   └── [city]/
│   │   ├── api/                  # API routes
│   │   │   ├── auth/
│   │   │   ├── webhooks/
│   │   │   ├── referrals/
│   │   │   └── payments/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── features/             # Feature-specific components
│   │   ├── layout/               # Layout components
│   │   └── shared/               # Shared components
│   │
│   ├── lib/
│   │   ├── auth.ts               # Clerk integration
│   │   ├── db.ts                 # Prisma client
│   │   ├── redis.ts              # Redis client
│   │   ├── storage.ts            # MinIO integration
│   │   └── services/             # Business logic services
│   │       ├── email.service.ts
│   │       ├── payment.service.ts
│   │       ├── referral.service.ts
│   │       └── ai-content.service.ts
│   │
│   ├── hooks/                    # React hooks
│   ├── utils/                    # Utility functions
│   └── types/                    # TypeScript types
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
│
├── public/                       # Static assets
├── emails/                       # React Email templates
├── tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local                    # Environment variables
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 5. Database Architecture

### 5.1 Core Schema (Prisma)

```prisma
// Core user and organization models

model Organization {
  id              String    @id @default(cuid())
  name            String
  slug            String    @unique
  plan            Plan      @default(TRIAL)
  trialEndsAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  preparers       Preparer[]
  clients         Client[]
  subscriptions   Subscription[]

  @@index([slug])
  @@index([plan])
}

model User {
  id              String    @id @default(cuid())
  clerkUserId     String    @unique
  email           String    @unique
  name            String
  role            UserRole
  photoUrl        String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  preparer        Preparer?
  client          Client?
  referrer        Referrer?

  @@index([clerkUserId])
  @@index([email])
  @@index([role])
}

enum UserRole {
  CLIENT
  PREPARER
  REFERRER
  ADMIN
}

enum Plan {
  TRIAL
  STARTER
  PROFESSIONAL
  ENTERPRISE
}

// Preparer model
model Preparer {
  id              String    @id @default(cuid())
  userId          String    @unique
  organizationId  String
  ptin            String?
  credentials     Json?
  yearsExperience Int?
  serviceAreas    String[]
  pricing         Json?
  bio             String?

  user            User      @relation(fields: [userId], references: [id])
  organization    Organization @relation(fields: [organizationId], references: [id])
  clients         Client[]

  @@index([organizationId])
}

// Client model
model Client {
  id              String    @id @default(cuid())
  userId          String    @unique
  preparerId      String?
  organizationId  String
  pipelineStage   PipelineStage @default(NEW)
  referredBy      String?

  user            User      @relation(fields: [userId], references: [id])
  preparer        Preparer? @relation(fields: [preparerId], references: [id])
  organization    Organization @relation(fields: [organizationId], references: [id])
  documents       Document[]
  questionnaire   Questionnaire?

  @@index([preparerId])
  @@index([organizationId])
  @@index([pipelineStage])
}

enum PipelineStage {
  NEW
  CONTACTED
  DOCUMENTS
  PREPARING
  COMPLETE
}

// Referrer model
model Referrer {
  id              String    @id @default(cuid())
  userId          String    @unique
  vanitySlug      String?   @unique
  totalReferrals  Int       @default(0)
  totalEarnings   Float     @default(0)

  user            User      @relation(fields: [userId], references: [id])
  referrals       Referral[]

  @@index([vanitySlug])
}

// Referral tracking
model Referral {
  id              String    @id @default(cuid())
  referrerId      String
  clientId        String?
  referralCode    String
  status          ReferralStatus @default(PENDING)
  commission      Float     @default(0)
  createdAt       DateTime  @default(now())
  convertedAt     DateTime?

  referrer        Referrer  @relation(fields: [referrerId], references: [id])

  @@index([referrerId])
  @@index([referralCode])
  @@index([status])
}

enum ReferralStatus {
  PENDING
  CONVERTED
  PAID
}

// Document storage
model Document {
  id              String    @id @default(cuid())
  clientId        String
  preparerId      String?
  filename        String
  minioKey        String
  fileSize        Int
  mimeType        String
  documentType    String?
  uploadedAt      DateTime  @default(now())

  client          Client    @relation(fields: [clientId], references: [id])

  @@index([clientId])
  @@index([preparerId])
}

// Subscription management
model Subscription {
  id                    String    @id @default(cuid())
  organizationId        String
  squareSubscriptionId  String    @unique
  plan                  Plan
  status                SubscriptionStatus
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  cancelAtPeriodEnd     Boolean   @default(false)
  clientCount           Int       @default(0)
  storageUsedMB         Float     @default(0)

  organization          Organization @relation(fields: [organizationId], references: [id])

  @@index([organizationId])
  @@index([status])
}

enum SubscriptionStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
  PAUSED
}

// Landing page content
model LandingPage {
  id              String    @id @default(cuid())
  slug            String    @unique
  city            String
  state           String
  title           String
  metaDescription String
  content         Json      // AI-generated content
  qaAccordion     Json      // Q&A data
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  published       Boolean   @default(false)

  @@index([slug])
  @@index([city])
  @@index([published])
}

// Contest system
model Contest {
  id              String    @id @default(cuid())
  name            String
  description     String
  startDate       DateTime
  endDate         DateTime
  rules           Json
  prizes          Json
  active          Boolean   @default(true)

  leaderboard     LeaderboardEntry[]

  @@index([active])
  @@index([startDate])
}

model LeaderboardEntry {
  id              String    @id @default(cuid())
  contestId       String
  referrerId      String
  score           Int       @default(0)
  rank            Int?

  contest         Contest   @relation(fields: [contestId], references: [id])

  @@unique([contestId, referrerId])
  @@index([contestId])
  @@index([rank])
}
```

---

## 6. Authentication Flow (Clerk)

### 6.1 User Registration & Login

```mermaid
sequenceDiagram
    participant U as User
    participant C as Clerk
    participant N as Next.js App
    participant DB as PostgreSQL

    U->>C: Sign up/Login
    C->>C: Authenticate
    C->>N: Webhook: user.created
    N->>DB: Create User record
    N->>DB: Create role-specific record
    C->>U: Return session token
    U->>N: Access protected route
    N->>C: Verify session
    C->>N: Session valid
    N->>U: Render dashboard
```

### 6.2 Clerk Configuration

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/locations(.*)',
  '/contact',
  '/api/webhooks(.*)',
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

---

## 7. Storage Architecture (MinIO)

### 7.1 MinIO Configuration

```typescript
// src/lib/storage.ts
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT!, // http://localhost:9000
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true, // Required for MinIO
});

export async function generateUploadUrl(key: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: 'tax-documents',
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 600 }); // 10 min
}

export async function generateDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: 'tax-documents',
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
}
```

### 7.2 Bucket Structure

```
MinIO Buckets:
├── tax-documents/
│   ├── {organizationId}/
│   │   ├── {clientId}/
│   │   │   ├── {timestamp}-w2.pdf
│   │   │   ├── {timestamp}-1099.pdf
│   │   │   └── {timestamp}-id.jpg
│
├── profile-images/
│   ├── {userId}-{timestamp}.jpg
│
└── marketing-assets/
    ├── posters/
    ├── social-media/
    └── email-templates/
```

---

## 8. Email Architecture (Resend)

### 8.1 Email Service

```typescript
// src/lib/services/email.service.ts
import { Resend } from 'resend';
import { render } from '@react-email/components';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(
  to: string,
  data: { name: string; dashboardUrl: string }
) {
  const { data: result, error } = await resend.emails.send({
    from: 'Tax Genius <noreply@taxgeniuspro.tax>',
    to,
    subject: 'Welcome to Tax Genius!',
    react: WelcomeEmail(data),
  });

  if (error) {
    throw new Error(`Email send failed: ${error.message}`);
  }

  return result;
}
```

### 8.2 Email Templates (React Email)

```tsx
// emails/WelcomeEmail.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from '@react-email/components';

export function WelcomeEmail({ name, dashboardUrl }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome, {name}!</Heading>
          <Text style={text}>
            Thank you for joining Tax Genius. Get started by accessing your dashboard.
          </Text>
          <Button href={dashboardUrl} style={button}>
            Go to Dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## 9. API Design Patterns

### 9.1 API Route Structure

```
/api/
├── auth/
│   └── webhook/              # Clerk webhook handler
├── webhooks/
│   ├── square/               # Square payment webhooks
│   └── resend/               # Email event webhooks
├── referrals/
│   ├── track/                # Track referral clicks
│   └── vanity/               # Vanity slug management
├── payments/
│   ├── process/              # Process payments
│   └── subscription/         # Subscription management
├── documents/
│   ├── upload/               # Generate upload URLs
│   └── download/             # Generate download URLs
├── ai/
│   └── generate-content/     # AI content generation
└── admin/
    ├── analytics/            # Admin analytics
    └── users/                # User management
```

### 9.2 API Response Format

```typescript
// Standard API response
type APIResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

// Example usage
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 10. Security Architecture

### 10.1 Security Layers

```
Security Measures:
├── Network Layer
│   ├── SSL/TLS (Let's Encrypt)
│   ├── Nginx rate limiting
│   └── Cloudflare (optional CDN)
│
├── Application Layer
│   ├── Clerk authentication
│   ├── JWT token verification
│   ├── CSRF protection (Next.js built-in)
│   └── XSS protection (React auto-escaping)
│
├── Data Layer
│   ├── Prisma parameterized queries (SQL injection protection)
│   ├── node:crypto encryption for PII
│   ├── MinIO presigned URLs (time-limited)
│   └── Redis session encryption
│
└── Access Control
    ├── Role-based access control (RBAC)
    ├── Organization-level isolation
    └── Feature gating by subscription plan
```

### 10.2 PII Encryption

```typescript
// src/lib/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, KEY, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

---

## 11. Deployment Architecture

### 11.1 Production Deployment (PM2)

```bash
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'taxgeniuspro',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3005,
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }],
};

# Commands
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 11.2 Nginx Configuration

```nginx
# /etc/nginx/sites-available/taxgeniuspro.tax
server {
    listen 80;
    server_name taxgeniuspro.tax www.taxgeniuspro.tax;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name taxgeniuspro.tax www.taxgeniuspro.tax;

    ssl_certificate /etc/letsencrypt/live/taxgeniuspro.tax/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taxgeniuspro.tax/privkey.pem;

    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # MinIO access
    location /storage/ {
        proxy_pass http://localhost:9000/;
    }
}
```

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

## 13. Monitoring & Observability

### 13.1 Application Monitoring

```typescript
// src/lib/monitoring.ts
export async function logError(error: Error, context?: any) {
  console.error('[ERROR]', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });

  // TODO: Integrate Sentry or similar service
}

export async function logPerformance(label: string, duration: number) {
  console.info('[PERFORMANCE]', {
    label,
    duration,
    timestamp: new Date().toISOString(),
  });
}
```

### 13.2 Health Check Endpoint

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis
    await redis.ping();

    // Check MinIO (optional)
    // await s3Client.headBucket({ Bucket: 'tax-documents' });

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'ok',
        redis: 'ok',
        storage: 'ok',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
      },
      { status: 503 }
    );
  }
}
```

---

## 14. AI Content Generation Architecture

### 14.1 AI Service Integration

```typescript
// src/lib/services/ai-content.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateLandingPageContent(
  city: string,
  keywords: string[]
): Promise<LandingPageContent> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    Generate SEO-optimized content for a tax preparation landing page.

    Target Location: ${city}
    Keywords: ${keywords.join(', ')}

    Generate the following in JSON format:
    1. Page title (60 chars max)
    2. Meta description (155 chars max)
    3. H1 heading
    4. 3 paragraphs of content
    5. 5 Q&A pairs for an FAQ accordion

    Format: { title, metaDescription, h1, content, qa }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return JSON.parse(text);
}
```

---

## 15. Migration Path

See [migration-guide.md](./migration-guide.md) for detailed migration instructions for:

1. Lucia → Clerk authentication
2. SendGrid → Resend email service
3. AWS S3/R2 → MinIO storage

---

## 16. Related Documentation

- [Tech Stack Details](./tech-stack-v3.md) - Comprehensive technology decisions
- [Migration Guide](./migration-guide.md) - Step-by-step migration instructions
- [MVP Requirements](./prd/mvp-requirements.md) - Product specifications
- [Epic 1: Core Foundation](./prd/epic-1-core-foundation.md)
- [Epic 2: Referrer Engine](./prd/epic-2-referrer-engine.md)
- [Epic 3: Client/Preparer Workflow](./prd/epic-3-client-preparer-workflow.md)
- [Epic 4: Marketing & Growth](./prd/epic-4-marketing-growth.md)

---

## 17. Appendix

### A. Environment Variables

```bash
# .env.local template

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/taxgenius"
REDIS_URL="redis://localhost:6379"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_xxxxx"
CLERK_SECRET_KEY="sk_live_xxxxx"
CLERK_WEBHOOK_SECRET="whsec_xxxxx"

# Email (Resend)
RESEND_API_KEY="re_xxxxx"

# Storage (MinIO)
MINIO_ENDPOINT="http://localhost:9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

# Payments (Square)
SQUARE_ACCESS_TOKEN="sq0atp-xxxxx"
SQUARE_LOCATION_ID="xxxxx"
SQUARE_WEBHOOK_SIGNATURE_KEY="xxxxx"

# AI (Gemini)
GEMINI_API_KEY="xxxxx"

# Encryption
ENCRYPTION_KEY="xxxxx" # 64-char hex string

# App Config
NEXT_PUBLIC_APP_URL="https://taxgeniuspro.tax"
NODE_ENV="production"
PORT="3005"
```

### B. Deployment Checklist

- [ ] PostgreSQL database running and migrated
- [ ] Redis server running
- [ ] MinIO server running with buckets created
- [ ] Clerk application configured with webhooks
- [ ] Resend domain verified and API key obtained
- [ ] Square application configured with webhooks
- [ ] SSL certificates installed and auto-renewal configured
- [ ] PM2 configured and set to auto-start on boot
- [ ] Nginx configured and tested
- [ ] Environment variables set
- [ ] Database backups scheduled
- [ ] Monitoring and alerting configured

---

**Document Version:** 3.0 FINAL
**Last Updated:** October 9, 2025
**Next Review:** November 9, 2025
**Maintained By:** Development Team
