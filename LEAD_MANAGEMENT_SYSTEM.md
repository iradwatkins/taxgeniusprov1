# 🎯 TaxGeniusPro - LEAD Management System

## 📋 **EXECUTIVE SUMMARY**

The LEAD role is **NOT just a "pending approval" status**. It's a sophisticated lead management system where:

- **LEADs are ASSIGNED to specific tax preparers**
- **Tax preparers can convert LEAD → CLIENT**
- **Admins can help any tax preparer convert leads**
- **Two lead forms** capture different types of prospects
- **Automatic assignment** based on referrer relationship

---

## 🔄 **LEAD WORKFLOW**

```
┌─────────────────────────────────────────────────────────────┐
│                    LEAD GENERATION                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├──► Form 1: /start-filing (Questions/Consultation)
                              │     - People with questions before committing
                              │     - Stored in "Lead" model
                              │
                              └──► Form 2: /start-filing/form (Tax Intake)
                                    - People ready to file immediately
                                    - Stored in "TaxIntakeLead" model
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   SMART LEAD ASSIGNMENT                     │
│                                                             │
│  IF referred by CLIENT        → Assign to client's preparer│
│  IF referred by TAX_PREPARER  → Assign to that preparer    │
│  IF referred by AFFILIATE     → Assign to Tax Genius       │
│  IF referred by REFERRER      → Assign to Tax Genius       │
│  IF direct (no referrer)      → Assign to Tax Genius       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              PREPARER LEAD DASHBOARD                        │
│                                                             │
│  Tax Preparer sees their assigned leads:                   │
│  - Contact information                                      │
│  - Lead source/referrer                                     │
│  - Status (NEW, CONTACTED, QUALIFIED, etc.)                │
│  - Contact notes                                            │
│  - "Convert to Client" button                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    LEAD → CLIENT CONVERSION                 │
│                                                             │
│  Tax Preparer Actions:                                      │
│  1. Contact lead (phone/email)                             │
│  2. Answer questions                                        │
│  3. Qualify lead                                            │
│  4. Click "Convert to Client"                              │
│                                                             │
│  Admin Actions:                                             │
│  - Can convert ANY lead for ANY preparer                   │
│  - Helps preparers with conversions                        │
│                                                             │
│  System Actions:                                            │
│  ✅ Changes Clerk role: LEAD → CLIENT                      │
│  ✅ Creates Profile with role=CLIENT                       │
│  ✅ Assigns client to preparer (ClientPreparer)           │
│  ✅ Creates TaxReturn from intake data                     │
│  ✅ Marks lead as converted                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                CLIENT NOW IN PREPARER'S CLIENT LIST         │
│                                                             │
│  - Appears in /dashboard/tax-preparer/clients              │
│  - Can upload documents                                     │
│  - Can track tax return status                             │
│  - Can message preparer                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 **TWO LEAD FORMS**

### **Form 1: Start Filing** (`/start-filing`)

**Purpose**: Capture leads who have questions before committing

**Target Audience**:
- People exploring options
- Price comparison shoppers
- Those with complex situations
- Need consultation before deciding

**Data Captured**:
- Basic contact info (name, email, phone)
- Tax situation details
- Questions/concerns
- Preferred contact method

**Model**: `Lead` (general purpose)

**Status**: Lead must be contacted and qualified

**Outcome**: After consultation → Convert to CLIENT when ready

---

### **Form 2: Tax Intake** (`/start-filing/form`)

**Purpose**: Capture leads ready to file immediately

**Target Audience**:
- People ready to start now
- Have all documents
- Know they want to file
- Just need to submit information

**Data Captured**:
- Complete personal information
- Full address
- Tax year details
- Income sources
- Deductions
- Family information
- All form data in JSON

**Model**: `TaxIntakeLead` (tax-specific)

**Status**: Ready to convert immediately

**Outcome**: Can be converted to CLIENT right away

---

## 🎯 **SMART LEAD ASSIGNMENT**

### **Assignment Logic** (from `tax-intake/lead/route.ts:34-98`)

```typescript
IF referred by CLIENT:
  → Assign to THAT CLIENT's tax preparer
  → Client's preparer gets commission
  → Maintains client-preparer relationship

IF referred by TAX_PREPARER:
  → Assign to THAT tax preparer
  → Preparer grows their own client base
  → Direct attribution

IF referred by AFFILIATE:
  → Assign to Tax Genius corporate (null)
  → Admin assigns to available preparer
  → Affiliate gets commission

IF referred by REFERRER:
  → Assign to Tax Genius corporate (null)
  → Admin assigns to available preparer
  → Referrer gets commission

IF no referrer (direct):
  → Assign to Tax Genius corporate (null)
  → Admin assigns based on capacity/specialty
```

### **Database Fields**

**`TaxIntakeLead` Model**:
```prisma
model TaxIntakeLead {
  // Assignment
  assignedPreparerId String? // Which preparer handles this lead

  // Conversion tracking
  convertedToClient Boolean @default(false)
  profileId String?  // Link to Profile after conversion
  taxReturnId String? // Link to TaxReturn after conversion
  convertedAt DateTime?

  // Contact management
  lastContactedAt DateTime?
  contactNotes String? @db.Text
  contactMethod String? // "CALL", "APPOINTMENT", "EMAIL"
  contactRequested Boolean @default(false)
}
```

---

## 👥 **WHO CAN DO WHAT**

### **Tax Preparer Permissions**

✅ **CAN**:
- View ONLY their assigned leads
- Contact leads (phone, email)
- Add contact notes
- Change lead status (NEW → CONTACTED → QUALIFIED)
- **Convert LEAD → CLIENT** for their assigned leads
- See lead source/attribution
- View commission rates

❌ **CANNOT**:
- See other preparers' leads
- Convert lead to TAX_PREPARER or AFFILIATE
- Delete leads
- Change lead assignment
- Access system-wide lead reports

**API Endpoint**: `GET /api/preparers/leads`
**Conversion**: `PATCH /api/preparers/leads` (body: `{ userId, newRole: 'client' }`)

---

### **Admin Permissions**

✅ **CAN**:
- View ALL leads across ALL preparers
- See which preparer each lead is assigned to
- **Convert LEAD → CLIENT** for any preparer
- **Convert LEAD → TAX_PREPARER** or **LEAD → AFFILIATE**
- Change lead assignment (reassign to different preparer)
- Add/edit contact notes
- View system-wide lead reports
- Help preparers manage their leads

❌ **CANNOT**:
- Nothing restricted (full access)

**API Endpoint**: `GET /api/preparers/leads` (returns all leads)
**Conversion**: `PATCH /api/preparers/leads` (can set any role)

---

## 🔄 **LEAD → CLIENT CONVERSION**

### **Manual Conversion** (Tax Preparer or Admin)

**API**: `PATCH /api/preparers/leads`

**Request**:
```json
{
  "userId": "user_abc123",
  "newRole": "client"
}
```

**What Happens**:
1. ✅ Verifies current role is LEAD
2. ✅ Tax preparers can ONLY convert to CLIENT (enforced line 86-91)
3. ✅ Updates Clerk `publicMetadata.role` to `client`
4. ✅ Logs the conversion with actor

**Response**:
```json
{
  "success": true,
  "message": "User role changed from LEAD to CLIENT",
  "user": {
    "id": "user_abc123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "client"
  }
}
```

---

### **Automatic Conversion** (User Signs Up After Intake)

**Trigger**: User fills `/start-filing/form` THEN signs up

**Flow** (from `lead-conversion.service.ts`):

1. **User fills tax intake form** → `TaxIntakeLead` created
2. **User signs up with same email** → Clerk webhook fires
3. **Service detects lead by email** → `findLeadByEmail()`
4. **Creates CLIENT profile** → `convertLeadToClient()`
5. **Assigns tracking code** → `assignTrackingCodeToUser()`
6. **Auto-assigns to preparer** → `ClientPreparer.create()`
   - Uses lead's `assignedPreparerId`
   - Falls back to `TAX_GENIUS_PREPARER_ID` env variable
7. **Creates TaxReturn from intake data** → All form data preserved
8. **Links everything** → `lead.profileId`, `lead.taxReturnId`, `lead.convertedToClient = true`

**Result**:
- ✅ CLIENT profile created
- ✅ Assigned to correct preparer
- ✅ TaxReturn ready for preparer to review
- ✅ Lead marked as converted

---

## 📊 **LEAD DASHBOARD** (Tax Preparer View)

### **Location**: `/dashboard/tax-preparer/leads` (needs implementation)

### **Should Display**:

```
┌────────────────────────────────────────────────────────────┐
│  MY LEADS                                                  │
│  ─────────────────────────────────────────────────────────│
│                                                            │
│  Filters: [ All ] [ New ] [ Contacted ] [ Qualified ]     │
│  Search: [________________]                                │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🔵 NEW - John Smith                           1h ago │ │
│  │ john.smith@email.com · (555) 123-4567                │ │
│  │ Source: Referral from Sarah Johnson                  │ │
│  │ Form: Tax Intake (Ready to file)                     │ │
│  │ [Contact] [Add Note] [Convert to Client]            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🟡 CONTACTED - Jane Doe                        2d ago│ │
│  │ jane.doe@email.com · (555) 234-5678                  │ │
│  │ Source: Direct (no referrer)                         │ │
│  │ Form: Consultation (Has questions)                   │ │
│  │ Last contacted: Yesterday at 2:30 PM                 │ │
│  │ Note: "Needs to gather W-2s, will call back Friday" │ │
│  │ [Call Again] [Add Note] [Convert to Client]         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 🟢 QUALIFIED - Mike Brown                      1w ago│ │
│  │ mike.brown@email.com · (555) 345-6789                │ │
│  │ Source: Tracking code TGP-12345                      │ │
│  │ Form: Tax Intake (All info submitted)               │ │
│  │ Ready to convert - All documents received            │ │
│  │ [✅ Convert to Client]                               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### **Key Features**:

1. **Status Indicators**:
   - 🔵 NEW - Just submitted, not contacted yet
   - 🟡 CONTACTED - Preparer reached out
   - 🟢 QUALIFIED - Ready to convert
   - 🔴 DISQUALIFIED - Not a good fit
   - ⚪ CONVERTED - Already client

2. **Contact Management**:
   - Call button (integrates with phone system)
   - Email button (opens email client)
   - Add/view notes
   - Track last contact date

3. **Lead Information**:
   - Form type (Consultation vs Tax Intake)
   - Source/attribution
   - Referrer information
   - Time since submission

4. **Conversion**:
   - "Convert to Client" button
   - Confirmation modal
   - Assigns to preparer automatically

---

## 📊 **ADMIN LEAD DASHBOARD**

### **Location**: `/admin/clients-status` (or `/admin/leads`)

### **Should Display**:

```
┌────────────────────────────────────────────────────────────┐
│  ALL LEADS (System-Wide)                                   │
│  ─────────────────────────────────────────────────────────│
│                                                            │
│  Filter by Preparer: [ All Preparers ▼ ]                  │
│  Filter by Status: [ All ▼ ]  Form Type: [ All ▼ ]        │
│  Search: [________________]                                │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ John Smith · john.smith@email.com                     │ │
│  │ Assigned to: Jane Preparer                            │ │
│  │ Status: NEW · Source: Client Referral                 │ │
│  │ [View Details] [Reassign] [Convert] [Contact]        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Sarah Johnson · sarah.j@email.com                     │ │
│  │ Assigned to: Tax Genius Corporate (Unassigned)        │ │
│  │ Status: NEW · Source: Affiliate Referral              │ │
│  │ [Assign Preparer ▼] [Convert] [Contact]              │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### **Admin Capabilities**:

1. **View All Leads**: See every lead across all preparers
2. **Reassign Leads**: Move lead from one preparer to another
3. **Convert to Any Role**: Can convert to CLIENT, TAX_PREPARER, or AFFILIATE
4. **Help Preparers**: Assist with conversions and lead management
5. **System Reports**: Lead conversion rates, response times, etc.

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **Current Status** ✅

**What's Working**:
- ✅ Two lead forms (consultation + intake)
- ✅ Smart lead assignment based on referrer
- ✅ `TaxIntakeLead` and `Lead` models
- ✅ API for fetching preparer's leads (`GET /api/preparers/leads`)
- ✅ API for converting LEAD → CLIENT (`PATCH /api/preparers/leads`)
- ✅ Automatic conversion on signup (`lead-conversion.service.ts`)
- ✅ Tax preparer restriction (can only convert to CLIENT)
- ✅ Admin can convert to any role

**What Needs Implementation** 🚧:
- ❌ Tax preparer lead dashboard UI (`/dashboard/tax-preparer/leads`)
- ❌ Admin lead management UI (`/admin/leads` or enhance `/admin/clients-status`)
- ❌ Contact management interface
- ❌ Lead status workflow (NEW → CONTACTED → QUALIFIED)
- ❌ Reassignment interface for admins

---

### **Key Files**:

1. **Lead Capture**:
   - `/start-filing/form/page.tsx` - Tax intake form
   - `/start-filing/page.tsx` - Consultation form
   - `SimpleTaxForm` component

2. **Lead Models**:
   - `prisma/schema.prisma` - `Lead` and `TaxIntakeLead` models

3. **Lead Assignment**:
   - `/api/tax-intake/lead/route.ts` - Smart assignment logic (lines 34-98)

4. **Lead Management**:
   - `/api/preparers/leads/route.ts` - Fetch and convert leads
   - `GET` - Fetch preparer's leads
   - `PATCH` - Convert LEAD → CLIENT

5. **Automatic Conversion**:
   - `src/lib/services/lead-conversion.service.ts` - Auto-conversion on signup

6. **Permissions**:
   - `src/lib/permissions.ts` - Role permissions
   - LEAD role has NO permissions (all explicitly `false`)

---

## 📋 **PERMISSIONS SUMMARY**

### **LEAD Role Permissions**

```typescript
lead: {
  dashboard: false,    // Shows pending approval page
  settings: false,     // No access until approved
  // ALL micro-toggles: false
}
```

### **Tax Preparer Can**:

```typescript
tax_preparer: {
  clients: true,       // See THEIR clients
  documents: true,     // Client documents
  // ... other preparer features
}
```

**LEAD Management**:
- ✅ View leads assigned to them
- ✅ Convert LEAD → CLIENT (their leads only)
- ❌ Cannot convert to TAX_PREPARER or AFFILIATE
- ❌ Cannot see other preparers' leads

---

## 🎯 **USE CASES**

### **Use Case 1: Client Referral**

**Scenario**: Existing client Sarah refers her friend John

1. John clicks Sarah's referral link
2. John fills tax intake form at `/start-filing/form`
3. System detects Sarah is a CLIENT
4. System assigns John to Sarah's tax preparer (Mike)
5. John shows up in Mike's lead dashboard
6. Mike contacts John, answers questions
7. Mike clicks "Convert to Client"
8. John is now Mike's client
9. Sarah earns referral commission

---

### **Use Case 2: Tax Preparer Self-Generated Lead**

**Scenario**: Tax preparer Jane shares her tracking code

1. Prospect fills form with Jane's tracking code
2. Lead assigned to Jane automatically
3. Jane sees lead in her dashboard
4. Jane converts to client
5. Client appears in Jane's client list

---

### **Use Case 3: Affiliate Referral**

**Scenario**: Affiliate Bob runs Facebook ads

1. User clicks Bob's affiliate link
2. User fills tax intake form
3. Lead assigned to Tax Genius corporate (null)
4. Admin assigns to available preparer
5. Preparer contacts and converts
6. Bob earns affiliate commission

---

### **Use Case 4: Direct Lead**

**Scenario**: User finds site via Google

1. User arrives at site directly (no referrer)
2. User fills tax intake form
3. Lead assigned to Tax Genius corporate (null)
4. Admin reviews and assigns to best preparer
5. Preparer contacts and converts

---

## 🚀 **NEXT STEPS FOR FULL IMPLEMENTATION**

### **Priority 1: Tax Preparer Lead Dashboard**

**Create**: `/dashboard/tax-preparer/leads/page.tsx`

**Features**:
- Fetch leads via `GET /api/preparers/leads`
- Display lead cards with contact info
- Status indicators (NEW, CONTACTED, QUALIFIED)
- Contact management (add notes, track calls)
- "Convert to Client" button
- Filter by status, search by name/email

**Time Estimate**: 4-6 hours

---

### **Priority 2: Admin Lead Management**

**Enhance**: `/admin/clients-status` or create `/admin/leads`

**Features**:
- View all leads system-wide
- Filter by preparer assignment
- Reassign leads to different preparers
- Convert to CLIENT, TAX_PREPARER, or AFFILIATE
- System-wide lead reports

**Time Estimate**: 4-6 hours

---

### **Priority 3: Lead Status Workflow**

**Add**: Status field and transitions

**Statuses**:
- NEW → lead just submitted
- CONTACTED → preparer reached out
- QUALIFIED → ready to convert
- DISQUALIFIED → not a good fit
- CONVERTED → now a client

**Time Estimate**: 2-3 hours

---

### **Priority 4: Contact Management**

**Features**:
- Add/view contact notes
- Track contact history
- Set follow-up reminders
- Email/call logging

**Time Estimate**: 3-4 hours

---

## ✅ **SUMMARY**

The LEAD system in TaxGeniusPro is a sophisticated lead management platform:

✅ **LEAD ≠ Pending Approval** - Leads are assigned to tax preparers
✅ **Two Forms** - Consultation and Tax Intake
✅ **Smart Assignment** - Based on referrer relationship
✅ **Tax Preparers Manage** - Contact, qualify, and convert their leads
✅ **Admins Assist** - Help any preparer with lead management
✅ **Automatic Conversion** - User signup triggers CLIENT creation
✅ **Permissions Enforced** - Tax preparers can only convert to CLIENT

**Current Implementation**: ✅ Backend complete, 🚧 Frontend needs dashboards

**Ready to Build**: Tax preparer and admin lead management UIs

---

**Generated**: January 2025
**Status**: Backend ✅ Complete | Frontend 🚧 Needs Implementation
**Documentation**: Complete

