# Permission Toggles - Visual Guide

**Legend**:
- 🟢 = **GREEN TOGGLE ON** (Permission enabled)
- ⚫ = **TOGGLE OFF** (Permission disabled/hidden)

---

## CLIENT ROLE PERMISSIONS

```
┌─────────────────────────────────────┐
│         CLIENT DASHBOARD            │
├─────────────────────────────────────┤
│ 🟢 Dashboard                        │
│ 🟢 Upload Documents                 │
│ 🟢 Analytics (Referrals)            │
│ 🟢 Tracking Code                    │
│ 🟢 Marketing Tools                  │
│                                     │
│ ⚫ Settings         (OFF)           │
│ ⚫ Academy          (OFF)           │
│ ⚫ Calendar         (OFF)           │
│ ⚫ Address Book     (OFF)           │
│ ⚫ File Center      (OFF)           │
│ ⚫ System Controls  (OFF)           │
└─────────────────────────────────────┘
```

**What Client Sees**:
- ✅ My Dashboard section
- ✅ Documents
- ✅ Payments
- ✅ My Referrals
- ❌ NO System Controls
- ❌ NO Settings
- ❌ NO CRM

---

## AFFILIATE ROLE PERMISSIONS

```
┌─────────────────────────────────────┐
│       AFFILIATE DASHBOARD           │
├─────────────────────────────────────┤
│ 🟢 Dashboard                        │
│ 🟢 Store                            │
│ 🟢 Marketing                        │
│ 🟢 Analytics                        │
│ 🟢 Tracking Code                    │
│                                     │
│ ⚫ Settings         (OFF)           │
│ ⚫ Academy          (OFF)           │
│ ⚫ Calendar         (OFF)           │
│ ⚫ Address Book     (OFF)           │
│ ⚫ File Center      (OFF)           │
│ ⚫ System Controls  (OFF)           │
└─────────────────────────────────────┘
```

**What Affiliate Sees**:
- ✅ Affiliate Dashboard section
- ✅ Links & QR
- ✅ My Leads
- ✅ Marketing
- ✅ Analytics
- ✅ Store
- ❌ NO System Controls
- ❌ NO Settings
- ❌ NO CRM

---

## TAX PREPARER ROLE PERMISSIONS

```
┌─────────────────────────────────────┐
│     TAX PREPARER DASHBOARD          │
├─────────────────────────────────────┤
│ 🟢 Dashboard                        │
│ 🟢 Clients (scoped)                 │
│ 🟢 Documents (scoped)               │
│ 🟢 File Center (scoped)             │
│ 🟢 Calendar (CRM)                   │
│ 🟢 Address Book (CRM)               │
│ 🟢 Store                            │
│ 🟢 Academy                          │
│ 🟢 Analytics (own stats)            │
│ 🟢 Tracking Code                    │
│                                     │
│ ⚫ Settings         (OFF)           │
│ ⚫ System Controls  (OFF)           │
│ ⚫ User Management  (OFF)           │
│ ⚫ Database         (OFF)           │
└─────────────────────────────────────┘
```

**What Tax Preparer Sees**:
- ✅ My Clients (their assigned clients only)
- ✅ Support Tickets
- ✅ Tax Forms Library
- ✅ Calendar (CRM) - their appointments
- ✅ CRM Contacts (their contacts only)
- ✅ Client File Center (their clients' files only)
- ✅ My Analytics
- ✅ My Tracking Code
- ✅ Academy
- ✅ Store
- ❌ NO System Controls
- ❌ NO Settings

---

## ADMIN ROLE PERMISSIONS

```
┌─────────────────────────────────────┐
│         ADMIN DASHBOARD             │
├─────────────────────────────────────┤
│ 🟢 Dashboard                        │
│ 🟢 Users                            │
│ 🟢 Payouts                          │
│ 🟢 Content Generator                │
│ 🟢 Analytics                        │
│ 🟢 Settings                         │
│ 🟢 Clients Status                   │
│ 🟢 Referrals Status                 │
│ 🟢 Emails                           │
│ 🟢 Calendar (CRM)                   │
│ 🟢 Address Book (CRM)               │
│ 🟢 Marketing Hub                    │
│ 🟢 Store                            │
│ 🟢 Academy                          │
│ 🟢 System Controls (limited)        │
│                                     │
│ ⚫ Permissions      (OFF - super)   │
│ ⚫ Database         (OFF - super)   │
│ ⚫ Alerts           (OFF - super)   │
│ ⚫ File Center      (OFF - super)   │
│ ⚫ Google Analytics (OFF - super)   │
└─────────────────────────────────────┘
```

**What Admin Sees**:
- ✅ Clients Status
- ✅ Referrals Status
- ✅ Calendar & Appointments (all)
- ✅ CRM Contacts (all)
- ✅ Emails
- ✅ Support System
- ✅ Earnings
- ✅ Payouts
- ✅ Analytics (all sections)
- ✅ Marketing Hub
- ✅ Tracking Codes
- ✅ Content Generator
- ✅ Store Management
- ✅ Learning Center
- ✅ Academy
- ✅ User Management
- ✅ System Controls (LIMITED)
- ✅ Settings
- ❌ NO Permissions (super_admin only)
- ❌ NO Database (super_admin only)

---

## SUPER ADMIN ROLE PERMISSIONS

```
┌─────────────────────────────────────┐
│      SUPER ADMIN DASHBOARD          │
├─────────────────────────────────────┤
│ 🟢 EVERYTHING                       │
│ 🟢 Dashboard                        │
│ 🟢 Users                            │
│ 🟢 Permissions                      │
│ 🟢 Database                         │
│ 🟢 Alerts                           │
│ 🟢 Payouts                          │
│ 🟢 Content Generator                │
│ 🟢 Analytics                        │
│ 🟢 Settings                         │
│ 🟢 Clients Status                   │
│ 🟢 Referrals Status                 │
│ 🟢 Emails                           │
│ 🟢 Calendar (CRM - all)             │
│ 🟢 Address Book (CRM - all)         │
│ 🟢 File Center (all clients)        │
│ 🟢 Google Analytics                 │
│ 🟢 Marketing Hub                    │
│ 🟢 Store                            │
│ 🟢 Academy                          │
│ 🟢 System Controls (FULL)           │
│ 🟢 Route Access Control             │
└─────────────────────────────────────┘
```

**What Super Admin Sees**:
- ✅ **EVERYTHING**
- ✅ All admin features
- ✅ Permissions management
- ✅ Database access
- ✅ Phone alerts
- ✅ All client files
- ✅ Google Analytics integration
- ✅ Route restrictions

---

## SECTION VISIBILITY BY ROLE

### 📱 My Dashboard (Client/Lead only)
```
Client:  ✅ VISIBLE
Affiliate: ⚫ HIDDEN
Tax Prep:  ⚫ HIDDEN
Admin:     ⚫ HIDDEN
Super:     ⚫ HIDDEN
```

### 🎯 Affiliate Dashboard (Affiliate only)
```
Client:    ⚫ HIDDEN
Affiliate: ✅ VISIBLE
Tax Prep:  ⚫ HIDDEN
Admin:     ⚫ HIDDEN
Super:     ⚫ HIDDEN
```

### 📋 CRM Section
```
Client:    ⚫ HIDDEN (no permissions)
Affiliate: ⚫ HIDDEN (no permissions)
Tax Prep:  ✅ VISIBLE (scoped access)
Admin:     ✅ VISIBLE (full access)
Super:     ✅ VISIBLE (full access)
```

### ⚙️ System Controls
```
Client:    ⚫ HIDDEN (no settings permission)
Affiliate: ⚫ HIDDEN (no settings permission)
Tax Prep:  ⚫ HIDDEN (no settings permission)
Admin:     ✅ VISIBLE (limited items)
Super:     ✅ VISIBLE (all items)
```

### ⚙️ Settings
```
Client:    ⚫ HIDDEN (no permission)
Affiliate: ⚫ HIDDEN (no permission)
Tax Prep:  ⚫ HIDDEN (no permission)
Admin:     ✅ VISIBLE
Super:     ✅ VISIBLE
```

### 💰 Financials
```
Client:    ⚫ HIDDEN
Affiliate: ⚫ HIDDEN
Tax Prep:  ⚫ HIDDEN
Admin:     ✅ VISIBLE
Super:     ✅ VISIBLE
```

### 📊 Analytics
```
Client:    ✅ VISIBLE (referral analytics only)
Affiliate: ✅ VISIBLE (their analytics)
Tax Prep:  ✅ VISIBLE (their analytics)
Admin:     ✅ VISIBLE (all analytics)
Super:     ✅ VISIBLE (all analytics)
```

### 🎓 Learning (Academy)
```
Client:    ⚫ HIDDEN
Affiliate: ⚫ HIDDEN
Tax Prep:  ✅ VISIBLE
Admin:     ✅ VISIBLE
Super:     ✅ VISIBLE
```

---

## QUICK REFERENCE CARD

### ❌ NEVER See (Clients)
- System Controls
- Settings
- Academy
- CRM (Calendar, Contacts, File Center)
- Admin tools

### ❌ NEVER See (Affiliates)
- System Controls
- Settings
- Academy
- CRM (Calendar, Contacts, File Center)
- Admin tools

### ❌ NEVER See (Tax Preparers)
- System Controls
- Settings
- User Management
- Permissions
- Database
- System-wide client status

### ❌ NEVER See (Admins)
- Permissions page (super_admin only)
- Database page (super_admin only)
- Phone alerts (super_admin only)
- All client files (super_admin only)
- Google Analytics (super_admin only)

---

## TESTING INSTRUCTIONS

1. **Login as Client**
   - Navigate to https://taxgeniuspro.tax/dashboard/client
   - Look at sidebar
   - Should see ONLY: My Dashboard section items
   - Should NOT see: System Controls, Settings, Academy, CRM

2. **Login as Affiliate**
   - Navigate to https://taxgeniuspro.tax/dashboard/affiliate
   - Look at sidebar
   - Should see ONLY: Affiliate Dashboard items
   - Should NOT see: System Controls, Settings, Academy, CRM

3. **Login as Tax Preparer**
   - Navigate to https://taxgeniuspro.tax/dashboard/tax-preparer
   - Look at sidebar
   - Should see: Clients, CRM (scoped), Academy, Business
   - Should NOT see: System Controls, Settings

4. **Login as Admin**
   - Navigate to https://taxgeniuspro.tax/dashboard/admin
   - Look at sidebar
   - Should see: Most sections including System Controls
   - Should NOT see: Permissions, Database items in System Controls

5. **Login as Super Admin**
   - Navigate to https://taxgeniuspro.tax/dashboard/admin
   - Look at sidebar
   - Should see: ALL sections including System Controls with Permissions/Database

---

**Generated with Claude Code** 🤖
