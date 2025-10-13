# Epic 6: Lead Tracking Dashboard Enhancement

**Type:** Brownfield Epic (Enhancement of Existing System)
**Estimated Duration:** 3-4 weeks (25 days)
**Priority:** HIGH
**Status:** Ready for Implementation

---

## Executive Summary

Transform TaxGeniusPro's basic link tracking into a comprehensive lead generation analytics platform matching industry-standard specifications. This epic enhances (not replaces) existing tracking infrastructure to provide:

- **Complete customer journey tracking** (Click → Intake Start → Intake Complete → Return Filed)
- **Comprehensive material management** with automatic QR code generation
- **Top 15 rankings** across users, materials, locations, and types
- **Advanced analytics** with drop-off analysis, material comparison, and export functionality
- **Role-based dashboards** with real-time performance insights for all user types

---

## Business Context

### Current State (What Exists)

✅ **Database Infrastructure:**
- `MarketingLink` and `LinkClick` models (basic tracking)
- `MarketingCampaign` model with tracking codes
- `Lead` model with UTM fields
- `Commission` model for referrer payments

✅ **Services:**
- `link-tracking.service.ts` (basic click tracking)
- `preparer-analytics.service.ts` (basic analytics)

✅ **Dashboards:**
- Referrer, Affiliate, Tax Preparer, Admin dashboards (with placeholder data)
- Basic stat cards and layout structure

### Gap Analysis (What's Missing)

❌ **4-Stage Journey Tracking:** Currently only tracks clicks, not full funnel
❌ **UTM Persistence:** No cookie-based attribution through authentication
❌ **Material Management UI:** Marketing hub has placeholder content only
❌ **Top 15 Rankings:** No sophisticated ranking queries or UI
❌ **Advanced Analytics:** No drop-off analysis, comparison tools, or exports
❌ **Real Performance Data:** Dashboards show dummy/static data

### Target State (What We're Building)

This epic delivers:
- ✅ Full 4-stage funnel tracking with UTM attribution
- ✅ Comprehensive material CRUD with QR generation
- ✅ Top 15 rankings for all categories
- ✅ Advanced analytics with exports (CSV/PDF)
- ✅ Real-time performance dashboards for all roles

---

## Epic Stories Breakdown

### Story 6.1: Complete UTM Journey Tracking ⭐ FOUNDATION
**Effort:** 5 days | **Priority:** CRITICAL

**Goal:** Enhance existing tracking to capture complete customer journey with UTM attribution

**Key Deliverables:**
- Database schema extensions (journey stage timestamps)
- UTM extraction middleware
- Cookie-based attribution (30-day window)
- Integration with intake form and status update APIs
- Cached conversion rate calculations

**Acceptance Criteria:**
- [x] Track: clicked_at → intake_started_at → intake_completed_at → tax_return_completed_at
- [x] UTM params persist through authentication
- [x] Journey tracking adds < 100ms latency
- [x] Commission triggers use journey completion data

**Files Created:**
- `/src/middleware/utm-tracking.ts`
- `/src/lib/services/journey-tracking.ts`
- `/src/lib/utils/utm-parser.ts`
- `/src/lib/utils/cookie-manager.ts`

**Files Updated:**
- `prisma/schema.prisma` (add journey fields to LinkClick)
- `src/lib/services/link-tracking.service.ts`
- `src/app/api/tax-intake/lead/route.ts`
- `src/app/api/submissions/[id]/status/route.ts`
- `src/middleware.ts`

---

### Story 6.2: Material Management Enhancement
**Effort:** 5 days | **Priority:** HIGH | **Depends on:** 6.1

**Goal:** Build comprehensive material CRUD with automatic QR code generation

**Key Deliverables:**
- Material creation form UI
- QR code generation service (PNG/SVG/PDF)
- R2/S3 upload integration
- Material library with real data
- Edit/delete functionality

**Acceptance Criteria:**
- [x] Create materials with all spec types (qr_poster, qr_flyer, email_link, etc.)
- [x] Auto-generate unique tracking codes with UTM parameters
- [x] QR codes scan successfully on all devices
- [x] Material creation completes in < 3 seconds
- [x] Material library displays real performance data

**Files Created:**
- `/src/lib/services/qr-code.service.ts`
- `/src/lib/services/material-management.service.ts`
- `/src/app/api/materials/create/route.ts`
- `/src/app/api/materials/[id]/route.ts`
- `/src/components/materials/MaterialCreationModal.tsx`
- `/src/components/materials/MaterialCard.tsx`
- `/src/components/materials/MaterialLibrary.tsx`

**Files Updated:**
- `prisma/schema.prisma` (add material fields to MarketingLink)
- `src/components/MarketingHub.tsx`
- `src/app/dashboard/referrer/marketing/page.tsx`

---

### Story 6.3: Super Admin Analytics Dashboard
**Effort:** 6 days | **Priority:** HIGH | **Depends on:** 6.1, 6.2

**Goal:** Build Top 15 rankings and comprehensive admin analytics

**Key Deliverables:**
- Admin analytics service with Top 15 queries
- Geographic performance service
- Performance overview cards
- Top 15 ranking UI components
- Drill-down navigation (macro → micro view)
- Date range filtering
- CSV export functionality

**Acceptance Criteria:**
- [x] Top 15: Tax Preparers, Affiliates, Referrers, Materials, Locations, Types
- [x] Performance overview displays real-time data
- [x] Dashboard loads in < 2 seconds
- [x] Drill-down into individual user performance
- [x] Geographic heat map visualization
- [x] CSV export for all rankings

**Files Created:**
- `/src/lib/services/admin-analytics.service.ts`
- `/src/lib/services/geographic-analytics.service.ts`
- `/src/app/api/admin/analytics/overview/route.ts`
- `/src/app/api/admin/analytics/top-performers/route.ts`
- `/src/app/api/admin/analytics/geographic/route.ts`
- `/src/components/admin/Top15Card.tsx`
- `/src/components/admin/PerformanceOverview.tsx`
- `/src/components/admin/GeographicHeatMap.tsx`

**Files Updated:**
- `src/app/dashboard/admin/page.tsx`
- `src/lib/services/preparer-analytics.service.ts`
- `prisma/schema.prisma` (add performance indexes)

---

### Story 6.4: Role Dashboard Enhancement
**Effort:** 6 days | **Priority:** HIGH | **Depends on:** 6.1, 6.2

**Goal:** Update referrer, affiliate, and tax preparer dashboards with real analytics

**Key Deliverables:**
- Top 15 materials table for each role
- Conversion funnel visualization
- Source breakdown charts
- Performance trends over time
- React Query hooks for data fetching
- Mobile responsive design

**Acceptance Criteria:**
- [x] Referrer: Top 15 my materials + funnel + source breakdown
- [x] Affiliate: Campaign performance + earnings by material
- [x] Tax Preparer: Client source tracking + referrer partnerships
- [x] All tables sortable and filterable
- [x] Dashboards load in < 2 seconds
- [x] Mobile responsive verified

**Files Created:**
- `/src/hooks/useMyMaterials.ts`
- `/src/hooks/useConversionFunnel.ts`
- `/src/hooks/useSourceBreakdown.ts`
- `/src/components/analytics/ConversionFunnel.tsx`
- `/src/components/analytics/SourceBreakdown.tsx`
- `/src/components/analytics/MaterialsTable.tsx`
- `/src/app/api/materials/my-performance/route.ts`
- `/src/app/api/analytics/funnel/[userId]/route.ts`

**Files Updated:**
- `src/app/dashboard/referrer/page.tsx`
- `src/app/dashboard/affiliate/page.tsx`
- `src/app/dashboard/tax-preparer/page.tsx`
- `src/hooks/useReferrerData.ts`
- `src/app/api/referrers/stats/route.ts`

---

### Story 6.5: Analytics & Reporting
**Effort:** 3 days | **Priority:** MEDIUM | **Depends on:** 6.1, 6.2, 6.3, 6.4

**Goal:** Add advanced analytics features (drop-off analysis, comparison, exports)

**Key Deliverables:**
- Drop-off analysis service and UI
- Material comparison tool (side-by-side)
- Performance trend analysis
- CSV export utility
- PDF report generator
- Export buttons on all dashboards

**Acceptance Criteria:**
- [x] Drop-off analysis shows abandonment at each stage
- [x] Material comparison supports up to 10 materials
- [x] CSV exports generate in < 2 seconds
- [x] PDF reports generate in < 5 seconds
- [x] Trend analysis displays performance over time
- [x] All dashboards support export functionality

**Files Created:**
- `/src/lib/services/dropoff-analysis.service.ts`
- `/src/lib/services/material-comparison.service.ts`
- `/src/lib/utils/csv-export.ts`
- `/src/lib/utils/pdf-export.ts`
- `/src/app/api/analytics/dropoff/route.ts`
- `/src/app/api/analytics/compare-materials/route.ts`
- `/src/app/api/analytics/export/csv/route.ts`
- `/src/components/analytics/DropOffAnalysis.tsx`
- `/src/components/analytics/MaterialComparison.tsx`
- `/src/components/analytics/ExportButton.tsx`

**Files Updated:**
- All dashboard pages (add export buttons)
- `src/lib/services/analytics.service.ts`

---

## Technical Architecture

### Database Changes

**Extensions to Existing Models:**

```prisma
// EXTEND LinkClick model (prisma/schema.prisma:946-973)
model LinkClick {
  // ... existing fields ...

  // NEW: Journey stage timestamps
  intakeStartedAt      DateTime?
  intakeCompletedAt    DateTime?
  taxReturnCompletedAt DateTime?

  // NEW: Enhanced UTM tracking
  utmTerm              String?   // Location/placement

  // NEW indexes
  @@index([linkId, clickedAt])
  @@index([materialId])
}

// EXTEND MarketingLink model (prisma/schema.prisma:897-944)
model MarketingLink {
  // ... existing fields ...

  // NEW: Material-specific fields
  location             String?
  notes                String?  @db.Text
  qrCodeImageUrl       String?
  dateActivated        DateTime?

  // NEW: Journey stage counters (cached for performance)
  intakeStarts         Int @default(0)
  intakeCompletes      Int @default(0)
  returnsFiled         Int @default(0)

  // NEW: Conversion rate caching
  intakeConversionRate   Float?
  completeConversionRate Float?
  filedConversionRate    Float?

  // NEW indexes for Top 15 queries
  @@index([creatorId, returnsFiled(sort: Desc)])
  @@index([linkType, conversions(sort: Desc)])
  @@index([location, clicks(sort: Desc)])
}
```

**No New Tables Required** - All enhancements use existing models

### API Endpoints

**New Endpoints:**
- `POST /api/tracking/journey-stage` - Record journey stage progress
- `GET /api/materials/my-performance` - User's material performance
- `POST /api/materials/create` - Create material with QR
- `GET /api/admin/analytics/overview` - Admin performance overview
- `GET /api/admin/analytics/top-performers` - Top 15 rankings
- `GET /api/analytics/funnel/[userId]` - Conversion funnel data
- `GET /api/analytics/dropoff` - Drop-off analysis
- `POST /api/analytics/compare-materials` - Material comparison
- `POST /api/analytics/export/csv` - CSV export
- `POST /api/analytics/export/pdf` - PDF report

**Enhanced Endpoints:**
- `GET /api/referrers/stats` - Add Top 15 materials query
- `GET /api/referrers/activity` - Add funnel stage details
- `POST /api/marketing/materials` - Full CRUD operations

### Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                     INTEGRATION FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Landing Page (w/ UTM)                                       │
│         │                                                     │
│         ├──> UTM Middleware ──> Cookie Storage              │
│         │                                                     │
│         └──> trackLinkClick() ──> LinkClick Record          │
│                                                               │
│  Intake Form Start                                           │
│         │                                                     │
│         └──> trackJourneyStage('INTAKE_STARTED')            │
│                   │                                           │
│                   └──> Update LinkClick.intakeStartedAt      │
│                                                               │
│  Intake Form Submit                                          │
│         │                                                     │
│         └──> trackJourneyStage('INTAKE_COMPLETED')          │
│                   │                                           │
│                   └──> Update LinkClick.intakeCompletedAt    │
│                                                               │
│  Tax Return Status → FILED                                   │
│         │                                                     │
│         ├──> trackJourneyStage('RETURN_FILED')              │
│         │         │                                           │
│         │         └──> Update LinkClick.taxReturnCompletedAt │
│         │                                                     │
│         └──> Create Commission (if applicable)               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Success Metrics

### Technical Metrics

- ✅ **Journey Tracking Accuracy:** 95%+ of customer journeys tracked through all 4 stages
- ✅ **Dashboard Load Time:** < 2 seconds for all dashboards
- ✅ **Query Performance:** Top 15 queries execute in < 500ms
- ✅ **Export Speed:** CSV < 2s, PDF < 5s
- ✅ **QR Generation:** < 3 seconds per material creation
- ✅ **Mobile Responsiveness:** All dashboards work on mobile, tablet, desktop

### Business Metrics

- 📈 **Material Creation Rate:** Users create 5+ materials per month
- 📈 **Dashboard Engagement:** 80%+ weekly active usage by referrers/affiliates
- 📈 **Attribution Rate:** 85%+ of tax returns attributed to marketing materials
- 📈 **Export Usage:** 40%+ of users export data monthly
- 📈 **Comparison Tool Usage:** 25%+ of users compare materials weekly

### User Experience Metrics

- 😊 **Dashboard Satisfaction:** 4.5+ / 5 stars (user survey)
- 😊 **Material Creation Ease:** 4.5+ / 5 stars (user survey)
- 😊 **Analytics Clarity:** Users understand funnel drop-offs without training

---

## Implementation Timeline

### Week 1: Foundation
- **Days 1-5:** Story 6.1 (UTM Journey Tracking)
- **Milestone:** Complete funnel tracking operational

### Week 2: Material Management
- **Days 6-10:** Story 6.2 (Material Management Enhancement)
- **Milestone:** Material creation with QR codes functional

### Week 3: Admin Analytics
- **Days 11-16:** Story 6.3 (Super Admin Dashboard)
- **Milestone:** Top 15 rankings and admin analytics live

### Week 4: Role Dashboards + Reporting
- **Days 17-22:** Story 6.4 (Role Dashboard Enhancement)
- **Days 23-25:** Story 6.5 (Analytics & Reporting)
- **Milestone:** All dashboards with real data, export functionality

---

## Risk Management

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Database performance** with complex aggregations | Medium | High | Add composite indexes, implement caching (5-min TTL), use materialized views if needed |
| **Cookie attribution loss** (user switches devices) | High | Medium | Accept industry-standard attribution loss, provide 30-day window, store in profile for authenticated users |
| **R2/S3 storage costs** from excessive QR generation | Low | Medium | Implement per-user limits (100 active materials), add cleanup jobs for old materials |
| **Large CSV exports** causing memory issues | Medium | Medium | Limit to 10K rows, implement streaming for large exports, add progress indicators |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Users don't adopt new features** | Low | High | Provide onboarding tour, video tutorials, in-app guidance |
| **Complexity overwhelms non-technical users** | Medium | Medium | Progressive disclosure, simple defaults, expert mode for advanced features |
| **Performance degrades with scale** | Medium | High | Monitor query performance, optimize indexes, consider read replicas if needed |

---

## Dependencies & Prerequisites

### Technical Dependencies

**Required:**
- ✅ Existing database models (MarketingLink, LinkClick, Profile, Commission)
- ✅ Clerk authentication system
- ✅ R2/S3 storage for QR codes
- ✅ Existing dashboard infrastructure

**Optional:**
- ⭐ Redis for caching (can use in-memory cache as fallback)
- ⭐ Mapbox/Google Maps for geographic heat map (can use simple chart)

### External Services

- **QR Code Generation:** `qrcode` npm package (MIT license)
- **CSV Export:** `json2csv` or `papaparse` (open source)
- **PDF Export:** `jsPDF` + `jspdf-autotable` (open source)
- **Charts:** Recharts (already installed)

---

## Testing Strategy

### Unit Tests (Required for Each Story)

- Journey tracking service tests
- QR code generation tests
- Analytics query tests
- Export utility tests
- React component tests

### Integration Tests (Required for Each Story)

- API endpoint tests
- Full funnel flow tests
- Material creation flow tests
- Export workflow tests

### End-to-End Tests (Epic-Level)

```typescript
// E2E Test: Complete User Journey
1. User clicks marketing link with UTM
2. System captures UTM in cookie
3. User starts intake form → Journey stage tracked
4. User completes intake → Journey stage tracked
5. Admin marks return filed → Commission created
6. User views dashboard → Sees attribution
7. User exports data → CSV downloads successfully
```

### Performance Tests

- Load testing: Dashboard with 1000+ materials
- Query performance: Top 15 queries with large datasets
- Export speed: 10K row CSV export
- Concurrent users: 100+ simultaneous dashboard loads

---

## Rollback Strategy

**Graceful Degradation:**
- All enhancements are additive (no data removal)
- Can disable new features via feature flags
- Existing dashboards continue to work independently
- Database migrations are reversible (nullable fields)

**Rollback Procedure:**
```bash
# 1. Disable feature flags
export ENABLE_JOURNEY_TRACKING=false
export ENABLE_MATERIAL_MANAGEMENT=false
export ENABLE_ADVANCED_ANALYTICS=false

# 2. Revert database migrations (if needed)
npx prisma migrate resolve --rolled-back 20250101_journey_tracking

# 3. Restart application
pm2 restart taxgeniuspro

# 4. Verify existing functionality works
```

---

## Documentation Requirements

### User Documentation

- [ ] Material creation guide (with screenshots)
- [ ] Dashboard overview for each role
- [ ] UTM parameter guide for custom campaigns
- [ ] Export functionality tutorial
- [ ] Best practices for material optimization

### Developer Documentation

- [ ] Journey tracking architecture diagram
- [ ] Database schema changes
- [ ] API endpoint documentation
- [ ] Service layer architecture
- [ ] Testing guidelines

### Admin Documentation

- [ ] Top 15 rankings interpretation guide
- [ ] Commission calculation verification
- [ ] Data integrity checks
- [ ] Performance monitoring guide

---

## Post-Epic Enhancements (Future)

**Short-term (Next 3 months):**
- A/B testing framework for materials
- Automated material performance alerts
- Scheduled reports (email PDF weekly)
- Mobile app for on-the-go tracking

**Medium-term (6 months):**
- AI-powered material optimization suggestions
- Predictive analytics (forecast conversions)
- Real-time dashboard updates (WebSockets)
- Advanced segmentation (by demographics)

**Long-term (12+ months):**
- Multi-touch attribution (not just last-touch)
- Cohort analysis
- Custom report builder
- Data warehouse integration for advanced analytics

---

## Approval Checklist

Before starting implementation, verify:

- [x] Epic stories reviewed and approved
- [x] Technical architecture validated
- [x] Database migration plan approved
- [x] Resource allocation confirmed
- [x] Dependencies identified and addressed
- [x] Risk mitigation plans in place
- [x] Testing strategy agreed upon
- [x] Documentation requirements understood
- [x] Success metrics defined
- [x] Rollback procedure documented

---

## Team Assignments

**Story 6.1 (Foundation):**
- Backend: Database migrations, journey tracking service
- Frontend: Minimal (middleware only)
- Estimated: 1 developer, 5 days

**Story 6.2 (Material Management):**
- Backend: QR generation service, material APIs
- Frontend: Material creation UI, library component
- Estimated: 1 full-stack developer, 5 days

**Story 6.3 (Admin Dashboard):**
- Backend: Admin analytics service, Top 15 queries
- Frontend: Admin dashboard UI, ranking components
- Estimated: 1 full-stack developer, 6 days

**Story 6.4 (Role Dashboards):**
- Backend: User analytics APIs
- Frontend: Dashboard enhancements, chart components
- Estimated: 1 full-stack developer, 6 days

**Story 6.5 (Analytics & Reporting):**
- Backend: Export services, comparison APIs
- Frontend: Export buttons, comparison UI
- Estimated: 1 full-stack developer, 3 days

**Total Team Size:** 1-2 developers (can parallelize Stories 6.3-6.5)

---

## Conclusion

This brownfield epic transforms TaxGeniusPro's basic tracking into a comprehensive lead generation analytics platform. By building on existing infrastructure rather than replacing it, we minimize risk while delivering enterprise-grade capabilities.

**Key Success Factors:**
1. **Foundation First:** Story 6.1 must be rock-solid before proceeding
2. **Incremental Delivery:** Each story delivers value independently
3. **Performance Focus:** Dashboard speed is critical for adoption
4. **User-Centric Design:** Simple interface, powerful features underneath

**Ready to Begin:** All 5 stories are fully specified with technical details, file lists, and acceptance criteria. Implementation can start immediately.

---

**Epic Owner:** TBD
**Start Date:** TBD
**Target Completion:** TBD (25 business days from start)
**Last Updated:** 2025-10-13

---

*For detailed story specifications, see:*
- [Story 6.1: UTM Journey Tracking](../stories/6.1.utm-journey-tracking.md)
- [Story 6.2: Material Management Enhancement](../stories/6.2.material-management-enhancement.md)
- [Story 6.3: Super Admin Analytics Dashboard](../stories/6.3.super-admin-analytics-dashboard.md)
- [Story 6.4: Role Dashboard Enhancement](../stories/6.4.role-dashboard-enhancement.md)
- [Story 6.5: Analytics & Reporting](../stories/6.5.analytics-reporting.md)
