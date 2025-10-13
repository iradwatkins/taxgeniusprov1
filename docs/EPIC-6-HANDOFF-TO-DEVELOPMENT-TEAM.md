# EPIC 6: LEAD TRACKING DASHBOARD - HANDOFF TO DEVELOPMENT TEAM

**Document Version**: 1.0
**Date**: 2025-10-13
**Epic Status**: SPECIFICATION COMPLETE - READY FOR IMPLEMENTATION
**Target Timeline**: 3-4 weeks (25 business days)
**Priority**: HIGH - Critical business intelligence upgrade

---

## 📋 EXECUTIVE SUMMARY

### What We're Building

Epic 6 transforms Tax Genius Pro's marketing analytics from basic click tracking to a comprehensive lead tracking dashboard that follows customers through a complete 4-stage journey:

1. **Click** → User clicks promotional material (QR code, link, flyer)
2. **Intake Start** → User begins tax intake form
3. **Intake Complete** → User submits completed intake form
4. **Return Filed** → Tax return successfully filed

### Business Value

- **For Referrers/Affiliates**: See which materials drive highest conversion (not just clicks)
- **For Tax Preparers**: Understand which lead sources close deals
- **For Super Admin**: Identify top performers across all categories with "Top 15" rankings
- **For Business**: Optimize marketing spend by tracking full funnel, not just traffic

### Key Features

1. **UTM Journey Tracking**: Cookie-based attribution through 30-day window
2. **Material Management**: QR code generation for posters, flyers, business cards, links
3. **Top 15 Rankings**: Sophisticated analytics across users, materials, locations, types
4. **Role-Based Dashboards**: Personalized views for all 5 user roles
5. **Advanced Analytics**: Drop-off analysis, material comparison, CSV/PDF exports

### Implementation Strategy

**Brownfield Enhancement Pattern**: Extend existing code without replacing it
- ✅ Zero breaking changes to existing functionality
- ✅ Additive database migrations only (nullable fields)
- ✅ Backward compatible APIs
- ✅ Feature flags for safe rollout
- ✅ Simple rollback plan

---

## 📚 COMPLETE DOCUMENTATION INDEX

All specification documents are located in `/docs/` directory:

### Master Epic Document
**`/docs/prd/epic-6-lead-tracking-dashboard.md`** (1,936 lines)
- Complete business requirements and user stories
- Technical architecture and database design
- Success metrics and risk management
- **Role**: Master reference for all Epic 6 work

### Story Implementation Guides (Must implement in order)

**`/docs/stories/6.1.utm-journey-tracking.md`** (665 lines)
- **FOUNDATION STORY - IMPLEMENT FIRST**
- Database schema extensions for journey tracking
- UTM middleware and cookie management
- Journey tracking service implementation
- Timeline: 5 days

**`/docs/stories/6.2.material-management-enhancement.md`** (507 lines)
- Material CRUD operations
- QR code generation and storage
- Material analytics integration
- **Depends on**: Story 6.1 complete
- Timeline: 5 days

**`/docs/stories/6.3.super-admin-analytics-dashboard.md`** (673 lines)
- Top 15 rankings implementation
- Admin analytics dashboard
- Performance optimization with indexes
- Timeline: 6 days

**`/docs/stories/6.4.role-dashboard-enhancement.md`** (658 lines)
- Dashboard updates for Referrer, Affiliate, Tax Preparer
- React Query hooks and components
- Responsive design implementation
- Timeline: 6 days

**`/docs/stories/6.5.analytics-reporting.md`** (523 lines)
- Drop-off analysis features
- Material comparison tools
- CSV/PDF export functionality
- Timeline: 3 days

### Integration & Verification Documents

**`/docs/EPIC-6-INTEGRATION-NAVIGATION.md`** (1,290 lines)
- Complete navigation flows for all 5 user roles
- End-to-end data flow diagrams
- 55 files mapped (40 new, 15 updated)
- Mobile responsive navigation design
- Integration checkpoints

**`/docs/EPIC-6-READY-TO-IMPLEMENT.md`** (885 lines)
- Final verification checklist
- Zero breaking changes guarantee
- Rollback plan documented
- Success metrics dashboard

---

## ✅ PREREQUISITES CHECKLIST

### System Status (Verified 2025-10-13)

#### Production Environment
- ✅ **Server**: taxgeniuspro.tax running on port 3005
- ✅ **Uptime**: Stable (83+ minutes verified)
- ✅ **Stack**: Next.js 14 (App Router), Prisma, PostgreSQL, Clerk Auth
- ✅ **Git Status**: 26 modified files, 4 commits ahead of origin

#### Required Dependencies
- ✅ `qrcode.react` - Already installed (for QR code generation)
- ✅ `recharts` - Already installed (for analytics charts)
- ✅ `jspdf` - Already installed (for PDF exports)
- ✅ `@tanstack/react-query` - Already in use

#### Environment Configuration
- ✅ `DATABASE_URL` - PostgreSQL connection configured
- ✅ `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` - Auth configured
- ✅ `RESEND_API_KEY` - Email service configured
- ✅ `SQUARE_*` - Payment integration configured

#### Code Foundation
- ✅ **Existing Models**: MarketingLink, LinkClick, Commission, Profile
- ✅ **Existing Services**: link-tracking.service.ts, analytics.service.ts
- ✅ **Existing Components**: DashboardSidebar, StatCard, MarketingHub
- ✅ **Permission System**: Already implemented with role-based access

### Before Starting Implementation

#### Required Actions
1. ⚠️ **Verify Epic 4 Complete**: Check e-commerce store functionality
2. ⚠️ **Database Backup**: Create backup before running migrations
3. ⚠️ **Review Git Status**: Commit or stash 26 modified files
4. ⚠️ **Team Assignments**: Assign developers to stories (see section below)
5. ⚠️ **Create Feature Branch**: `git checkout -b epic-6-lead-tracking`

#### Nice to Have
- 📊 Establish baseline metrics (current click counts, conversion rates)
- 🧪 Set up testing environment separate from production
- 📱 Test devices ready (mobile, tablet for responsive testing)
- 👥 Schedule demos after each story completion

---

## 🗓️ IMPLEMENTATION ROADMAP

### Timeline Overview (3-4 Weeks)

```
Week 1: Foundation
├─ Story 6.1: UTM Journey Tracking (5 days)
│  └─ Backend Developer + Database Administrator
│
Week 2: Material Management
├─ Story 6.2: Material Management Enhancement (5 days)
│  └─ Full-Stack Developer
│
Week 3: Admin Analytics
├─ Story 6.3: Super Admin Analytics Dashboard (6 days)
│  └─ Full-Stack Developer + Data Analyst
│
Week 4: Dashboards & Polish
├─ Story 6.4: Role Dashboard Enhancement (3 days)
│  └─ Frontend Developer
└─ Story 6.5: Analytics & Reporting (3 days)
   └─ Frontend Developer + QA
```

### Critical Path Dependencies

```
Story 6.1 (UTM Journey Tracking)
    ↓
    REQUIRED FOR ALL OTHER STORIES
    ↓
Story 6.2 (Material Management)
    ↓
    FEEDS DATA TO
    ↓
Stories 6.3 + 6.4 + 6.5 (Can run in parallel after 6.2)
```

**⚠️ WARNING**: Do NOT skip Story 6.1. All other stories depend on journey tracking foundation.

---

## 👥 DEVELOPER ASSIGNMENTS & RESPONSIBILITIES

### Story 6.1: Backend Developer + Database Administrator

**Primary Developer**: Backend specialist comfortable with Prisma, PostgreSQL, middleware
**Duration**: 5 days
**Complexity**: HIGH (foundation story)

#### Files to Create (12 new files)
```
/src/lib/services/utm-tracking.service.ts        (UTM parameter extraction)
/src/lib/services/journey-tracking.service.ts    (Stage tracking logic)
/src/lib/services/cookie-manager.service.ts      (30-day attribution)
/src/middleware/utm.middleware.ts                (Request interception)
/src/app/api/journey/track/route.ts              (Journey tracking API)
/src/app/api/journey/status/[clickId]/route.ts   (Status endpoint)
/prisma/migrations/20XX_journey_tracking.sql     (Database migration)
/__tests__/services/utm-tracking.test.ts
/__tests__/services/journey-tracking.test.ts
/__tests__/services/cookie-manager.test.ts
/__tests__/api/journey-track.test.ts
/__tests__/api/journey-status.test.ts
```

#### Files to Update (3 files)
```
/src/middleware.ts                                (Add UTM middleware)
/src/lib/services/link-tracking.service.ts        (Extend with journey)
/src/app/api/tax-intake/submit/route.ts          (Track intake complete)
```

#### Key Code Pattern to Follow
```typescript
// Journey tracking service pattern
export async function trackJourneyStage(params: {
  clickId: string
  stage: 'INTAKE_START' | 'INTAKE_COMPLETE' | 'RETURN_FILED'
  metadata?: Record<string, any>
}): Promise<LinkClick> {
  const now = new Date()

  return await prisma.linkClick.update({
    where: { id: params.clickId },
    data: {
      [`${params.stage.toLowerCase()}At`]: now,
      // Validate stage progression (can't skip stages)
      ...(await validateStageProgression(params.clickId, params.stage))
    }
  })
}
```

#### Database Changes
```prisma
model LinkClick {
  id                   String    @id @default(cuid())
  marketingLinkId      String
  clickedAt            DateTime  @default(now())
  ipAddress            String?
  userAgent            String?
  referrer             String?
  utmSource            String?
  utmMedium            String?
  utmCampaign          String?

  // NEW FIELDS (all nullable - additive only)
  intakeStartedAt      DateTime?
  intakeCompletedAt    DateTime?
  taxReturnCompletedAt DateTime?
  utmTerm              String?
  utmContent           String?

  marketingLink        MarketingLink @relation(fields: [marketingLinkId], references: [id])

  @@index([marketingLinkId])
  @@index([clickedAt])
  @@index([intakeStartedAt])      // NEW
  @@index([intakeCompletedAt])    // NEW
  @@index([taxReturnCompletedAt]) // NEW
}
```

#### Success Criteria (Gate to Story 6.2)
- [ ] UTM parameters captured in cookies (30-day expiry)
- [ ] Journey stages track in correct order (Click → Intake Start → Intake Complete → Return Filed)
- [ ] Cannot skip stages (validation enforced)
- [ ] API endpoints return journey status
- [ ] All tests passing (unit + integration)
- [ ] Database migration runs without errors
- [ ] Zero impact on existing click tracking

---

### Story 6.2: Full-Stack Developer

**Primary Developer**: Full-stack specialist comfortable with React, TypeScript, QR codes
**Duration**: 5 days
**Complexity**: MEDIUM
**Depends On**: Story 6.1 complete

#### Files to Create (8 new files)
```
/src/lib/services/qr-code.service.ts              (QR generation)
/src/lib/services/material-management.service.ts  (Material CRUD)
/src/components/modals/MaterialCreationModal.tsx  (Create UI)
/src/components/modals/MaterialEditModal.tsx      (Edit UI)
/src/components/QRCodePreview.tsx                 (Preview component)
/src/app/api/materials/route.ts                   (CRUD endpoints)
/src/app/api/materials/[id]/route.ts              (Single material)
/src/app/api/materials/[id]/qr/route.ts           (QR regeneration)
```

#### Files to Update (2 files)
```
/src/components/MarketingHub.tsx                  (Add material mgmt UI)
/src/app/dashboard/referrer/marketing/page.tsx    (Update marketing page)
```

#### Key Code Pattern to Follow
```typescript
// QR Code service pattern
export async function generateAndUploadQR(params: {
  url: string
  materialId: string
  format?: 'PNG' | 'SVG'
  size?: number
  brandColor?: string
}): Promise<string> {
  // 1. Generate QR code using qrcode package
  const qrCode = await QRCode.toDataURL(params.url, {
    width: params.size || 512,
    margin: 2,
    color: {
      dark: params.brandColor || '#000000',
      light: '#FFFFFF'
    }
  })

  // 2. Upload to R2/S3 (implement based on storage solution)
  const uploadedUrl = await uploadToStorage({
    data: qrCode,
    filename: `qr-${params.materialId}.${params.format.toLowerCase()}`,
    contentType: `image/${params.format.toLowerCase()}`
  })

  return uploadedUrl
}
```

#### Success Criteria (Gate to Stories 6.3/6.4/6.5)
- [ ] Create material with type (POSTER, FLYER, BUSINESS_CARD, LINK)
- [ ] QR code generates automatically on creation
- [ ] QR code downloads as PNG/SVG
- [ ] Edit material details (updates QR if URL changes)
- [ ] Delete material (soft delete recommended)
- [ ] Material list displays with QR preview
- [ ] All CRUD operations work from MarketingHub
- [ ] Materials associated with correct user/role

---

### Story 6.3: Full-Stack Developer + Data Analyst

**Primary Developer**: Full-stack with strong SQL/analytics background
**Duration**: 6 days
**Complexity**: HIGH (complex queries, performance optimization)
**Depends On**: Story 6.2 complete

#### Files to Create (10 new files)
```
/src/lib/services/admin-analytics.service.ts      (Top 15 queries)
/src/app/admin/analytics/page.tsx                 (Main dashboard)
/src/components/admin/Top15UsersTable.tsx         (User rankings)
/src/components/admin/Top15MaterialsTable.tsx     (Material rankings)
/src/components/admin/Top15LocationsTable.tsx     (Location rankings)
/src/components/admin/GeographicHeatMap.tsx       (Visual map)
/src/components/admin/AnalyticsFilters.tsx        (Date range filters)
/src/app/api/admin/analytics/top-users/route.ts
/src/app/api/admin/analytics/top-materials/route.ts
/src/app/api/admin/analytics/top-locations/route.ts
```

#### Files to Update (2 files)
```
/src/app/admin/layout.tsx                         (Add analytics nav)
/src/lib/permissions.ts                           (Add analytics permission)
```

#### Key Code Pattern to Follow
```typescript
// Top 15 query pattern with performance optimization
export async function getTop15Materials(params: {
  dateRange: { start: Date; end: Date }
  sortBy: 'clicks' | 'conversions' | 'conversion_rate'
  materialType?: MaterialType
}): Promise<MaterialPerformance[]> {
  // Use raw SQL for performance (complex aggregations)
  const results = await prisma.$queryRaw`
    SELECT
      ml.id,
      ml.name,
      ml.type,
      COUNT(DISTINCT lc.id) as total_clicks,
      COUNT(DISTINCT CASE WHEN lc.intakeCompletedAt IS NOT NULL THEN lc.id END) as conversions,
      ROUND(
        CAST(COUNT(DISTINCT CASE WHEN lc.intakeCompletedAt IS NOT NULL THEN lc.id END) AS DECIMAL) /
        NULLIF(COUNT(DISTINCT lc.id), 0) * 100,
        2
      ) as conversion_rate,
      u.name as created_by_name,
      u.role as created_by_role
    FROM "MarketingLink" ml
    LEFT JOIN "LinkClick" lc ON lc."marketingLinkId" = ml.id
    LEFT JOIN "User" u ON ml."createdById" = u.id
    WHERE lc."clickedAt" >= ${params.dateRange.start}
      AND lc."clickedAt" <= ${params.dateRange.end}
      ${params.materialType ? Prisma.sql`AND ml.type = ${params.materialType}` : Prisma.empty}
    GROUP BY ml.id, ml.name, ml.type, u.name, u.role
    ORDER BY ${Prisma.raw(params.sortBy)} DESC
    LIMIT 15
  `

  return results as MaterialPerformance[]
}
```

#### Performance Optimization Requirements
- [ ] Create database indexes for aggregation queries
- [ ] Implement query result caching (Redis recommended)
- [ ] Use React Query with 30-second stale time
- [ ] Lazy load chart data (load tables first, charts after)
- [ ] Paginate drill-down views (50 items per page)

#### Success Criteria
- [ ] Top 15 tables render in <2 seconds
- [ ] Date range filters work (Last 7/30/90 days, Custom)
- [ ] Click user → Navigate to user's detail view
- [ ] Click material → Navigate to material analytics
- [ ] Geographic heat map displays (if location data available)
- [ ] Export to CSV works for all tables
- [ ] Permission check: Only Super Admin can access

---

### Story 6.4: Frontend Developer

**Primary Developer**: Frontend specialist comfortable with React, charts, responsive design
**Duration**: 6 days
**Complexity**: MEDIUM (lots of UI components)
**Depends On**: Story 6.2 complete (can run parallel with 6.3)

#### Files to Create (15 new files)
```
/src/hooks/useMyTopMaterials.ts                   (React Query hook)
/src/hooks/useConversionFunnel.ts                 (React Query hook)
/src/hooks/useSourceBreakdown.ts                  (React Query hook)
/src/components/dashboards/MaterialsTable.tsx     (Reusable table)
/src/components/dashboards/ConversionFunnel.tsx   (Funnel chart)
/src/components/dashboards/SourceBreakdown.tsx    (Pie/bar chart)
/src/components/dashboards/MaterialPerformanceCard.tsx
/src/app/dashboard/referrer/analytics/page.tsx    (Referrer analytics)
/src/app/dashboard/affiliate/analytics/page.tsx   (Affiliate analytics)
/src/app/dashboard/tax-preparer/analytics/page.tsx
/src/app/api/my-materials/top/route.ts
/src/app/api/my-materials/funnel/route.ts
/src/app/api/my-materials/sources/route.ts
/__tests__/hooks/useMyTopMaterials.test.tsx
/__tests__/components/ConversionFunnel.test.tsx
```

#### Files to Update (3 files)
```
/src/app/dashboard/referrer/page.tsx              (Add analytics preview)
/src/app/dashboard/affiliate/page.tsx             (Add analytics preview)
/src/app/dashboard/tax-preparer/page.tsx          (Add analytics preview)
```

#### Key Code Pattern to Follow
```typescript
// React Query hook pattern
export function useMyTopMaterials(options?: {
  limit?: number
  sortBy?: 'clicks' | 'conversions' | 'conversion_rate'
  dateRange?: string
}) {
  return useQuery({
    queryKey: ['my-top-materials', options],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(options?.limit || 15),
        sortBy: options?.sortBy || 'conversions',
        dateRange: options?.dateRange || '30d'
      })

      const response = await fetch(`/api/my-materials/top?${params}`)
      if (!response.ok) throw new Error('Failed to fetch materials')

      return response.json() as Promise<MaterialPerformance[]>
    },
    staleTime: 30_000, // 30 seconds
    refetchOnWindowFocus: false
  })
}

// Usage in component
function MyAnalytics() {
  const { data, isLoading, error } = useMyTopMaterials({ limit: 15, sortBy: 'conversions' })

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage />

  return <MaterialsTable data={data} />
}
```

#### Responsive Design Requirements
- [ ] Desktop: 3-column layout (tables + charts side-by-side)
- [ ] Tablet: 2-column layout (stack some components)
- [ ] Mobile: Single column (stack all components)
- [ ] Charts: Use Recharts ResponsiveContainer
- [ ] Tables: Horizontal scroll on mobile
- [ ] Filters: Collapse into drawer on mobile

#### Success Criteria
- [ ] Referrer dashboard shows Top 5 materials preview
- [ ] Click "View All" → Navigate to /dashboard/referrer/analytics
- [ ] Analytics page shows Top 15 materials table
- [ ] Conversion funnel visualizes 4-stage journey
- [ ] Source breakdown shows clicks by material type
- [ ] All components responsive (test on 320px width)
- [ ] Same features for Affiliate and Tax Preparer roles

---

### Story 6.5: Frontend Developer + QA

**Primary Developer**: Frontend specialist + QA engineer
**Duration**: 3 days
**Complexity**: LOW (polish + utilities)
**Depends On**: Stories 6.3 and 6.4 complete

#### Files to Create (7 new files)
```
/src/lib/utils/export-csv.ts                      (CSV generation)
/src/lib/utils/export-pdf.ts                      (PDF generation)
/src/components/analytics/DropoffAnalysis.tsx     (Drop-off chart)
/src/components/analytics/MaterialComparison.tsx  (Comparison view)
/src/components/analytics/ExportButton.tsx        (Export dropdown)
/src/app/api/analytics/dropoff/route.ts
/src/app/api/analytics/compare/route.ts
```

#### Files to Update (5 files)
```
/src/app/admin/analytics/page.tsx                 (Add exports)
/src/app/dashboard/referrer/analytics/page.tsx    (Add exports)
/src/app/dashboard/affiliate/analytics/page.tsx   (Add exports)
/src/app/dashboard/tax-preparer/analytics/page.tsx (Add exports)
/src/components/dashboards/MaterialsTable.tsx     (Add compare checkbox)
```

#### Key Code Pattern to Follow
```typescript
// CSV export utility pattern
export function exportToCSV<T extends Record<string, any>>(params: {
  data: T[]
  filename: string
  columns: { key: keyof T; label: string }[]
}): void {
  // 1. Create CSV header
  const header = params.columns.map(col => col.label).join(',')

  // 2. Create CSV rows
  const rows = params.data.map(row =>
    params.columns.map(col => {
      const value = row[col.key]
      // Escape commas and quotes
      return typeof value === 'string' && value.includes(',')
        ? `"${value.replace(/"/g, '""')}"`
        : value
    }).join(',')
  )

  // 3. Combine and download
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${params.filename}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()

  URL.revokeObjectURL(url)
}

// Usage
<Button onClick={() => exportToCSV({
  data: materials,
  filename: 'top-15-materials',
  columns: [
    { key: 'name', label: 'Material Name' },
    { key: 'clicks', label: 'Total Clicks' },
    { key: 'conversions', label: 'Conversions' },
    { key: 'conversion_rate', label: 'Conversion Rate' }
  ]
})}>
  Export CSV
</Button>
```

#### QA Testing Checklist
- [ ] CSV export: Downloads file with correct data
- [ ] PDF export: Renders charts and tables correctly
- [ ] Drop-off analysis: Shows percentage at each stage
- [ ] Material comparison: Compares up to 5 materials
- [ ] Mobile export: Works on touch devices
- [ ] Large datasets: Handles 1000+ rows without freezing
- [ ] Error states: Graceful handling of export failures

#### Success Criteria
- [ ] Export CSV button on all analytics pages
- [ ] Export PDF includes charts (not just tables)
- [ ] Drop-off analysis highlights biggest drop (red)
- [ ] Material comparison shows side-by-side metrics
- [ ] All exports include timestamp in filename
- [ ] No performance degradation with exports

---

## 🔒 INTEGRATION VERIFICATION GATES

Each story must pass these gates before proceeding to the next:

### After Story 6.1 (UTM Journey Tracking)

**Backend Verification**
```bash
# 1. Database migration successful
npx prisma migrate deploy
npx prisma db pull  # Verify schema updated

# 2. API endpoints responding
curl http://localhost:3005/api/journey/track \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"clickId":"test123","stage":"INTAKE_START"}'

# Expected: 200 OK with updated LinkClick object

# 3. Cookie management working
# Visit: http://localhost:3005?utm_source=test&utm_medium=qr
# Open DevTools → Application → Cookies
# Verify: tgp_attribution cookie exists with 30-day expiry
```

**Data Verification**
```sql
-- Verify journey tracking in database
SELECT
  id,
  clickedAt,
  intakeStartedAt,
  intakeCompletedAt,
  taxReturnCompletedAt,
  utmSource,
  utmMedium
FROM "LinkClick"
WHERE intakeStartedAt IS NOT NULL
LIMIT 5;

-- Should return rows with progressive timestamps
```

**✅ Gate Passed**: All tests passing, API functional, cookies work → Proceed to Story 6.2

---

### After Story 6.2 (Material Management)

**Frontend Verification**
```bash
# 1. Navigate to Marketing Hub
# http://localhost:3005/dashboard/referrer/marketing

# 2. Create test material
- Click "Create Material"
- Name: "Test Poster"
- Type: POSTER
- Click "Generate QR Code"

# Expected: QR code displays, material saves

# 3. Download QR code
- Click "Download PNG"
- Verify: PNG file downloads with embedded URL

# 4. Edit material
- Change name to "Updated Poster"
- Expected: QR code regenerates with new URL
```

**QR Code Verification**
```bash
# Scan QR code with phone or use online QR decoder
# Expected: URL includes correct tracking parameters
# Format: https://taxgeniuspro.tax/start-filing?ref=abc123&utm_source=referrer&utm_medium=qr_code
```

**✅ Gate Passed**: Materials CRUD works, QR codes generate/download → Proceed to Stories 6.3/6.4/6.5

---

### After Story 6.3 (Super Admin Analytics)

**Admin Dashboard Verification**
```bash
# 1. Login as Super Admin
# Navigate to: http://localhost:3005/admin/analytics

# 2. Verify Top 15 tables render
- Top 15 Users (by conversions)
- Top 15 Materials (by conversion rate)
- Top 15 Locations (by clicks)

# Expected: All tables load in <2 seconds

# 3. Test date range filter
- Select "Last 7 Days"
- Expected: Tables update with filtered data

# 4. Test drill-down navigation
- Click on a user in Top 15 Users
- Expected: Navigate to user detail view with their materials
```

**Performance Verification**
```bash
# Check database query performance
EXPLAIN ANALYZE SELECT
  ml.id,
  COUNT(DISTINCT lc.id) as clicks,
  COUNT(DISTINCT CASE WHEN lc.intakeCompletedAt IS NOT NULL THEN lc.id END) as conversions
FROM "MarketingLink" ml
LEFT JOIN "LinkClick" lc ON lc."marketingLinkId" = ml.id
WHERE lc."clickedAt" >= NOW() - INTERVAL '30 days'
GROUP BY ml.id
ORDER BY conversions DESC
LIMIT 15;

# Expected: Query time < 500ms
# If slower: Add indexes per Story 6.3 spec
```

**✅ Gate Passed**: Admin analytics functional, performance acceptable → Story 6.3 complete

---

### After Story 6.4 (Role Dashboards)

**Multi-Role Verification**
```bash
# Test all 3 roles (Referrer, Affiliate, Tax Preparer)

# 1. Referrer Dashboard
- Navigate to: /dashboard/referrer
- Expected: See "Top 5 Materials" preview card
- Click "View All Analytics"
- Expected: Navigate to /dashboard/referrer/analytics
- Verify: Top 15 materials table, conversion funnel, source breakdown

# 2. Affiliate Dashboard
- Navigate to: /dashboard/affiliate
- Repeat verification steps above

# 3. Tax Preparer Dashboard
- Navigate to: /dashboard/tax-preparer
- Repeat verification steps above
```

**Responsive Design Verification**
```bash
# Use Chrome DevTools → Device Toolbar

# Desktop (1920x1080)
- Expected: 3-column layout, tables and charts side-by-side

# Tablet (768x1024)
- Expected: 2-column layout, some stacking

# Mobile (375x667)
- Expected: Single column, horizontal scroll on tables
- Charts: Full width, responsive height

# Test interactions
- Filters collapse into drawer on mobile
- Tables scroll horizontally without breaking layout
```

**✅ Gate Passed**: All role dashboards functional, responsive design works → Story 6.4 complete

---

### After Story 6.5 (Analytics & Reporting)

**Export Verification**
```bash
# 1. Test CSV Export
- Navigate to any analytics page
- Click "Export CSV"
- Expected: CSV file downloads with current date in filename
- Open CSV: Verify data matches table

# 2. Test PDF Export
- Click "Export PDF"
- Expected: PDF downloads with charts rendered
- Open PDF: Verify charts are images (not broken)

# 3. Test Drop-off Analysis
- Navigate to analytics page
- View conversion funnel
- Expected: Shows percentage drop at each stage
- Expected: Biggest drop highlighted in red

# 4. Test Material Comparison
- Select 3 materials using checkboxes
- Click "Compare Selected"
- Expected: Side-by-side comparison view
- Verify: Metrics display for all 3 materials
```

**Edge Case Testing**
```bash
# Large dataset export
- Create scenario with 1000+ materials
- Export to CSV
- Expected: File downloads without browser freeze (<5 seconds)

# Empty state
- Filter to date range with no data
- Expected: "No data to export" message (not error)

# Mobile export
- Test CSV/PDF export on mobile device
- Expected: Downloads work, files are accessible
```

**✅ Gate Passed**: All exports functional, no performance issues → Epic 6 COMPLETE

---

## 🧪 TESTING STRATEGY

### Unit Tests (Required for each service/component)

**Location**: `__tests__/` directories next to source files

**Coverage Requirements**:
- Services: 80% code coverage minimum
- Components: 70% code coverage minimum
- API routes: 90% code coverage minimum

**Key Test Files**:
```bash
# Story 6.1
__tests__/services/utm-tracking.test.ts
__tests__/services/journey-tracking.test.ts
__tests__/api/journey-track.test.ts

# Story 6.2
__tests__/services/qr-code.test.ts
__tests__/components/MaterialCreationModal.test.tsx

# Story 6.3
__tests__/services/admin-analytics.test.ts
__tests__/components/admin/Top15UsersTable.test.tsx

# Story 6.4
__tests__/hooks/useMyTopMaterials.test.tsx
__tests__/components/ConversionFunnel.test.tsx

# Story 6.5
__tests__/utils/export-csv.test.ts
__tests__/utils/export-pdf.test.ts
```

**Run Tests**:
```bash
npm test                    # Run all tests
npm test -- --coverage      # Run with coverage report
npm test utm-tracking       # Run specific test file
```

---

### Integration Tests (End-to-End User Flows)

**Framework**: Playwright or Cypress (choose based on existing setup)

**Critical Flows to Test**:

#### Flow 1: Referrer Creates Material and Tracks Journey
```typescript
test('Referrer creates QR code material and tracks conversions', async ({ page }) => {
  // 1. Login as Referrer
  await page.goto('/auth/login')
  await loginAsReferrer(page)

  // 2. Navigate to Marketing Hub
  await page.goto('/dashboard/referrer/marketing')

  // 3. Create material
  await page.click('button:has-text("Create Material")')
  await page.fill('input[name="name"]', 'E2E Test Poster')
  await page.selectOption('select[name="type"]', 'POSTER')
  await page.click('button:has-text("Generate QR Code")')

  // 4. Verify QR code displays
  await expect(page.locator('img[alt="QR Code"]')).toBeVisible()

  // 5. Get tracking URL
  const trackingUrl = await page.locator('input[readonly]').inputValue()

  // 6. Simulate customer journey (in new context)
  const customerPage = await context.newPage()

  // Stage 1: Click
  await customerPage.goto(trackingUrl)
  await expect(customerPage).toHaveURL(/utm_source=referrer/)

  // Stage 2: Intake Start
  await customerPage.goto('/start-filing')
  await customerPage.fill('input[name="firstName"]', 'Test')
  await customerPage.fill('input[name="lastName"]', 'Customer')

  // Stage 3: Intake Complete
  await customerPage.click('button:has-text("Submit")')
  await expect(customerPage).toHaveURL('/dashboard/client')

  // 7. Verify analytics update
  await page.goto('/dashboard/referrer/analytics')
  await expect(page.locator('text=E2E Test Poster')).toBeVisible()
  await expect(page.locator('text=1 conversion')).toBeVisible()
})
```

#### Flow 2: Admin Views Top 15 Rankings
```typescript
test('Admin views Top 15 rankings with drill-down', async ({ page }) => {
  // 1. Login as Super Admin
  await page.goto('/auth/login')
  await loginAsSuperAdmin(page)

  // 2. Navigate to analytics
  await page.goto('/admin/analytics')

  // 3. Verify all Top 15 tables render
  await expect(page.locator('h2:has-text("Top 15 Users")')).toBeVisible()
  await expect(page.locator('h2:has-text("Top 15 Materials")')).toBeVisible()
  await expect(page.locator('h2:has-text("Top 15 Locations")')).toBeVisible()

  // 4. Test date range filter
  await page.selectOption('select[name="dateRange"]', '7d')
  await page.waitForLoadState('networkidle')

  // 5. Test drill-down
  await page.click('table tr:nth-child(1) td:first-child') // Click first user
  await expect(page).toHaveURL(/\/admin\/analytics\/users\//)

  // 6. Verify user detail view
  await expect(page.locator('h1')).toContainText('User Analytics')
  await expect(page.locator('text=Materials Created')).toBeVisible()
})
```

#### Flow 3: Export Analytics Data
```typescript
test('User exports analytics to CSV and PDF', async ({ page }) => {
  // 1. Login and navigate
  await page.goto('/dashboard/referrer/analytics')

  // 2. Test CSV export
  const [download1] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Export CSV")')
  ])

  const csvPath = await download1.path()
  const csvContent = await fs.readFile(csvPath, 'utf-8')
  expect(csvContent).toContain('Material Name,Total Clicks,Conversions')

  // 3. Test PDF export
  const [download2] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Export PDF")')
  ])

  expect(download2.suggestedFilename()).toMatch(/analytics-.*\.pdf/)
})
```

**Run Integration Tests**:
```bash
npx playwright test              # Run all E2E tests
npx playwright test --headed     # Run with browser visible
npx playwright test --debug      # Run in debug mode
```

---

### Manual QA Test Scripts

**Location**: `/docs/qa/epic-6-manual-test-scripts.md` (create this file)

**Test Scenarios**:

#### Scenario 1: Multi-Device QR Code Scanning
1. Create QR code material in desktop browser
2. Download QR code PNG
3. Print or display QR code on screen
4. Scan with mobile phone camera
5. Verify: Mobile browser opens tracking URL with UTM parameters
6. Complete intake on mobile
7. Verify: Desktop dashboard shows conversion

#### Scenario 2: Permission Boundaries
1. Login as Referrer
2. Attempt to access `/admin/analytics`
3. Expected: 403 Forbidden or redirect
4. Login as Super Admin
5. Attempt to access `/admin/analytics`
6. Expected: Page loads successfully

#### Scenario 3: Data Consistency Across Roles
1. Super Admin creates material for Referrer A
2. Referrer A logs in and views analytics
3. Verify: Material appears in Referrer A's dashboard
4. Referrer B logs in and views analytics
5. Verify: Material does NOT appear in Referrer B's dashboard

#### Scenario 4: Performance Under Load
1. Create 100+ materials with click data
2. Navigate to analytics dashboard
3. Measure: Time to load Top 15 tables
4. Expected: <2 seconds on average connection
5. Test: Change date range filter
6. Expected: Update in <1 second

---

## 🚀 DEPLOYMENT PLAN

### Pre-Deployment Checklist

#### Code Quality
- [ ] All unit tests passing (`npm test`)
- [ ] All E2E tests passing (`npx playwright test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Code reviewed by at least 2 developers

#### Database Readiness
- [ ] Backup production database (`pg_dump taxgeniuspro > backup.sql`)
- [ ] Test migrations on staging environment
- [ ] Verify rollback script works
- [ ] Document new indexes and their impact

#### Environment Configuration
- [ ] Feature flags configured (if using)
- [ ] QR code storage configured (R2/S3 credentials)
- [ ] Analytics cache configured (Redis recommended)
- [ ] Rate limiting set for export endpoints

#### Documentation
- [ ] Update API documentation
- [ ] Create user guides for new features
- [ ] Document new permissions in admin panel
- [ ] Update system architecture diagrams

---

### Deployment Steps (Production)

#### Step 1: Database Migration (15 minutes)

```bash
# 1. SSH into production server
ssh root@taxgeniuspro.tax

# 2. Navigate to app directory
cd /root/websites/taxgeniuspro

# 3. Backup database FIRST
pg_dump -U postgres taxgeniuspro > backup_$(date +%Y%m%d_%H%M%S).sql

# 4. Pull latest code
git fetch origin
git checkout epic-6-lead-tracking
git pull origin epic-6-lead-tracking

# 5. Install dependencies
npm install

# 6. Run database migrations
npx prisma migrate deploy

# 7. Generate Prisma client
npx prisma generate

# 8. Verify migration
psql -U postgres taxgeniuspro -c "\d \"LinkClick\""
# Expected: See new columns (intakeStartedAt, intakeCompletedAt, etc.)
```

#### Step 2: Application Deployment (10 minutes)

```bash
# 1. Build application
npm run build

# 2. Test build locally
NODE_ENV=production npm start
# Verify: App starts without errors

# 3. Stop production server
pm2 stop taxgeniuspro

# 4. Start with new code
pm2 start npm --name taxgeniuspro -- start

# 5. Verify server health
pm2 status
pm2 logs taxgeniuspro --lines 50

# 6. Test critical endpoints
curl http://localhost:3005/api/health
curl http://localhost:3005/api/journey/track -X POST -H "Content-Type: application/json" -d '{"test":true}'
```

#### Step 3: Smoke Testing (10 minutes)

```bash
# Open browser and test:

# 1. Login as Super Admin
https://taxgeniuspro.tax/auth/login

# 2. Navigate to analytics
https://taxgeniuspro.tax/admin/analytics
# Expected: Page loads, Top 15 tables display

# 3. Login as Referrer
# Navigate to marketing hub
https://taxgeniuspro.tax/dashboard/referrer/marketing
# Expected: See material management UI

# 4. Create test material
- Click "Create Material"
- Generate QR code
- Verify download works

# 5. Test tracking flow
- Scan QR code with phone
- Start intake form
- Verify cookie set (DevTools)

# 6. Check error logs
pm2 logs taxgeniuspro --err --lines 100
# Expected: No critical errors
```

---

### Rollback Plan (If Issues Occur)

#### Quick Rollback (5 minutes)

```bash
# 1. Stop current server
pm2 stop taxgeniuspro

# 2. Checkout previous stable commit
git checkout main  # Or specific commit hash

# 3. Rebuild and restart
npm run build
pm2 restart taxgeniuspro

# 4. Verify rollback
curl http://localhost:3005/api/health
```

#### Database Rollback (10 minutes)

```bash
# Only if database migration caused issues

# 1. Stop application
pm2 stop taxgeniuspro

# 2. Restore database backup
psql -U postgres -d taxgeniuspro < backup_YYYYMMDD_HHMMSS.sql

# 3. Restart application on previous version
git checkout main
npm run build
pm2 restart taxgeniuspro
```

#### Feature Flag Disable (Instant)

```bash
# If using feature flags (recommended)

# Add to .env.local:
EPIC_6_ENABLED=false

# Restart server
pm2 restart taxgeniuspro

# This disables Epic 6 features without code changes
```

---

### Post-Deployment Monitoring (First 48 Hours)

#### Metrics to Watch

```bash
# 1. Server performance
pm2 monit
# Watch: CPU usage, memory usage

# 2. Error logs
tail -f /root/.pm2/logs/taxgeniuspro-error.log
# Watch: Any new errors or warnings

# 3. Database performance
psql -U postgres taxgeniuspro -c "
  SELECT
    query,
    mean_exec_time,
    calls
  FROM pg_stat_statements
  WHERE query LIKE '%LinkClick%'
  ORDER BY mean_exec_time DESC
  LIMIT 10;
"
# Watch: Query times (should be <500ms)

# 4. User activity
psql -U postgres taxgeniuspro -c "
  SELECT COUNT(*) as new_materials_created
  FROM \"MarketingLink\"
  WHERE \"createdAt\" > NOW() - INTERVAL '1 day';
"
# Watch: User adoption of new features
```

#### Alert Thresholds

- **Critical**: Server down, database errors, >500 errors/hour
- **Warning**: Response time >2 seconds, CPU >80%, memory >90%
- **Info**: New features usage below expected (track adoption)

---

## 📊 SUCCESS METRICS

### Business Metrics (Track Weekly)

#### Adoption Metrics
- **Materials Created**: Target 50+ new materials in first week
- **QR Codes Generated**: Target 100+ QR codes downloaded
- **Analytics Page Views**: Target 500+ views across all roles
- **Export Usage**: Target 20+ CSV/PDF exports per week

#### Engagement Metrics
- **Dashboard Return Rate**: Users check analytics 3+ times/week
- **Material Iteration**: Users edit/optimize materials based on data
- **Admin Usage**: Super Admin uses Top 15 rankings daily

### Technical Metrics (Monitor Daily)

#### Performance
- **Page Load Time**: <2 seconds for all analytics pages
- **API Response Time**: <500ms for Top 15 queries
- **Database Query Time**: <200ms for aggregation queries
- **Export Generation**: <5 seconds for CSV/PDF (up to 1000 rows)

#### Reliability
- **Uptime**: 99.9% availability
- **Error Rate**: <0.1% of requests
- **Data Accuracy**: 100% (no missing/incorrect journey stages)

### User Satisfaction (Survey After 1 Month)

**Questions to Ask**:
1. "How useful are the new analytics features?" (1-5 scale)
2. "Do you check your material performance more often now?" (Yes/No)
3. "Has this helped you optimize your marketing?" (Yes/No)
4. "What additional analytics would you like to see?" (Open-ended)

**Success Threshold**: 80% of users rate usefulness as 4 or 5

---

## 🆘 SUPPORT RESOURCES

### Documentation

**Epic 6 Documentation** (All files in `/docs/`)
- Master PRD: `/docs/prd/epic-6-lead-tracking-dashboard.md`
- Story Guides: `/docs/stories/6.1.*.md` through `/docs/stories/6.5.*.md`
- Integration Map: `/docs/EPIC-6-INTEGRATION-NAVIGATION.md`
- Verification: `/docs/EPIC-6-READY-TO-IMPLEMENT.md`

**System Documentation**
- Database Schema: Run `npx prisma studio` (visual editor)
- API Documentation: `/docs/api/` (if exists)
- Component Library: `/src/components/README.md` (if exists)

### Code Patterns

**Example Repositories** (for reference)
- Journey Tracking: Similar to Mixpanel/Segment event tracking
- QR Code Generation: Reference `qrcode` npm package docs
- Top 15 Queries: SQL aggregation patterns with window functions
- React Query Hooks: Reference TanStack Query documentation

### External Resources

**Official Documentation**
- Next.js 14: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Clerk Auth: https://clerk.com/docs
- React Query: https://tanstack.com/query/latest/docs
- QR Code Library: https://www.npmjs.com/package/qrcode

**Community Support**
- Next.js Discord: https://nextjs.org/discord
- Prisma Slack: https://slack.prisma.io
- Stack Overflow: Tag questions with `nextjs`, `prisma`, `react-query`

### Internal Contacts

**Development Team** (Assign based on your team)
- Backend Lead: [Name] - Database, APIs, services
- Frontend Lead: [Name] - UI components, dashboards
- DevOps Lead: [Name] - Deployment, monitoring
- QA Lead: [Name] - Testing, verification

**Business Stakeholders**
- Product Owner: [Name] - Feature prioritization, requirements
- Marketing Lead: [Name] - User feedback, adoption metrics
- Super Admin: [Name] - Analytics usage, business insights

### Escalation Process

**Level 1**: Developer encounters issue
- Check story documentation for solution
- Review integration verification gates
- Search existing code for similar patterns

**Level 2**: Issue not resolved in 2 hours
- Post in team Slack channel with:
  - Story number (e.g., "Story 6.2 issue")
  - Error message/screenshot
  - What you've tried
  - Relevant code snippet

**Level 3**: Blocker (work cannot continue)
- Escalate to Backend/Frontend Lead
- Schedule sync call within 4 hours
- Document blocker in issue tracker

**Level 4**: Critical production issue
- Immediately notify DevOps Lead
- Consider rollback (see Rollback Plan above)
- All hands on deck until resolved

---

## 🎯 FINAL CHECKLIST BEFORE STARTING

### Team Readiness
- [ ] All developers assigned to stories
- [ ] Developers have read their story documentation
- [ ] Team understands dependency order (6.1 → 6.2 → 6.3/6.4/6.5)
- [ ] Kick-off meeting scheduled (1 hour)

### Environment Readiness
- [ ] Development environment set up (all developers)
- [ ] Staging environment available for testing
- [ ] Production backup plan documented
- [ ] Feature branch created: `epic-6-lead-tracking`

### Technical Readiness
- [ ] Database backup created
- [ ] All dependencies verified installed
- [ ] Git status clean (commit or stash 26 modified files)
- [ ] Prisma schema reviewed by backend team

### Communication Readiness
- [ ] Daily standup scheduled (15 minutes)
- [ ] Demo schedule set (after each story)
- [ ] Slack channel created: `#epic-6-lead-tracking`
- [ ] Stakeholders informed of timeline

---

## 📝 NOTES FROM BMAD AGENT

### Context from Specification Phase

This Epic 6 specification was created using the BMAD (Brownfield Methodology for Agile Development) framework. Key decisions made during planning:

**Why Epic vs Single Story?**
- Original spec was comprehensive (15+ database changes, 4-5 distinct features)
- Required architectural planning (UTM persistence, 30-day attribution)
- Multiple user roles with different dashboard needs
- Decision: Full epic with 5 coordinated stories

**Why This Story Order?**
- Story 6.1 (UTM Journey Tracking) is FOUNDATION - cannot skip
- Story 6.2 (Material Management) depends on 6.1 journey data
- Stories 6.3/6.4/6.5 can run parallel after 6.2 (optimize for speed)

**Why Brownfield (Not Greenfield)?**
- Existing system is stable and production-ready
- Risk mitigation: Extend, don't replace
- All database changes are additive (nullable fields)
- Zero breaking changes guarantee

**Integration Concerns Addressed**
- User emphasized: "everything has to make navagation sense"
- Created comprehensive integration document (EPIC-6-INTEGRATION-NAVIGATION.md)
- All 55 files mapped (40 new, 15 updated)
- Navigation flows documented for all 5 roles
- Mobile responsive design specified

### Known Considerations

**QR Code Storage**
- Story 6.2 spec mentions "R2/S3 storage"
- **Action Required**: Confirm storage solution with DevOps
- Options: AWS S3, Cloudflare R2, or local storage (/public/qr-codes/)

**Performance Optimization**
- Top 15 queries can be slow with large datasets
- **Recommendation**: Implement caching (Redis) after Story 6.3
- Monitor query times during initial rollout

**Permission System**
- Epic 6 adds 6 new permissions
- **Verify**: Existing permission system can handle (likely yes)
- File: `/src/lib/permissions.ts`

**Mobile Experience**
- Responsive design specified in Story 6.4
- **Priority**: Test on real devices (not just DevTools)
- Critical: QR code scanning flow on mobile

### Production Status (As of 2025-10-13)

**Current State**:
- taxgeniuspro.tax running on port 3005
- 26 modified files in git (uncommitted)
- Epic 4 (e-commerce store) complete
- All Epic 6 dependencies installed

**Recommendation**:
1. Commit or stash 26 modified files before starting Epic 6
2. Create clean feature branch: `git checkout -b epic-6-lead-tracking`
3. Start Story 6.1 immediately (foundation is critical)

---

## 🚀 READY TO BEGIN

This handoff document represents the complete specification for Epic 6: Lead Tracking Dashboard Enhancement. All planning, integration analysis, and verification checklists are complete.

**Next Step**: Kick-off meeting with development team to:
1. Review this handoff document (30 minutes)
2. Assign stories to developers (15 minutes)
3. Answer questions (15 minutes)
4. Create tasks in project management tool (30 minutes)

**Timeline**: 3-4 weeks (25 business days) from kick-off to production deployment

**Confidence Level**: HIGH
- All 55 files planned
- Zero breaking changes verified
- Rollback plan documented
- Dependencies installed
- Team has clear roadmap

**Let's ship this! 🎉**

---

**Document Prepared By**: BMAD Brownfield Epic Planning Agent
**Date**: 2025-10-13
**Version**: 1.0 - Ready for Implementation
**Questions?**: Refer to Support Resources section above