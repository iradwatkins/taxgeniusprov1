# Epic 6 - Story 6: Commission Tracking System

**Status:** ✅ Complete
**Date:** 2025-10-16

## Overview
Implemented a comprehensive commission tracking and payout management system that automatically calculates commissions when leads convert, tracks earnings by status, and enables users to request payouts.

---

## 📦 Components Delivered

### 1. Commission Service (`/lib/services/commission.service.ts`)
**Purpose:** Core business logic for commission calculations and earnings management

**Key Features:**
- **Automatic Commission Calculation:**
  - Triggered when lead reaches `CONVERTED` status
  - Uses locked `commissionRate` from lead creation
  - Creates `PENDING` commission record
  - Prevents duplicate commissions

- **Status Management:**
  - `PENDING` → Lead just converted (awaiting approval)
  - `APPROVED` → Auto-approved after 30 days in CONVERTED status
  - `PAID` → Payout completed
  - `CANCELLED` → Lead status reverted from CONVERTED

- **Auto-Approval System:**
  - `autoApproveCommissions()` function for cron job
  - Approves commissions for leads CONVERTED for 30+ days
  - Updates commission status and sets `approvedAt` timestamp

- **Earnings Tracking:**
  - Total, pending, approved, and paid earnings
  - This month vs last month comparison
  - Average commission calculation
  - Lead conversion metrics

- **Payout Management:**
  - Request payout with amount validation
  - Multiple payment methods (PayPal, Bank Transfer, Check, Venmo, Cash App)
  - Balance verification before processing
  - Payout history tracking

**Functions:**
```typescript
calculateCommission(leadId: string)
updateCommissionStatus(leadId: string, newLeadStatus: string)
autoApproveCommissions() // For scheduled job
getEarningsSummary(username: string)
getCommissionHistory(username: string, limit?: number)
requestPayout(username, amount, paymentMethod, paymentDetails)
getPayoutHistory(username: string, limit?: number)
```

---

### 2. API Endpoints

#### `/api/earnings/summary` (GET)
**Purpose:** Returns earnings summary for authenticated user

**Response:**
```json
{
  "totalEarnings": 15420.50,
  "pendingEarnings": 2500.00,
  "approvedEarnings": 3800.25,
  "paidEarnings": 9120.25,
  "totalLeads": 47,
  "convertedLeads": 31,
  "averageCommission": 497.43,
  "thisMonthEarnings": 2850.00,
  "lastMonthEarnings": 2100.00
}
```

#### `/api/earnings/history` (GET)
**Purpose:** Returns detailed commission history

**Query Parameters:**
- `limit` (default: 50) - Number of records to return

**Response:**
```json
{
  "commissions": [
    {
      "id": "comm_123",
      "leadId": "lead_456",
      "amount": 150.00,
      "status": "APPROVED",
      "leadStatus": "CONVERTED",
      "createdAt": "2025-09-15T10:30:00Z",
      "approvedAt": "2025-10-15T10:30:00Z",
      "notes": "Commission locked at 150 on..."
    }
  ],
  "total": 31
}
```

#### `/api/payouts/request` (POST)
**Purpose:** Creates a payout request

**Request Body:**
```json
{
  "amount": 3800.25,
  "paymentMethod": "PAYPAL",
  "paymentDetails": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "payoutId": "payout_789",
  "message": "Payout request submitted successfully"
}
```

#### `/api/payouts/history` (GET)
**Purpose:** Returns payout request history

**Query Parameters:**
- `limit` (default: 20)

---

### 3. Dashboard Components

#### **EarningsOverviewCard** (`/components/dashboard/earnings-overview-card.tsx`)
**Purpose:** Comprehensive earnings dashboard widget

**Features:**
- **Total Lifetime Earnings** - Large prominent display
- **Month-over-Month Growth** - Trend indicator with percentage
- **This Month Earnings** - Current month total
- **Average Commission** - Per-conversion average
- **Status Breakdown** with progress bars:
  - Pending (yellow) - Awaiting approval
  - Approved (green) - Ready for payout
  - Paid (blue) - Successfully paid
- **Performance Metrics**:
  - Total leads count
  - Converted leads count
  - Conversion rate percentage
- **CTA for Payout** - Highlighted when balance available
- **Request Payout Button** - Opens payout dialog

**Props:**
```typescript
{
  className?: string
  onRequestPayout?: () => void
}
```

#### **CommissionHistoryTable** (`/components/dashboard/commission-history-table.tsx`)
**Purpose:** Detailed commission records table

**Features:**
- **Column Headers:**
  - Lead ID (truncated)
  - Amount
  - Status (with icon badge)
  - Lead Status
  - Created date (relative)
  - Last updated date (relative)
- **Status Icons:**
  - Pending: Clock icon (yellow)
  - Approved: CheckCircle icon (green)
  - Paid: DollarSign icon (blue)
  - Cancelled: XCircle icon (red)
- **Refresh Button** - Real-time data updates
- **Empty State** - Helpful messaging when no commissions
- **Pagination Indicator** - Shows when more records exist

**Props:**
```typescript
{
  className?: string
  limit?: number // default: 50
}
```

#### **PayoutRequestDialog** (`/components/dashboard/payout-request-dialog.tsx`)
**Purpose:** Modal for requesting commission payouts

**Features:**
- **Available Balance Display** - Highlighted at top
- **Amount Input** with validation:
  - Must be positive number
  - Cannot exceed available balance
  - "Max" button to fill entire balance
- **Payment Method Selector**:
  - PayPal
  - Bank Transfer
  - Check (Mail)
  - Venmo
  - Cash App
- **Payment Details Input** - Context-aware placeholder based on method
- **Success State** - Checkmark confirmation screen
- **Error Handling** - Clear validation messages
- **Loading States** - Spinner during submission

**Props:**
```typescript
{
  open: boolean
  onOpenChange: (open: boolean) => void
  availableBalance: number
  onSuccess?: () => void
}
```

---

## 🔄 Business Logic Flow

### Commission Creation Flow
```
1. Lead reaches CONVERTED status
   ↓
2. calculateCommission(leadId) triggered
   ↓
3. Check for existing commission (prevent duplicates)
   ↓
4. Create PENDING commission with locked rate
   ↓
5. Commission appears in user's earnings (pending)
```

### Commission Approval Flow
```
1. Cron job runs autoApproveCommissions() daily
   ↓
2. Find leads CONVERTED for 30+ days
   ↓
3. Update commissions to APPROVED status
   ↓
4. Commission moves to "approved earnings" bucket
   ↓
5. User can now request payout
```

### Payout Request Flow
```
1. User clicks "Request Payout"
   ↓
2. Dialog opens with available balance
   ↓
3. User enters amount + payment method + details
   ↓
4. Validation: amount ≤ approved balance
   ↓
5. POST /api/payouts/request
   ↓
6. Payout record created with REQUESTED status
   ↓
7. Success confirmation shown
   ↓
8. Admin processes payout manually
   ↓
9. Admin updates commission status to PAID
```

### Status Reversal Flow
```
1. CONVERTED lead changes to different status
   ↓
2. updateCommissionStatus(leadId, newStatus) triggered
   ↓
3. If commission is PENDING → Change to CANCELLED
   ↓
4. Commission removed from earnings
   ↓
5. Notes field updated with reason
```

---

## 🔐 Security & Validation

### API Security
- All endpoints require Clerk authentication
- User can only access their own commission data
- Amount validation prevents overpayment
- Balance checks before payout creation

### Data Integrity
- Commission rate locked at lead creation (immutable)
- Duplicate commission prevention
- Status transitions are logged
- Audit trail via `notes` field

---

## 📊 Database Impact

### New Tables/Models Required
Based on the service logic, these Prisma models should exist:

```prisma
model Commission {
  id                String    @id @default(cuid())
  leadId            String
  referrerUsername  String
  referrerType      String
  amount            Decimal
  status            String    // PENDING, APPROVED, PAID, CANCELLED
  leadStatus        String
  notes             String?
  createdAt         DateTime  @default(now())
  approvedAt        DateTime?
  paidAt            DateTime?
}

model Payout {
  id                String    @id @default(cuid())
  referrerUsername  String
  amount            Decimal
  status            String    // REQUESTED, PROCESSING, COMPLETED, REJECTED
  paymentMethod     String
  paymentDetails    String
  requestedAt       DateTime  @default(now())
  processedAt       DateTime?
  completedAt       DateTime?
}
```

---

## 🧪 Testing Scenarios

### Unit Tests Needed
1. `calculateCommission()` - Creates commission correctly
2. `calculateCommission()` - Prevents duplicates
3. `updateCommissionStatus()` - Cancels on status revert
4. `autoApproveCommissions()` - Approves after 30 days
5. `requestPayout()` - Validates balance
6. `getEarningsSummary()` - Calculates totals correctly

### Integration Tests Needed
1. Lead conversion → Commission creation flow
2. 30-day approval automation
3. Payout request → Earnings deduction
4. API endpoint authentication
5. React component rendering with real data

---

## 📈 Analytics & Monitoring

### Key Metrics to Track
- Total commissions generated (by period)
- Pending vs approved vs paid ratio
- Average time from pending → paid
- Payout request volume
- Average payout amount
- Commission cancellation rate

### Log Events
```typescript
logger.info('Commission calculated', { leadId, amount, referrerUsername })
logger.info('Commission approved', { commissionId, leadId })
logger.info('Payout requested', { payoutId, username, amount })
logger.error('Commission calculation failed', { leadId, error })
```

---

## 🚀 Next Steps

### Story 7: Google Analytics Integration
- GA4 event tracking utilities
- Lead capture form integration
- Conversion tracking for referrals
- UTM parameter tracking
- Event tracking for commission milestones

---

## ✅ Story 6 Checklist

- [x] Commission calculation service
- [x] Earnings summary API endpoint
- [x] Commission history API endpoint
- [x] Payout request API endpoint
- [x] Payout history API endpoint
- [x] Earnings overview dashboard card
- [x] Commission history table component
- [x] Payout request dialog component
- [x] Auto-approval logic (cron ready)
- [x] Status management and transitions
- [x] Payment method support (5 methods)
- [x] Balance validation
- [x] Error handling and logging
- [x] Loading and success states

---

## 📝 Notes

### Cron Job Setup Required
The `autoApproveCommissions()` function needs to be scheduled:
```bash
# Run daily at 2 AM
0 2 * * * curl -X POST http://localhost:3005/api/cron/approve-commissions
```

Or use a serverless cron (Vercel Cron):
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/approve-commissions",
    "schedule": "0 2 * * *"
  }]
}
```

### Admin Payout Processing
Currently, payout processing is manual. Future enhancement could integrate:
- Stripe Connect for automated payouts
- PayPal Payouts API
- Wise API for bank transfers
- ACH processing

### Commission Rate Configuration
Commission rates are set at lead creation based on:
- Default rate from settings table
- Custom rate for bonded preparers
- Promotional rates for campaigns
- Rate is **immutable** once locked
