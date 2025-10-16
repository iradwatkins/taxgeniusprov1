# Epic 7: Native CRM System

**Type:** Brownfield Epic (Major Enhancement of Existing System)
**Estimated Duration:** 6 weeks (25 dev days + 5 days testing/buffer)
**Priority:** HIGH
**Status:** Ready for Implementation
**Version:** 1.0
**Last Updated:** 2025-01-16

---

## Executive Summary

Build a comprehensive Customer Relationship Management (CRM) system integrated into TaxGeniusPro that enables admins and tax preparers to manage client relationships, track all interactions (phone, email, meetings, notes), visualize pipelines with drag-and-drop stage management, sync emails automatically from Resend, and track affiliate/referrer relationships—all while maintaining existing system functionality and extending (not replacing) current Client, Lead, and Preparer models.

**Key Features:**
- ✅ Centralized contact database (clients, leads, affiliates, preparers)
- ✅ Interaction tracking (phone calls, meetings, notes)
- ✅ Automatic email sync from Resend (real-time webhook integration)
- ✅ Gmail-style email threading in timeline view
- ✅ Drag-and-drop Kanban pipeline board
- ✅ Affiliate/referrer relationship tracking
- ✅ CRM reports and analytics
- ✅ CSV export functionality
- ✅ Role-based access (admin + tax_preparer only)

---

## Business Context

### Current State (What Exists)

✅ **Database Infrastructure:**
- `User`, `Client`, `Preparer`, `Affiliate`, `Lead` models
- `PipelineStage` enum (NEW, CONTACTED, DOCUMENTS, PREPARING, COMPLETE)
- Epic 6 Lead Tracking Dashboard (recently completed)
- Commission tracking for referrals

✅ **Services:**
- Clerk authentication system
- Resend email service (transactional emails)
- MinIO document storage
- Socket.io notifications

✅ **Dashboards:**
- Admin, Tax Preparer, Affiliate, Client dashboards
- Epic 6 analytics and lead tracking

### Gap Analysis (What's Missing)

❌ **Centralized Contact Management:** No unified view of all clients, leads, affiliates
❌ **Interaction History:** No system for logging phone calls, meetings, or notes
❌ **Email Sync:** Sent emails not tracked in system (no communication history)
❌ **Visual Pipeline Management:** No drag-and-drop stage updates
❌ **Relationship Tracking:** Limited visibility into affiliate-client-preparer relationships
❌ **CRM Reporting:** No analytics on interactions, response times, or preparer performance

### Target State (What We're Building)

This epic delivers:
- ✅ Complete CRM system with contact management
- ✅ Interaction tracking with automatic email sync
- ✅ Visual Kanban pipeline board
- ✅ Relationship tracking for affiliates/referrers
- ✅ CRM reports and analytics
- ✅ Role-based access for admins and tax preparers

---

## Epic Stories Breakdown

| Story | Title | Duration | Dependencies | Primary Focus |
|-------|-------|----------|--------------|---------------|
| **7.1** | CRM Database Schema & Contact Management | 5 days | None | Database migrations, CRM models, contact CRUD APIs, backfill script |
| **7.2** | Interaction Tracking & Resend Email Sync | 6 days | 7.1 | Interaction logging, email webhook integration, Bull queue, email threading |
| **7.3** | CRM Dashboard UI & Contact Detail View | 5 days | 7.1, 7.2 | Admin/preparer dashboard updates, contact list, contact detail with timeline |
| **7.4** | Pipeline Kanban Board & Drag-and-Drop | 4 days | 7.1, 7.3 | Kanban visualization, @dnd-kit integration, stage management |
| **7.5** | Relationship Tracking & CRM Reporting | 5 days | 7.1, 7.2, 7.3 | Affiliate/referrer relationships, CRM reports, CSV exports, final integration |

**Total Timeline:** 25 days (5 weeks development) + 5 days (testing/deployment) = **6 weeks**
**Deployment Strategy:** All stories completed → Full regression testing → Single production deployment

---

## Product Requirements

### Functional Requirements

**FR1: Contact Management**
- System SHALL maintain a centralized contact database for all clients, leads, affiliates, and tax preparers
- System SHALL support custom fields for tax-specific information (filing status, dependents, previous year AGI, etc.)
- System SHALL auto-sync contact data from existing Client, Lead, Preparer, and Affiliate models
- System SHALL track contact lifecycle stages: Prospect → Lead → Active Client → Completed Return → Inactive

**FR2: Interaction Tracking**
- System SHALL log all interactions (phone calls, emails, meetings, notes) with timestamp, user, and contact
- System SHALL automatically import sent emails from Resend email service into interaction history (real-time webhook)
- System SHALL support manual entry of phone calls, in-person meetings, and notes
- System SHALL support interaction categorization (follow-up, consultation, document review, complaint, general inquiry)
- System SHALL display complete interaction timeline per contact in chronological order

**FR3: Communication History**
- System SHALL maintain searchable communication logs for all contacts
- System SHALL sync outbound emails from Resend automatically via webhooks
- System SHALL link communications to specific clients/preparers/affiliates
- System SHALL support attaching documents/files to communications
- System SHALL display email thread view with full conversation history (Gmail-style)

**FR4: Relationship Tracking**
- System SHALL track client-to-preparer assignments with assignment date and history
- System SHALL track affiliate-to-client referral relationships (extending Epic 6 lead tracking)
- System SHALL track affiliate-to-preparer partnership relationships
- System SHALL display relationship hierarchy: Affiliate → Client → Preparer → Organization
- System SHALL keep affiliate and client contacts separate (no merge when affiliate becomes client)

**FR5: Pipeline & Stage Management**
- System SHALL extend existing PipelineStage enum (NEW, CONTACTED, DOCUMENTS, PREPARING, COMPLETE) with CRM metadata
- System SHALL track stage entry/exit timestamps for reporting
- System SHALL allow manual stage updates by admins and assigned preparers
- System SHALL support drag-and-drop stage updates via Kanban board
- System SHALL trigger automatic notifications on stage changes
- System SHALL display pipeline visualization (Kanban board + funnel chart)

**FR6: Search & Filtering**
- System SHALL provide global search across contacts, interactions, and notes
- System SHALL support advanced filters: date range, interaction type, contact stage, assigned preparer
- System SHALL support saved filter presets (My Clients, Overdue Follow-ups, New Leads This Week, etc.)
- System SHALL display search results with highlighting and context preview

**FR7: Reporting & Analytics**
- System SHALL generate reports: Interaction Summary, Pipeline Health, Preparer Performance
- System SHALL display CRM metrics on admin dashboard: Total Interactions (7/30/90 days), Stage Distribution
- System SHALL export reports to CSV (reusing Epic 6 export utilities)
- System SHALL calculate preparer KPIs: Avg Response Time, Pipeline Velocity

**FR8: Integration with Existing Systems**
- System SHALL integrate with Epic 6 Lead Tracking (extend LinkClick journey data with CRM interactions)
- System SHALL integrate with Document Management (link documents to CRM interactions)
- System SHALL integrate with Commission System (track affiliate-client relationships for payments)
- System SHALL integrate with Resend Email Service (real-time webhook for sent emails)

**FR9: Role-Based Access Control**
- System SHALL restrict CRM access to super_admin, admin, and tax_preparer roles ONLY
- System SHALL allow tax preparers to view/edit ONLY their assigned clients
- System SHALL allow admins to view/edit ALL contacts and interactions
- System SHALL prevent clients, affiliates, and leads from accessing CRM features
- System SHALL audit all CRM actions (who viewed/edited what contact, when)

### Non-Functional Requirements

**NFR1: Performance**
- CRM dashboard SHALL load in < 2 seconds (including interaction history for 100+ contacts)
- Contact search SHALL return results in < 500ms
- Email sync from Resend SHALL complete in < 5 seconds per email batch (max 50 emails/batch)
- System SHALL cache frequently accessed contact data for 5 minutes

**NFR2: Scalability**
- System SHALL support 10,000+ contacts without performance degradation
- System SHALL support 100,000+ interactions logged over 12 months
- System SHALL handle 500+ concurrent CRM dashboard users
- Database queries SHALL use composite indexes for CRM tables

**NFR3: Data Integrity**
- System SHALL prevent duplicate contact creation (email uniqueness constraint)
- System SHALL maintain referential integrity between contacts, interactions, and stage history
- System SHALL soft-delete CRM records (never hard delete contacts/interactions)
- System SHALL backup CRM data daily (aligned with existing PostgreSQL backup strategy)

**NFR4: Security**
- System SHALL encrypt PII in CRM notes/interactions using existing encryption layer
- System SHALL log all CRM access for audit trails
- System SHALL enforce row-level security (preparers see only their clients)
- System SHALL sanitize user input to prevent SQL injection/XSS in notes/search

**NFR5: Reliability**
- CRM features SHALL have 99.5% uptime (aligned with platform SLA)
- Email sync failures SHALL retry with exponential backoff (3 attempts max)
- System SHALL degrade gracefully if Resend integration fails (allow manual email logging)
- System SHALL queue email sync events (Bull queue) to prevent notification loss

**NFR6: Usability**
- CRM interface SHALL follow existing TaxGeniusPro design system (Tailwind + shadcn/ui)
- System SHALL be mobile-responsive (phone, tablet, desktop)
- CRM dashboard SHALL load with sensible defaults (My Clients, Recent Interactions)
- System SHALL provide in-app tooltips and help text for CRM features

**NFR7: Maintainability**
- CRM code SHALL follow existing Next.js App Router patterns (Server Components, Server Actions)
- System SHALL use existing service layer architecture (lib/services/crm.service.ts)
- System SHALL use Prisma ORM for all database operations
- System SHALL include comprehensive TypeScript types for CRM entities

**NFR8: Compatibility**
- System SHALL maintain backward compatibility with existing Client, Preparer, Lead models
- System SHALL NOT break Epic 6 Lead Tracking functionality
- System SHALL reuse existing UI components (shadcn/ui cards, tables, badges)
- System SHALL extend existing API patterns (Next.js API routes, requireOneOfRoles auth)

### Compatibility Requirements

**CR1: Database Schema Compatibility**
- CRM tables SHALL use foreign keys to existing User, Client, Preparer, Affiliate tables
- New CRM fields SHALL NOT modify existing table columns (additive only)
- Migration SHALL be reversible (all new columns nullable or with defaults)
- Existing queries for Client/Preparer models SHALL NOT require changes

**CR2: API Compatibility**
- CRM API routes SHALL follow existing pattern: `/api/crm/*`
- Existing API routes (`/api/referrers/*`, `/api/preparers/*`) SHALL remain unchanged
- CRM endpoints SHALL use existing auth middleware (`requireOneOfRoles`)
- API responses SHALL follow existing format: `{ success: boolean, data: T, error?: string }`

**CR3: UI/UX Consistency**
- CRM pages SHALL use existing Dashboard layout (DashboardHeader + DashboardSidebar)
- CRM components SHALL use shadcn/ui components (Card, Table, Badge, Button, Dialog)
- CRM color scheme SHALL follow existing role badge colors (blue for preparer, red for admin)
- CRM navigation SHALL integrate into existing sidebar menu structure

**CR4: Integration Compatibility**
- Email sync SHALL use Resend webhooks (real-time)
- CRM notifications SHALL use existing Socket.io server + Web Push infrastructure
- CRM exports SHALL reuse existing CSV utilities from Epic 6
- CRM search SHALL use PostgreSQL full-text search (no new search engine required)

---

## Technical Architecture

### Database Schema

**New Prisma Models (additive, non-breaking):**

```prisma
// CRM Contact (extends existing User/Client/Preparer/Affiliate)
model CRMContact {
  id                String    @id @default(cuid())
  userId            String    @unique  // FK to User table
  contactType       ContactType        // CLIENT | LEAD | AFFILIATE | PREPARER

  // Contact metadata
  firstName         String
  lastName          String
  email             String    @unique
  phone             String?
  company           String?

  // Tax-specific fields
  filingStatus      String?   // Single, Married, etc.
  dependents        Int?
  previousYearAGI   Float?
  taxYear           Int?

  // CRM lifecycle
  stage             PipelineStage @default(NEW)
  stageEnteredAt    DateTime  @default(now())
  source            String?   // utm_source, referral code, etc.

  // Assignment
  assignedPreparerId String?
  assignedAt        DateTime?

  // Timestamps
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  lastContactedAt   DateTime?

  // Relations
  user              User      @relation(fields: [userId], references: [id])
  assignedPreparer  Preparer? @relation(fields: [assignedPreparerId], references: [id])
  interactions      CRMInteraction[]
  stageHistory      CRMStageHistory[]

  @@index([email])
  @@index([assignedPreparerId])
  @@index([stage])
  @@index([contactType])
  @@index([lastContactedAt])
}

enum ContactType {
  CLIENT
  LEAD
  AFFILIATE
  PREPARER
}

// CRM Interaction (phone, email, meeting, note)
model CRMInteraction {
  id                String    @id @default(cuid())
  contactId         String
  userId            String    // Who logged this interaction

  // Interaction details
  type              InteractionType
  direction         Direction @default(OUTBOUND) // INBOUND | OUTBOUND
  subject           String?
  body              String?   @db.Text
  duration          Int?      // minutes (for calls/meetings)

  // Email-specific (for Resend sync)
  emailId           String?   @unique // Resend email ID
  emailThreadId     String?   // For Gmail-style threading
  emailTo           String[]
  emailCc           String[]
  emailBcc          String[]

  // Metadata
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  occurredAt        DateTime  @default(now()) // When interaction happened

  // Attachments
  attachments       Json?     // Array of MinIO file keys

  // Relations
  contact           CRMContact @relation(fields: [contactId], references: [id])
  user              User      @relation(fields: [userId], references: [id])

  @@index([contactId, occurredAt(sort: Desc)])
  @@index([emailThreadId])
  @@index([type])
  @@index([userId])
}

enum InteractionType {
  EMAIL
  PHONE_CALL
  MEETING
  NOTE
  OTHER
}

enum Direction {
  INBOUND
  OUTBOUND
}

// Stage history tracking (for reporting)
model CRMStageHistory {
  id                String    @id @default(cuid())
  contactId         String
  fromStage         PipelineStage?
  toStage           PipelineStage
  changedBy         String    // userId
  reason            String?   @db.Text
  createdAt         DateTime  @default(now())

  contact           CRMContact @relation(fields: [contactId], references: [id])

  @@index([contactId, createdAt(sort: Desc)])
}
```

### API Endpoints

**New Endpoints:**
```
# Contact CRUD
GET    /api/crm/contacts              # List contacts (paginated, filtered)
POST   /api/crm/contacts              # Create contact
GET    /api/crm/contacts/[id]         # Get contact details
PATCH  /api/crm/contacts/[id]         # Update contact
DELETE /api/crm/contacts/[id]         # Soft delete contact

# Interactions
GET    /api/crm/contacts/[id]/interactions  # Get interaction timeline
POST   /api/crm/contacts/[id]/interactions  # Log interaction
PATCH  /api/crm/interactions/[id]           # Update interaction
DELETE /api/crm/interactions/[id]           # Delete interaction

# Pipeline management
GET    /api/crm/pipeline                    # Get pipeline view data
PATCH  /api/crm/contacts/[id]/stage         # Update stage (for drag-drop)
GET    /api/crm/contacts/[id]/stage-history # Get stage history

# Email sync (Resend webhook)
POST   /api/webhooks/resend/email-sent      # Webhook: email.sent event

# Search & reporting
GET    /api/crm/search                      # Full-text search contacts
GET    /api/crm/reports/interactions        # Interaction summary report
GET    /api/crm/reports/pipeline-health     # Pipeline metrics
GET    /api/crm/reports/preparer-performance # Preparer KPIs

# Export
POST   /api/crm/export/contacts-csv         # Export contacts to CSV
POST   /api/crm/export/interactions-csv     # Export interactions to CSV
```

### Integration Points

**Resend Email Sync Flow:**
```
1. Email sent via Resend → email.sent webhook fires
2. Webhook endpoint validates signature, adds to Bull queue
3. Queue processes at 1.8 req/sec (90% of Resend 2 req/sec limit)
4. Create CRMInteraction record with type=EMAIL
5. Update CRMContact.lastContactedAt
6. Real-time update via Socket.io (if user viewing contact)
```

**Epic 6 Lead Tracking Integration:**
```
1. Lead clicks marketing link (Epic 6 tracking)
2. Lead converts → Client created
3. CRM backfill script creates CRMContact
4. CRMContact.referredBy linked to affiliate
5. Commission created when return filed
6. Commission visible in CRM contact detail view
```

---

## Success Metrics

### Technical Metrics

- ✅ **CRM Dashboard Load Time:** < 2 seconds for all dashboards
- ✅ **Query Performance:** Contact list queries execute in < 500ms
- ✅ **Email Sync Accuracy:** 95%+ of sent emails appear in CRM within 10 seconds
- ✅ **Export Speed:** CSV exports complete in < 10 seconds for 5000 records
- ✅ **Mobile Responsiveness:** All CRM pages work on mobile, tablet, desktop

### Business Metrics

- 📈 **CRM Adoption:** 80%+ of tax preparers use CRM weekly
- 📈 **Interaction Logging:** 90%+ of client communications logged in CRM
- 📈 **Pipeline Velocity:** 20% reduction in avg time from NEW → COMPLETE
- 📈 **Response Time:** 30% improvement in avg time from lead assigned → first contact

### User Experience Metrics

- 😊 **Dashboard Satisfaction:** 4.5+ / 5 stars (user survey)
- 😊 **Ease of Use:** Users can log interaction without training
- 😊 **Email Sync Reliability:** < 5% email sync failures

---

## Risk Management

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Resend webhook delivery failure** | Medium | High | Bull queue with 3 retries + exponential backoff. Manual email logging fallback. Monitor queue dead-letter. |
| **Database performance degradation** | Medium | High | Add composite indexes on CRMContact. Use Redis caching for contact lists (5min TTL). Optimize N+1 queries with Prisma `include`. |
| **Rate limit exceeded (2 req/sec)** | High | Medium | Queue all email sync events. Process at 1.8 req/sec (safety margin). Implement exponential backoff on 429 errors. |
| **Email thread parsing complexity** | Medium | Medium | Use simple email threading (group by subject + contact). No need for perfect Gmail-style threading in v1. |
| **Contact deduplication edge cases** | Medium | Medium | Enforce email uniqueness constraint. When affiliate→client conversion: update CRMContact.contactType, keep same email. |

### Integration Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Breaking Epic 6 lead tracking** | Low | High | CRM reuses existing PipelineStage enum. No changes to LinkClick/Lead models. Run full Epic 6 regression tests before launch. |
| **Clerk auth session issues** | Low | Medium | CRM uses same `requireOneOfRoles` middleware. No new auth logic. |
| **MinIO storage quota exceeded** | Low | Medium | Monitor storage usage. Add file size limits (10MB per attachment). |
| **Resend webhook signature validation** | Low | High | Implement webhook signature verification using `RESEND_WEBHOOK_SECRET`. Reject unsigned requests. |

---

## Implementation Timeline

### Week 1: Foundation (Story 7.1)
- **Days 1-5:** CRM Database Schema & Contact Management
- **Milestone:** Database migrations complete, contact CRUD APIs functional, backfill script tested

### Week 2: Email Sync (Story 7.2)
- **Days 6-11:** Interaction Tracking & Resend Email Sync
- **Milestone:** Interaction logging functional, Resend webhook integration complete, email sync queue operational

### Week 3: UI (Story 7.3)
- **Days 12-16:** CRM Dashboard UI & Contact Detail View
- **Milestone:** Admin/preparer dashboards live, contact list and detail views functional, interaction timeline working

### Week 4: Pipeline (Story 7.4)
- **Days 17-20:** Pipeline Kanban Board & Drag-and-Drop
- **Milestone:** Kanban board operational, drag-and-drop stage updates working, stage history tracking functional

### Week 5: Reporting (Story 7.5)
- **Days 21-25:** Relationship Tracking & CRM Reporting
- **Milestone:** Affiliate relationships tracked, CRM reports generated, CSV exports working

### Week 6: Testing & Deployment
- **Days 26-30:** Integration testing, bug fixes, documentation, production deployment
- **Final Milestone:** Epic 7 deployed to production, all features operational

---

## Dependencies & Prerequisites

### Technical Dependencies

**Required:**
- ✅ Existing database models (User, Client, Preparer, Affiliate, Lead)
- ✅ Clerk authentication system
- ✅ Resend email service with webhook support
- ✅ MinIO object storage
- ✅ Bull queue system (from Epic 6)
- ✅ Redis cache
- ✅ Socket.io notification system

**New Libraries:**
- `@dnd-kit/core` + `@dnd-kit/sortable` - Drag-and-drop for Kanban board
- `date-fns` - Date formatting (already installed)
- `react-email` - Email preview rendering (already installed)

### External Services

- **Resend Webhooks:** `email.sent`, `email.delivered` events
- **Resend API Rate Limit:** 2 req/sec (enforce 1.8 req/sec with queue)

---

## Testing Strategy

### Unit Tests (Required for Each Story)

- CRM service tests (contact CRUD, interaction logging, stage updates)
- Email sync service tests (webhook parsing, threading logic)
- React component tests (ContactList, InteractionTimeline, PipelineBoard)

### Integration Tests (Required for Each Story)

- API endpoint tests (auth, CRUD operations, error handling)
- Full CRM flow tests (create contact → log interaction → update stage)
- Email sync workflow tests (webhook → queue → database)

### End-to-End Tests (Epic-Level)

```typescript
// E2E Test: Complete CRM Workflow
1. Admin creates new contact
2. Preparer assigned to contact
3. Preparer logs phone call interaction
4. Email sent via Resend → synced to CRM
5. Admin moves contact through pipeline stages
6. Admin exports contacts to CSV
7. Verify all data correct
```

### Performance Tests

- Load testing: CRM dashboard with 1000+ contacts
- Query performance: Contact list with complex filters
- Email sync performance: 100 emails/minute webhook load
- Export speed: 10K contact CSV export

---

## Rollback Strategy

**Graceful Degradation:**
- All enhancements are additive (no data removal)
- Can disable CRM features via feature flags
- Existing dashboards continue to work independently
- Database migrations are reversible (nullable fields)

**Rollback Procedure:**
```bash
# 1. Disable feature flags
export ENABLE_CRM=false
export ENABLE_EMAIL_SYNC=false

# 2. Revert database migrations (if needed)
npx prisma migrate resolve --rolled-back 20250116_add_crm_system

# 3. Restart application
pm2 restart taxgeniuspro

# 4. Verify existing functionality works
```

---

## Documentation Requirements

### User Documentation

- [ ] CRM getting started guide (with screenshots)
- [ ] Contact management tutorial
- [ ] Interaction logging guide
- [ ] Pipeline board usage guide
- [ ] Reports and analytics guide
- [ ] Best practices for CRM usage

### Developer Documentation

- [ ] CRM architecture diagram
- [ ] Database schema changes documentation
- [ ] API endpoint documentation
- [ ] Service layer architecture
- [ ] Testing guidelines
- [ ] Deployment procedures

### Admin Documentation

- [ ] User role and permissions guide
- [ ] Relationship tracking guide
- [ ] Report interpretation guide
- [ ] Data export procedures
- [ ] Troubleshooting guide

---

## Post-Epic Enhancements (Future)

**Short-term (Next 3 months):**
- Task management (follow-up reminders, deadlines)
- SMS integration (Twilio)
- Automated email sequences
- Mobile app for CRM

**Medium-term (6 months):**
- AI-powered client insights
- Predictive analytics (churn risk, conversion probability)
- Advanced segmentation
- Custom report builder

**Long-term (12+ months):**
- Multi-touch attribution
- Cohort analysis
- Integration with third-party tax software
- White-label CRM for preparers

---

## Approval Checklist

Before starting implementation, verify:

- [ ] Epic stories reviewed and approved
- [ ] Technical architecture validated
- [ ] Database migration plan approved
- [ ] Resource allocation confirmed (1-2 developers)
- [ ] Dependencies identified and addressed
- [ ] Risk mitigation plans in place
- [ ] Testing strategy agreed upon
- [ ] Documentation requirements understood
- [ ] Success metrics defined
- [ ] Rollback procedure documented
- [ ] Timeline approved by stakeholders

---

## Conclusion

Epic 7 transforms TaxGeniusPro into a comprehensive platform with enterprise-grade CRM capabilities. By building on existing infrastructure (Epic 6 lead tracking, Clerk auth, Resend email, MinIO storage) rather than replacing it, we minimize risk while delivering maximum value.

**Key Success Factors:**
1. **Foundation First:** Story 7.1 must be rock-solid before proceeding
2. **Incremental Development:** Each story delivers value independently
3. **Code Reuse:** Extend existing patterns, don't duplicate
4. **User-Centric Design:** Simple interface, powerful features underneath
5. **Production-Ready:** Deploy all features at once for complete user experience

**Ready to Begin:** All 5 stories are fully specified with technical details, file lists, and acceptance criteria. Implementation can start immediately.

---

**Epic Owner:** TBD
**Start Date:** TBD
**Target Completion:** TBD (6 weeks from start)
**Version:** 1.0
**Last Updated:** 2025-01-16

---

*For detailed story specifications, see individual story documents in `/docs/stories/` directory.*
