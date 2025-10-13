# Epic 3: Client & Preparer Core Workflow - Completion Status

## Overview
This document tracks the completion status of Epic 3 stories and identifies what's built vs what remains.

---

## Story 3.1: Client Document Submission Questionnaire

### Status: ✅ **80% COMPLETE** (UI Built, Backend Integration Needed)

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| **Multi-step questionnaire UI** | ✅ COMPLETE | `/dashboard/client` | Tabbed interface with sections |
| **Personal Info section** | ✅ COMPLETE | Client dashboard tabs | Form fields present |
| **Income section** | ✅ COMPLETE | Client dashboard tabs | Input components ready |
| **Deductions section** | ✅ COMPLETE | Client dashboard tabs | UI implemented |
| **File upload component** | ✅ COMPLETE | Client dashboard | Upload UI exists |
| **Form validation** | ✅ COMPLETE | `react-hook-form` | Validation implemented |
| **Auto-save progress** | ⚠️ PARTIAL | Frontend only | Needs backend API |
| **Backend API - Save data** | ❌ NEEDED | `/api/submissions/*` | Create submission endpoints |
| **Backend API - Upload files** | ✅ EXISTS | `/api/upload` | File upload endpoint exists |
| **Database schema** | ✅ EXISTS | Prisma schema | TaxSubmission model exists |

**What's Missing:**
1. Backend API endpoints for questionnaire data submission
2. Database integration for auto-save
3. Progress tracking in database

**Estimated Time to Complete:** 2-3 hours

---

## Story 3.2: Two-Step Lead Form Flow

### Status: ✅ **100% COMPLETE**

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| **Lead-gen form UI** | ✅ COMPLETE | `/` (home page) | Contact/Apply CTAs |
| **Thank you page** | ✅ COMPLETE | `/apply` | Application confirmation |
| **Pre-fill logic** | ✅ COMPLETE | `/apply` page | URL params supported |
| **Leads database table** | ✅ EXISTS | Prisma schema | Lead model exists |
| **Lead capture API** | ✅ EXISTS | Contact form | Lead creation functional |

**Status:** ✅ **NO ACTION NEEDED**

---

## Story 3.3: Preparer Client & Document Portal

### Status: ✅ **85% COMPLETE** (UI Built, Real Data Integration Needed)

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| **Preparer dashboard UI** | ✅ COMPLETE | `/dashboard/preparer` | Full dashboard exists |
| **Client list view** | ✅ COMPLETE | Preparer dashboard | List UI implemented |
| **Client status display** | ✅ COMPLETE | UI components | Status badges present |
| **Client detail view** | ✅ COMPLETE | Modal/detail panel | Detail UI exists |
| **Document download links** | ✅ COMPLETE | UI components | Download buttons present |
| **Backend - Fetch clients** | ⚠️ MOCK DATA | Frontend hooks | Using placeholder data |
| **Backend - Document URLs** | ❌ NEEDED | `/api/documents/[id]` | Secure URL generation needed |
| **Row-level security** | ⚠️ PARTIAL | Prisma schema | Relations exist, RLS needed |

**What's Missing:**
1. Backend API to fetch preparer's assigned clients
2. Secure document URL generation (time-limited URLs)
3. Database query implementation
4. Row-level security enforcement

**Estimated Time to Complete:** 3-4 hours

---

## Story 3.4: "Silent Partner" Automated Emails

### Status: ⚠️ **40% COMPLETE** (Infrastructure Ready, Templates Needed)

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| **Email service configured** | ✅ COMPLETE | Resend integration | `email.service.ts` exists |
| **Email templates - Submission received** | ❌ NEEDED | `/emails/*` | Create React Email template |
| **Email templates - Return filed** | ❌ NEEDED | `/emails/*` | Create template |
| **Status change triggers** | ❌ NEEDED | API routes | Implement status update logic |
| **Preparer name personalization** | ⚠️ PARTIAL | Database | Preparer info in DB, not used |
| **Email sending logic** | ✅ COMPLETE | `email.service.ts` | Service methods exist |

**What's Missing:**
1. Email templates using React Email
2. Trigger logic when submission status changes
3. Preparer assignment logic
4. Dynamic preparer name injection in emails

**Estimated Time to Complete:** 4-5 hours

---

## Story 3.5: Post-Filing Referral Invitation

### Status: ⚠️ **50% COMPLETE** (Referral System Exists, Filing Trigger Needed)

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| **Referral sign-up page** | ✅ COMPLETE | `/auth/select-role` | Role selection includes referrer |
| **Referral dashboard** | ✅ COMPLETE | `/dashboard/referrer` | Full referrer dashboard built |
| **Email template - Referral invite** | ❌ NEEDED | `/emails/*` | Create invitation template |
| **"Mark as Filed" button** | ⚠️ PARTIAL | Preparer dashboard UI | Button exists, no backend |
| **Filing status trigger** | ❌ NEEDED | API route | Create status update endpoint |
| **Referral link generation** | ✅ COMPLETE | Vanity link system | Already functional |
| **Email sending on filing** | ❌ NEEDED | Status change hook | Implement trigger |

**What's Missing:**
1. Backend API for "Mark as Filed" action
2. Email template for referral invitation
3. Trigger to send email on status change
4. Link referral to filed return

**Estimated Time to Complete:** 3-4 hours

---

## Overall Epic 3 Completion Summary

| Story | Status | Completion % | Priority | Effort |
|-------|--------|--------------|----------|--------|
| 3.1: Client Document Submission | ✅ UI Done | 80% | HIGH | 2-3h |
| 3.2: Two-Step Lead Form | ✅ Complete | 100% | - | 0h |
| 3.3: Preparer Portal | ✅ UI Done | 85% | HIGH | 3-4h |
| 3.4: Silent Partner Emails | ⚠️ Partial | 40% | MEDIUM | 4-5h |
| 3.5: Post-Filing Referral | ⚠️ Partial | 50% | MEDIUM | 3-4h |

**Overall Epic 3 Completion:** 71% → Target: 100%

**Total Remaining Effort:** 12-16 hours of development

---

## What's Already Built (Current 71%)

### ✅ **Fully Functional:**
1. All dashboard UI shells (Client, Preparer, Referrer)
2. Complete referrer dashboard with vanity links, QR codes, contests
3. Tax advance application flow
4. Lead capture forms
5. File upload infrastructure
6. Email service integration (Resend)
7. Database schema with all tables
8. Authentication and role-based access

### ✅ **Partially Built (Needs Backend Connection):**
1. Client questionnaire UI (needs API integration)
2. Preparer client list (needs real data)
3. Document management UI (needs secure URLs)
4. Status tracking UI (needs database persistence)

---

## Completion Roadmap to 100%

### Phase 1: Core Data Flow (6-7 hours)
**Priority: HIGH - Required for MVP**

1. **Story 3.1 Backend** (2-3h):
   - Create `/api/submissions/save` POST endpoint
   - Implement auto-save with debounce
   - Store questionnaire data in database
   - Return saved submission ID

2. **Story 3.3 Backend** (3-4h):
   - Create `/api/preparers/clients` GET endpoint
   - Implement preparer-client assignment logic
   - Generate secure document download URLs (signed URLs with expiry)
   - Add Row-Level Security (RLS) middleware

### Phase 2: Email Automation (6-8 hours)
**Priority: MEDIUM - Enhances UX**

3. **Story 3.4 Templates** (2-3h):
   - Create "Documents Received" email template
   - Create "Return Filed" email template
   - Use React Email for templating
   - Add preparer personalization

4. **Story 3.4 & 3.5 Triggers** (4-5h):
   - Create `/api/submissions/[id]/status` PATCH endpoint
   - Implement status change webhook/trigger
   - Send automated emails on status changes
   - Add referral invitation to "Filed" status

---

## Database Schema Reference

### Already Exists in Prisma:

```prisma
model TaxSubmission {
  id              String   @id @default(cuid())
  clientId        String
  preparerId      String?
  status          SubmissionStatus
  questionnaireData Json   // Stores form responses
  documents       Document[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum SubmissionStatus {
  DRAFT
  SUBMITTED
  IN_REVIEW
  FILED
  COMPLETED
}

model Document {
  id           String @id @default(cuid())
  submissionId String
  fileName     String
  fileUrl      String
  fileType     String
  uploadedAt   DateTime @default(now())
}

model PreparerAssignment {
  id         String @id @default(cuid())
  preparerId String
  clientId   String
  assignedAt DateTime @default(now())
}
```

**Status:** ✅ Schema is production-ready

---

## Quick Wins (Can Complete in 1 Session)

### Option A: Complete Stories 3.1 + 3.3 (Backend Integration)
**Impact:** Functional client submission + preparer review workflow
**Time:** 5-7 hours
**Result:** Epic 3 jumps to 90%+

### Option B: Complete Email Automation (Stories 3.4 + 3.5)
**Impact:** Professional automated communication
**Time:** 6-8 hours
**Result:** Epic 3 jumps to 85%+

---

## Recommendation

**To reach 100% before moving to Epic 4:**

1. **TODAY:** Complete Phase 1 (Stories 3.1 + 3.3 backends) - 6-7 hours
   - This unlocks the core tax filing workflow
   - Clients can submit, preparers can review

2. **TOMORROW:** Complete Phase 2 (Email automation) - 6-8 hours
   - Adds professional touch with automated emails
   - Completes referral invitation loop

**Alternative (Fast Track to Next Epic):**

- Mark Stories 3.4 and 3.5 as "Nice to Have" for Epic 3.5 (future iteration)
- Complete only Stories 3.1 + 3.3 backends (6-7 hours)
- Move to Epic 4 with 85% Epic 3 completion
- Circle back to email automation when you have more user feedback

---

## Current Verdict

**Epic 3 Status:** ⚠️ **71% COMPLETE**

**Path to 100%:**
- Core workflow (3.1 + 3.3): 6-7 hours → **Brings to 90%**
- Email automation (3.4 + 3.5): 6-8 hours → **Brings to 100%**

**Total:** 12-15 hours to full completion

**Recommendation:** Complete core workflow today, then proceed to Epic 4. Email automation can be parallel track or follow-up.

---

**Updated:** October 9, 2025
**Next Review:** After backend API implementation
