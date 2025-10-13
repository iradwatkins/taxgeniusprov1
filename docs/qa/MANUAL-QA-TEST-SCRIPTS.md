# Tax Genius Pro - Manual QA Test Scripts

**Date**: October 10, 2025
**Purpose**: Comprehensive manual testing before production launch
**Estimated Time**: 4-6 hours (full suite)
**Testers**: Development team, QA team, or beta users

---

## Table of Contents

1. [Test Environment Setup](#test-environment-setup)
2. [Authentication Flow Tests](#authentication-flow-tests)
3. [Referral Commission Flow (End-to-End)](#referral-commission-flow-end-to-end)
4. [Tax Filing Workflow](#tax-filing-workflow)
5. [E-commerce Store Tests](#e-commerce-store-tests)
6. [Contest & Leaderboard Tests](#contest--leaderboard-tests)
7. [Admin Panel Tests](#admin-panel-tests)
8. [Security & Rate Limiting Tests](#security--rate-limiting-tests)
9. [Email Notification Tests](#email-notification-tests)
10. [Performance Tests](#performance-tests)

---

## Test Environment Setup

### Prerequisites

1. **Test Accounts Required**:
   - [ ] Admin account
   - [ ] Referrer account (at least 2)
   - [ ] Tax preparer account
   - [ ] Client account (at least 3)

2. **Test Data**:
   - [ ] Sample tax documents (W2, 1099, receipts)
   - [ ] Test credit card (Square sandbox): `4111 1111 1111 1111`
   - [ ] Test email addresses (use + notation: yourname+test1@gmail.com)

3. **Browser Setup**:
   - [ ] Chrome/Firefox (latest version)
   - [ ] Private/Incognito mode available
   - [ ] Developer tools enabled

4. **Credentials Template**:
```
Admin Account:
  Email: admin+test@taxgeniuspro.tax
  Password: [set during test]
  Role: ADMIN

Referrer Account 1:
  Email: referrer1+test@gmail.com
  Name: Sarah Johnson
  Vanity Slug: sarah
  Role: REFERRER

Referrer Account 2:
  Email: referrer2+test@gmail.com
  Name: Mike Thompson
  Vanity Slug: mike
  Role: REFERRER

Preparer Account:
  Email: preparer+test@gmail.com
  Name: Jane Smith, CPA
  Role: PREPARER

Client Accounts:
  Email: client1+test@gmail.com (referred by sarah)
  Email: client2+test@gmail.com (referred by sarah)
  Email: client3+test@gmail.com (referred by mike)
```

---

## Test 1: Authentication Flow Tests

**Estimated Time**: 30 minutes

### Test 1.1: Client Sign Up

**Steps**:
1. [ ] Navigate to https://taxgeniuspro.tax
2. [ ] Click "Get Started" or "File Your Taxes"
3. [ ] Click "Sign Up"
4. [ ] Enter email: `client1+test@gmail.com`
5. [ ] Enter password (min 8 characters)
6. [ ] Enter first name: "John"
7. [ ] Enter last name: "Doe"
8. [ ] Click "Create Account"

**Expected Results**:
- ✅ Account created successfully
- ✅ Redirected to `/dashboard` or `/start-filing`
- ✅ Welcome message displayed
- ✅ Profile created with role: CLIENT
- ✅ Email verification sent (check Resend dashboard)

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Notes: _______________

---

### Test 1.2: Referrer Sign Up

**Steps**:
1. [ ] Navigate to `/referral/signup`
2. [ ] Fill out referrer application form:
   - Email: `referrer1+test@gmail.com`
   - Name: Sarah Johnson
   - Phone: (555) 123-4567
   - Preferred vanity slug: `sarah`
3. [ ] Agree to terms
4. [ ] Submit application

**Expected Results**:
- ✅ Application submitted successfully
- ✅ Redirected to confirmation page
- ✅ Profile created with role: REFERRER
- ✅ Vanity URL created: `taxgeniuspro.tax/sarah`
- ✅ Confirmation email sent

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Notes: _______________

---

### Test 1.3: Social Login (OAuth)

**Steps**:
1. [ ] Navigate to `/auth/login`
2. [ ] Click "Continue with Google"
3. [ ] Select Google account
4. [ ] Authorize Tax Genius Pro

**Expected Results**:
- ✅ OAuth flow completes
- ✅ User logged in
- ✅ Profile created with Google email
- ✅ Redirected to appropriate dashboard

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Notes: _______________

---

### Test 1.4: Role-Based Dashboard Redirect

**Steps**:
1. [ ] Login as CLIENT → should redirect to `/dashboard` or `/start-filing`
2. [ ] Login as REFERRER → should redirect to `/dashboard/referrer`
3. [ ] Login as PREPARER → should redirect to `/dashboard/preparer`
4. [ ] Login as ADMIN → should redirect to `/admin`

**Expected Results**:
- ✅ Each role redirects to correct dashboard
- ✅ No access errors
- ✅ Dashboard loads with role-specific content

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Notes: _______________

---

## Test 2: Referral Commission Flow (End-to-End)

**Estimated Time**: 45 minutes

**Critical Test - This validates the entire business model!**

### Test 2.1: Create Referral Link

**Steps**:
1. [ ] Login as REFERRER (sarah)
2. [ ] Navigate to `/dashboard/referrer`
3. [ ] Locate "Your Referral Link" section
4. [ ] Copy vanity URL: `https://taxgeniuspro.tax/sarah`
5. [ ] Open URL in incognito window

**Expected Results**:
- ✅ Vanity URL works
- ✅ Landing page loads correctly
- ✅ "Get Started" button visible
- ✅ Referral tracking cookie set (check dev tools → Application → Cookies)

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Vanity URL: _______________
- Cookie set: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 2.2: Client Signs Up via Referral Link

**Steps**:
1. [ ] In incognito window (from Test 2.1)
2. [ ] Click "Get Started" or "File Now"
3. [ ] Complete sign-up form:
   - Email: `client1+test@gmail.com`
   - Name: John Doe
   - Password: [create secure password]
4. [ ] Submit

**Expected Results**:
- ✅ Account created
- ✅ Referral record created in database
- ✅ Referral status: PENDING
- ✅ referrerId: sarah's profile ID
- ✅ clientId: john's profile ID

**Database Verification**:
```sql
-- Check Referral table
SELECT * FROM referrals WHERE clientId = '[john_profile_id]';

Expected:
- referrerId: [sarah_profile_id]
- status: PENDING
- referralCode: [unique code]
```

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Referral ID: _______________
- Status: _______________
- Notes: _______________

---

### Test 2.3: Client Completes Tax Return

**Steps**:
1. [ ] Login as CLIENT (john)
2. [ ] Navigate to `/start-filing`
3. [ ] Complete tax questionnaire:
   - Tax year: 2023
   - Filing status: Single
   - Income: W2 wages
   - Deductions: Standard
4. [ ] Save draft (auto-save should work)
5. [ ] Upload documents:
   - W2 form (use sample PDF)
   - Bank statement (use sample PDF)
6. [ ] Click "Submit for Review"

**Expected Results**:
- ✅ Tax return created with status: DRAFT
- ✅ Documents uploaded successfully
- ✅ Status changes to: IN_REVIEW
- ✅ "Documents Received" email sent to client
- ✅ Preparer can see return in queue

**Database Verification**:
```sql
-- Check TaxReturn table
SELECT * FROM tax_returns WHERE profileId = '[john_profile_id]';

Expected:
- status: IN_REVIEW
- taxYear: 2023
```

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Tax Return ID: _______________
- Status: _______________
- Documents uploaded: _______________
- Email sent: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 2.4: Preparer Reviews and Files Return

**Steps**:
1. [ ] Login as PREPARER (jane)
2. [ ] Navigate to `/dashboard/preparer`
3. [ ] Locate John Doe's return in "Pending Review" queue
4. [ ] Click "Review"
5. [ ] View uploaded documents (test signed URLs!)
6. [ ] Click "Update Status" → select "FILED"
7. [ ] Enter filing details:
   - Refund amount: $2,500
   - Filed date: [today's date]
8. [ ] Submit

**Expected Results**:
- ✅ Status updated to: FILED
- ✅ "Return Filed" email sent to client
- ✅ **COMMISSION CREATED AUTOMATICALLY** ← CRITICAL!
- ✅ Commission amount: $35 (STANDARD package)
- ✅ Commission status: PENDING
- ✅ Referral status updated to: COMPLETED
- ✅ Referral.returnFiledDate: [today's date]
- ✅ Referral.commissionEarned: $35
- ✅ "Commission Earned" email sent to referrer (sarah)

**Database Verification**:
```sql
-- Check Commission table
SELECT * FROM commissions WHERE referralId = '[referral_id]';

Expected:
- amount: 35.00 (STANDARD rate)
- status: PENDING
- referrerId: [sarah_profile_id]

-- Check Referral table
SELECT * FROM referrals WHERE id = '[referral_id]';

Expected:
- status: COMPLETED
- returnFiledDate: [today's date]
- commissionEarned: 35.00
```

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Commission created: [ ] YES / [ ] NO
- Commission ID: _______________
- Commission amount: $_______________
- Commission status: _______________
- Referral status: _______________
- Email sent to referrer: [ ] YES / [ ] NO
- Notes: _______________

**🚨 CRITICAL: If commission was NOT created automatically, this is a BLOCKER! 🚨**

---

### Test 2.5: Referrer Views Earnings

**Steps**:
1. [ ] Login as REFERRER (sarah)
2. [ ] Navigate to `/dashboard/referrer`
3. [ ] Check stats:
   - Total Referrals
   - Active Referrals
   - Total Earnings
   - Pending Balance
4. [ ] Click "View Earnings" or navigate to `/dashboard/referrer/earnings`

**Expected Results**:
- ✅ Total Referrals: 1
- ✅ Active Referrals: 0 (moved to completed)
- ✅ Total Earnings: $35
- ✅ Pending Balance: $35
- ✅ Pending commissions table shows 1 row:
  - Client: John D. (first name + last initial for privacy)
  - Amount: $35.00
  - Status: PENDING
  - Date Earned: [today's date]

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Total Referrals: _______________
- Total Earnings: $_______________
- Pending Balance: $_______________
- Pending commissions visible: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 2.6: Referrer Requests Payout

**Steps**:
1. [ ] On `/dashboard/referrer/earnings` page
2. [ ] Click "Request Payout" button
3. [ ] Verify minimum $50 check:
   - Current balance: $35
   - Should show: "Minimum payout amount is $50. Current balance: $35"
4. [ ] Complete another referral (repeat steps 2.2-2.4 with client2)
5. [ ] Return to earnings page
6. [ ] Pending balance should now be: $70 ($35 + $35)
7. [ ] Click "Request Payout"
8. [ ] Select payment method: "Bank Transfer"
9. [ ] Add notes: "Please send to Chase account ending in 1234"
10. [ ] Submit request

**Expected Results**:
- ✅ Minimum $50 validation works
- ✅ After 2nd commission, balance = $70
- ✅ Payout request dialog opens
- ✅ Payment method options visible (Bank Transfer, PayPal, Square Cash, Venmo)
- ✅ Payout request created in database
- ✅ Payout request status: PENDING
- ✅ Commission status updated to: PROCESSING (both commissions)
- ✅ "Payout Confirmation" email sent to referrer
- ✅ "Payout Request" email sent to admin

**Database Verification**:
```sql
-- Check PayoutRequest table
SELECT * FROM payout_requests WHERE referrerId = '[sarah_profile_id]';

Expected:
- amount: 70.00
- status: PENDING
- paymentMethod: BANK_TRANSFER
- commissionIds: [array of 2 commission IDs]

-- Check Commission table
SELECT * FROM commissions WHERE referrerId = '[sarah_profile_id]';

Expected (both commissions):
- status: PROCESSING
```

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Minimum validation: [ ] PASS / [ ] FAIL
- Payout request ID: _______________
- Payout amount: $_______________
- Commission IDs included: _______________
- Commissions updated to PROCESSING: [ ] YES / [ ] NO
- Email sent to referrer: [ ] YES / [ ] NO
- Email sent to admin: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 2.7: Admin Approves Payout

**Steps**:
1. [ ] Login as ADMIN
2. [ ] Navigate to `/admin/payouts`
3. [ ] Verify "Pending" tab shows 1 payout request
4. [ ] Stats should show:
   - Pending Requests: 1
   - Pending Amount: $70
5. [ ] Click "Review" on Sarah's payout
6. [ ] Review payout details:
   - Referrer: Sarah Johnson
   - Amount: $70.00
   - Payment method: Bank Transfer
   - Commissions: 2 (view list)
7. [ ] Click "Approve Payout"
8. [ ] Enter payment reference: "ACH-2025-001"
9. [ ] Confirm approval

**Expected Results**:
- ✅ Payout request visible in admin panel
- ✅ Payout details displayed correctly
- ✅ Commission list shows both commissions
- ✅ After approval:
  - Payout status: PAID
  - Payout processedAt: [current timestamp]
  - Payout paymentRef: "ACH-2025-001"
- ✅ Both commissions updated:
  - Status: PAID
  - paidAt: [current timestamp]
  - paymentRef: "ACH-2025-001"
- ✅ "Payout Completed" email sent to referrer
- ✅ Payout moved to "Paid" tab in admin panel

**Database Verification**:
```sql
-- Check PayoutRequest table
SELECT * FROM payout_requests WHERE id = '[payout_request_id]';

Expected:
- status: PAID
- processedAt: [timestamp]
- paymentRef: ACH-2025-001

-- Check Commission table
SELECT * FROM commissions WHERE id IN ('[commission_id_1]', '[commission_id_2]');

Expected (both):
- status: PAID
- paidAt: [timestamp]
- paymentRef: ACH-2025-001
```

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Payout visible in admin: [ ] YES / [ ] NO
- Approval successful: [ ] YES / [ ] NO
- Payout status: _______________
- Commission statuses: _______________
- Email sent: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 2.8: Referrer Views Payout History

**Steps**:
1. [ ] Login as REFERRER (sarah)
2. [ ] Navigate to `/dashboard/referrer/earnings`
3. [ ] Check stats:
   - Pending Balance: $0 (paid out)
   - Total Earnings: $70
   - Total Paid Out: $70
4. [ ] Scroll to "Payout History" section

**Expected Results**:
- ✅ Pending Balance: $0.00
- ✅ Total Earnings: $70.00
- ✅ Total Paid Out: $70.00
- ✅ Payout history table shows 1 row:
  - Amount: $70.00
  - Status: PAID (green badge)
  - Method: Bank Transfer
  - Date: [today's date]
  - Reference: ACH-2025-001

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Stats correct: [ ] YES / [ ] NO
- Payout history visible: [ ] YES / [ ] NO
- Data accurate: [ ] YES / [ ] NO
- Notes: _______________

---

**✅ END-TO-END REFERRAL FLOW COMPLETE**

**Summary**:
- Total time: _____ minutes
- Tests passed: _____ / 8
- Critical issues: _______________
- Non-critical issues: _______________

---

## Test 3: Tax Filing Workflow

**Estimated Time**: 30 minutes

### Test 3.1: Tax Questionnaire Auto-Save

**Steps**:
1. [ ] Login as CLIENT
2. [ ] Navigate to `/start-filing`
3. [ ] Start filling questionnaire
4. [ ] Fill out 3-4 fields
5. [ ] Wait 5 seconds (auto-save debounce)
6. [ ] Check browser console for "Draft saved" message
7. [ ] Refresh page
8. [ ] Verify fields are still filled

**Expected Results**:
- ✅ Form auto-saves every 5 seconds after changes
- ✅ Console shows "Draft saved" message
- ✅ After refresh, data persists
- ✅ No data loss

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Auto-save working: [ ] YES / [ ] NO
- Data persists: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 3.2: Document Upload

**Steps**:
1. [ ] Navigate to `/upload-documents`
2. [ ] Select category: "W2"
3. [ ] Click "Upload" or drag-and-drop
4. [ ] Select sample W2 PDF
5. [ ] Wait for upload to complete
6. [ ] Upload 4 more documents (different categories)

**Expected Results**:
- ✅ Upload progress indicator shows
- ✅ File uploads successfully
- ✅ Document appears in list with:
  - Filename
  - File type icon
  - File size
  - Upload date
  - Category badge
- ✅ Can upload multiple files
- ✅ All documents visible in list

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Upload successful: [ ] YES / [ ] NO
- Documents visible: _____ / 5
- Notes: _______________

---

### Test 3.3: Document Viewing (Signed URLs)

**Steps**:
1. [ ] Login as PREPARER
2. [ ] Navigate to `/dashboard/preparer`
3. [ ] Click "Documents" tab
4. [ ] Find client with uploaded documents
5. [ ] Click Eye icon (View) on first document
6. [ ] Document should open in new tab or modal
7. [ ] Copy the URL from address bar
8. [ ] Wait 16 minutes
9. [ ] Try to access same URL again

**Expected Results**:
- ✅ Document loads correctly
- ✅ URL format: `https://taxgeniuspro.tax/api/documents/view/[JWT_TOKEN]`
- ✅ Document displays (PDF viewer or download)
- ✅ After 15 minutes, token expires
- ✅ Expired token shows: "Invalid or expired token" error

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Document loaded: [ ] YES / [ ] NO
- URL format correct: [ ] YES / [ ] NO
- Token expiry working: [ ] YES / [ ] NO (wait 16 minutes)
- Notes: _______________

---

### Test 3.4: Status Update with Email Triggers

**Steps**:
1. [ ] Login as PREPARER
2. [ ] Open client's tax return
3. [ ] Update status: DRAFT → IN_REVIEW
4. [ ] Check client email for "Documents Received" email
5. [ ] Update status: IN_REVIEW → FILED
6. [ ] Enter refund amount: $2,500
7. [ ] Check client email for "Return Filed" email
8. [ ] Check referrer email for "Commission Earned" email

**Expected Results**:
- ✅ Status updates successfully
- ✅ "Documents Received" email sent when → IN_REVIEW
- ✅ "Return Filed" email sent when → FILED
- ✅ "Commission Earned" email sent to referrer (if applicable)
- ✅ All emails formatted correctly
- ✅ All emails contain relevant data (client name, amounts, dates)

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Emails sent: _____ / 3
- Email formatting: [ ] GOOD / [ ] ISSUES
- Notes: _______________

---

## Test 4: E-commerce Store Tests

**Estimated Time**: 20 minutes

### Test 4.1: Browse Products

**Steps**:
1. [ ] Navigate to `/store`
2. [ ] Verify 3 products display:
   - Tax Genius Pro T-Shirt ($24.99)
   - Branded Business Cards ($49.99)
   - Referrer Welcome Kit ($79.99)
3. [ ] Click on each product
4. [ ] View product details

**Expected Results**:
- ✅ All 3 products visible
- ✅ Product images load
- ✅ Prices displayed correctly
- ✅ Product descriptions show
- ✅ "Add to Cart" button visible

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Products visible: _____ / 3
- Images loaded: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 4.2: Checkout with Square (Sandbox Mode)

**Steps**:
1. [ ] Add "Business Cards" to cart ($49.99)
2. [ ] Click cart icon
3. [ ] Verify cart shows 1 item, total: $49.99
4. [ ] Click "Checkout"
5. [ ] Redirected to Square payment page
6. [ ] Use test card: `4111 1111 1111 1111`
7. [ ] CVV: 123
8. [ ] Expiry: any future date
9. [ ] ZIP: 12345
10. [ ] Complete payment
11. [ ] Should redirect to `/store/success`

**Expected Results**:
- ✅ Cart updates correctly
- ✅ Checkout redirects to Square
- ✅ Test card accepted (sandbox mode)
- ✅ Payment processes
- ✅ Redirects to success page
- ✅ Order created in database
- ✅ Order status: PAID
- ✅ Order confirmation email sent

**Database Verification**:
```sql
-- Check Order table
SELECT * FROM orders ORDER BY createdAt DESC LIMIT 1;

Expected:
- status: PAID
- totalAmount: 49.99
- squareOrderId: [square_order_id]
- squarePaymentId: [square_payment_id]
```

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Payment successful: [ ] YES / [ ] NO
- Order ID: _______________
- Order status: _______________
- Email sent: [ ] YES / [ ] NO
- Notes: _______________

---

## Test 5: Contest & Leaderboard Tests

**Estimated Time**: 25 minutes

### Test 5.1: View Active Contest

**Steps**:
1. [ ] Login as REFERRER
2. [ ] Navigate to `/dashboard/referrer`
3. [ ] Click "Contests" tab
4. [ ] Verify active contest displays (if exists)

**Expected Results**:
- ✅ Active contests visible
- ✅ Contest details show:
  - Title
  - Description
  - Start/end dates
  - Contest type (Most Referrals, Most Returns, Highest Earnings)
  - Prize description
- ✅ "Join Contest" button visible

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Contests visible: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 5.2: View Leaderboard

**Steps**:
1. [ ] On Contests tab
2. [ ] Click on active contest
3. [ ] View leaderboard

**Expected Results**:
- ✅ Leaderboard displays top 10 referrers
- ✅ Shows rank, name, score
- ✅ Current user's rank highlighted
- ✅ Real-time data

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Leaderboard visible: [ ] YES / [ ] NO
- Current user rank visible: [ ] YES / [ ] NO
- Notes: _______________

---

## Test 6: Admin Panel Tests

**Estimated Time**: 20 minutes

### Test 6.1: Admin Dashboard Access

**Steps**:
1. [ ] Login as ADMIN
2. [ ] Navigate to `/admin`
3. [ ] Verify admin dashboard loads
4. [ ] Check sidebar navigation

**Expected Results**:
- ✅ Dashboard loads without errors
- ✅ Admin-only navigation visible
- ✅ Stats/metrics displayed
- ✅ Quick actions available

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Notes: _______________

---

### Test 6.2: Payout Management

**Steps**:
1. [ ] Navigate to `/admin/payouts`
2. [ ] View pending payouts
3. [ ] Click "Review" on a payout
4. [ ] Approve or reject

**Expected Results**:
- ✅ Payout list displays
- ✅ Tabs work (Pending, Approved, Paid, Rejected)
- ✅ Detail view shows all info
- ✅ Approve/reject functionality works

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Notes: _______________

---

## Test 7: Security & Rate Limiting Tests

**Estimated Time**: 30 minutes

### Test 7.1: Document Download Rate Limiting

**Steps**:
1. [ ] Login as PREPARER
2. [ ] Write a simple script to make 35 rapid requests:
```javascript
// Run in browser console
for (let i = 0; i < 35; i++) {
  fetch('/api/documents/[doc_id]/download', {
    headers: { 'Authorization': 'Bearer [token]' }
  }).then(r => console.log(i, r.status))
}
```
3. [ ] Check responses

**Expected Results**:
- ✅ Requests 1-30: Status 200 (success)
- ✅ Requests 31-35: Status 429 (rate limited)
- ✅ Response includes:
  - `X-RateLimit-Limit: 30`
  - `X-RateLimit-Remaining: 0`
  - `retryAfter: [seconds]`

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Rate limit triggered: [ ] YES / [ ] NO
- Correct status code: [ ] YES / [ ] NO
- Headers present: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 7.2: Upload Rate Limiting

**Steps**:
1. [ ] Login as CLIENT
2. [ ] Attempt to upload 21 files within 1 hour
3. [ ] Check response on 21st upload

**Expected Results**:
- ✅ Uploads 1-20: Success (200)
- ✅ Upload 21: Rate limited (429)
- ✅ Error message: "Upload limit exceeded. Please try again later."
- ✅ Includes `retryAfter` in seconds

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Rate limit triggered: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 7.3: Unauthorized Access

**Steps**:
1. [ ] Logout completely
2. [ ] Try to access `/admin` (should redirect to login)
3. [ ] Try to access `/dashboard/referrer` (should redirect to login)
4. [ ] Try to GET `/api/documents/[doc_id]/download` without auth
5. [ ] Login as CLIENT
6. [ ] Try to access `/admin` (should show 403 Forbidden)
7. [ ] Try to access `/dashboard/preparer` (should show 403 Forbidden)

**Expected Results**:
- ✅ Unauthenticated users redirected to login
- ✅ API returns 401 Unauthorized
- ✅ Wrong role shows 403 Forbidden
- ✅ No sensitive data exposed

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Auth checks working: [ ] YES / [ ] NO
- Notes: _______________

---

## Test 8: Email Notification Tests

**Estimated Time**: 20 minutes

**Prerequisites**: Check Resend dashboard at https://resend.com/emails

### Test 8.1: Documents Received Email

**Trigger**: Client submits tax return for review

**Expected Content**:
- ✅ Subject: "We've Received Your Documents!"
- ✅ Client name in greeting
- ✅ List of uploaded documents
- ✅ Next steps explanation
- ✅ Support contact info

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Email received: [ ] YES / [ ] NO
- Content correct: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 8.2: Return Filed Email

**Trigger**: Preparer updates status to FILED

**Expected Content**:
- ✅ Subject: "Your Tax Return Has Been Filed!"
- ✅ Client name
- ✅ Refund amount (or owe amount)
- ✅ Filing confirmation
- ✅ Referral invitation link

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Email received: [ ] YES / [ ] NO
- Content correct: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 8.3: Commission Earned Email

**Trigger**: Tax return filed for referred client

**Expected Content**:
- ✅ Subject: "You've Earned a Commission!"
- ✅ Referrer name
- ✅ Client name (first name only)
- ✅ Commission amount
- ✅ Total pending balance
- ✅ Link to earnings page

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Email received: [ ] YES / [ ] NO
- Content correct: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 8.4: Payout Confirmation Email

**Trigger**: Referrer requests payout

**Expected Content**:
- ✅ Subject: "Payout Request Received"
- ✅ Referrer name
- ✅ Payout amount
- ✅ Payment method
- ✅ Processing timeline
- ✅ Support contact

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Email received: [ ] YES / [ ] NO
- Content correct: [ ] YES / [ ] NO
- Notes: _______________

---

### Test 8.5: Payout Completed Email

**Trigger**: Admin approves payout

**Expected Content**:
- ✅ Subject: "Payout Completed!"
- ✅ Referrer name
- ✅ Amount paid
- ✅ Payment reference number
- ✅ Payment method
- ✅ Receipt/confirmation

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Email received: [ ] YES / [ ] NO
- Content correct: [ ] YES / [ ] NO
- Notes: _______________

---

## Test 9: Performance Tests

**Estimated Time**: 15 minutes

### Test 9.1: Page Load Times

**Tools**: Chrome DevTools → Network tab

**Steps**:
1. [ ] Clear cache
2. [ ] Navigate to each page
3. [ ] Record load time

**Pages to Test**:
- [ ] Homepage: _____ ms (target: < 2000ms)
- [ ] /dashboard: _____ ms (target: < 3000ms)
- [ ] /dashboard/referrer: _____ ms (target: < 3000ms)
- [ ] /dashboard/preparer: _____ ms (target: < 3000ms)
- [ ] /store: _____ ms (target: < 2000ms)
- [ ] /admin/payouts: _____ ms (target: < 3000ms)

**Expected Results**:
- ✅ All pages load in < 3 seconds
- ✅ No console errors
- ✅ No 404s for assets

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Slowest page: _______________
- Issues found: _______________

---

### Test 9.2: Mobile Responsiveness

**Steps**:
1. [ ] Open Chrome DevTools
2. [ ] Toggle device toolbar (Cmd+Shift+M)
3. [ ] Test on:
   - [ ] iPhone 12 Pro (390×844)
   - [ ] iPad Air (820×1180)
   - [ ] Desktop (1920×1080)

**Check**:
- [ ] Dashboard layout adapts
- [ ] Navigation menu responsive
- [ ] Tables scroll or stack
- [ ] Forms usable on mobile
- [ ] No horizontal scroll

**Actual Results**:
- [ ] PASS / [ ] FAIL
- Mobile issues: _______________

---

## Test Summary

### Overall Results

**Total Tests**: ~50 test cases
**Tests Passed**: _____ / 50
**Tests Failed**: _____ / 50
**Blockers Found**: _____
**Critical Issues**: _____
**Minor Issues**: _____

### Critical User Flows Status

- [ ] **Authentication**: PASS / FAIL
- [ ] **Referral Commission (E2E)**: PASS / FAIL ← MOST CRITICAL
- [ ] **Tax Filing**: PASS / FAIL
- [ ] **E-commerce**: PASS / FAIL
- [ ] **Admin Panel**: PASS / FAIL
- [ ] **Security**: PASS / FAIL

### Recommendation

- [ ] **READY FOR SOFT LAUNCH** (< 3 critical issues)
- [ ] **NEEDS FIXES BEFORE LAUNCH** (3-5 critical issues)
- [ ] **NOT READY** (> 5 critical issues)

### Notes

_______________________________________________
_______________________________________________
_______________________________________________

---

**Test Completed By**: _______________
**Date**: _______________
**Signature**: _______________

---

**Next Steps**:
1. Fix all critical issues
2. Re-test failed test cases
3. Get stakeholder sign-off
4. Proceed to soft launch (invite-only beta)
5. Monitor for 1 week
6. Address any issues found
7. Proceed to public launch

---

**Questions or Issues?**
Contact development team immediately if:
- Commission automation fails (Test 2.4)
- Payments fail (Test 4.2)
- Rate limiting doesn't work (Test 7.1, 7.2)
- Security vulnerabilities found (Test 7.3)
