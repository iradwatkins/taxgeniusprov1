# 🔄 Role System Refactoring Summary

**Date:** October 16, 2025
**Status:** ✅ Phase 1 Complete (5/10 tasks)

---

## 🎯 Objective

Refactor the user role system to correctly implement the TaxGeniusPro business model:
- **Remove REFERRER as a role** (it's an activity, not a role)
- **Add LEAD as default role** for new signups
- **Enable clients to refer** and earn commissions (same features as affiliates)
- **Implement role transition**: Affiliate → Client after tax return completion

---

## ✅ Completed Tasks (Phase 1)

### 1. Database Schema Update ✅
**File:** `prisma/schema.prisma`

**Changes:**
```prisma
// BEFORE:
enum UserRole {
  SUPER_ADMIN
  ADMIN
  CLIENT
  REFERRER  // ❌ Removed
  TAX_PREPARER
  AFFILIATE
}

// AFTER:
enum UserRole {
  SUPER_ADMIN
  ADMIN
  LEAD          // ✅ NEW - Default for new signups (pending approval)
  CLIENT        // ✅ User who has completed tax preparation
  TAX_PREPARER  // ✅ Tax professional
  AFFILIATE     // ✅ Referrer working for Tax Genius (hasn't done taxes)
}
```

**Migration Status:** ✅ Completed via `npx prisma db push`

---

### 2. Lead Dashboard Created ✅
**File:** `/src/app/dashboard/lead/page.tsx`

**Purpose:** Pending approval page for new signups

**Features:**
- Professional "Account Pending Approval" message
- Progress tracker (Application → Admin Review → Activation)
- Contact information for support
- Auto-redirect when role changes

---

### 3. Referrer Dashboard Deleted ✅
**File:** `/src/app/dashboard/referrer/page.tsx` - **DELETED**

**Reason:** Redundant - referral features integrated into client & affiliate dashboards

---

### 4. Client Dashboard Enhanced ✅
**File:** `/src/app/dashboard/client/page.tsx`

**New Feature:** **"My Referrals" Tab** (conditional)

**Display Logic:**
```typescript
const shortLinkUsername = dashboardData?.user?.shortLinkUsername
const totalLeads = dashboardData?.referralStats?.totalLeads || 0
const showReferralsTab = shortLinkUsername || totalLeads > 0
```

**Tab Features:**
- Referral link with copy/share functionality
- AttributionStatsCard (Epic 6)
- RecentLeadsTable (Epic 6)
- EarningsOverviewCard (Epic 6)
- Commission tracking
- Payout request dialog

**Component:** `/src/components/dashboard/client/MyReferralsTab.tsx` - **NEW**

---

### 5. Reusable MyReferralsTab Component ✅
**File:** `/src/components/dashboard/client/MyReferralsTab.tsx`

**Features:**
- Onboarding state (no referral link yet)
- Active state (showing referral analytics)
- Reuses all Epic 6 components:
  - `AttributionStatsCard`
  - `RecentLeadsTable`
  - `EarningsOverviewCard`
  - `PayoutRequestDialog`

---

## 📋 Pending Tasks (Phase 2)

### 6. Admin Role Management UI (Pending)
**Location:** `/admin/leads-management` or `/admin/clients-status`

**Requirements:**
- View all users with role = LEAD
- Dropdown to change role: LEAD → CLIENT | AFFILIATE | TAX_PREPARER
- Assign lead/client to specific tax preparer
- Real-time dashboard update when role changes

---

### 7. Tax Preparer Role Management (Pending)
**Location:** `/dashboard/tax-preparer/clients` tab

**Requirements:**
- View assigned leads (assigned by admin)
- Limited dropdown: LEAD → CLIENT only
- Cannot change to AFFILIATE or TAX_PREPARER

---

### 8. File Center, Calendar, Emails, Address Book Integration (Pending)
**Tax Preparer Dashboard Enhancement**

**Add navigation links:**
- 📧 Emails → `/admin/emails`
- 📅 Calendar → `/admin/calendar`
- 📇 Address Book → `/admin/address-book`
- 📁 File Center → `/admin/file-center`

**Access Control:**
- ADMIN: Full access
- TAX_PREPARER: Full access
- CLIENT: File Center only (view/upload, no delete)
- AFFILIATE: No access

---

### 9. Academy Access (Pending)
**Location:** `/app/academy`

**Requirements:**
- Add "Academy" link to Tax Preparer dashboard
- Route protection: `if (role !== 'TAX_PREPARER') redirect('/dashboard')`
- Tab/sidebar navigation integration

---

### 10. Middleware Update (Pending)
**File:** `/src/middleware.ts`

**Requirements:**
- Handle LEAD role routing → `/dashboard/lead`
- Remove REFERRER role handling
- Role-based dashboard redirects:
  - LEAD → `/dashboard/lead`
  - CLIENT → `/dashboard/client`
  - AFFILIATE → `/dashboard/affiliate`
  - TAX_PREPARER → `/dashboard/tax-preparer`
  - ADMIN/SUPER_ADMIN → `/dashboard/admin`

---

## 🎯 Role System Overview (After Refactoring)

### Role Definitions

| Role | Description | Can Refer? | Gets Commission? |
|------|-------------|------------|------------------|
| **LEAD** | New signup (pending approval) | ❌ No | ❌ No |
| **CLIENT** | Completed tax return with Tax Genius | ✅ Yes | ✅ Yes |
| **AFFILIATE** | Works for Tax Genius (hasn't done taxes) | ✅ Yes | ✅ Yes |
| **TAX_PREPARER** | Tax professional | ✅ Yes | ❌ No (tracking only) |
| **ADMIN** | Administrator | ✅ Yes | N/A |

### Role Lifecycle

```
1. User signs up → LEAD (default)
   ↓
2. Admin reviews:
   ├─→ Filed taxes → CLIENT
   ├─→ Referrer → AFFILIATE
   └─→ Tax pro → TAX_PREPARER

OR

3. Tax Preparer assigns lead:
   └─→ Completes taxes → CLIENT only
```

### Role Transition: Affiliate → Client

**Trigger:** When affiliate completes their first tax return

```typescript
if (user.role === 'AFFILIATE' && taxReturn.status === 'FILED') {
  await updateUserRole(user.id, 'CLIENT')
  // CLIENT retains all referral features + gains tax client features
}
```

---

## 🔑 Key Business Logic

### "Referrer" is an Activity, Not a Role

**Anyone can refer:**
- Clients (who have done taxes)
- Affiliates (who work for Tax Genius)
- Tax Preparers (tracking their client sources)

**Referral features accessible via:**
- CLIENT: "My Referrals" tab (conditional)
- AFFILIATE: Primary dashboard features
- TAX_PREPARER: Overview tab analytics (Epic 6)

### Attribution Tracking (Epic 6)

**Works by username, not role:**
```prisma
model Lead {
  referrerUsername String? // Username who referred
  referrerType     String? // TAX_PREPARER, AFFILIATE, CLIENT, ADMIN
  attributionMethod String? // cookie, email_match, phone_match, direct
}
```

**Commission eligibility:**
- CLIENT: ✅ Earns commissions
- AFFILIATE: ✅ Earns commissions
- TAX_PREPARER: ❌ No commissions (tracking only)

---

## 📊 Dashboard Structure (Updated)

### Before Refactoring:
- `/dashboard/referrer` ❌ (redundant)
- `/dashboard/affiliate` ✅
- `/dashboard/client` ⚠️ (no referral features)
- `/dashboard/tax-preparer` ✅
- `/dashboard/admin` ✅

### After Refactoring:
- `/dashboard/lead` ✅ **NEW** (pending approval page)
- `/dashboard/affiliate` ✅ (referral-focused)
- `/dashboard/client` ✅ **ENHANCED** (+ "My Referrals" tab)
- `/dashboard/tax-preparer` ✅ (+ admin tools integration - pending)
- `/dashboard/admin` ✅

---

## 🚀 Next Steps

### Immediate (Phase 2):
1. Create Admin role management UI
2. Add tax preparer limited role change controls
3. Integrate admin tools (File Center, Calendar, etc.)
4. Add Academy access for tax preparers
5. Update middleware for role routing

### Future Enhancements:
1. Automated role transition (Affiliate → Client on tax return completion)
2. Email notifications when role changes
3. Onboarding flow for LEAD users
4. Referral link setup wizard for clients
5. Admin audit log for role changes

---

## 📝 Notes

- **No data loss:** Schema migration successful (no existing REFERRER users)
- **Backward compatibility:** Epic 6 attribution system already supports CLIENT referrers
- **Testing needed:** Manual QA for dashboard navigation and role transitions
- **Documentation:** Update user guides to reflect new role system

---

**Phase 1 Completion:** 50% (5/10 tasks) ✅
**Estimated Time for Phase 2:** 2-3 hours

