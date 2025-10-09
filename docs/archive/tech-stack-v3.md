# Tax Genius Platform - Technology Stack v3

**Version:** 3.0
**Date:** October 9, 2025
**Status:** Active - Single Source of Truth

---

## Table of Contents

1. [Overview](#1-overview)
2. [Core Technologies](#2-core-technologies)
3. [Frontend Stack](#3-frontend-stack)
4. [Backend Stack](#4-backend-stack)
5. [Infrastructure](#5-infrastructure)
6. [Third-Party Services](#6-third-party-services)
7. [Development Tools](#7-development-tools)
8. [Package Versions](#8-package-versions)
9. [Migration Status](#9-migration-status)

---

## 1. Overview

This document provides a comprehensive breakdown of all technologies used in the Tax Genius platform, including version numbers, rationale, and migration status.

### Tech Stack Philosophy

- **Modern & Stable:** Use latest stable versions of proven technologies
- **Type-Safe:** TypeScript throughout for reliability
- **Self-Hosted First:** Minimize external dependencies where practical
- **Developer Experience:** Prioritize DX without sacrificing performance
- **Cost-Effective:** Balance managed services with self-hosting

---

## 2. Core Technologies

### 2.1 Framework & Runtime

| Technology | Version | Status | Rationale |
|------------|---------|--------|-----------|
| **Next.js** | 15.5.3+ | ✅ Active | Best-in-class React framework with App Router, Server Components, and excellent DX |
| **React** | 19.1.0+ | ✅ Active | Industry-standard UI library with concurrent features |
| **Node.js** | 20 LTS | ✅ Active | Long-term support, stable, widely adopted |
| **TypeScript** | 5+ | ✅ Active | Type safety, better IDE support, fewer runtime errors |

**Why Next.js 15 over Vite/React:**
- Server Components reduce client bundle size
- Built-in API routes simplify architecture
- Excellent SEO with dynamic metadata
- Production-ready out of the box
- Better suited for SaaS applications

---

## 3. Frontend Stack

### 3.1 Styling & UI Components

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **Tailwind CSS** | 4.1.13 | ✅ Active | Utility-first styling, excellent DX |
| **shadcn/ui** | Latest | ✅ Active | Accessible, customizable components |
| **Radix UI** | Latest | ✅ Active | Unstyled accessible primitives |
| **Lucide React** | 0.544.0+ | ✅ Active | Beautiful, consistent icons |
| **Framer Motion** | 12.23.12+ | ✅ Active | Smooth animations |

**Component Architecture:**
```
components/
├── ui/           # shadcn/ui styled components
├── features/     # Feature-specific components
├── layout/       # Layout components (Header, Footer, etc.)
└── shared/       # Shared utility components
```

### 3.2 State Management

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **@tanstack/react-query** | 5.87.4+ | ✅ Active | Server state management, caching |
| **React Context** | Built-in | ✅ Active | Global client state (minimal) |
| **React Hook Form** | 7.62.0+ | ✅ Active | Form state management |
| **Zod** | 4.1.8+ | ✅ Active | Schema validation |

**State Management Strategy:**
- **Server State:** React Query for all API data
- **Form State:** React Hook Form for all forms
- **Global UI State:** React Context (theme, user preferences)
- **URL State:** Next.js routing and search params

### 3.3 Routing & Navigation

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **Next.js App Router** | Built-in | ✅ Active | File-based routing, layouts |
| **next/navigation** | Built-in | ✅ Active | Programmatic navigation |

**Routing Structure:**
```
app/
├── (marketing)/          # Public pages (no layout)
├── auth/                 # Authentication pages
├── dashboard/            # Protected dashboards
│   ├── client/
│   ├── preparer/
│   └── referrer/
├── locations/[city]/     # Dynamic landing pages
└── admin/                # Admin tools
```

---

## 4. Backend Stack

### 4.1 Database & ORM

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **PostgreSQL** | 15+ | ✅ Active | Primary relational database |
| **Prisma** | 6.16.1+ | ✅ Active | Type-safe ORM, migrations |
| **Redis** | 7.2+ | ✅ Active | Caching, sessions, queues |
| **ioredis** | 5.7.0+ | ✅ Active | Redis client library |

**Database Features:**
- ✅ Prisma Migrate for version control
- ✅ Type-safe queries
- ✅ Automatic migrations
- ✅ Connection pooling

### 4.2 Authentication & Authorization

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **Clerk.com** | Latest | 🔄 Migrating | Authentication & user management |
| **Lucia** | 3.2.2 | ⚠️ Deprecated | Current auth (being replaced) |
| **node:crypto** | Built-in | ✅ Active | PII encryption |
| **scrypt** | Built-in | ✅ Active | Password hashing |

**Migration Timeline:**
- Week 3-4: Implement Clerk
- Week 4-5: Migrate users
- Week 5: Deprecate Lucia

### 4.3 Storage

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **MinIO** | Latest | 🔄 Setting up | S3-compatible object storage |
| **@aws-sdk/client-s3** | 3.888.0+ | ✅ Active | S3 client (works with MinIO) |
| **@aws-sdk/s3-request-presigner** | 3.888.0+ | ✅ Active | Presigned URLs |
| **Cloudflare R2** | N/A | ⚠️ Deprecated | Being replaced by MinIO |

**Storage Buckets:**
- `tax-documents` - Client tax documents
- `profile-images` - User profile photos
- `marketing-assets` - Marketing materials

### 4.4 Background Jobs

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **Bull** | 4.16.5+ | ✅ Active | Job queue management |
| **@bull-board/express** | 6.12.7+ | ✅ Active | Queue monitoring UI |

**Job Types:**
- Email sending (async)
- Document processing
- Analytics calculations
- Subscription billing

---

## 5. Infrastructure

### 5.1 Hosting & Deployment

| Component | Technology | Status | Details |
|-----------|-----------|--------|---------|
| **Hosting** | Self-hosted VPS | ✅ Active | 72.60.28.175:3005 |
| **Process Manager** | PM2 | ✅ Active | Process monitoring, restart |
| **Reverse Proxy** | Nginx | ✅ Active | SSL termination, routing |
| **SSL** | Let's Encrypt | ✅ Active | Auto-renewal via certbot |
| **DNS** | Cloudflare | ✅ Active | DNS management |

**Server Specifications:**
- OS: Ubuntu 22.04 LTS
- RAM: 16GB+
- Storage: 500GB+ SSD
- Port: 3005 (dedicated)

### 5.2 CI/CD

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **GitHub Actions** | N/A | ✅ Active | Automated deployments |
| **Git** | 2.40+ | ✅ Active | Version control |

**Deployment Flow:**
```
Push to main → GitHub Actions → Build → Test → Deploy to VPS → PM2 restart
```

### 5.3 Monitoring & Logging

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **PM2 Logs** | Built-in | ✅ Active | Application logs |
| **Winston** | TBD | 📋 Planned | Structured logging |
| **Sentry** | TBD | 📋 Planned | Error tracking |

---

## 6. Third-Party Services

### 6.1 Authentication

**Clerk.com**
- **Plan:** Pro ($25/mo for 1000 MAU)
- **Features:** Email/password, magic link, OAuth
- **Status:** 🔄 Implementing

### 6.2 Email

**Resend**
- **Plan:** Free tier (3000 emails/mo), then $20/mo
- **Features:** React Email templates, webhooks, analytics
- **Status:** ✅ Package installed, activating
- **Package:** `resend@6.0.3`

**React Email**
- **Package:** `@react-email/components@0.5.3`
- **Purpose:** Type-safe email templates
- **Status:** ✅ Active

### 6.3 Payments

**Square**
- **Package:** `square@43.0.2`
- **Features:**
  - Payment processing
  - Subscription management
  - Webhook events
- **Status:** ✅ Active

### 6.4 AI & Content Generation

**Google Gemini API**
- **Plan:** Pay-as-you-go
- **Pricing:** ~$0.01 per 1000 tokens
- **Purpose:** Landing page content generation
- **Status:** 📋 To implement

**Alternative: Claude API (Anthropic)**
- **Plan:** Pay-as-you-go
- **Purpose:** Backup LLM provider
- **Status:** 📋 Optional

### 6.5 Real-time Communication

**Socket.io**
- **Package:** `socket.io@4.8.1`
- **Purpose:** Live notifications, real-time updates
- **Status:** ✅ Active

**Web Push**
- **Package:** `web-push@3.6.7`
- **Purpose:** PWA push notifications
- **Status:** ✅ Active

---

## 7. Development Tools

### 7.1 Code Quality

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 9+ | Code linting |
| **Prettier** | Latest | Code formatting |
| **TypeScript Compiler** | 5+ | Type checking |

**ESLint Configuration:**
```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### 7.2 Testing

| Tool | Version | Purpose |
|------|---------|---------|
| **Jest** | 30.1.3+ | Unit testing |
| **@testing-library/react** | 16.3.0+ | Component testing |
| **@testing-library/jest-dom** | 6.8.0+ | DOM assertions |
| **Playwright** | 1.55.0+ | E2E testing |

**Testing Strategy:**
- Unit tests: Business logic, utilities
- Integration tests: API routes
- Component tests: UI components
- E2E tests: Critical user flows

### 7.3 Development Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| **date-fns** | 4.1.0+ | Date manipulation |
| **clsx** | 2.1.1+ | Conditional classes |
| **class-variance-authority** | 0.7.1+ | Component variants |
| **tailwind-merge** | 3.3.1+ | Merge Tailwind classes |

---

## 8. Package Versions

### 8.1 Core Dependencies

```json
{
  "dependencies": {
    "next": "15.5.3",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "typescript": "^5",

    "@prisma/client": "^6.16.1",
    "prisma": "^6.16.1",

    "resend": "^6.0.3",
    "@react-email/components": "^0.5.3",

    "@aws-sdk/client-s3": "^3.888.0",
    "@aws-sdk/s3-request-presigner": "^3.888.0",

    "square": "^43.0.2",

    "@tanstack/react-query": "^5.87.4",
    "react-hook-form": "^7.62.0",
    "zod": "^4.1.8",

    "tailwindcss": "^4.1.13",
    "@radix-ui/react-*": "latest",
    "lucide-react": "^0.544.0",

    "ioredis": "^5.7.0",
    "bull": "^4.16.5",
    "socket.io": "^4.8.1",
    "web-push": "^3.6.7"
  }
}
```

### 8.2 Packages to Add

```bash
# Clerk authentication
npm install @clerk/nextjs

# MinIO client (already have AWS SDK)
# No additional package needed - AWS SDK works with MinIO

# AI content generation
npm install @google/generative-ai
# OR
npm install @anthropic-ai/sdk
```

### 8.3 Packages to Remove (Post-Migration)

```bash
# After Clerk migration is complete
npm uninstall lucia @lucia-auth/adapter-prisma arctic

# After Resend activation is complete
npm uninstall @sendgrid/mail
```

---

## 9. Migration Status

### 9.1 Authentication Migration

| Item | From | To | Status |
|------|------|----|----- ---|
| Auth provider | Lucia | Clerk | 📋 Planned (Week 3-4) |
| Session management | Custom | Clerk sessions | 📋 Planned |
| User database | Custom schema | Clerk + User model | 📋 Planned |

### 9.2 Email Migration

| Item | From | To | Status |
|------|------|----|----- ---|
| Email provider | SendGrid | Resend | 🔄 Ready (package installed) |
| Email templates | SendGrid templates | React Email | ✅ Package installed |
| Email service | email.service.ts | Update to Resend | 📋 To update |

### 9.3 Storage Migration

| Item | From | To | Status |
|------|------|----|----- ---|
| Object storage | Cloudflare R2 | MinIO | 📋 To setup |
| S3 client | AWS SDK | AWS SDK (MinIO endpoint) | ✅ Compatible |
| Bucket structure | R2 buckets | MinIO buckets | 📋 To create |

---

## 10. Technology Rationale

### Why These Choices?

#### Next.js 15 over Vite/React PWA
- ✅ Built-in API routes (no separate backend needed)
- ✅ Server Components reduce bundle size
- ✅ Better SEO with automatic sitemap generation
- ✅ Incremental Static Regeneration for landing pages
- ✅ More mature deployment patterns

#### Clerk over Lucia/Supabase Auth
- ✅ Managed service (less maintenance)
- ✅ Built-in user management UI
- ✅ Better suited for SaaS/multi-tenancy
- ✅ Excellent developer experience
- ✅ Comprehensive webhook system

#### Resend over SendGrid
- ✅ Modern API design
- ✅ React Email integration
- ✅ Better deliverability
- ✅ More cost-effective
- ✅ Excellent developer experience

#### MinIO over Cloudflare R2
- ✅ Self-hosted (data sovereignty)
- ✅ No egress fees
- ✅ S3-compatible API (easy migration)
- ✅ Better for tax document storage (compliance)
- ✅ Cost-effective for high usage

#### PostgreSQL + Prisma over Supabase
- ✅ More control over database
- ✅ Better performance (no REST overhead)
- ✅ Easier to optimize
- ✅ No vendor lock-in
- ✅ Prisma's type safety and migrations

---

## 11. Cost Analysis

### Monthly Recurring Costs

| Service | Plan | Cost | Status |
|---------|------|------|--------|
| VPS Hosting | 16GB RAM, 8 CPU | $50-100 | ✅ Active |
| Clerk | Pro (1000 MAU) | $25 | 📋 To add |
| Resend | 50k emails/mo | $20 | ✅ Ready |
| Square | Pay-per-transaction | 2.9% + 30¢ | ✅ Active |
| MinIO | Self-hosted | $0 | 📋 To setup |
| Redis | Self-hosted | $0 | ✅ Active |
| PostgreSQL | Self-hosted | $0 | ✅ Active |
| SSL Certificate | Let's Encrypt | $0 | ✅ Active |
| **Total** | | **~$95-145/mo** | |

**AI Content Generation (One-time + Maintenance):**
- Initial 200 pages: $4-8
- Monthly updates: $2-4/mo

**Total Estimated Monthly Cost: $100-150**

### Cost Comparison

| Stack | Monthly Cost | Notes |
|-------|--------------|-------|
| **Current (Lucia + SendGrid + R2)** | ~$100 | Self-hosted auth |
| **New (Clerk + Resend + MinIO)** | ~$100-150 | Managed auth + better email |
| **Alternative (Supabase + Vercel)** | ~$200-300 | Fully managed |

**Verdict:** New stack is cost-competitive with better developer experience and scalability.

---

## 12. Performance Targets

### Application Performance

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Time to First Byte | < 200ms | TBD | 📊 To measure |
| First Contentful Paint | < 1.5s | TBD | 📊 To measure |
| Largest Contentful Paint | < 2.5s | TBD | 📊 To measure |
| Cumulative Layout Shift | < 0.1 | TBD | 📊 To measure |
| Time to Interactive | < 3.5s | TBD | 📊 To measure |

### Database Performance

| Metric | Target | Notes |
|--------|--------|-------|
| Query time (avg) | < 50ms | For common queries |
| Connection pool | 10-20 | Based on load |
| Cache hit rate | > 80% | Redis caching |

---

## 13. Browser Support

### Supported Browsers

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | Last 2 versions | ✅ Primary target |
| Firefox | Last 2 versions | ✅ Full support |
| Safari | Last 2 versions | ✅ Full support |
| Edge | Last 2 versions | ✅ Full support |
| Mobile Safari | iOS 14+ | ✅ PWA support |
| Chrome Android | Last 2 versions | ✅ PWA support |

### Progressive Enhancement

- ✅ Core functionality works without JavaScript
- ✅ Enhanced experience with JavaScript enabled
- ✅ PWA features for modern browsers
- ✅ Graceful degradation for older browsers

---

## 14. Security Technologies

### Application Security

| Technology | Purpose | Status |
|------------|---------|--------|
| **Clerk** | Authentication | 📋 To implement |
| **JWT** | Session tokens | ✅ Via Clerk |
| **node:crypto** | PII encryption | ✅ Active |
| **Helmet.js** | HTTP headers | 📋 To add |
| **CSRF tokens** | Next.js built-in | ✅ Active |

### Infrastructure Security

| Component | Technology | Status |
|-----------|-----------|--------|
| **SSL/TLS** | Let's Encrypt | ✅ Active |
| **Firewall** | UFW | ✅ Active |
| **Rate limiting** | Nginx + Next.js | ✅ Active |
| **SQL injection** | Prisma (parameterized) | ✅ Active |
| **XSS** | React (auto-escaping) | ✅ Active |

---

## 15. Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev

# Open browser
# http://localhost:3005
```

### Production Deployment

```bash
# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# View logs
pm2 logs taxgeniuspro
```

---

## 16. Future Considerations

### Potential Additions

| Technology | Purpose | Timeline |
|------------|---------|----------|
| **Sentry** | Error tracking | Q1 2026 |
| **Segment** | Analytics pipeline | Q1 2026 |
| **DataDog** | APM monitoring | Q2 2026 |
| **Stripe** | Payment alternative | Q2 2026 |
| **Twilio** | SMS notifications | Q2 2026 |

### Scalability Plan

**When to scale:**
- Database: Add read replicas at 1000+ concurrent users
- Redis: Add Redis Cluster at 10k+ active sessions
- Application: Add more VPS instances with load balancer
- Storage: Add CDN for static assets at 10k+ users

---

## 17. Related Documentation

- [Architecture v3 FINAL](./architecture-v3-FINAL.md) - Complete system architecture
- [Migration Guide](./migration-guide.md) - Step-by-step migration instructions
- [MVP Requirements](./prd/mvp-requirements.md) - Product specifications

---

## 18. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12 | Initial stack (Lucia, SendGrid, R2) |
| 2.0 | 2025-01 | Updated to Next.js 15 |
| 3.0 | 2025-10 | Migration to Clerk, Resend, MinIO |

---

**Document Status:** ✅ Active
**Last Updated:** October 9, 2025
**Next Review:** November 9, 2025
**Maintained By:** Development Team
