# Epic 7: Google Analytics Integration + Lead-to-CRM Auto-Sync

**Status:** 🟡 IN PROGRESS (60% Complete)
**Date Started:** 2025-01-16
**Estimated Completion:** 2-3 hours remaining

---

## ✅ COMPLETED WORK

### Phase 1: Google Analytics CRM Tracking Functions ✅
**File:** `src/lib/analytics/ga4.ts`

**Added 10 new CRM tracking functions:**
1. ✅ `trackCRMContactCreated()` - Contact creation events
2. ✅ `trackCRMContactUpdated()` - Contact update events
3. ✅ `trackCRMContactAssigned()` - Contact assignment to preparers
4. ✅ `trackCRMStageChanged()` - Pipeline stage movement tracking
5. ✅ `trackCRMInteractionLogged()` - Interaction logging (call, email, meeting, note)
6. ✅ `trackCRMEmailSynced()` - Resend email sync events
7. ✅ `trackCRMDashboardViewed()` - Dashboard analytics
8. ✅ `trackCRMContactViewed()` - Contact detail page views
9. ✅ `trackCRMSearchPerformed()` - Search behavior tracking
10. ✅ `trackCRMExportCSV()` - Data export tracking

**Lines Added:** ~320 lines
**Note:** These are client-side tracking functions. Server-side events will be logged and triggered from client components after successful API calls.

---

### Phase 2: Attribution Schema Enhancement ✅
**File:** `prisma/schema.prisma`

**Added attribution fields to CRMContact model:**
```prisma
// Lead Attribution (Epic 6 integration)
referrerUsername         String?
referrerType             String?
commissionRate           Decimal?  @db.Decimal(5, 2)
commissionRateLockedAt   DateTime?
attributionMethod        String?
attributionConfidence    Int      @default(100)

@@index([referrerUsername])
```

**Why Critical:**
- Without these fields, all Epic 6 attribution data would be LOST when leads migrate to CRM
- Links CRM contacts back to affiliate/preparer referrers for commission tracking
- Enables attribution reporting across the full customer journey

---

### Phase 3: CRM Types Update ✅
**File:** `src/types/crm.ts`

**Updated interfaces:**
1. ✅ `CRMContactInput` - Added attribution fields
2. ✅ `ContactExportData` - Added attribution fields for CSV exports

**Impact:** Full type safety for attribution data throughout CRM system

---

## 🟡 IN PROGRESS WORK

### Phase 4: Lead-to-CRM Auto-Sync (NEXT STEP)
**Files to Modify:**
- `src/app/api/leads/customer/route.ts`
- `src/app/api/leads/affiliate/route.ts`
- `src/app/api/leads/preparer/route.ts`

**What Needs to Be Done:**
After each lead is created, automatically create a CRM contact:

```typescript
// After lead creation (line ~87 in customer/route.ts)
const lead = await prisma.lead.create({ data: leadDataWithFraud });

// ✅ ADD THIS: Auto-create CRM contact for real-time visibility
try {
  await prisma.cRMContact.create({
    data: {
      userId: null, // Lead doesn't have user yet
      clerkUserId: null,
      contactType: 'LEAD',
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      stage: 'NEW',
      source: lead.source,
      // ✅ PRESERVE ATTRIBUTION DATA
      referrerUsername: lead.referrerUsername,
      referrerType: lead.referrerType,
      commissionRate: lead.commissionRate,
      commissionRateLockedAt: lead.commissionRateLockedAt,
      attributionMethod: lead.attributionMethod,
      attributionConfidence: lead.attributionConfidence,
    },
  });
} catch (error) {
  // Log error but don't fail lead creation
  logger.error('[Lead API] Failed to create CRM contact', { leadId: lead.id, error });
}
```

**Why Critical:**
- Provides REAL-TIME CRM visibility when leads come in
- No manual backfill script required
- Attribution data preserved immediately

---

### Phase 5: Enhanced Backfill Script (NEEDED)
**File:** `scripts/backfill-crm-contacts.ts`

**What Needs Enhancement:**

**Current Problem #1:** Script skips CONVERTED leads
```typescript
// Line 123: Current code
const leads = await prisma.lead.findMany({
  where: { status: { not: 'CONVERTED' } }
});
```

**Fix:** Create CRM contacts for converted leads as CLIENTS:
```typescript
// Backfill converted leads as CLIENT contacts
const convertedLeads = await prisma.lead.findMany({
  where: { status: 'CONVERTED' }
});

for (const lead of convertedLeads) {
  await prisma.cRMContact.create({
    data: {
      contactType: 'CLIENT', // ← Changed from LEAD
      stage: 'COMPLETE',     // ← Converted = complete
      // ... copy attribution data
    }
  });
}
```

**Current Problem #2:** Attribution data not migrated
```typescript
// Current code missing attribution fields
await prisma.cRMContact.create({
  data: {
    firstName: lead.firstName,
    // ❌ Missing: referrerUsername, commissionRate, etc.
  }
});
```

**Fix:** Add attribution data migration:
```typescript
await prisma.cRMContact.create({
  data: {
    // ... existing fields
    // ✅ ADD: Attribution data from Epic 6
    referrerUsername: lead.referrerUsername,
    referrerType: lead.referrerType,
    commissionRate: lead.commissionRate,
    commissionRateLockedAt: lead.commissionRateLockedAt,
    attributionMethod: lead.attributionMethod,
    attributionConfidence: lead.attributionConfidence,
  }
});
```

---

## ⏳ PENDING WORK

### Phase 6: Database Migration ⏳
**Command:** `npx prisma db push`

**What It Does:**
- Adds 6 new columns to `crm_contacts` table
- Creates index on `referrerUsername` for faster queries
- Sets default value for `attributionConfidence` (100)

**Impact:** ~1 minute downtime during migration

**Pre-Migration Checklist:**
- ✅ Schema changes reviewed
- ✅ Types updated
- ✅ No breaking changes
- ⏳ Backfill script enhanced
- ⏳ Lead API routes updated

---

### Phase 7: Lead Status → CRM Stage Sync ⏳
**Future Enhancement (Not Critical for MVP)**

**Goal:** When Lead.status changes in Epic 6, update CRMContact.stage

**Implementation:**
Add webhook or event listener when Lead.status is updated:
```typescript
// When Lead.status updated
if (crmContact) {
  await CRMService.updateContactStage({
    contactId: crmContact.id,
    toStage: mapLeadStatusToStage(newStatus),
    reason: 'Lead status updated in Epic 6'
  }, accessContext);
}
```

**Status Mapping:**
- NEW → NEW
- CONTACTED → CONTACTED
- QUALIFIED → DOCUMENTS
- CONVERTED → COMPLETE
- DISQUALIFIED → (soft delete or archive)

---

## 📊 KEY METRICS TO TRACK (Post-Deployment)

### CRM Adoption Metrics
- **CRM Dashboard Views:** Track with `trackCRMDashboardViewed()`
- **Contacts Created:** `trackCRMContactCreated()`
- **Interactions Logged:** `trackCRMInteractionLogged()`
- **Stage Movements:** `trackCRMStageChanged()`

### Attribution Metrics
- **Leads with Attribution:** % of CRM contacts with `referrerUsername`
- **Attribution Methods:** Distribution of cookie vs email vs phone matching
- **Commission Attribution:** Total commission $ linked via CRM

### Pipeline Metrics
- **Pipeline Velocity:** Avg days from NEW → COMPLETE
- **Stage Conversion Rates:** % moving from each stage to next
- **Bottleneck Detection:** Which stage has longest duration

### Business Impact
- **Lead-to-Client Conversion:** % of LEAD contacts becoming CLIENT
- **Preparer Utilization:** Avg contacts per preparer
- **Response Time:** Time from lead created → first interaction logged

---

## 🎯 REMAINING IMPLEMENTATION STEPS

### IMMEDIATE (Today):
1. ⏳ **Add CRM contact creation to lead API routes** (3 files, ~30 min)
2. ⏳ **Enhance backfill script with attribution** (~20 min)
3. ⏳ **Run database migration** (`prisma db push`) (~5 min)
4. ⏳ **Test end-to-end flow** (~30 min)
   - Submit test lead form
   - Verify CRM contact created
   - Check attribution data preserved
   - Confirm GA4 events logged

### SHORT-TERM (This Week):
5. ⏳ **Update Story 7.3 UI components** to call GA4 tracking functions
6. ⏳ **Add CRM analytics dashboard** showing GA4 metrics
7. ⏳ **Document GA4 events** for marketing team

### MEDIUM-TERM (Next Sprint):
8. ⏳ **Add Lead status → CRM stage sync**
9. ⏳ **Build attribution reporting** (which affiliates drive best leads)
10. ⏳ **Add automated lead assignment** based on preparer capacity

---

## 🔍 INTEGRATION VALIDATION CHECKLIST

### Pre-Deployment:
- ✅ GA4 tracking functions created
- ✅ Attribution schema added to CRM
- ✅ Types updated with attribution
- ⏳ Lead API routes create CRM contacts
- ⏳ Backfill script enhanced
- ⏳ Database migration completed
- ⏳ Tests passing (Epic 7 + Epic 6)

### Post-Deployment:
- ⏳ Verify GA4 events appearing in Google Analytics
- ⏳ Check CRM contacts have attribution data
- ⏳ Confirm Epic 6 lead tracking still works
- ⏳ Monitor database query performance
- ⏳ Validate commission attribution accurate

---

## 🚨 CRITICAL INTEGRATION POINTS

### Integration #1: Epic 6 Lead Tracking ✅
**Status:** Additive only, no breaking changes
**Validation:** Lead attribution continues to work, CRM enhances it

### Integration #2: Commission System 🟡
**Status:** Needs testing
**Risk:** Commission calculations must use `commissionRate` from CRM, not recalculate
**Mitigation:** CRM locks rate at lead creation (matches Epic 6 pattern)

### Integration #3: Attribution Service ✅
**Status:** Compatible
**Validation:** `getAttribution()` returns all needed fields for CRM

### Integration #4: Fraud Prevention ✅
**Status:** Compatible
**Validation:** Fraud checks run before CRM contact created

---

## 📝 QUESTIONS FOR USER

1. **Database Migration Timing:** When should we run `prisma db push`?
   - Option A: Now (testing environment)
   - Option B: After all code changes complete
   - Option C: During scheduled maintenance window

2. **Converted Leads:** Should backfill script create CRM contacts for old converted leads?
   - Pro: Complete historical data
   - Con: May create 1000s of contacts at once

3. **GA4 Tracking Scope:** Should we track CRM events in development/staging?
   - Pro: Test events before production
   - Con: May pollute production analytics

---

## 🎉 COMPLETION CRITERIA

### Definition of Done:
- ✅ GA4 tracking functions implemented
- ✅ Attribution schema added
- ✅ Types updated
- ⏳ Lead API routes create CRM contacts
- ⏳ Backfill script enhanced
- ⏳ Database migration successful
- ⏳ End-to-end test passing
- ⏳ Documentation updated
- ⏳ Code review approved

### Success Metrics:
- 100% of new leads auto-create CRM contacts
- 95%+ of CRM contacts have attribution data
- GA4 events firing correctly
- No Epic 6 regression issues
- Database queries < 500ms

---

**Next Session:** Complete Phases 4-6, run migration, test end-to-end flow.

**Estimated Time Remaining:** 2-3 hours

**Ready for Code Review:** Once Phases 4-6 complete
