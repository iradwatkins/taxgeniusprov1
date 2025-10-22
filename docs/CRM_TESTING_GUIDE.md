# CRM Contact Detail - Manual Testing Guide

## Overview

This guide provides step-by-step instructions for manually testing the CRM Contact Detail functionality with both **Admin** and **Tax Preparer** roles.

## Prerequisites

- Two test accounts:
  - Admin account (role: `admin` or `super_admin`)
  - Tax Preparer account (role: `tax_preparer`)
- At least 2 CRM contacts in the database:
  - One assigned to the tax preparer
  - One unassigned or assigned to a different preparer

## Test Suite 1: Admin Role Testing

### Test 1.1: View CRM Contacts List

**Steps:**

1. Log in as Admin
2. Navigate to `/crm/contacts`
3. Verify the page loads successfully

**Expected Results:**

- ✅ Page displays without errors
- ✅ All contacts are visible (not filtered by assignment)
- ✅ Contact table shows: Name, Email, Type, Stage, Assigned Preparer
- ✅ Search and filter controls are present

---

### Test 1.2: View Contact Detail Page

**Steps:**

1. From contacts list, click on any contact
2. Or navigate directly to `/crm/contacts/[contactId]`

**Expected Results:**

- ✅ Contact detail page loads
- ✅ Contact info card displays: Name, Email, Phone, Company, Assigned Preparer
- ✅ Stats cards show: Total Appointments, Total Interactions, Documents, Tax Returns
- ✅ Tabs are visible: Timeline, Appointments, Documents, Returns
- ✅ Quick action buttons: "Log Activity", "Schedule Appointment", "Edit Contact"

---

### Test 1.3: Log a Phone Call Interaction

**Steps:**

1. On contact detail page, click "Log Activity" button
2. In the dialog:
   - Select Type: "Phone Call"
   - Select Direction: "Outbound"
   - Enter Duration: "15" minutes
   - Enter Subject: "Initial consultation call"
   - Enter Notes: "Discussed tax situation, needs business return"
3. Click "Log Interaction"

**Expected Results:**

- ✅ Dialog opens with all form fields
- ✅ Type selector shows: Phone Call, Email, Meeting, Note, Other
- ✅ Direction shows: Outbound (I initiated), Inbound (They initiated)
- ✅ Duration field appears for Phone Call type
- ✅ After submit: Success toast appears
- ✅ Dialog closes
- ✅ Timeline tab now shows the new interaction
- ✅ Stats card "Total Interactions" increments by 1

---

### Test 1.4: Log an Email Interaction

**Steps:**

1. Click "Log Activity" again
2. Select Type: "Email"
3. Direction: "Inbound"
4. Subject: "Question about deductions"
5. Body: "Client asked about home office deduction eligibility"
6. Click "Log Interaction"

**Expected Results:**

- ✅ Email specific placeholders shown
- ✅ Duration field hidden (not relevant for emails)
- ✅ Interaction saved successfully
- ✅ Appears in Timeline with mail icon
- ✅ Shows "Inbound" badge with arrow icon

---

### Test 1.5: Log a Note

**Steps:**

1. Click "Log Activity"
2. Select Type: "Note"
3. Subject: (leave empty - optional for notes)
4. Body: "Client mentioned they're self-employed, will need Schedule C"
5. Save

**Expected Results:**

- ✅ Subject field is optional
- ✅ Note saves successfully
- ✅ Appears in timeline with note icon

---

### Test 1.6: View Timeline

**Steps:**

1. Click "Timeline" tab
2. Scroll through activities

**Expected Results:**

- ✅ Activities displayed in chronological order (newest first)
- ✅ Each item shows icon based on type (phone, email, calendar, note)
- ✅ Date and time displayed clearly
- ✅ Interaction direction shown with badges (Inbound/Outbound)
- ✅ Full notes/body text visible in expandable section
- ✅ If no activities: "No activity yet" empty state shown

---

### Test 1.7: View Appointments Tab

**Steps:**

1. Click "Appointments" tab

**Expected Results:**

- ✅ List of all appointments for this contact
- ✅ Shows: Date, Time, Type, Status
- ✅ Color-coded status badges
- ✅ Empty state if no appointments

---

### Test 1.8: Access Any Contact (Admin Privilege)

**Steps:**

1. Navigate to a contact assigned to another preparer
2. Try to view details and log interactions

**Expected Results:**

- ✅ Admin can view ALL contacts regardless of assignment
- ✅ Admin can log interactions with any contact
- ✅ No "Forbidden" errors

---

## Test Suite 2: Tax Preparer Role Testing

### Test 2.1: View Assigned Contacts Only

**Steps:**

1. Log in as Tax Preparer
2. Navigate to `/crm/contacts`

**Expected Results:**

- ✅ Only contacts assigned to this preparer are shown
- ✅ Contacts assigned to other preparers are hidden
- ✅ Unassigned contacts may or may not be visible (check business logic)

---

### Test 2.2: Access Assigned Contact

**Steps:**

1. Click on a contact assigned to you
2. Navigate to contact detail page

**Expected Results:**

- ✅ Page loads successfully
- ✅ All sections visible: Contact info, Stats, Tabs
- ✅ Can log interactions
- ✅ Can view timeline and appointments

---

### Test 2.3: Try to Access Unassigned Contact (Security Test)

**Steps:**

1. Get the ID of a contact NOT assigned to you
2. Try to navigate directly: `/crm/contacts/[unassigned-contact-id]`

**Expected Results:**

- ✅ Redirected to `/forbidden` page OR
- ✅ Redirected back to `/crm/contacts` with error toast OR
- ✅ Shows "Access Denied" message
- ❌ SHOULD NOT show contact details

---

### Test 2.4: Try to Log Interaction with Unassigned Contact (API Security Test)

**Steps:**

1. Open browser DevTools → Network tab
2. Try to POST to `/api/crm/interactions` with contactId of unassigned contact
3. Use payload:

```json
{
  "contactId": "unassigned-contact-id",
  "type": "PHONE_CALL",
  "direction": "OUTBOUND",
  "subject": "Unauthorized attempt",
  "body": "This should fail"
}
```

**Expected Results:**

- ✅ API returns 403 Forbidden
- ✅ Error message: "Forbidden" or "You do not have permission"
- ✅ Interaction is NOT created
- ❌ SHOULD NOT return 200/201 success

---

### Test 2.5: Log Interaction with Assigned Contact

**Steps:**

1. On an assigned contact detail page
2. Log a phone call, email, or note

**Expected Results:**

- ✅ Works identical to Admin flow
- ✅ Interaction saved successfully
- ✅ Appears in timeline

---

## Test Suite 3: UI/UX Verification

### Test 3.1: Empty Timeline State

**Steps:**

1. Find or create a new contact with no interactions/appointments
2. View Timeline tab

**Expected Results:**

- ✅ Shows empty state with icon
- ✅ Message: "No activity yet"
- ✅ Helpful text about logging first interaction

---

### Test 3.2: Interaction Icons

**Steps:**

1. Create interactions of each type
2. View timeline

**Expected Results:**

- ✅ Phone Call = Phone icon
- ✅ Email = Mail icon
- ✅ Meeting = Calendar icon
- ✅ Note = File/Note icon
- ✅ Other = Message icon

---

### Test 3.3: Direction Badges

**Steps:**

1. Create both Inbound and Outbound interactions
2. Check timeline display

**Expected Results:**

- ✅ Outbound shows up arrow badge
- ✅ Inbound shows down arrow badge
- ✅ Badge text: "Outbound" / "Inbound"

---

### Test 3.4: Dialog Form Validation

**Steps:**

1. Open "Log Activity" dialog
2. Try to submit without required fields

**Expected Results:**

- ✅ Type is required
- ✅ For Meetings: Duration should be validated
- ✅ Cannot submit with missing data
- ✅ Shows validation errors

---

### Test 3.5: Loading States

**Steps:**

1. Log an interaction
2. Observe the submit button

**Expected Results:**

- ✅ Button shows "Logging..." during API call
- ✅ Button is disabled during submission
- ✅ Re-enables after success/error

---

### Test 3.6: Toast Notifications

**Steps:**

1. Successfully log an interaction
2. Try to access forbidden contact (as tax_preparer)

**Expected Results:**

- ✅ Success: "Interaction Logged" toast
- ✅ Error: "Access Denied" or relevant error toast
- ✅ Toasts auto-dismiss after a few seconds

---

## Test Suite 4: Database Verification

### Test 4.1: Interaction Persisted

**Steps:**

1. Log an interaction through UI
2. Check database:

```sql
SELECT * FROM crm_interactions
WHERE "contactId" = '[contact-id]'
ORDER BY "createdAt" DESC LIMIT 5;
```

**Expected Results:**

- ✅ New row exists with correct data
- ✅ `clerkUserId` matches logged-in user
- ✅ `type`, `direction`, `subject`, `body` all correct
- ✅ `createdAt` is recent

---

### Test 4.2: Contact Last Contacted Date Updated

**Steps:**

1. Log an interaction
2. Check contact record:

```sql
SELECT "lastContactedAt"
FROM crm_contacts
WHERE id = '[contact-id]';
```

**Expected Results:**

- ✅ `lastContactedAt` is updated to current timestamp
- ✅ Matches the interaction `createdAt` time

---

## Test Suite 5: Integration with Calendar

### Test 5.1: Appointments in Timeline

**Steps:**

1. Create an appointment for a contact (via `/admin/calendar`)
2. Go to that contact's detail page
3. View Timeline tab

**Expected Results:**

- ✅ Appointment appears in timeline
- ✅ Sorted chronologically with interactions
- ✅ Shows appointment type, status, date/time
- ✅ Different visual style from interactions (calendar icon, etc.)

---

### Test 5.2: Schedule Appointment from Contact Page

**Steps:**

1. On contact detail page, click "Schedule Appointment"
2. Fill in appointment details
3. Save

**Expected Results:**

- ✅ Opens appointment scheduling dialog (if implemented)
- ✅ Contact info pre-filled
- ✅ Appointment saves successfully
- ✅ Appears in both calendar and contact timeline

---

## Test Results Checklist

### Admin Role

- [ ] Can view all contacts
- [ ] Can access any contact detail
- [ ] Can log interactions with any contact
- [ ] All interaction types work (phone, email, meeting, note)
- [ ] Timeline displays correctly
- [ ] No permission errors

### Tax Preparer Role

- [ ] Sees only assigned contacts
- [ ] Can access assigned contact details
- [ ] CANNOT access unassigned contacts (403 or redirect)
- [ ] Can log interactions with assigned contacts
- [ ] Timeline works for assigned contacts
- [ ] Row-level security enforced

### API Security

- [ ] All endpoints require authentication (307/401)
- [ ] Tax preparers blocked from unassigned contacts (403)
- [ ] Interaction POST returns 403 for unauthorized contacts
- [ ] Clerk headers present in responses

### UI/UX

- [ ] Empty states shown when appropriate
- [ ] Loading states during API calls
- [ ] Success/error toasts displayed
- [ ] Form validation working
- [ ] Icons match interaction types
- [ ] Direction badges correct
- [ ] Chronological timeline ordering

---

## Known Issues / Notes

- Authentication must be done through Clerk UI (cannot test APIs directly without valid session)
- Row-level security depends on `assignedPreparerId` field being set correctly
- Timeline merges both appointments and interactions into one feed
- This is a **lead generation** system - not for actual tax preparation

---

## Contact Test Data

### Available Test Contacts (from database):

- `cmgxquyqk0000jxa8wakm2i56` - John Doe (john.doe@test.com) - No preparer assigned
- `cmgxquyte0007jxa8p2yz2ru2` - John Doe (assigned@test.com) - Assigned to 'preparer-profile-id'

Use these IDs for manual testing.
