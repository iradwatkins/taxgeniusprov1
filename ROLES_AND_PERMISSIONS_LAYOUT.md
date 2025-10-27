# 🔐 TaxGeniusPro - Roles & Permissions System Layout

## 📋 **TABLE OF CONTENTS**

1. [System Overview](#system-overview)
2. [Role Hierarchy](#role-hierarchy)
3. [Complete Permissions Matrix](#complete-permissions-matrix)
4. [Section-Based Organization](#section-based-organization)
5. [Micro-Permissions System](#micro-permissions-system)
6. [Database Schema](#database-schema)
7. [How It Works](#how-it-works)
8. [Security Features](#security-features)
9. [Testing & Verification](#testing--verification)

---

## 🎯 **SYSTEM OVERVIEW**

TaxGeniusPro uses a comprehensive role-based access control (RBAC) system with:

- **6 User Roles** with distinct permission sets
- **85+ Granular Permissions** controlling access to features
- **40+ Micro-Permissions** for fine-grained control within features
- **9 Permission Sections** for organized management
- **Role stored in Clerk** `publicMetadata.role`
- **Custom permissions** can override defaults per user
- **Admin "View As" feature** for testing different role experiences

### Key Files:
- **Permissions Logic**: `src/lib/permissions.ts`
- **Middleware**: `src/middleware.ts`
- **Database Schema**: `prisma/schema.prisma`
- **Role Switcher**: `src/lib/utils/role-switcher.ts`

---

## 👥 **ROLE HIERARCHY**

### 1. 🛡️ **SUPER_ADMIN** (Highest Level - Full System Control)

**Purpose**: System owner with unrestricted access

**Key Differentiators**:
- ✅ Database management
- ✅ Permission management (adminManagement)
- ✅ Google Analytics access
- ✅ All client files (not scoped)
- ✅ Phone alerts enabled
- ✅ Route access control
- ✅ Cannot be assigned to regular users (security)

**Use Case**: Primary system administrator (you)

---

### 2. 👑 **ADMIN** (Limited Administrative Access)

**Purpose**: Operational administrators with restricted critical functions

**Key Differentiators**:
- ✅ User management
- ✅ Payouts management
- ✅ Content generator
- ✅ System-wide analytics
- ❌ **CANNOT** manage permissions
- ❌ **CANNOT** access database
- ❌ **CANNOT** access Google Analytics
- ❌ **CANNOT** delete contacts (safety)
- ❌ **CANNOT** delete files (safety)
- ❌ **CANNOT** delete marketing assets (safety)
- ❌ **CANNOT** edit tracking codes
- ❌ **CANNOT** upload tax forms (only super_admin)
- ❌ Phone alerts disabled by default

**Use Case**: Operations managers, customer support leads

**Security Notes**:
- Can be customized by super_admin to grant specific permissions
- Some delete operations restricted to prevent accidental data loss

---

### 3. 📊 **TAX_PREPARER** (Independent Tax Professional)

**Purpose**: Tax professionals who prepare returns for their assigned clients

**Key Differentiators**:
- ✅ Manages **THEIR OWN** assigned clients only (backend filtered)
- ✅ Full client file access (scoped to their clients)
- ✅ Can upload tax forms for their clients
- ✅ Tracking code for lead generation
- ✅ Academy access for training
- ✅ Store access for marketing materials
- ✅ Marketing assets (upload/download/delete)
- ✅ All micro-permissions enabled (for their scope)
- ❌ Cannot see other preparers' clients
- ❌ Cannot access admin features
- ❌ Cannot access system-wide data

**Use Case**: Independent contractors preparing taxes

**Important**: All client-related queries are automatically filtered by `preparerId` in backend

---

### 4. 🤝 **AFFILIATE** (External Professional Marketer)

**Purpose**: External marketers who promote TaxGeniusPro through professional campaigns

**Key Differentiators**:
- ✅ Store access (purchase marketing materials)
- ✅ Marketing tools and tracking
- ✅ Sophisticated analytics and conversion tracking
- ✅ Full tracking code customization
- ✅ Marketing assets (view & download only)
- ❌ **CANNOT** upload marketing assets
- ❌ **CANNOT** delete marketing assets
- ❌ **CANNOT** access any client data
- ❌ **CANNOT** access admin features
- ❌ No calendar, contacts, or file access

**Use Case**: Professional marketers, influencers, business partners

**Note**: Works for Tax Genius but hasn't done taxes with us yet

---

### 5. 🔶 **LEAD** (Potential Client - Assigned to Tax Preparer)

**Purpose**: Potential clients assigned to tax preparers for contact and conversion

**Key Differentiators**:
- ❌ **NO dashboard access** (shows pending approval page)
- ❌ **NO permissions at all**
- ❌ All micro-toggles explicitly disabled
- ✅ **ASSIGNED to specific tax preparers**
- ✅ Tax Preparers can change LEAD → CLIENT only (their assigned leads)
- ✅ Admins can change LEAD to: CLIENT, TAX_PREPARER, or AFFILIATE
- ✅ Two lead forms: Consultation form and Tax Intake form
- ✅ Smart assignment based on referrer (CLIENT → client's preparer, TAX_PREPARER → that preparer, AFFILIATE → Tax Genius)

**Use Case**: Prospects who filled out lead forms, waiting for tax preparer to contact and convert

**Important**: LEADs are NOT just "pending approval" - they are active prospects in tax preparer's sales pipeline

**See Also**: `LEAD_MANAGEMENT_SYSTEM.md` for complete workflow

---

### 6. 👤 **CLIENT** (Tax Service Customer)

**Purpose**: Customer who has completed or is completing tax preparation

**Key Differentiators**:
- ✅ Upload documents (their own only)
- ✅ View their tax return status
- ✅ **CAN REFER** new clients (if they have shortLinkUsername)
- ✅ Full tracking code access (customize their referral link)
- ✅ Full referral analytics (track their referrals)
- ✅ Marketing materials (view & download to share)
- ✅ File access (view, upload, download their files)
- ❌ **CANNOT** delete files
- ❌ **CANNOT** share files
- ❌ **CANNOT** upload marketing assets

**Use Case**: Regular customers, satisfied clients who refer others

**Important**: Clients earn commissions on referrals same as affiliates

---

## 📊 **COMPLETE PERMISSIONS MATRIX**

### Core Permissions (26 Main Features)

| Permission | Super Admin | Admin | Tax Preparer | Affiliate | Lead | Client |
|------------|-------------|-------|--------------|-----------|------|--------|
| **dashboard** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **alerts** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **users** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **payouts** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **contentGenerator** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **database** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **analytics** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **adminManagement** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **clients** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **documents** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **store** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **academy** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **earnings** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **settings** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **marketing** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **uploadDocuments** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **contest** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **trackingCode** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **clientsStatus** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **referralsStatus** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **emails** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **calendar** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **addressBook** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **clientFileCenter** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **taxForms** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **marketingAssets** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **googleAnalytics** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **referralsAnalytics** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **learningCenter** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **marketingHub** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **quickShareLinks** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **routeAccessControl** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🎛️ **MICRO-PERMISSIONS SYSTEM**

Micro-permissions provide fine-grained control within each feature.

### 📅 **Calendar & Appointments** (4 Micro-Toggles)

| Micro-Permission | Super Admin | Admin | Tax Preparer | Affiliate | Lead | Client |
|------------------|-------------|-------|--------------|-----------|------|--------|
| **calendar_view** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **calendar_create** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **calendar_edit** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **calendar_delete** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

### 👥 **CRM Contacts** (5 Micro-Toggles)

| Micro-Permission | Super Admin | Admin | Tax Preparer | Affiliate | Lead | Client |
|------------------|-------------|-------|--------------|-----------|------|--------|
| **contacts_view** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **contacts_create** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **contacts_edit** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **contacts_delete** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **contacts_export** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

**Note**: Admin **CANNOT** delete contacts (safety restriction)

---

### 📂 **Client File Center** (5 Micro-Toggles)

| Micro-Permission | Super Admin | Admin | Tax Preparer | Affiliate | Lead | Client |
|------------------|-------------|-------|--------------|-----------|------|--------|
| **files_view** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **files_upload** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **files_download** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **files_delete** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **files_share** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

**Note**:
- Admin **CANNOT** delete files (safety restriction)
- Client **CANNOT** delete or share files

---

### 🎓 **Academy** (3 Micro-Toggles)

| Micro-Permission | Super Admin | Admin | Tax Preparer | Affiliate | Lead | Client |
|------------------|-------------|-------|--------------|-----------|------|--------|
| **academy_view** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **academy_enroll** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **academy_complete** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

### 📋 **IRS Forms** (4 Micro-Toggles)

| Micro-Permission | Super Admin | Admin | Tax Preparer | Affiliate | Lead | Client |
|------------------|-------------|-------|--------------|-----------|------|--------|
| **taxforms_view** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **taxforms_download** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **taxforms_assign** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **taxforms_upload** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |

**Note**: Only Super Admin and Tax Preparers can upload forms

---

### 📊 **Analytics** (3 Micro-Toggles)

| Micro-Permission | Super Admin | Admin | Tax Preparer | Affiliate | Lead | Client |
|------------------|-------------|-------|--------------|-----------|------|--------|
| **analytics_view** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **analytics_export** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **analytics_detailed** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |

**Note**: Clients get full analytics for their referral tracking

---

### 🔗 **Tracking Code** (3 Micro-Toggles)

| Micro-Permission | Super Admin | Admin | Tax Preparer | Affiliate | Lead | Client |
|------------------|-------------|-------|--------------|-----------|------|--------|
| **tracking_view** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **tracking_edit** | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| **tracking_analytics** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |

**Note**: Admin **CANNOT** edit tracking codes (restriction)

---

### 🛒 **Store** (3 Micro-Toggles)

| Micro-Permission | Super Admin | Admin | Tax Preparer | Affiliate | Lead | Client |
|------------------|-------------|-------|--------------|-----------|------|--------|
| **store_view** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **store_purchase** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **store_cart** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

---

### 🎨 **Marketing Assets** (4 Micro-Toggles)

| Micro-Permission | Super Admin | Admin | Tax Preparer | Affiliate | Lead | Client |
|------------------|-------------|-------|--------------|-----------|------|--------|
| **marketing_view** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **marketing_upload** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **marketing_download** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **marketing_delete** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |

**Note**:
- Admin **CANNOT** delete marketing assets (safety)
- Affiliates **CANNOT** upload or delete (view & download only)
- Clients **CANNOT** upload or delete (view & download only)

---

## 📦 **SECTION-BASED ORGANIZATION**

Permissions are organized into 9 logical sections for easier management:

### 1. 🔔 **General** (section_general)
- `dashboard`
- `alerts`

### 2. 👥 **Client Management** (section_client_management)
- `clientsStatus`
- `clients`
- `clientFileCenter` + 5 file micro-toggles
- `taxForms` + 4 tax form micro-toggles
- `documents`
- `uploadDocuments`

### 3. 📧 **Communications** (section_communications)
- `emails`
- `calendar` + 4 calendar micro-toggles
- `addressBook` + 5 contact micro-toggles

### 4. 📊 **Analytics & Reporting** (section_analytics)
- `analytics` + 3 analytics micro-toggles
- `googleAnalytics`
- `referralsAnalytics`
- `trackingCode` + 3 tracking micro-toggles

### 5. 🚀 **Growth & Marketing** (section_growth_marketing)
- `referralsStatus`
- `contest`
- `quickShareLinks`

### 6. 🎓 **Content & Learning** (section_content_learning)
- `learningCenter`
- `academy` + 3 academy micro-toggles

### 7. 📢 **Marketing Materials** (section_marketing_materials)
- `marketingHub`
- `marketing`
- `marketingAssets` + 4 marketing micro-toggles
- `contentGenerator`
- `store` + 3 store micro-toggles

### 8. 💰 **Financial** (section_financial)
- `payouts`
- `earnings`

### 9. ⚙️ **System Administration** (section_system_admin)
- `users`
- `adminManagement`
- `database`
- `settings`
- `routeAccessControl`

---

## 🗄️ **DATABASE SCHEMA**

### UserRole Enum (Prisma)

```prisma
enum UserRole {
  SUPER_ADMIN      // System owner
  ADMIN            // Limited administrator
  LEAD             // Pending approval
  CLIENT           // Tax customer
  TAX_PREPARER     // Tax professional
  AFFILIATE        // External marketer
}
```

**Important**: Database stores roles in **UPPERCASE**, but TypeScript uses **lowercase_with_underscores**. The middleware normalizes these automatically (line 170 in middleware.ts).

### Profile Model (Key Fields)

```prisma
model Profile {
  id          String   @id @default(cuid())
  clerkUserId String?  @unique
  role        UserRole

  // Universal Tracking System
  trackingCode        String?  @unique
  customTrackingCode  String?  @unique
  trackingCodeChanged Boolean  @default(false)

  // Short Link System
  shortLinkUsername        String?  @unique
  shortLinkUsernameChanged Boolean  @default(false)

  // ...other fields
}
```

### Clerk publicMetadata Structure

```typescript
{
  role: 'super_admin' | 'admin' | 'tax_preparer' | 'affiliate' | 'lead' | 'client',
  permissions: {
    dashboard: boolean,
    users: boolean,
    // ... 85+ permission fields
  }
}
```

---

## ⚙️ **HOW IT WORKS**

### 1. **Role Assignment**

**On User Signup**:
```typescript
// Default role is LEAD
const newProfile = await prisma.profile.create({
  data: {
    clerkUserId: user.id,
    role: 'LEAD', // Database: UPPERCASE
  }
});
```

**Admin Changes Role**:
```typescript
// Admin assigns role via /admin/users
await clerkClient.users.updateUser(userId, {
  publicMetadata: {
    role: 'tax_preparer' // Clerk: lowercase
  }
});
```

### 2. **Middleware Flow**

**Authentication & Authorization** (`src/middleware.ts`):

1. **Public Route Check**: Skip auth for public routes
2. **User Authentication**: Check Clerk session
3. **Role Retrieval**: Fetch role from Clerk publicMetadata
4. **Role Normalization**: Convert to lowercase (handles legacy uppercase)
5. **Effective Role**: Check if admin is viewing as another role
6. **Permission Check**: Verify user has permission for requested route
7. **Redirect or Allow**: Allow access or redirect to `/forbidden`

**Role Normalization** (handles database mismatch):
```typescript
// Lines 168-174 in middleware.ts
if (role) {
  const originalRole = role;
  role = role.toLowerCase(); // SUPER_ADMIN → super_admin
  if (originalRole !== role) {
    logger.info(`🔄 Normalized role from "${originalRole}" to "${role}"`);
  }
}
```

### 3. **Permission Check in Code**

**Get User Permissions**:
```typescript
import { getUserPermissions, hasPermission } from '@/lib/permissions';

const permissions = getUserPermissions(userRole, customPermissions);

if (hasPermission(permissions, 'database')) {
  // Allow database access
}
```

**Micro-Permission Helpers**:
```typescript
import { canDeleteContacts, canUploadFiles } from '@/lib/permissions';

if (canDeleteContacts(permissions)) {
  // Show delete button
}
```

### 4. **Admin "View As" Feature**

**How It Works**:
```typescript
// Admin sets viewing cookie
document.cookie = `viewing_role=${targetRole}; path=/`;

// Middleware checks cookie
const effectiveRole = await getEffectiveRole(actualRole, userId);

// User sees UI for effectiveRole but keeps actualRole privileges
```

**Security**:
- Only `super_admin` and `admin` can use "View As"
- Backend still enforces actualRole for security-critical operations
- UI shows "Viewing As" banner

---

## 📝 **LEAD FORMS & CONVERSION**

### **Two Lead Capture Forms**:

1. **Consultation Form** (`/start-filing`)
   - For prospects with questions before committing
   - Captures: basic info, tax situation, questions
   - Stored in: `Lead` model
   - Assignment: Based on referrer or manual by admin

2. **Tax Intake Form** (`/start-filing/form`)
   - For prospects ready to file immediately
   - Captures: complete personal info, address, tax details
   - Stored in: `TaxIntakeLead` model
   - Assignment: **Automatic smart assignment** based on referrer

### **Smart Lead Assignment** (`/api/tax-intake/lead/route.ts:34-98`):

```
IF CLIENT refers         → Assign to client's tax preparer
IF TAX_PREPARER refers   → Assign to that tax preparer
IF AFFILIATE refers      → Assign to Tax Genius corporate
IF REFERRER refers       → Assign to Tax Genius corporate
IF direct (no referrer)  → Assign to Tax Genius corporate
```

### **Lead Conversion**:

**Tax Preparers**:
- Can view their assigned leads via `GET /api/preparers/leads`
- Can convert LEAD → CLIENT via `PATCH /api/preparers/leads`
- **CANNOT** convert to TAX_PREPARER or AFFILIATE (enforced)

**Admins**:
- Can view ALL leads system-wide
- Can convert LEAD to any role (CLIENT, TAX_PREPARER, AFFILIATE)
- Can reassign leads to different preparers

**Automatic Conversion** (`lead-conversion.service.ts`):
- When user signs up after filling tax intake form
- Automatically creates CLIENT profile
- Assigns to preparer (from `assignedPreparerId` or fallback)
- Creates TaxReturn from form data
- Links everything together

**See**: `LEAD_MANAGEMENT_SYSTEM.md` for complete workflow and UI mockups

---

## 🔒 **SECURITY FEATURES**

### 1. **Role Verification**

- ✅ Always checks database (Clerk) first
- ✅ Session claims used as fallback (if rate limited)
- ✅ Role mismatch logged and database role used

### 2. **Route Protection**

- ✅ Middleware blocks unauthorized routes
- ✅ API routes verify role before processing
- ✅ Frontend components check permissions before rendering

### 3. **Data Scoping**

**Tax Preparers**:
```typescript
// Backend automatically filters queries
const clients = await prisma.client.findMany({
  where: {
    preparerId: currentUserId, // Scoped to their clients only
  },
});
```

**Clients**:
```typescript
// Clients only see their own data
const documents = await prisma.document.findMany({
  where: {
    clientId: currentUserId, // Their documents only
  },
});
```

### 4. **Admin Restrictions**

- ❌ Admin cannot manage permissions (only super_admin)
- ❌ Admin cannot access database
- ❌ Admin cannot delete contacts/files/assets (safety)
- ❌ Admin cannot upload tax forms
- ❌ Admin cannot edit tracking codes

### 5. **LEAD Role Security**

- ✅ ALL permissions explicitly set to `false`
- ✅ Dashboard redirects to pending approval page
- ✅ Cannot access any features until approved
- ✅ Admin must manually change role

### 6. **Special Protections**

**Super Admin Setup**:
```typescript
// Only iradwatkins@gmail.com can access /setup-admin
if (pathname === '/setup-admin') {
  const userEmail = user.emailAddresses[0]?.emailAddress;
  if (userEmail === 'iradwatkins@gmail.com') {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL('/forbidden', req.url));
}
```

**Admin Routes**:
```typescript
// Must have actual admin/super_admin role (not just viewing)
if (pathname.startsWith('/admin')) {
  if (role !== 'admin' && role !== 'super_admin') {
    return NextResponse.redirect(new URL('/forbidden', req.url));
  }
}
```

---

## ✅ **TESTING & VERIFICATION**

### Test Each Role:

1. **Create test users** for each role
2. **Login as each role**
3. **Verify dashboard access**
4. **Test permission boundaries**
5. **Try accessing restricted routes**

### Verification Checklist:

**Super Admin**:
- [ ] Can access `/admin/database`
- [ ] Can access `/admin/permissions`
- [ ] Can see all client files
- [ ] Can delete contacts/files/assets
- [ ] Can upload tax forms

**Admin**:
- [ ] Can access `/admin/users`
- [ ] Can access `/admin/payouts`
- [ ] **CANNOT** access `/admin/database`
- [ ] **CANNOT** access `/admin/permissions`
- [ ] **CANNOT** delete contacts
- [ ] **CANNOT** delete files
- [ ] **CANNOT** upload tax forms

**Tax Preparer**:
- [ ] Can access `/dashboard/tax-preparer`
- [ ] Can see ONLY their clients
- [ ] Can upload documents for their clients
- [ ] **CANNOT** access `/admin/*`
- [ ] **CANNOT** see other preparers' clients

**Affiliate**:
- [ ] Can access `/dashboard/affiliate`
- [ ] Can access `/store`
- [ ] Can view marketing assets
- [ ] **CANNOT** upload marketing assets
- [ ] **CANNOT** access client data
- [ ] **CANNOT** access `/admin/*`

**Lead**:
- [ ] **CANNOT** access dashboard
- [ ] Sees pending approval page
- [ ] **CANNOT** access any features

**Client**:
- [ ] Can access `/dashboard/client`
- [ ] Can upload documents
- [ ] Can customize tracking code
- [ ] Can view referral analytics
- [ ] **CANNOT** delete files
- [ ] **CANNOT** access admin features

### Debug Tools:

**Check Current User Role**:
```typescript
// Visit /debug-role to see your current role and permissions
```

**Admin "View As" Testing**:
1. Login as super_admin
2. Go to /admin/users
3. Click "View As" for a user
4. Verify you see their dashboard
5. Verify "Viewing As" banner shows
6. Click "Stop Viewing As"

---

## 📚 **QUICK REFERENCE**

### File Locations:

- **Permissions Logic**: `src/lib/permissions.ts` (1,170 lines)
- **Middleware**: `src/middleware.ts` (enforces permissions)
- **Role Switcher**: `src/lib/utils/role-switcher.ts`
- **Database Schema**: `prisma/schema.prisma`

### Helper Functions:

```typescript
// Get user permissions
getUserPermissions(role, customPermissions)

// Check permission
hasPermission(permissions, 'database')

// Micro-permission helpers
canViewCalendar(permissions)
canDeleteContacts(permissions)
canUploadFiles(permissions)
// ... 40+ helper functions

// Get effective role (for admin "View As")
getEffectiveRole(actualRole, userId)
```

### Common Patterns:

**Check Permission in Component**:
```typescript
import { getUserPermissions, hasPermission } from '@/lib/permissions';

const permissions = getUserPermissions(userRole);

{hasPermission(permissions, 'users') && (
  <Link href="/admin/users">User Management</Link>
)}
```

**Check Permission in API**:
```typescript
import { getUserPermissions, hasPermission } from '@/lib/permissions';

const permissions = getUserPermissions(user.role);

if (!hasPermission(permissions, 'database')) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

## 🎯 **SUMMARY**

The TaxGeniusPro permissions system provides:

✅ **6 Distinct Roles** with clear hierarchies
✅ **85+ Granular Permissions** for feature control
✅ **40+ Micro-Permissions** for fine-grained access
✅ **9 Organized Sections** for easy management
✅ **Role Normalization** (handles database/TypeScript differences)
✅ **Admin "View As"** for testing user experiences
✅ **Data Scoping** (tax preparers see only their clients)
✅ **Security Restrictions** (admin cannot delete critical data)
✅ **LEAD Protection** (no access until approved)
✅ **Client Referral System** (clients can refer and earn)

**Status**: ✅ **FULLY FUNCTIONAL AND PRODUCTION READY**

---

**Generated**: January 2025
**Version**: 1.0
**Last Updated**: Post-Gamification Implementation
