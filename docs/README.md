# Tax Genius Platform - Documentation

**Last Updated:** October 9, 2025
**Version:** 3.0
**Platform:** taxgeniuspro.tax (Port 3005)

---

## 📚 Documentation Index

Welcome to the Tax Genius Platform documentation. This README serves as your navigation guide to all project documentation.

---

## 🎯 Start Here

### New to the Project?
1. [Architecture](./architecture/) - Complete system architecture (sharded into focused docs)
2. [Tech Stack](./tech-stack/) - All technologies and versions (sharded into focused docs)
3. [MVP Requirements](./prd/mvp/) - Product specification (sharded into focused docs)

### Ready to Develop?
1. [Migration Guide](./migrations/) - Step-by-step migration instructions (sharded into focused docs)
2. [Epic Files](./prd/) - Feature requirements and user stories

---

## 📖 Core Documentation

### System Architecture

| Directory | Purpose | Contents |
|-----------|---------|----------|
| [architecture/](./architecture/) | System architecture, data models, API design | 11 focused docs (architecture.md, data-model.md, api-design.md, etc.) |
| [tech-stack/](./tech-stack/) | Technology decisions, package versions, rationale | 12 focused docs (core.md, frontend.md, backend.md, etc.) |
| [migrations/](./migrations/) | Migration guides from legacy stack | 6 focused docs (resend-email, minio-storage, clerk-auth, etc.) |

### Product Requirements

| Document | Epic | Focus Area |
|----------|------|------------|
| [prd/mvp/](./prd/mvp/) | Overview | Complete MVP specification (sharded into focused docs) |
| [prd/epic-1-core-foundation.md](./prd/epic-1-core-foundation.md) | Epic 1 | Auth, user management, dashboards |
| [prd/epic-2-referrer-engine.md](./prd/epic-2-referrer-engine.md) | Epic 2 | Referrer system, gamification, marketing tools |
| [prd/epic-3-client-preparer-workflow.md](./prd/epic-3-client-preparer-workflow.md) | Epic 3 | Client intake, document management, preparer portal |
| [prd/epic-4-marketing-growth.md](./prd/epic-4-marketing-growth.md) | Epic 4 | AI SEO, landing pages, e-commerce |
| [prd/_ARCHITECTURE_NOTE.md](./prd/_ARCHITECTURE_NOTE.md) | Note | Important: Architecture changes explained |

---

## 🏗️ Architecture Quick Reference

### Current Tech Stack

```yaml
Framework: Next.js 15 (App Router)
Runtime: Node.js 20 LTS
Language: TypeScript 5+
Database: PostgreSQL 15+ (Prisma ORM)
Cache: Redis 7+
Storage: MinIO (S3-compatible)
Auth: Clerk.com (migrating from Lucia)
Email: Resend (already installed)
Payments: Square
Real-time: Socket.io + Web Push
Hosting: Self-hosted VPS (72.60.28.175:3005)
```

### Project Structure

```
/root/websites/taxgeniuspro/
├── docs/                      # 📖 YOU ARE HERE
│   ├── README.md             # This file
│   ├── architecture/         # System architecture (11 focused docs)
│   ├── tech-stack/           # Tech stack docs (12 focused docs)
│   ├── migrations/           # Migration guides (6 focused docs)
│   ├── prd/                  # Product requirements
│   │   ├── mvp/             # MVP requirements (sharded)
│   │   ├── epic-1-core-foundation.md
│   │   ├── epic-2-referrer-engine.md
│   │   ├── epic-3-client-preparer-workflow.md
│   │   └── epic-4-marketing-growth.md
│   └── archive/              # Old documentation
│
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/           # React components
│   ├── lib/                  # Business logic
│   └── types/                # TypeScript types
│
├── prisma/                   # Database schema
├── emails/                   # React Email templates
└── tests/                    # Test files
```

---

## 🚀 Quick Start Guide

### 1. Environment Setup

```bash
# Clone repository
git clone <repo-url>
cd taxgeniuspro

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

### 2. Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."
REDIS_URL="redis://localhost:6379"

# Auth (Clerk) - Get from clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_xxxxx"
CLERK_SECRET_KEY="sk_live_xxxxx"
CLERK_WEBHOOK_SECRET="whsec_xxxxx"

# Email (Resend) - Get from resend.com
RESEND_API_KEY="re_xxxxx"

# Storage (MinIO) - Self-hosted
MINIO_ENDPOINT="https://storage.taxgeniuspro.tax"
MINIO_ACCESS_KEY="admin"
MINIO_SECRET_KEY="xxxxx"

# Payments (Square)
SQUARE_ACCESS_TOKEN="sq0atp-xxxxx"
SQUARE_LOCATION_ID="xxxxx"

# AI (Gemini)
GEMINI_API_KEY="xxxxx"
```

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed database (optional)
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
# Opens on http://localhost:3005
```

### 5. Build for Production

```bash
npm run build
npm run start

# Or with PM2
pm2 start ecosystem.config.js
```

---

## 📋 Development Workflow

### Git Workflow

```
main (production)
  └── develop (staging)
      ├── feature/user-auth
      ├── feature/referrer-dashboard
      └── feature/ai-landing-pages
```

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates

### Commit Messages

```
feat: Add Clerk authentication
fix: Resolve MinIO upload issue
refactor: Simplify email service
docs: Update architecture guide
test: Add referrer dashboard tests
```

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm test

# Watch mode
npm test -- --watch

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/                 # Unit tests
│   ├── lib/
│   └── utils/
├── integration/          # API integration tests
│   └── api/
└── e2e/                  # End-to-end tests
    └── flows/
```

---

## 📊 Project Status

### Migration Status

| Migration | Status | Completion |
|-----------|--------|------------|
| **SendGrid → Resend** | 🔄 Ready | 95% (package installed) |
| **R2 → MinIO** | 📋 Planned | 0% (to setup) |
| **Lucia → Clerk** | 📋 Planned | 0% (Week 3-4) |

### Feature Development Status

| Epic | Status | Progress |
|------|--------|----------|
| **Epic 1: Core Foundation** | 🟡 In Progress | 60% |
| **Epic 2: Referrer Engine** | 🟡 In Progress | 40% |
| **Epic 3: Client/Preparer Workflow** | 🟡 In Progress | 50% |
| **Epic 4: Marketing & Growth** | 🔴 Not Started | 10% |

---

## 🔗 External Resources

### Services & Dashboards

- **Clerk Dashboard:** https://dashboard.clerk.com
- **Resend Dashboard:** https://resend.com/emails
- **MinIO Console:** https://minio-console.taxgeniuspro.tax (after setup)
- **Square Dashboard:** https://squareup.com/dashboard
- **Production Site:** https://taxgeniuspro.tax

### Documentation References

- **Next.js Docs:** https://nextjs.org/docs
- **Clerk Docs:** https://clerk.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Resend Docs:** https://resend.com/docs
- **MinIO Docs:** https://min.io/docs

---

## 🤝 Contributing

### Before You Start

1. Read [Architecture Overview](./architecture/README.md)
2. Review [Tech Stack Overview](./tech-stack/README.md)
3. Check relevant Epic file in [prd/](./prd/)

### Development Guidelines

- **TypeScript:** Use strict mode, no `any` types
- **Components:** Use Server Components by default
- **Styling:** Use Tailwind CSS + shadcn/ui
- **State:** React Query for server state
- **Forms:** React Hook Form + Zod validation
- **Testing:** Write tests for all business logic
- **Git:** Create feature branch, open PR for review

---

## 📞 Support & Contact

### Getting Help

1. **Check Documentation:** Start here first
2. **Check Logs:** `pm2 logs taxgeniuspro`
3. **Check Service Dashboards:** Clerk, Resend, etc.
4. **GitHub Issues:** Report bugs or request features

### Key Files for Troubleshooting

```bash
# Application logs
pm2 logs taxgeniuspro

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# PostgreSQL logs
sudo journalctl -u postgresql

# MinIO logs (after setup)
docker logs minio
```

---

## 📅 Timeline & Milestones

### Current Sprint (Week 1-2)

- ✅ Documentation consolidation
- 🔄 Activate Resend email service
- 📋 Setup MinIO on VPS

### Upcoming Sprints

**Week 3-4:** Implement Clerk authentication
**Week 5-6:** AI SEO landing page system
**Week 7-8:** SaaS subscription features
**Week 9:** Testing & QA
**Week 10:** Launch updated platform

---

## 📝 Document Maintenance

### Updating Documentation

1. Make changes to relevant `.md` files
2. Update "Last Updated" date at top of file
3. Update this README if adding new documents
4. Commit with descriptive message

### Documentation Standards

- Use Markdown format (`.md`)
- Include table of contents for long documents
- Use relative links for cross-references
- Keep code examples up-to-date
- Include version numbers for packages

---

## 🗂️ Archive

Old documentation has been moved to [archive/](./archive/):

- `architecture.md` - Original Supabase-based architecture
- `architecture-v2.md` - Version 2 architecture
- `prd-v2.md` - Version 2 PRD
- `architecture-v3-FINAL.md` - Monolithic architecture doc (now sharded into architecture/)
- `tech-stack-v3.md` - Monolithic tech stack doc (now sharded into tech-stack/)
- `migration-guide.md` - Monolithic migration doc (now sharded into migrations/)

**⚠️ Archive files are for reference only. Use the sharded docs in architecture/, tech-stack/, and migrations/ directories for current development.**

---

## 🎓 Learning Resources

### For New Developers

1. **Next.js 15 App Router:** https://nextjs.org/docs/app
2. **React Server Components:** https://react.dev/reference/react/use-server
3. **Prisma ORM:** https://www.prisma.io/docs/getting-started
4. **TypeScript Best Practices:** https://www.typescriptlang.org/docs/

### Architecture Patterns

- **Server Components:** Default for all pages
- **Client Components:** Only when needed (interactivity)
- **Server Actions:** For mutations
- **API Routes:** For webhooks and external APIs
- **Service Layer:** Business logic in `/lib/services/`

---

## ✅ Checklist for New Team Members

- [ ] Read [Architecture Overview](./architecture/README.md)
- [ ] Read [Tech Stack Overview](./tech-stack/README.md)
- [ ] Setup local development environment
- [ ] Run database migrations
- [ ] Start dev server successfully
- [ ] Review Epic files for your features
- [ ] Join Slack/Discord channel
- [ ] Get access to service dashboards

---

**Happy Coding! 🚀**

For questions or updates to this documentation, please open a pull request or contact the development team.

---

**Document Version:** 3.0
**Last Updated:** October 9, 2025
**Maintained By:** Development Team
