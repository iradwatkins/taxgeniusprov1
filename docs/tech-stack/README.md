# Technology Stack

**Version:** 3.0
**Last Updated:** October 9, 2025
**Status:** ✅ Active

## Overview

This directory contains the complete technology stack documentation for Tax Genius Platform, broken down into focused, maintainable documents.

## Tech Stack Philosophy

- **Modern & Stable:** Use latest stable versions of proven technologies
- **Type-Safe:** TypeScript throughout for reliability
- **Self-Hosted First:** Minimize external dependencies where practical
- **Developer Experience:** Prioritize DX without sacrificing performance
- **Cost-Effective:** Balance managed services with self-hosting

## Documents

### Core Technologies
1. **[core.md](./core.md)** - Framework, runtime, and foundational technologies
   - Next.js 15, React 19, Node.js, TypeScript

### Application Stack
2. **[frontend.md](./frontend.md)** - Frontend technologies and UI components
   - Tailwind, shadcn/ui, React Query, React Hook Form

3. **[backend.md](./backend.md)** - Backend services and APIs
   - PostgreSQL, Prisma, Redis, Bull queues

4. **[authentication.md](./authentication.md)** - Auth & security
   - Clerk migration, Lucia deprecation, encryption

5. **[storage.md](./storage.md)** - File storage and object management
   - MinIO setup, S3 compatibility, bucket structure

### Infrastructure
6. **[infrastructure.md](./infrastructure.md)** - Hosting, deployment, and DevOps
   - VPS, PM2, Nginx, SSL, CI/CD

7. **[services.md](./services.md)** - Third-party services and integrations
   - Resend, Square, Socket.io, AI services

### Development
8. **[development.md](./development.md)** - Development tools and workflow
   - Testing, linting, local development, deployment

9. **[packages.md](./packages.md)** - Package versions and dependencies
   - Complete package.json reference, versions, migration plan

### Planning & Analysis
10. **[performance.md](./performance.md)** - Performance targets and optimization
    - Metrics, targets, monitoring strategy

11. **[costs.md](./costs.md)** - Cost analysis and projections
    - Monthly costs, comparisons, ROI analysis

## Quick Reference

### Current Tech Stack (v3)

| Layer | Technologies |
|-------|-------------|
| **Framework** | Next.js 15 + React 19 + TypeScript 5 |
| **Styling** | Tailwind 4 + shadcn/ui + Radix UI |
| **Database** | PostgreSQL 15 + Prisma 6 + Redis 7 |
| **Auth** | Clerk (migrating from Lucia) |
| **Email** | Resend + React Email (migrating from SendGrid) |
| **Storage** | MinIO (migrating from R2) |
| **Payments** | Square |
| **Hosting** | Self-hosted VPS + PM2 + Nginx |

### Migration Status

| Migration | Status | Timeline |
|-----------|--------|----------|
| SendGrid → Resend | ✅ Complete | Week 1 |
| Lucia → Clerk | 📋 Planned | Week 3-4 |
| R2 → MinIO | 📋 Planned | Week 2-3 |

## Cost Summary

**Total Monthly Cost:** ~$100-150

| Service | Cost |
|---------|------|
| VPS Hosting | $50-100 |
| Clerk Auth | $25 |
| Resend Email | $20 |
| Self-hosted (MinIO, Redis, PostgreSQL) | $0 |

## Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
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

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Last 2 versions |
| Firefox | ✅ Last 2 versions |
| Safari | ✅ Last 2 versions |
| Edge | ✅ Last 2 versions |
| Mobile | ✅ iOS 14+, Android (last 2 Chrome) |

## Related Documentation

- [Architecture](../architecture/) - System architecture and design
- [Migrations](../migrations/) - Migration guides and procedures
- [PRD](../prd/) - Product requirements and specifications

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-12 | Initial stack (Lucia, SendGrid, R2) |
| 2.0 | 2025-01 | Updated to Next.js 15 |
| 3.0 | 2025-10 | Migration to Clerk, Resend, MinIO |

---

**Document Status:** ✅ Active
**Maintained By:** Development Team
**Next Review:** November 9, 2025
