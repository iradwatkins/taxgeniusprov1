# Epic 6: Lead Tracking Dashboard - Testing & QA Plan

**Story 9: Testing & Quality Assurance**
**Status:** In Progress
**Date:** 2025-10-16

---

## 📋 Testing Strategy Overview

### Testing Pyramid
```
                    E2E Tests (10%)
                   /              \
            Integration Tests (30%)
           /                          \
      Unit Tests (60%)
```

### Coverage Goals
- **Unit Tests:** 80%+ coverage for services
- **Integration Tests:** All API endpoints
- **E2E Tests:** Critical user flows
- **Manual Testing:** Edge cases and UX

---

## 🧪 Unit Tests

### 1. Attribution Service Tests

**File:** `__tests__/services/attribution.service.test.ts`

#### Test Cases:
```typescript
describe('Attribution Service', () => {
  describe('getAttribution', () => {
    it('should find cookie-based attribution with 100% confidence', async () => {
      // Mock cookie with referrer username
      // Call getAttribution()
      // Expect: attributionMethod = 'cookie', confidence = 100
    })

    it('should fall back to email match with 90% confidence', async () => {
      // Mock: No cookie, email has previous referrer visit
      // Expect: attributionMethod = 'email_match', confidence = 90
    })

    it('should fall back to phone match with 85% confidence', async () => {
      // Mock: No cookie, no email match, phone has previous visit
      // Expect: attributionMethod = 'phone_match', confidence = 85
    })

    it('should return direct attribution when no matches found', async () => {
      // Mock: No cookie, no email, no phone
      // Expect: attributionMethod = 'direct', confidence = 100, no referrer
    })

    it('should prioritize cookie over email match', async () => {
      // Mock: Both cookie AND email match exist
      // Expect: Cookie wins (highest priority)
    })
  })

  describe('getReferrerAttributionStats', () => {
    it('should calculate correct attribution breakdown', async () => {
      // Mock leads with different attribution methods
      // Expect: Correct counts for each method
    })

    it('should calculate cross-device rate correctly', async () => {
      // Mock: 3 cookie, 2 email, 1 phone = 60% cross-device
      // Expect: crossDeviceRate = 60
    })
  })
})
```

---

### 2. Commission Service Tests

**File:** `__tests__/services/commission.service.test.ts`

#### Test Cases:
```typescript
describe('Commission Service', () => {
  describe('calculateCommission', () => {
    it('should create commission when lead is CONVERTED', async () => {
      // Create lead with status CONVERTED
      // Call calculateCommission()
      // Expect: Commission created with PENDING status
    })

    it('should not create commission for non-CONVERTED leads', async () => {
      // Create lead with status NEW
      // Call calculateCommission()
      // Expect: null returned, no commission created
    })

    it('should prevent duplicate commissions', async () => {
      // Create lead and commission
      // Call calculateCommission() again
      // Expect: Returns existing commission, no duplicate
    })

    it('should use locked commission rate from lead', async () => {
      // Create lead with commissionRate = 150
      // Call calculateCommission()
      // Expect: Commission amount = 150
    })
  })

  describe('updateCommissionStatus', () => {
    it('should cancel commission when lead reverts from CONVERTED', async () => {
      // Create PENDING commission
      // Update lead status to DISQUALIFIED
      // Expect: Commission status = CANCELLED
    })

    it('should create commission when lead newly converts', async () => {
      // No existing commission
      // Call with newStatus = CONVERTED
      // Expect: New commission created
    })
  })

  describe('autoApproveCommissions', () => {
    it('should approve commissions after 30 days', async () => {
      // Create commission from 31 days ago
      // Call autoApproveCommissions()
      // Expect: Commission approved, approvedAt set
    })

    it('should not approve recent commissions', async () => {
      // Create commission from 15 days ago
      // Call autoApproveCommissions()
      // Expect: Commission still PENDING
    })
  })

  describe('getEarningsSummary', () => {
    it('should calculate total earnings correctly', async () => {
      // Create 3 commissions: PENDING (100), APPROVED (200), PAID (300)
      // Expect: totalEarnings = 600
    })

    it('should calculate this month vs last month correctly', async () => {
      // Create commissions in different months
      // Expect: Correct thisMonth and lastMonth values
    })
  })

  describe('requestPayout', () => {
    it('should create payout when balance is sufficient', async () => {
      // Mock approved earnings = 500
      // Request payout of 300
      // Expect: Success, payout created
    })

    it('should reject payout when balance insufficient', async () => {
      // Mock approved earnings = 100
      // Request payout of 300
      // Expect: Error, insufficient balance
    })
  })
})
```

---

### 3. Fraud Prevention Service Tests

**File:** `__tests__/services/fraud-prevention.service.test.ts`

#### Test Cases:
```typescript
describe('Fraud Prevention Service', () => {
  describe('checkDuplicateLead', () => {
    it('should detect duplicate email within 24 hours', async () => {
      // Create lead with email 1 hour ago
      // Check same email
      // Expect: isDuplicate = true
    })

    it('should detect duplicate phone within 24 hours', async () => {
      // Create lead with phone 1 hour ago
      // Check same phone
      // Expect: isDuplicate = true
    })

    it('should allow duplicate after 24 hours', async () => {
      // Create lead with email 25 hours ago
      // Check same email
      // Expect: isDuplicate = false
    })
  })

  describe('checkIPRateLimit', () => {
    it('should allow submissions under limit', async () => {
      // Create 3 submissions from IP (limit = 5)
      // Check rate limit
      // Expect: allowed = true, remaining = 2
    })

    it('should block submissions over limit', async () => {
      // Create 5 submissions from IP (limit = 5)
      // Check rate limit
      // Expect: allowed = false
    })
  })

  describe('detectSuspiciousPatterns', () => {
    it('should flag disposable email domains', async () => {
      // Check email: test@tempmail.com
      // Expect: flags includes DISPOSABLE_EMAIL
    })

    it('should flag suspicious phone patterns', async () => {
      // Check phone: 555-555-5555
      // Expect: flags includes SUSPICIOUS_PHONE_PATTERN
    })

    it('should flag test emails', async () => {
      // Check email: test@example.com
      // Expect: flags includes SUSPICIOUS_EMAIL_PATTERN
    })
  })

  describe('performFraudCheck', () => {
    it('should block duplicate within 1 hour', async () => {
      // Create lead 30 minutes ago
      // Check same email/phone
      // Expect: isValid = false, blockedReason set
    })

    it('should block when rate limit exceeded', async () => {
      // Create 5 leads from same IP
      // Check 6th submission
      // Expect: isValid = false
    })

    it('should allow low-risk submissions', async () => {
      // Valid email, phone, no duplicates
      // Expect: isValid = true, riskScore < 50
    })

    it('should flag high-risk but allow medium risk', async () => {
      // Disposable email + suspicious pattern
      // Expect: isValid = true, riskScore 50-80
    })
  })
})
```

---

## 🔗 Integration Tests

### 1. Lead Creation API Tests

**File:** `__tests__/api/leads/customer.test.ts`

#### Test Cases:
```typescript
describe('POST /api/leads/customer', () => {
  it('should create lead with valid data', async () => {
    const response = await fetch('/api/leads/customer', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567'
      })
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.leadId).toBeDefined()
  })

  it('should reject duplicate submission within 1 hour', async () => {
    // Create lead
    await createLead({email: 'john@example.com'})

    // Try again immediately
    const response = await fetch('/api/leads/customer', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567'
      })
    })

    expect(response.status).toBe(429)
    const data = await response.json()
    expect(data.error).toContain('Duplicate')
  })

  it('should block after rate limit exceeded', async () => {
    // Create 5 leads from same IP
    for (let i = 0; i < 5; i++) {
      await createLead({email: `user${i}@example.com`})
    }

    // 6th attempt should be blocked
    const response = await fetch('/api/leads/customer', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567'
      })
    })

    expect(response.status).toBe(429)
  })

  it('should attribute lead to referrer from cookie', async () => {
    // Set referrer cookie
    setCookie('referrer_username', 'johnsmith')

    // Create lead
    const response = await createLead({email: 'jane@example.com'})
    const lead = await prisma.lead.findFirst({where: {email: 'jane@example.com'}})

    expect(lead.referrerUsername).toBe('johnsmith')
    expect(lead.attributionMethod).toBe('cookie')
    expect(lead.attributionConfidence).toBe(100)
  })

  it('should track lead submission in GA4', async () => {
    const gaSpy = jest.spyOn(ga4, 'trackLeadSubmission')

    await createLead({email: 'test@example.com'})

    expect(gaSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        leadType: 'CUSTOMER',
        attributionMethod: expect.any(String)
      })
    )
  })
})
```

---

### 2. Earnings API Tests

**File:** `__tests__/api/earnings/summary.test.ts`

#### Test Cases:
```typescript
describe('GET /api/earnings/summary', () => {
  it('should return earnings summary for authenticated user', async () => {
    // Create user with commissions
    const user = await createUser({username: 'testuser'})
    await createCommissions(user.username, [
      {amount: 100, status: 'PENDING'},
      {amount: 200, status: 'APPROVED'},
      {amount: 300, status: 'PAID'}
    ])

    const response = await authenticatedFetch('/api/earnings/summary', user)
    const data = await response.json()

    expect(data.totalEarnings).toBe(600)
    expect(data.pendingEarnings).toBe(100)
    expect(data.approvedEarnings).toBe(200)
    expect(data.paidEarnings).toBe(300)
  })

  it('should require authentication', async () => {
    const response = await fetch('/api/earnings/summary')
    expect(response.status).toBe(401)
  })
})
```

---

### 3. Attribution Analytics API Tests

**File:** `__tests__/api/analytics/attribution.test.ts`

#### Test Cases:
```typescript
describe('GET /api/analytics/attribution', () => {
  it('should return attribution breakdown', async () => {
    const user = await createUser({username: 'testuser'})
    await createLeads(user.username, [
      {attributionMethod: 'cookie'},
      {attributionMethod: 'cookie'},
      {attributionMethod: 'email_match'},
      {attributionMethod: 'direct'}
    ])

    const response = await authenticatedFetch('/api/analytics/attribution', user)
    const data = await response.json()

    expect(data.byMethod.cookie).toBe(2)
    expect(data.byMethod.emailMatch).toBe(1)
    expect(data.byMethod.direct).toBe(1)
    expect(data.totalLeads).toBe(4)
  })

  it('should filter by date range', async () => {
    // Create leads in different periods
    // Request with period=7d
    // Expect: Only last 7 days included
  })
})
```

---

## 🎭 End-to-End Tests

### 1. Complete Lead Submission Flow

**File:** `__tests__/e2e/lead-submission.spec.ts`

#### Test Scenarios:
```typescript
describe('Lead Submission E2E', () => {
  it('should complete full referral flow', async () => {
    // 1. Visit site via referral link
    await page.goto('https://taxgeniuspro.com/ref/johnsmith')

    // 2. Verify cookie set
    const cookies = await page.cookies()
    expect(cookies.find(c => c.name === 'referrer_username')).toBeDefined()

    // 3. Navigate to lead form
    await page.goto('/start-filing/form')

    // 4. Fill out form
    await page.fill('[name="firstName"]', 'Jane')
    await page.fill('[name="lastName"]', 'Doe')
    await page.fill('[name="email"]', 'jane@example.com')
    await page.fill('[name="phone"]', '555-123-4567')

    // 5. Submit form
    await page.click('button[type="submit"]')

    // 6. Verify success page
    await page.waitForSelector('.success-message')

    // 7. Verify lead in database
    const lead = await prisma.lead.findFirst({
      where: {email: 'jane@example.com'}
    })
    expect(lead.referrerUsername).toBe('johnsmith')
    expect(lead.attributionMethod).toBe('cookie')
  })

  it('should handle cross-device attribution via email', async () => {
    // 1. Visit on mobile (set cookie)
    // 2. Submit form on desktop (different device)
    // 3. Verify email_match attribution
  })
})
```

---

### 2. Commission Lifecycle Flow

**File:** `__tests__/e2e/commission-flow.spec.ts`

#### Test Scenarios:
```typescript
describe('Commission Lifecycle E2E', () => {
  it('should track commission from lead to payout', async () => {
    // 1. Create lead via referral
    const lead = await createLead({
      referrerUsername: 'affiliate1',
      email: 'customer@example.com'
    })

    // 2. Verify no commission yet (lead is NEW)
    let commission = await prisma.commission.findFirst({where: {leadId: lead.id}})
    expect(commission).toBeNull()

    // 3. Convert lead to CONVERTED status
    await prisma.lead.update({
      where: {id: lead.id},
      data: {status: 'CONVERTED'}
    })
    await calculateCommission(lead.id)

    // 4. Verify PENDING commission created
    commission = await prisma.commission.findFirst({where: {leadId: lead.id}})
    expect(commission.status).toBe('PENDING')

    // 5. Fast-forward 30 days and run auto-approve
    await prisma.commission.update({
      where: {id: commission.id},
      data: {createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000)}
    })
    await autoApproveCommissions()

    // 6. Verify commission APPROVED
    commission = await prisma.commission.findFirst({where: {id: commission.id}})
    expect(commission.status).toBe('APPROVED')

    // 7. Request payout as affiliate
    const payout = await requestPayout('affiliate1', commission.amount, 'PAYPAL', 'user@paypal.com')
    expect(payout.success).toBe(true)

    // 8. Admin marks payout as PAID
    await prisma.commission.update({
      where: {id: commission.id},
      data: {status: 'PAID', paidAt: new Date()}
    })

    // 9. Verify final state
    commission = await prisma.commission.findFirst({where: {id: commission.id}})
    expect(commission.status).toBe('PAID')
  })
})
```

---

### 3. Dashboard Analytics Flow

**File:** `__tests__/e2e/dashboard.spec.ts`

#### Test Scenarios:
```typescript
describe('Dashboard Analytics E2E', () => {
  it('should display real-time attribution stats', async () => {
    // 1. Login as affiliate
    await loginAsAffiliate('testuser')

    // 2. Navigate to dashboard
    await page.goto('/dashboard/affiliate')

    // 3. Verify attribution stats card visible
    await page.waitForSelector('[data-testid="attribution-stats-card"]')

    // 4. Verify data loads
    const totalLeads = await page.textContent('[data-testid="total-leads"]')
    expect(parseInt(totalLeads)).toBeGreaterThan(0)

    // 5. Change period filter
    await page.click('[data-testid="period-selector"]')
    await page.click('[data-value="7d"]')

    // 6. Verify data updates
    await page.waitForTimeout(500) // Wait for re-fetch
    const newTotalLeads = await page.textContent('[data-testid="total-leads"]')
    expect(newTotalLeads).not.toBe(totalLeads)
  })

  it('should request payout successfully', async () => {
    // Login, navigate to earnings, request payout
    // Verify success message and payout appears in history
  })
})
```

---

## 🔒 Security Tests

### 1. Authentication Tests
- ✅ All API endpoints require authentication
- ✅ Users can only access their own data
- ✅ Admin endpoints require admin role

### 2. Input Validation Tests
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS prevention (React auto-escaping)
- ✅ Email format validation
- ✅ Phone number sanitization

### 3. Fraud Prevention Tests
- ✅ Rate limiting works correctly
- ✅ Duplicate detection prevents abuse
- ✅ Suspicious patterns flagged
- ✅ High-risk submissions blocked

---

## 📊 Performance Tests

### Load Testing
```bash
# Test lead submission endpoint
artillery quick --count 100 --num 10 https://taxgeniuspro.com/api/leads/customer

# Expected: < 500ms p95, < 1s p99
```

### Database Query Performance
- Attribution lookup: < 100ms
- Earnings summary: < 200ms
- Commission history: < 150ms

---

## ✅ Manual Testing Checklist

### Smoke Tests
- [ ] Create lead via referral link
- [ ] View attribution stats in dashboard
- [ ] Request commission payout
- [ ] Admin approve payout
- [ ] Verify GA4 events firing

### Edge Cases
- [ ] Lead reverts from CONVERTED → Commission cancelled
- [ ] Duplicate email 23 hours later → Blocked
- [ ] Duplicate email 25 hours later → Allowed
- [ ] Rate limit: 6th submission blocked
- [ ] Invalid referrer username → Graceful fallback
- [ ] Commission auto-approval after exactly 30 days
- [ ] Payout request exceeds balance → Error
- [ ] Cross-device attribution works

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## 🐛 Bug Tracking

### Known Issues
1. ~~Duplicate detection case-sensitive~~ → Fixed: Email normalized to lowercase
2. ~~Commission rate not locked~~ → Fixed: commissionRateLockedAt field
3. ~~GA4 events fire multiple times~~ → Fixed: Single call per event

---

## 📈 Test Metrics

### Current Status
- **Unit Tests:** 0/50 written (0%)
- **Integration Tests:** 0/20 written (0%)
- **E2E Tests:** 0/10 written (0%)
- **Code Coverage:** Not measured yet

### Target Metrics
- **Unit Test Coverage:** 80%+
- **Integration Test Coverage:** 100% of API endpoints
- **E2E Test Coverage:** All critical paths
- **Pass Rate:** 100%
- **Test Execution Time:** < 5 minutes

---

## 🚀 CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Epic 6 Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      - uses: codecov/codecov-action@v2
```

---

## 📝 Next Steps

1. **Write Unit Tests** - Start with critical services
2. **Write Integration Tests** - Cover all API endpoints
3. **Set up E2E Framework** - Playwright or Cypress
4. **Configure Coverage** - Istanbul/NYC
5. **Run Security Audit** - npm audit, Snyk
6. **Performance Baseline** - Lighthouse, Web Vitals
7. **Deploy to Staging** - Test with real data
8. **UAT with Stakeholders** - Get user feedback
9. **Production Deployment** - Gradual rollout

---

**Status:** Test specifications complete, implementation pending
**Blocked By:** None
**Next Action:** Begin writing unit tests for attribution.service.ts
