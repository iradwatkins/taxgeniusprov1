# Epic 7: CRM System - Development Handoff

**Status:** ✅ Ready for Implementation
**Date:** 2025-01-16
**Epic Document:** `/docs/prd/epic-7-crm-system.md`

---

## Executive Summary

Epic 7 adds a comprehensive CRM (Customer Relationship Management) system to TaxGeniusPro. The PRD is complete and approved. This document provides the development handoff.

## What Was Completed (PM Phase)

✅ **Complete PRD Created:** `/docs/prd/epic-7-crm-system.md`
- Comprehensive requirements (FR1-FR9, NFR1-NFR8, CR1-CR4)
- Full technical architecture (database schema, API endpoints, integration points)
- 5 detailed stories with acceptance criteria
- Risk assessment and mitigation strategies
- Timeline and resource estimates

✅ **Key Decisions Made:**
- Native CRM build (not third-party integration)
- Real-time email sync via Resend webhooks
- Drag-and-drop Kanban board using @dnd-kit
- Gmail-style email threading
- Role-based access (admin + tax_preparer only)
- All-at-once deployment (not phased rollout)

✅ **Scope Clarified:**
- Task management feature CUT from scope (user decision)
- Email sync: Real-time webhooks (not polling)
- Contact deduplication: Keep affiliate/client separate
- Resend rate limit: 2 req/sec (enforce 1.8 req/sec with queue)

---

## Development Instructions

### Start with Story 7.1: CRM Database Schema & Contact Management

**Story Document:** Ready to be created in `/docs/stories/7.1-crm-database-schema.md`

**Key Tasks:**
1. Create Prisma migrations for CRMContact, CRMInteraction, CRMStageHistory models
2. Create backfill script to migrate existing Client/Lead/Preparer data
3. Implement CRMService with contact CRUD methods
4. Create API routes: `/api/crm/contacts/*`
5. Add role-based access control (reuse existing `requireOneOfRoles` middleware)

**Critical Requirements:**
- ✅ All new tables use foreign keys to existing User/Client/Preparer tables
- ✅ Migration is REVERSIBLE (all new columns nullable or with defaults)
- ✅ NO changes to existing tables (additive only)
- ✅ Composite indexes added for performance
- ✅ Backfill script is idempotent (can run multiple times safely)

**Code Reuse Strategy (IMPORTANT):**
- REUSE existing `requireOneOfRoles` middleware (don't create new auth)
- REUSE existing Prisma patterns (don't duplicate database logic)
- EXTEND existing service layer (don't create parallel services)

### Estimated Timeline

- **Week 1:** Story 7.1 (5 days)
- **Week 2:** Story 7.2 (6 days)
- **Week 3:** Story 7.3 (5 days)
- **Week 4:** Story 7.4 (4 days)
- **Week 5:** Story 7.5 (5 days)
- **Week 6:** Testing + deployment (5 days)

**Total: 30 days (6 weeks)**

---

## Critical Integration Points

### Epic 6 Integration
- CRM extends Epic 6 Lead Tracking (does NOT replace it)
- Reuse existing `PipelineStage` enum
- No changes to `LinkClick` or `Lead` models
- CRM adds interaction tracking on top of lead tracking

### Resend Email Integration
- Real-time webhook: `/api/webhooks/resend/email-sent`
- Webhook signature validation required (`RESEND_WEBHOOK_SECRET`)
- Bull queue processes at 1.8 req/sec (90% of Resend 2 req/sec limit)
- Exponential backoff on failures (1s → 2s → 4s)

### Existing Systems to Preserve
- ✅ Clerk authentication (no changes)
- ✅ MinIO document storage (no changes)
- ✅ Epic 6 dashboards (no breaking changes)
- ✅ Commission system (extend with CRM data)

---

## Success Criteria

**Technical:**
- [ ] All 5 stories completed with acceptance criteria met
- [ ] CRM dashboard loads in < 2 seconds
- [ ] Email sync accuracy: 95%+ of emails synced within 10 seconds
- [ ] No regressions in Epic 6 functionality

**Business:**
- [ ] Admins can view all contacts with interaction history
- [ ] Tax preparers can view only their assigned clients
- [ ] Email sync operational and reliable
- [ ] Drag-and-drop pipeline board functional

**Quality:**
- [ ] Unit tests for all services (>80% coverage)
- [ ] Integration tests for all API endpoints
- [ ] E2E test for complete CRM workflow
- [ ] Performance tests pass (1000+ contacts, 100K+ interactions)

---

## Next Steps

1. **Development Agent:** Review Epic 7 PRD (`/docs/prd/epic-7-crm-system.md`)
2. **Start Story 7.1:** Create database migrations and contact CRUD APIs
3. **Create Story Document:** `/docs/stories/7.1-crm-database-schema.md` with detailed implementation plan
4. **Begin Coding:** Follow acceptance criteria in Epic 7 PRD

---

## Questions or Clarifications

If any requirements are unclear:
1. Refer to Epic 7 PRD (`/docs/prd/epic-7-crm-system.md`) for complete specifications
2. Existing code patterns documented in `/docs/architecture/` directory
3. Epic 6 implementation can serve as reference for similar patterns

---

**Handoff From:** PM Agent (John)
**Handoff To:** Development Agent
**Date:** 2025-01-16
**Status:** ✅ Ready to Code

---

*"Build on existing patterns. Extend, don't duplicate. Test thoroughly. Ship confidently."*
