# 🎭 TaxGeniusPro - Complete Role Differentiation Guide

This document defines the clear separation between all 6 user roles in the system.

---

## 📋 Table of Contents
1. [Role Hierarchy](#role-hierarchy)
2. [Role Purposes](#role-purposes)
3. [Shared Features](#shared-features-all-roles)
4. [Role-Specific Features](#role-specific-features)
5. [Permission Matrix](#full-permission-matrix)
6. [Recommended Changes](#recommended-changes)

---

## 🏛️ Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  1. SUPER ADMIN (Highest) - Full System Control             │
│     └─ Can do EVERYTHING including system-critical features │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  2. ADMIN (Limited Admin) - Business Operations             │
│     └─ Can manage day-to-day operations but NOT critical   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  3. TAX PREPARER - Independent Tax Professional             │
│     └─ Manages their own clients and tax preparation work  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  4. AFFILIATE - Marketing Partner (External)                │
│     └─ Promotes services via marketing materials           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  5. REFERRER - Word-of-Mouth Promoter                       │
│     └─ Refers friends/family, participates in contests     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  6. CLIENT (Lowest) - Tax Service Customer                  │
│     └─ Receives tax services, uploads documents            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Role Purposes

### 1. 🛡️ SUPER ADMIN
**Who:** System owner (iradwatkins@gmail.com)
**Purpose:** Complete system control including critical operations
**Business Function:**
- Manages system infrastructure
- Controls permissions for other admins
- Accesses sensitive data and analytics
- Makes system-level decisions

**Key Characteristics:**
- CANNOT be assigned to regular users (security restriction)
- Has access to database management
- Can view Google Analytics
- Receives phone alerts for critical events
- Can manage other admin permissions

---

### 2. 👑 ADMIN
**Who:** Trusted staff members managing day-to-day operations
**Purpose:** Handle business operations without access to critical systems
**Business Function:**
- Manages clients and referrals status
- Handles communications (emails, calendar, address book)
- Views analytics and reports
- Manages payouts
- Creates marketing content

**Key Restrictions (vs Super Admin):**
- ❌ Cannot manage permissions (no adminManagement)
- ❌ Cannot access database directly
- ❌ Cannot view Google Analytics
- ❌ Cannot access sensitive client file center
- ❌ No phone alerts

---

### 3. 📊 TAX PREPARER
**Who:** Independent tax professionals or contractors
**Purpose:** Prepare taxes for clients assigned to them
**Business Function:**
- Views and manages THEIR OWN clients only
- Uploads/downloads client documents
- Tracks their own leads via tracking code
- Manages their own calendar/appointments
- Accesses academy for training

**Current Issues ⚠️:**
- Currently has access to ALL clients (should be filtered to assigned only)
- Has access to ALL referrals (shouldn't have this)
- Has access to ALL emails (should only see their own)
- Has access to entire address book (should be limited)

**What They SHOULD Have:**
- ✅ Their own client list (filtered view)
- ✅ Documents for their clients only
- ✅ Their own analytics/tracking code
- ✅ Their own calendar
- ✅ Academy access for training
- ❌ Should NOT see all system clients
- ❌ Should NOT manage all referrals

---

### 4. 🤝 AFFILIATE
**Who:** External marketing partners promoting TaxGeniusPro
**Purpose:** Drive traffic and leads through marketing campaigns
**Business Function:**
- Shares marketing materials on social media/websites
- Uses tracking codes to track conversions
- Views their own performance analytics
- Accesses marketing materials from the store

**What Makes Them Unique:**
- Focus on EXTERNAL marketing (not internal operations)
- Earn commissions for referrals
- Use professional marketing materials
- Track performance via unique links

---

### 5. 🎯 REFERRER
**Who:** Customers who refer friends/family
**Purpose:** Word-of-mouth referrals with contest participation
**Business Function:**
- Refers friends and family
- Participates in referral contests
- Uses simple tracking codes
- Views their own referral analytics

**What Makes Them Unique:**
- Focus on PERSONAL referrals (friends/family)
- Can participate in contests (affiliate cannot)
- Simpler interface than affiliates
- No access to professional marketing hub

---

### 6. 👤 CLIENT
**Who:** Customers receiving tax services
**Purpose:** Submit documents and track their tax return
**Business Function:**
- Uploads tax documents
- Views their tax return status
- Communicates with their assigned tax preparer

**What Makes Them Unique:**
- Most restricted role
- Only sees their own data
- Cannot access any system management features

---

## 🔄 Shared Features (All Roles)

These features are available to EVERY user regardless of role:

| Feature | Purpose | Route |
|---------|---------|-------|
| **Dashboard** | Overview of their account | `/dashboard` |
| **Settings** | Manage account preferences | `/dashboard/*/settings` |

---

## 🎨 Role-Specific Features

### 🛡️ SUPER ADMIN EXCLUSIVE (5 features)

| Feature | Why Super Admin Only | Route |
|---------|---------------------|-------|
| 🔔 **Phone Alerts** | Critical system notifications | `/admin/alerts` |
| 🔐 **Admin Management** | Control who has admin access | `/admin/permissions` |
| 💾 **Database** | Direct database access (dangerous) | `/admin/database` |
| 📊 **Google Analytics** | Requires API keys/sensitive access | `/admin/analytics/google` |
| 🗂️ **Client File Center** | Contains ALL users' sensitive files | `/admin/file-center` |

---

### 👑 ADMIN EXCLUSIVE (vs Lower Roles)

| Feature | Purpose | Route |
|---------|---------|-------|
| 👥 **User Management** | Manage all system users | `/admin/users` |
| 💰 **Payouts** | Process affiliate/referrer payments | `/admin/payouts` |
| ✨ **Content Generator** | AI-powered content creation | `/admin/content-generator` |
| 📧 **Communications** | System-wide email management | `/admin/emails` |
| 📅 **Calendar Management** | Company-wide calendar | `/admin/calendar` |
| 📖 **Address Book** | All contacts database | `/admin/address-book` |
| 📊 **System Analytics** | Company-wide analytics | `/admin/analytics` |
| 📢 **Marketing Hub** | Professional marketing tools | `/admin/marketing-hub` |

---

### 📊 TAX PREPARER EXCLUSIVE

| Feature | Purpose | Route |
|---------|---------|-------|
| 👥 **My Clients** | Clients assigned to them | `/dashboard/tax-preparer/clients` |
| 📄 **Client Documents** | Tax documents for their clients | `/dashboard/tax-preparer/documents` |
| 📊 **My Lead Analytics** | Their own lead performance | `/dashboard/tax-preparer/analytics` |
| 🔗 **My Tracking Code** | Personal lead tracking link | `/dashboard/tax-preparer/tracking` |
| 🗂️ **My Client Files** | File storage for their clients | `/dashboard/tax-preparer/file-center` |
| 🎓 **Academy** | Tax prep training & certification | `/app/academy` |

**❗ IMPORTANT:** All "clients status", "emails", "calendar" should be SCOPED to their own clients only, not all system clients.

---

### 🤝 AFFILIATE EXCLUSIVE

| Feature | Purpose | Route |
|---------|---------|-------|
| 📢 **Marketing Materials** | Professional marketing assets | `/dashboard/affiliate/marketing` |
| 📊 **My Affiliate Analytics** | Conversion tracking | `/dashboard/affiliate/analytics` |
| 🔗 **My Tracking Code** | Affiliate tracking link | `/dashboard/affiliate/tracking` |
| 🛒 **Store Access** | Marketing materials store | `/store` |

---

### 🎯 REFERRER EXCLUSIVE

| Feature | Purpose | Route |
|---------|---------|-------|
| 🏆 **Contest** | Referral contests & leaderboards | `/dashboard/referrer/contest` |
| 📊 **My Referral Analytics** | Referral performance | `/dashboard/referrer/analytics` |
| 🔗 **My Tracking Code** | Referral tracking link | `/dashboard/referrer/tracking` |
| 📱 **Marketing Tools** | Simple sharing tools | `/dashboard/referrer/marketing` |

---

### 👤 CLIENT EXCLUSIVE

| Feature | Purpose | Route |
|---------|---------|-------|
| 📤 **Upload Documents** | Submit tax documents | `/dashboard/client/upload-documents` |
| 📊 **My Tax Status** | View tax return progress | `/dashboard/client/status` |

---

## 📊 Full Permission Matrix

| Permission | Super Admin | Admin | Tax Preparer | Affiliate | Referrer | Client | Notes |
|------------|:-----------:|:-----:|:------------:|:---------:|:--------:|:------:|-------|
| **UNIVERSAL** |
| dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Everyone |
| settings | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Everyone |
| **SUPER ADMIN ONLY** |
| alerts 🔒 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Critical system alerts |
| adminManagement 🔒 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Manage permissions |
| database 🔒 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | Direct DB access |
| googleAnalytics 🔒 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | GA integration |
| clientFileCenter 🔒 | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ALL client files (sensitive) |
| **ADMIN TIER** |
| users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Manage users |
| payouts | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Process payments |
| contentGenerator | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | AI content |
| clientsStatus | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | Should be scoped for Tax Preparer |
| referralsStatus | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | Should Tax Preparer have this? |
| emails | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | Should be scoped for Tax Preparer |
| calendar | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | Should be scoped for Tax Preparer |
| addressBook | ✅ | ✅ | ⚠️ | ❌ | ❌ | ❌ | Should Tax Preparer have this? |
| referralsAnalytics | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | System-wide referrals |
| marketingHub | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | Professional marketing |
| academy | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | Training |
| store | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | Marketing store |
| **TAX PREPARER** |
| documents | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | Client tax docs (their clients only) |
| analytics | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | Role-scoped analytics |
| trackingCode | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | Personal tracking |
| **MARKETING ROLES** |
| marketing | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | Marketing materials |
| contest | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | Referrer only |
| **CLIENT** |
| uploadDocuments | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | Client only |

**Legend:**
- ✅ = Has Permission
- ❌ = No Permission
- ⚠️ = Has Permission but May Need Revision
- 🔒 = Super Admin Exclusive

---

## 🔧 Recommended Changes

### Issue #1: Tax Preparer has too many system-wide permissions

**Current Problem:**
```typescript
tax_preparer: {
  clientsStatus: true,      // ❌ Sees ALL clients
  referralsStatus: true,    // ❌ Shouldn't manage referrals
  emails: true,             // ❌ Sees ALL emails
  calendar: true,           // ❌ Sees ALL appointments
  addressBook: true,        // ❌ Sees ALL contacts
  clientFileCenter: true,   // ⚠️ Should only see THEIR clients' files
}
```

**Recommended Fix:**
```typescript
tax_preparer: {
  // Remove system-wide management tools
  clientsStatus: false,     // ✅ Remove - admins manage this
  referralsStatus: false,   // ✅ Remove - not their job
  emails: false,            // ✅ Remove - or scope to their clients only
  calendar: false,          // ✅ Remove - or scope to their appointments only
  addressBook: false,       // ✅ Remove - not needed

  // Keep client-focused features
  clients: true,            // ✅ Their assigned clients only (filtered in backend)
  documents: true,          // ✅ Their clients' documents only
  clientFileCenter: true,   // ✅ Their clients' files only (filtered in backend)
  analytics: true,          // ✅ Their own performance
  trackingCode: true,       // ✅ Their own tracking link
  academy: true,            // ✅ Training access
  store: true,              // ✅ Can buy materials
}
```

**Backend Implementation Note:**
For permissions that tax preparers SHOULD have but scoped to their own data:
- `clients`: Filter query to only show clients where `assignedPreparer === currentUser.id`
- `documents`: Filter to documents for their assigned clients
- `clientFileCenter`: Filter to files for their assigned clients

---

### Issue #2: Affiliate vs Referrer differentiation unclear

**Current Problem:**
Both roles have nearly identical permissions. Only difference is `contest`.

**Recommended Enhancement:**

**AFFILIATE (External Professional Marketer):**
```typescript
affiliate: {
  dashboard: true,
  store: true,              // ✅ Access to marketing store
  marketing: true,          // ✅ Professional marketing materials
  settings: true,
  analytics: true,          // ✅ Detailed conversion analytics
  trackingCode: true,       // ✅ Sophisticated tracking
  marketingHub: false,      // ❌ Don't give them content generator (admin only)
}
```

**REFERRER (Casual Word-of-Mouth):**
```typescript
referrer: {
  dashboard: true,
  contest: true,            // ✅ Participate in contests
  marketing: true,          // ✅ Simple sharing tools
  settings: true,
  analytics: true,          // ✅ Basic referral stats
  trackingCode: true,       // ✅ Simple referral link
  store: false,             // ❌ No store access (not professional marketer)
}
```

**Key Differentiation:**
- **Affiliate** = Professional marketer with store access and advanced tools
- **Referrer** = Casual promoter with contests and simple sharing

---

### Issue #3: Missing visual documentation

**Fix:** This document! 🎉

---

## 🎯 Summary: What Makes Each Role Unique

| Role | Unique Features | Can Do | Cannot Do |
|------|-----------------|--------|-----------|
| **Super Admin** | Database, Permissions, Alerts, GA | EVERYTHING | Nothing restricted |
| **Admin** | User Management, Payouts, Company-wide tools | Manage operations | Critical system changes |
| **Tax Preparer** | Client Documents, Own Client Management | Prepare taxes for assigned clients | See other preparers' clients |
| **Affiliate** | Marketing Store, Professional Materials | Professional marketing campaigns | Access client data |
| **Referrer** | Contests, Simple Sharing | Refer friends casually | Professional marketing |
| **Client** | Upload Documents | Submit documents, track status | Access any admin features |

---

## ✅ Implementation Checklist

- [ ] Update `src/lib/permissions.ts` with recommended changes
- [ ] Add backend filtering for tax_preparer queries (clients, documents, files)
- [ ] Test each role's dashboard to verify proper access
- [ ] Add role-specific analytics views (scoped data)
- [ ] Document role assignment process
- [ ] Add visual role badges in UI
- [ ] Create role selection flow for new users

---

**Last Updated:** $(date +%Y-%m-%d)
**Author:** Claude Code Analysis
**Version:** 1.0
