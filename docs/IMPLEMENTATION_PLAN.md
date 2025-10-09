# Tax Genius - Implementation Plan

**Date:** October 9, 2025
**Status:** In Progress
**Timeline:** 6 weeks

---

## 🎯 Implementation Phases

### ✅ Phase 0: Documentation Consolidation (COMPLETE)

**Duration:** Completed
**Status:** ✅ Done

**Deliverables:**
- [x] Architecture v3 FINAL documentation
- [x] Tech Stack v3 documentation
- [x] Migration Guide
- [x] Epic files organized in docs/prd/
- [x] Archive old documentation
- [x] Create navigation README

---

### 🔄 Phase 1: Email Migration (IN PROGRESS)

**Duration:** 1-2 days
**Status:** 🔄 In Progress
**Priority:** HIGH

**Tasks:**
- [ ] Get Resend API key from resend.com
- [x] Create React Email templates (MagicLinkEmail created)
- [ ] Create WelcomeEmail template
- [ ] Create CommissionEmail template
- [ ] Create StatusUpdateEmail template
- [ ] Update email.service.ts to use Resend
- [ ] Add Resend configuration to .env.local
- [ ] Test email sending in development
- [ ] Deploy to production
- [ ] Monitor for 48 hours
- [ ] Remove SendGrid dependency

**Files to Modify:**
```
- src/lib/services/email.service.ts (refactor)
- .env.local (add RESEND_API_KEY)
- emails/ (new directory with React Email templates)
```

---

### 📋 Phase 2: MinIO Storage Setup

**Duration:** 2-3 days
**Status:** 📋 Planned
**Priority:** HIGH

**Tasks:**
- [ ] Deploy MinIO Docker container on VPS
- [ ] Configure Nginx reverse proxy for MinIO
- [ ] Setup SSL for storage.taxgeniuspro.tax
- [ ] Create MinIO buckets (tax-documents, profile-images, marketing-assets)
- [ ] Update storage.ts to use MinIO endpoint
- [ ] Test file upload/download
- [ ] Migrate existing files from R2 to MinIO (if any)
- [ ] Update .env.local with MinIO credentials
- [ ] Deploy to production
- [ ] Monitor storage usage

**Commands:**
```bash
# Deploy MinIO
docker run -d --name minio -p 9000:9000 -p 9001:9001 \
  -v /mnt/minio/data:/data \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=<SECURE_PASSWORD>" \
  --restart always \
  minio/minio server /data --console-address ":9001"

# Create buckets
mc alias set local http://localhost:9000 admin <PASSWORD>
mc mb local/tax-documents
mc mb local/profile-images
mc mb local/marketing-assets
```

---

### 🔐 Phase 3: Clerk Authentication

**Duration:** 5-7 days
**Status:** 📋 Planned
**Priority:** CRITICAL

**Week 1: Implementation**
- [ ] Install @clerk/nextjs package
- [ ] Create Clerk application at clerk.com
- [ ] Configure Clerk settings (auth methods, user fields)
- [ ] Add Clerk middleware to Next.js
- [ ] Update root layout with ClerkProvider
- [ ] Create new auth pages (login, signup)
- [ ] Setup Clerk webhook endpoint
- [ ] Test authentication flows

**Week 2: Migration**
- [ ] Create user migration script
- [ ] Test migration with sample users
- [ ] Run production migration
- [ ] Support parallel auth (Lucia + Clerk)
- [ ] Monitor for issues
- [ ] Deprecate Lucia completely

**Files to Create/Modify:**
```
- src/middleware.ts (new)
- src/app/layout.tsx (update)
- src/app/auth/login/page.tsx (replace)
- src/app/auth/signup/page.tsx (replace)
- src/app/api/webhooks/clerk/route.ts (new)
- .env.local (add Clerk keys)
- prisma/schema.prisma (add clerkUserId field)
```

---

### 🤖 Phase 4: AI SEO Landing Pages

**Duration:** 5-7 days
**Status:** 📋 Planned
**Priority:** MEDIUM

**Week 1: Content Generation Tool**
- [ ] Create admin UI for content generation
- [ ] Integrate Gemini API
- [ ] Create AI prompts for landing pages
- [ ] Add Q&A accordion generation
- [ ] Test content quality
- [ ] Create content approval workflow

**Week 2: Dynamic Landing Pages**
- [ ] Create landing page template
- [ ] Implement dynamic routing (/locations/[city])
- [ ] Add JSON-LD structured data
- [ ] Implement dynamic metadata
- [ ] Generate initial 50 pages
- [ ] Test SEO with Google Search Console

**New Routes:**
```
- /admin/content-generator (admin tool)
- /locations/[city] (dynamic landing pages)
- /services/[service] (service pages)
- /tax-preparers/[location] (preparer recruitment)
```

---

### 💰 Phase 5: SaaS Features

**Duration:** 5-7 days
**Status:** 📋 Planned
**Priority:** HIGH

**Database Changes:**
- [ ] Add Organization model to Prisma
- [ ] Add Subscription model
- [ ] Create migration
- [ ] Add multi-tenancy support

**Square Integration:**
- [ ] Setup Square Subscriptions
- [ ] Create subscription plans (Starter, Professional)
- [ ] Implement subscription webhooks
- [ ] Build billing dashboard
- [ ] Add plan upgrade/downgrade flows

**Feature Gating:**
- [ ] Implement feature middleware
- [ ] Add usage tracking
- [ ] Create billing alerts
- [ ] Test trial expiration

---

### 📚 Phase 6: Documentation Sharding

**Duration:** 1-2 days
**Status:** 📋 Planned
**Priority:** MEDIUM

**Tasks:**
- [ ] Shard architecture-v3-FINAL.md into sections
- [ ] Shard tech-stack-v3.md into categories
- [ ] Shard migration-guide.md by migration type
- [ ] Create docs/architecture/ directory
- [ ] Create docs/tech-stack/ directory
- [ ] Create docs/migration/ directory
- [ ] Update all cross-references
- [ ] Update README with new structure
- [ ] Verify all links work

**Target Structure:**
```
docs/
├── README.md
├── architecture/
│   ├── README.md (overview)
│   ├── 01-system-overview.md
│   ├── 02-tech-stack.md
│   ├── 03-database-schema.md
│   ├── 04-api-design.md
│   ├── 05-security.md
│   ├── 06-storage.md
│   ├── 07-email.md
│   └── 08-deployment.md
├── tech-stack/
│   ├── README.md
│   ├── frontend.md
│   ├── backend.md
│   ├── database.md
│   ├── infrastructure.md
│   └── third-party.md
├── migration/
│   ├── README.md
│   ├── 01-email-resend.md
│   ├── 02-storage-minio.md
│   └── 03-auth-clerk.md
└── prd/ (existing)
```

---

## 📊 Progress Tracking

### Overall Progress

| Phase | Status | Progress | Start Date | End Date |
|-------|--------|----------|------------|----------|
| 0. Documentation | ✅ Complete | 100% | Oct 9 | Oct 9 |
| 1. Email Migration | 🔄 In Progress | 30% | Oct 9 | TBD |
| 2. MinIO Setup | 📋 Planned | 0% | TBD | TBD |
| 3. Clerk Auth | 📋 Planned | 0% | TBD | TBD |
| 4. AI SEO | 📋 Planned | 0% | TBD | TBD |
| 5. SaaS Features | 📋 Planned | 0% | TBD | TBD |
| 6. Doc Sharding | 📋 Planned | 0% | TBD | TBD |

### Critical Path

```
Email Migration → MinIO Setup → Clerk Auth → SaaS Features
                                     ↓
                              AI SEO (parallel)
                                     ↓
                              Doc Sharding (final)
```

---

## 🚨 Risks & Mitigation

### High Risk Items

1. **Clerk Migration**
   - Risk: User data loss or auth failures
   - Mitigation: Parallel auth support, comprehensive testing, rollback plan

2. **MinIO Data Migration**
   - Risk: File corruption or incomplete migration
   - Mitigation: Checksum verification, keep R2 as backup for 30 days

3. **Production Downtime**
   - Risk: Service interruption during deployments
   - Mitigation: Deploy during low-traffic hours, have rollback ready

### Medium Risk Items

1. **AI Content Quality**
   - Risk: Low-quality or inappropriate AI-generated content
   - Mitigation: Human approval workflow, content review process

2. **Email Deliverability**
   - Risk: Emails going to spam with Resend
   - Mitigation: Proper SPF/DKIM setup, warm up sending domain

---

## 📝 Daily Standup Template

**What was completed yesterday:**
-

**What will be done today:**
-

**Blockers:**
-

---

## 🎯 Definition of Done

### Phase 1 (Email):
- [ ] All email templates use Resend
- [ ] Zero SendGrid dependencies
- [ ] Email delivery rate >95%
- [ ] No production errors for 48 hours

### Phase 2 (MinIO):
- [ ] MinIO accessible via HTTPS
- [ ] All new uploads go to MinIO
- [ ] File upload/download working
- [ ] No storage errors for 48 hours

### Phase 3 (Clerk):
- [ ] All users can log in with Clerk
- [ ] Lucia code removed
- [ ] Zero auth errors for 1 week
- [ ] User migration 100% complete

### Phase 4 (AI SEO):
- [ ] 50+ landing pages generated
- [ ] Pages indexed by Google
- [ ] Admin tool functional
- [ ] Content quality approved

### Phase 5 (SaaS):
- [ ] Subscription plans active
- [ ] Billing working correctly
- [ ] Feature gating implemented
- [ ] First paying customer

### Phase 6 (Docs):
- [ ] All docs sharded properly
- [ ] All links working
- [ ] README updated
- [ ] Easy navigation confirmed

---

## 📞 Support & Escalation

**Technical Issues:**
- Check logs: `pm2 logs taxgeniuspro`
- Check service dashboards (Clerk, Resend, etc.)
- Review migration-guide.md for rollback procedures

**Blockers:**
- Document in this file
- Escalate to senior developer
- Update timeline if needed

---

**Last Updated:** October 9, 2025
**Next Review:** Daily during active development
**Maintained By:** Development Team
