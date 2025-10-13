# Epic 6: Complete Integration & Navigation Blueprint

**Document Type:** Ultra-Deep Integration Analysis
**Purpose:** Ensure perfect integration and navigation flow across all Epic 6 stories
**Status:** Master Reference Document

---

## 🎯 **Integration Philosophy**

This epic follows a **brownfield enhancement** approach:
- ✅ **EXTEND** existing navigation (don't replace)
- ✅ **ADD** new menu items and pages
- ✅ **INTEGRATE** with existing routing and permissions
- ✅ **PRESERVE** all current functionality

---

## 📐 **Current Navigation Structure (As-Is)**

### Existing Sidebar Navigation (by Role)

```typescript
// From src/components/DashboardSidebar.tsx

SUPER_ADMIN / ADMIN:
├─ Dashboard (/dashboard/admin)
├─ User Management (/admin/users)
├─ Payouts (/admin/payouts)
├─ Content Generator (/admin/content-generator)
├─ Database (/admin/database)
├─ Analytics (/admin/analytics) ← ENHANCE with Top 15
└─ Settings (/admin/settings)

TAX_PREPARER:
├─ Dashboard (/dashboard/tax-preparer)
├─ Client List (/dashboard/tax-preparer/clients)
├─ Documents (/dashboard/tax-preparer/documents)
├─ Store (/store)
├─ Academy (/app/academy)
├─ Earnings (/dashboard/tax-preparer/earnings)
└─ Settings (/dashboard/tax-preparer/settings)

AFFILIATE:
├─ Dashboard (/dashboard/affiliate)
├─ Leads (/dashboard/affiliate/leads)
├─ Marketing Materials (/dashboard/affiliate/marketing) ← ENHANCE
├─ Earnings (/dashboard/affiliate/earnings)
└─ Settings (/dashboard/affiliate/settings)

REFERRER:
├─ Dashboard (/dashboard/referrer) ← ENHANCE with Top 15
├─ Referrals (/dashboard/referrer/referrals)
├─ Contest (/dashboard/referrer/contest)
├─ Marketing Tools (/dashboard/referrer/marketing) ← ENHANCE
├─ Earnings (/dashboard/referrer/earnings)
└─ Settings (/dashboard/referrer/settings)

CLIENT:
├─ Dashboard (/dashboard/client)
├─ Upload Documents (/upload-documents)
├─ My Returns (/dashboard/client/returns)
├─ Messages (/dashboard/client/messages)
└─ Settings (/dashboard/client/settings)
```

---

## 🆕 **Enhanced Navigation Structure (To-Be)**

### NEW Routes to Add

```typescript
// NO new sidebar items needed!
// All enhancements happen within existing pages via TABS

// Enhanced existing pages:
/dashboard/referrer              → Add "My Materials" tab (Story 6.4)
/dashboard/referrer/marketing    → Add material CRUD UI (Story 6.2)
/dashboard/affiliate             → Add "Campaigns" tab (Story 6.4)
/dashboard/affiliate/marketing   → Add material CRUD UI (Story 6.2)
/dashboard/tax-preparer          → Add "Client Sources" tab (Story 6.4)
/dashboard/admin/analytics       → Complete rebuild with Top 15 (Story 6.3)

// NEW dedicated pages (not in sidebar):
/dashboard/materials/[id]        → Material detail/edit page
/dashboard/materials/create      → Material creation flow (alternative to modal)
/dashboard/analytics/compare     → Material comparison tool
/dashboard/analytics/export      → Export confirmation page

// NEW API routes (backend only):
/api/tracking/journey-stage      → Journey tracking
/api/materials/*                 → Material CRUD
/api/analytics/*                 → Advanced analytics
/api/admin/analytics/*           → Admin-specific analytics
```

---

## 🔀 **Complete User Journey Flows**

### 1. REFERRER: Create Material & Track Performance

**Current State:** Placeholder marketing hub
**Enhanced Flow:**

```
Login
  ↓
Dashboard (/dashboard/referrer)
  ├─ [Overview Tab] - See Top 5 materials preview
  │    ├─ Click "View All Materials" button
  │    └─ → Opens "My Materials" tab (same page)
  │
  ├─ [My Materials Tab] ← NEW (Story 6.4)
  │    ├─ MaterialsTable component (Top 15)
  │    ├─ Click "Create Material" button
  │    │    ├─ Option A: Modal opens (MaterialCreationModal)
  │    │    └─ Option B: Navigate to /dashboard/materials/create
  │    ├─ Fill form (type, campaign, location)
  │    ├─ Click "Generate"
  │    └─ Material created + QR code generated
  │
  ├─ [Analytics Tab] ← ENHANCED (Story 6.4)
  │    ├─ ConversionFunnel component
  │    ├─ SourceBreakdown component
  │    ├─ PerformanceTrends component
  │    └─ Click material → Drill into /dashboard/materials/[id]
  │
  └─ Navigate to Marketing Tools (/dashboard/referrer/marketing)
       ├─ Material library (real data from DB)
       ├─ Click material → View details
       ├─ Click "Edit" → MaterialEditModal or /dashboard/materials/[id]
       ├─ Click "Download QR" → Download PNG/SVG/PDF
       └─ Click "Export" → CSV/PDF export

Material Detail Page (/dashboard/materials/[id])
  ├─ Material info card
  ├─ Performance metrics
  ├─ Conversion funnel (specific to this material)
  ├─ Geographic breakdown
  ├─ Edit button → Edit modal
  ├─ Delete button → Confirmation modal
  └─ Back to Materials list
```

**Navigation Components Needed:**
- ✅ Tab navigation within dashboard (already exists via Tabs component)
- 🆕 Breadcrumb navigation: Dashboard > My Materials > [Material Name]
- 🆕 Material detail page route and component
- 🆕 Material creation modal (or dedicated page)
- 🆕 Material edit modal

---

### 2. AFFILIATE: Campaign Management & Earnings

**Enhanced Flow:**

```
Login
  ↓
Dashboard (/dashboard/affiliate)
  ├─ [Overview Tab] - Campaign performance cards
  │
  ├─ [Campaigns Tab] ← NEW (Story 6.4)
  │    ├─ Top 15 campaigns table
  │    ├─ Campaign metrics (clicks, conversions, earnings)
  │    ├─ Filter by status (Active/Paused)
  │    └─ Click campaign → /dashboard/materials/[id]
  │
  ├─ [Analytics Tab] ← ENHANCED
  │    ├─ Material comparison tool
  │    ├─ ROI analysis
  │    ├─ Best performing channels
  │    └─ Export button
  │
  └─ Navigate to Marketing Materials (/dashboard/affiliate/marketing)
       ├─ Material library
       ├─ Create new campaign
       └─ Download marketing assets

Earnings Page (/dashboard/affiliate/earnings)
  ├─ Financial summary
  ├─ Earnings by material (breakdown)
  ├─ Payment history table
  ├─ Payout request button
  └─ Export financial report (PDF)
```

---

### 3. TAX PREPARER: Client Source Tracking

**Enhanced Flow:**

```
Login
  ↓
Dashboard (/dashboard/tax-preparer)
  ├─ [Overview Tab]
  │
  ├─ [Client Sources Tab] ← NEW (Story 6.4)
  │    ├─ Source breakdown chart
  │    │    ├─ My own materials
  │    │    ├─ Assigned referrers
  │    │    ├─ Direct website
  │    │    └─ Other sources
  │    ├─ Top 10 my materials (subset)
  │    └─ Referrer partnership performance
  │
  └─ [Materials Tab] ← NEW (if preparers create materials)
       └─ Similar to referrer material management

Client List (/dashboard/tax-preparer/clients)
  ├─ Client table with source column ← ENHANCED
  ├─ Filter by source
  ├─ Click client → Client detail
  └─ Client detail shows:
       ├─ How they found us (attribution)
       ├─ Original marketing material
       └─ Referrer credit (if applicable)
```

---

### 4. ADMIN: Top 15 Analytics & Drill-Downs

**Enhanced Flow:**

```
Login
  ↓
Dashboard (/dashboard/admin)
  ├─ Quick overview cards
  └─ Link to "View Full Analytics" → /admin/analytics

Admin Analytics (/admin/analytics) ← COMPLETE REBUILD (Story 6.3)
  │
  ├─ [Overview Tab] - Performance overview cards
  │    ├─ Total clicks (today, week, month, all time)
  │    ├─ Total conversions
  │    ├─ Overall conversion rate
  │    ├─ Total commissions owed/paid
  │    ├─ Active users breakdown
  │    └─ Date range filter (applies to all tabs)
  │
  ├─ [Top Users Tab]
  │    ├─ Top 15 Tax Preparers card
  │    ├─ Top 15 Affiliates card
  │    ├─ Top 15 Referrers card
  │    ├─ Each entry:
  │    │    ├─ Rank (#1, #2, #3 with badges)
  │    │    ├─ User name (clickable)
  │    │    ├─ Metrics (returns filed, earnings)
  │    │    └─ Click → Drill into user's dashboard
  │    └─ "View Details" → Opens user's actual dashboard in admin view
  │
  ├─ [Top Materials Tab]
  │    ├─ Top 15 Materials Overall card
  │    ├─ Top 15 Material Types card
  │    ├─ Each entry:
  │    │    ├─ Material name (clickable)
  │    │    ├─ Creator name
  │    │    ├─ Performance metrics
  │    │    └─ Click → /dashboard/materials/[id]?admin=true
  │    └─ Material comparison tool
  │         ├─ Select 2-10 materials
  │         ├─ Click "Compare"
  │         └─ Shows comparison chart + table
  │
  ├─ [Geographic Tab]
  │    ├─ Geographic heat map component
  │    ├─ Top 15 Locations table
  │    │    ├─ City, State
  │    │    ├─ Total clicks
  │    │    ├─ Conversions
  │    │    └─ Conversion rate
  │    └─ Filter by state/region
  │
  └─ [Export Tab]
       ├─ Export configuration form
       ├─ Select: Overview, Users, Materials, Geographic
       ├─ Select format: CSV, PDF
       ├─ Date range
       └─ Generate & Download button

Drill-Down Navigation:
  Admin clicks user name
    ↓
  Open modal or navigate to /admin/user-view/[userId]
    ├─ Shows that user's complete dashboard
    ├─ All their metrics
    ├─ Can navigate as if logged in as that user
    ├─ "Back to Admin Analytics" breadcrumb
    └─ "Exit Admin View" button
```

**New Components Needed:**
- 🆕 UserViewModal or /admin/user-view/[userId] page
- 🆕 MaterialDetailAdminView component
- 🆕 AdminBreadcrumb component
- 🆕 "Viewing as [User Name]" banner

---

## 🔌 **Complete Data Flow Integration**

### End-to-End Journey Tracking Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                   CUSTOMER JOURNEY TRACKING                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [STAGE 1: CLICK] User clicks marketing link                     │
│  URL: taxgeniuspro.tax/start-filing?utm_source=john_001&...      │
│     │                                                              │
│     ├─> Middleware.ts intercepts request                         │
│     │   ├─> Extracts UTM params from URL                         │
│     │   └─> Calls: utmTrackingMiddleware()                       │
│     │                                                              │
│     ├─> UTM Storage                                               │
│     │   ├─> Creates encrypted cookie __tgp_utm                   │
│     │   ├─> Structure: { source, medium, campaign, content, term }│
│     │   ├─> Expires: 30 days                                      │
│     │   └─> Stores in session as backup                          │
│     │                                                              │
│     └─> Journey Tracking                                          │
│         ├─> Calls: trackLinkClick(params)                        │
│         ├─> Creates: LinkClick record                             │
│         │   └─> Fields: linkId, clickedAt, ipAddress, utmParams  │
│         └─> Updates: MarketingLink.clicks += 1                    │
│                                                                    │
│  [STAGE 2: INTAKE START] User begins form                        │
│  Page: /start-filing or /tax-intake                              │
│     │                                                              │
│     ├─> Form mount useEffect()                                    │
│     │   ├─> Retrieves UTM from cookie                            │
│     │   └─> Calls: trackJourneyStage('INTAKE_STARTED')           │
│     │                                                              │
│     └─> Journey Update                                            │
│         ├─> Finds: LinkClick by tracking code                    │
│         ├─> Updates: LinkClick.intakeStartedAt = now()           │
│         └─> Increments: MarketingLink.intakeStarts += 1          │
│                                                                    │
│  [STAGE 3: INTAKE COMPLETE] User submits form                    │
│  API: POST /api/tax-intake/lead or POST /api/submissions         │
│     │                                                              │
│     ├─> API handler saves form data                              │
│     │   └─> Creates: TaxIntakeLead or Submission record          │
│     │                                                              │
│     └─> Journey Update                                            │
│         ├─> Retrieves UTM from request headers/cookie            │
│         ├─> Calls: trackJourneyStage('INTAKE_COMPLETED')         │
│         ├─> Updates: LinkClick.intakeCompletedAt = now()         │
│         ├─> Increments: MarketingLink.intakeCompletes += 1       │
│         └─> Calculates: conversion rates                         │
│                                                                    │
│  [STAGE 4: RETURN FILED] Preparer marks done                     │
│  API: PATCH /api/submissions/[id]/status                          │
│     │                                                              │
│     ├─> Status update handler                                     │
│     │   ├─> Updates: TaxReturn.status = 'FILED'                  │
│     │   └─> Checks: if status === 'FILED'                        │
│     │                                                              │
│     ├─> Journey Completion                                        │
│     │   ├─> Finds: LinkClick by submissionId/clientId            │
│     │   ├─> Updates: LinkClick.taxReturnCompletedAt = now()      │
│     │   └─> Increments: MarketingLink.returnsFiled += 1          │
│     │                                                              │
│     ├─> Commission Creation (if applicable)                       │
│     │   ├─> Finds: Referral by clientId                          │
│     │   ├─> Creates: Commission record                            │
│     │   ├─> Updates: Referral.status = 'COMPLETED'               │
│     │   └─> Sends: commission email notification                 │
│     │                                                              │
│     └─> Analytics Update                                          │
│         ├─> Recalculates: MarketingLink conversion rates         │
│         ├─> Updates: cached metrics                               │
│         └─> Triggers: real-time dashboard updates                │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

### Integration Checkpoints

**✅ Checkpoint 1: UTM Extraction**
- File: `src/middleware.ts`
- Function: `utmTrackingMiddleware()`
- Validates: URL contains UTM params
- Creates: Encrypted cookie
- Next: Cookie available on all subsequent requests

**✅ Checkpoint 2: Click Tracking**
- File: `src/lib/services/link-tracking.service.ts`
- Function: `trackLinkClick()`
- Validates: Tracking code exists in database
- Creates: LinkClick record
- Next: User can proceed to intake form

**✅ Checkpoint 3: Intake Start**
- File: `src/app/start-filing/page.tsx` or intake form component
- Hook: `useEffect()` on mount
- Function: `trackJourneyStage('INTAKE_STARTED')`
- Validates: UTM cookie exists
- Updates: LinkClick.intakeStartedAt
- Next: User fills out form

**✅ Checkpoint 4: Intake Complete**
- File: `src/app/api/tax-intake/lead/route.ts`
- Function: POST handler
- After: Form data saved
- Calls: `trackJourneyStage('INTAKE_COMPLETED')`
- Updates: LinkClick.intakeCompletedAt
- Next: Admin/preparer can process return

**✅ Checkpoint 5: Return Filed**
- File: `src/app/api/submissions/[id]/status/route.ts`
- Function: PATCH handler
- When: `status === 'FILED'`
- Calls: `trackJourneyStage('RETURN_FILED')`
- Updates: LinkClick.taxReturnCompletedAt
- Triggers: Commission creation
- Next: Dashboard shows completion

---

## 🧩 **Missing Components Inventory**

### Components to CREATE (Story 6.2)

```typescript
// Material Management
/src/components/materials/MaterialCreationModal.tsx
  - Form for creating new material
  - Material type selector
  - Campaign name input
  - Location input
  - Notes textarea
  - Generate button
  - QR code preview after creation
  - Download options (PNG, SVG, PDF)

/src/components/materials/MaterialCard.tsx
  - Material thumbnail/preview
  - Material name and type
  - Performance metrics (clicks, conversions)
  - Status badge (Active/Paused)
  - Action buttons (Edit, View, Download QR)
  - Used in: MaterialLibrary grid view

/src/components/materials/MaterialLibrary.tsx
  - Grid or list view of materials
  - Filter by type, status, date
  - Search by name/location
  - Pagination (50 per page)
  - Sort by performance metrics
  - Bulk actions (delete, export)

/src/components/materials/MaterialEditModal.tsx
  - Similar to creation modal
  - Pre-filled with existing data
  - Can update: name, location, notes, status
  - Cannot change: tracking code (immutable)

/src/components/materials/QRCodeDownload.tsx
  - QR code display (large preview)
  - Download buttons (PNG, SVG, PDF)
  - QR code customization options
  - Share QR code options

/src/app/dashboard/materials/[id]/page.tsx
  - Material detail page
  - Performance metrics chart
  - Conversion funnel (specific to material)
  - Geographic distribution
  - Recent activity log
  - Edit/Delete buttons
  - Breadcrumb navigation
```

### Components to CREATE (Story 6.3)

```typescript
// Admin Analytics
/src/components/admin/Top15Card.tsx
  - Reusable ranking card
  - Props: category, data, onItemClick
  - Displays: rank, name, metrics, badge
  - Click handler for drill-down

/src/components/admin/PerformanceOverview.tsx
  - Grid of stat cards
  - Real-time metrics
  - Trend indicators (up/down arrows)
  - Click to drill into details

/src/components/admin/GeographicHeatMap.tsx
  - Map visualization (Mapbox or simple SVG)
  - Color-coded by performance
  - Tooltip on hover
  - Click to filter by location

/src/components/admin/DrillDownModal.tsx
  - Modal or page overlay
  - Shows user's complete dashboard
  - Navigation as that user
  - "Exit Admin View" button
  - Breadcrumb: Admin > Analytics > [User Name]

/src/components/admin/MaterialComparison.tsx
  - Material selector (multi-select)
  - Comparison chart (bar, radar, table)
  - Side-by-side metrics
  - Winner indicator

/src/components/admin/AdminBreadcrumb.tsx
  - Shows current navigation path
  - Example: Admin > Analytics > Top Preparers > John Doe
  - Clickable segments
  - Back navigation support
```

### Components to CREATE (Story 6.4)

```typescript
// Dashboard Enhancements
/src/components/analytics/MaterialsTable.tsx
  - Sortable table of user's materials
  - Columns: name, type, location, clicks, conversions, rate
  - Row actions: view, edit, export
  - Pagination controls
  - Export button (CSV)

/src/components/analytics/ConversionFunnel.tsx
  - 4-stage funnel visualization
  - Bars showing drop-off at each stage
  - Percentage labels
  - Color-coded (green = good, red = needs improvement)
  - Click stage to see details

/src/components/analytics/SourceBreakdown.tsx
  - Pie or donut chart
  - Shows lead sources:
    - My materials
    - Referrer partnerships
    - Direct website
    - Other sources
  - Legend with counts
  - Click segment to filter

/src/components/analytics/PerformanceTrends.tsx
  - Line chart showing metrics over time
  - Selectable metrics (clicks, conversions, rate)
  - Date range selector
  - Zoom/pan controls
  - Export chart as image

/src/components/analytics/DateRangePicker.tsx
  - Preset ranges (Today, 7d, 30d, 90d, Custom)
  - Custom date picker modal
  - Apply button
  - Used across all dashboards
```

### Components to CREATE (Story 6.5)

```typescript
// Analytics & Reporting
/src/components/analytics/DropOffAnalysis.tsx
  - Shows where users abandon
  - 3 drop-off points displayed
  - Avg time at each stage
  - Insights and recommendations
  - Alert for high drop-off (> 50%)

/src/components/analytics/ExportButton.tsx
  - Dropdown menu
  - Options: CSV, PDF, Excel (future)
  - Loading state during export
  - Success message after download
  - Reusable across all pages

/src/components/analytics/ComparisonTable.tsx
  - Side-by-side material comparison
  - Highlight best/worst performers
  - Color-coded metrics
  - Export comparison report

/src/components/shared/Breadcrumb.tsx
  - Generic breadcrumb component
  - Renders path: Home > Dashboard > Materials > [Name]
  - Clickable navigation
  - Used across all detail pages
```

---

## 🔐 **Permission Integration**

### NEW Permissions to Add

```typescript
// Update src/lib/permissions.ts

export interface UserPermissions {
  // ... existing permissions ...

  // NEW for Epic 6
  materialManagement: boolean  // Create, edit, delete materials
  qrGeneration: boolean        // Generate QR codes
  analytics: boolean            // View analytics (already exists, enhance)
  advancedAnalytics: boolean   // Material comparison, drop-off analysis
  exportData: boolean          // Export CSV/PDF
  adminAnalytics: boolean      // Admin-only Top 15 views
  viewOtherUsers: boolean      // Admin drill-down into user dashboards
}

// Default permissions by role
const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  referrer: {
    // ... existing ...
    materialManagement: true,
    qrGeneration: true,
    analytics: true,
    advancedAnalytics: false,  // Basic analytics only
    exportData: true,
    adminAnalytics: false,
    viewOtherUsers: false,
  },

  affiliate: {
    // ... existing ...
    materialManagement: true,
    qrGeneration: true,
    analytics: true,
    advancedAnalytics: true,  // Full analytics
    exportData: true,
    adminAnalytics: false,
    viewOtherUsers: false,
  },

  tax_preparer: {
    // ... existing ...
    materialManagement: true,  // Can create materials
    qrGeneration: true,
    analytics: true,
    advancedAnalytics: false,
    exportData: true,
    adminAnalytics: false,
    viewOtherUsers: false,
  },

  super_admin: {
    // ... existing ...
    materialManagement: true,
    qrGeneration: true,
    analytics: true,
    advancedAnalytics: true,
    exportData: true,
    adminAnalytics: true,      // Top 15 rankings
    viewOtherUsers: true,       // Drill-down capability
  },

  admin: {
    // ... similar to super_admin ...
    adminAnalytics: true,
    viewOtherUsers: true,
  },

  client: {
    // ... existing ...
    materialManagement: false,  // Clients don't create materials
    qrGeneration: false,
    analytics: false,
    advancedAnalytics: false,
    exportData: false,
    adminAnalytics: false,
    viewOtherUsers: false,
  },
}
```

### API Endpoint Permission Checks

```typescript
// Middleware pattern for all new APIs

// Example: POST /api/materials/create
export async function POST(request: Request) {
  const user = await currentUser()
  if (!user) return unauthorized()

  const permissions = getUserPermissions(user.publicMetadata.role)
  if (!permissions.materialManagement) {
    return forbidden('No permission to create materials')
  }

  // ... proceed with material creation
}

// Example: GET /api/admin/analytics/top-performers
export async function GET(request: Request) {
  const user = await currentUser()
  if (!user) return unauthorized()

  const permissions = getUserPermissions(user.publicMetadata.role)
  if (!permissions.adminAnalytics) {
    return forbidden('Admin-only analytics')
  }

  // ... proceed with analytics query
}
```

---

## 📱 **Mobile Responsive Navigation**

### Mobile Menu Structure

```typescript
// Mobile menu (< 768px)
// Hamburger menu with drawer

[☰] Tax Genius Pro                [👤] [🔔]
────────────────────────────────────────────

When opened (drawer from left):

┌─────────────────────────────┐
│  [✕] Close                   │
│                               │
│  👤 John Doe                  │
│  🟢 Referrer Account          │
│                               │
│  ─────────────────────        │
│                               │
│  🏠 Dashboard                 │
│  👥 Referrals                 │
│  🏆 Contest                   │
│  📱 Marketing Tools           │
│    ├─ My Materials ← NEW TAB │
│    └─ QR Generator            │
│  💰 Earnings                  │
│  ⚙️  Settings                 │
│                               │
│  ─────────────────────        │
│                               │
│  🚪 Sign Out                  │
└─────────────────────────────┘
```

### Mobile Tab Navigation (within pages)

```typescript
// Dashboard with tabs on mobile
// Horizontal scroll tabs

[Overview] [Materials] [Analytics] →

// Swipeable content area
<SwipeableViews>
  <OverviewTab />
  <MaterialsTab />  ← NEW
  <AnalyticsTab />  ← ENHANCED
</SwipeableViews>
```

### Mobile Material Card

```typescript
// Compact card for mobile

┌──────────────────────────────┐
│ 🥇 Spring Downtown Poster    │
│ 📍 Atlanta Coffee - Main St  │
│ ─────────────────────────    │
│ 👆 124 clicks  ✅ 23 filed   │
│ 📊 18.5% conversion rate     │
│ ─────────────────────────    │
│ [View] [Edit] [•••]          │
└──────────────────────────────┘
```

---

## 🧪 **Integration Testing Scenarios**

### End-to-End Test: Complete User Journey

```typescript
// Test file: __tests__/e2e/complete-journey.test.ts

test('Complete referrer journey: create material → track performance', async () => {
  // 1. Login as referrer
  await login('referrer@test.com')

  // 2. Navigate to dashboard
  await page.goto('/dashboard/referrer')
  expect(page).toHaveURL('/dashboard/referrer')

  // 3. Click "Create Material" button
  await page.click('[data-testid="create-material-btn"]')

  // 4. Fill material creation form
  await page.fill('[name="campaignName"]', 'Test Campaign')
  await page.selectOption('[name="materialType"]', 'QR_POSTER')
  await page.fill('[name="location"]', 'Test Location')

  // 5. Generate material
  await page.click('[data-testid="generate-btn"]')
  await page.waitForSelector('[data-testid="qr-code-preview"]')

  // 6. Verify material appears in list
  await page.click('[data-testid="my-materials-tab"]')
  await expect(page.locator('text=Test Campaign')).toBeVisible()

  // 7. Get tracking URL
  const trackingUrl = await page.locator('[data-testid="tracking-url"]').textContent()

  // 8. Simulate customer click (new session)
  await logout()
  await page.goto(trackingUrl)

  // 9. Verify UTM cookie set
  const cookies = await page.context().cookies()
  expect(cookies.find(c => c.name === '__tgp_utm')).toBeDefined()

  // 10. Start intake form
  await page.goto('/start-filing')
  await page.fill('[name="firstName"]', 'Test')
  await page.fill('[name="lastName"]', 'Customer')
  await page.fill('[name="email"]', 'customer@test.com')

  // 11. Submit intake
  await page.click('[data-testid="submit-intake"]')
  await page.waitForSelector('text=Intake submitted')

  // 12. Login as referrer again
  await login('referrer@test.com')
  await page.goto('/dashboard/referrer')

  // 13. Check material performance updated
  await page.click('[data-testid="my-materials-tab"]')
  await expect(page.locator('text=Test Campaign')).toContainText('1 click')
  await expect(page.locator('text=Test Campaign')).toContainText('1 intake started')

  // 14. Admin marks return filed
  await loginAsAdmin()
  await page.goto('/admin/submissions')
  await page.click('[data-testid="mark-filed"]')

  // 15. Verify commission created
  await login('referrer@test.com')
  await page.goto('/dashboard/referrer/earnings')
  await expect(page.locator('text=Commission earned')).toBeVisible()
})
```

### Integration Test: Navigation Consistency

```typescript
test('Navigation works consistently across all roles', async () => {
  for (const role of ['referrer', 'affiliate', 'tax_preparer', 'admin']) {
    await login(`${role}@test.com`)

    // Verify dashboard loads
    await page.goto(`/dashboard/${role}`)
    expect(page).toHaveURL(`/dashboard/${role}`)

    // Verify sidebar navigation
    const sidebar = await page.locator('[data-testid="dashboard-sidebar"]')
    expect(sidebar).toBeVisible()

    // Verify role-specific nav items
    if (role === 'referrer' || role === 'affiliate') {
      await expect(page.locator('text=Marketing Tools')).toBeVisible()
    }

    // Verify breadcrumb if on detail page
    await page.goto(`/dashboard/materials/test-id`)
    await expect(page.locator('[data-testid="breadcrumb"]')).toContainText('Dashboard')

    await logout()
  }
})
```

---

## ✅ **Integration Checklist**

### Story 6.1: Journey Tracking

- [ ] UTM middleware integrated with existing middleware.ts
- [ ] Cookie manager works with existing session system
- [ ] Journey tracking hooks into existing intake form
- [ ] Journey tracking hooks into existing status update API
- [ ] Commission trigger integrates with existing commission service
- [ ] No conflicts with existing link-tracking.service.ts

### Story 6.2: Material Management

- [ ] Material CRUD APIs follow existing API patterns
- [ ] QR generation integrates with existing R2/S3 upload
- [ ] Material library uses existing UI components (Card, Table, etc.)
- [ ] Material creation accessible from existing marketing page
- [ ] Permission checks use existing permission system
- [ ] No conflicts with existing MarketingCampaign functionality

### Story 6.3: Admin Analytics

- [ ] Admin analytics page extends existing /admin/analytics route
- [ ] Top 15 queries use existing database indexes
- [ ] Drill-down navigation respects existing routing
- [ ] Admin breadcrumb integrates with existing layout
- [ ] Export functionality uses existing download patterns
- [ ] No performance impact on existing admin pages

### Story 6.4: Role Dashboards

- [ ] Dashboard enhancements preserve existing tab structure
- [ ] New tabs added to existing Tabs component
- [ ] MaterialsTable component uses existing Table component
- [ ] Charts use existing Recharts setup
- [ ] React Query hooks follow existing naming conventions
- [ ] No breaking changes to existing dashboard layouts

### Story 6.5: Analytics & Reporting

- [ ] Export buttons added to all existing tables
- [ ] CSV export follows existing download patterns
- [ ] PDF generation uses existing report styles
- [ ] Drop-off analysis integrates with funnel component
- [ ] Material comparison uses existing comparison patterns
- [ ] No conflicts with existing analytics.service.ts

---

## 🚀 **Implementation Order with Integration Gates**

### Week 1: Foundation (Story 6.1)
**Integration Gate:** Journey tracking working end-to-end before proceeding

```bash
# Verification commands
npm run test:journey-tracking
npm run test:utm-middleware
curl -X POST localhost:3000/api/tracking/journey-stage --data '{"stage":"INTAKE_STARTED"}'
```

### Week 2: Material Management (Story 6.2)
**Integration Gate:** Material creation + QR generation working

```bash
# Verification commands
npm run test:material-crud
npm run test:qr-generation
# Manual test: Create material, download QR, scan with phone
```

### Week 3: Admin Analytics (Story 6.3)
**Integration Gate:** Top 15 rankings displaying real data

```bash
# Verification commands
npm run test:admin-analytics
npm run test:top-15-queries
# Manual test: Admin dashboard loads in < 2 seconds
```

### Week 4: Role Dashboards + Reporting (Stories 6.4 + 6.5)
**Integration Gate:** All dashboards showing real data, exports working

```bash
# Verification commands
npm run test:all-dashboards
npm run test:exports
npm run test:e2e:complete-journey
# Manual test: Export CSV from each dashboard
```

---

## 📊 **Success Metrics**

### Navigation Metrics
- ✅ Users can navigate to material detail in ≤ 2 clicks
- ✅ Breadcrumb navigation always shows correct path
- ✅ Mobile navigation works seamlessly
- ✅ No broken links or 404 errors

### Integration Metrics
- ✅ 100% of journey stages tracked correctly
- ✅ Attribution accuracy ≥ 95%
- ✅ No performance degradation (< 2s load time)
- ✅ Zero breaking changes to existing features

### User Experience Metrics
- ✅ Task completion rate ≥ 90% (create material, view analytics, export)
- ✅ User satisfaction ≥ 4.5/5 (survey)
- ✅ Support tickets < 5% increase
- ✅ Feature adoption ≥ 60% within first month

---

**This document ensures perfect integration and navigation flow across all Epic 6 stories. Every component, every route, every data flow is mapped and connected. Ready to implement with confidence! 🚀**
