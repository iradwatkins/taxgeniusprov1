# Testing & Validation

This document provides comprehensive testing strategies and validation checklists for all Tax Genius platform migrations.

---

## Table of Contents

1. [Testing Environments](#testing-environments)
2. [Email Migration Testing](#email-migration-testing)
3. [Storage Migration Testing](#storage-migration-testing)
4. [Auth Migration Testing](#auth-migration-testing)
5. [Integration Testing](#integration-testing)
6. [Performance Testing](#performance-testing)
7. [Load Testing](#load-testing)
8. [Security Testing](#security-testing)
9. [User Acceptance Testing](#user-acceptance-testing)

---

## Testing Environments

### Local Development

```bash
# Environment: localhost:3005
# Purpose: Initial development and unit tests
# Database: Local PostgreSQL
# Email: Test mode / Resend sandbox
# Storage: Local MinIO or test bucket

# Start local environment
npm run dev

# Run tests
npm test
npm run test:e2e
```

### Staging (Optional)

```bash
# Environment: staging.taxgeniuspro.tax
# Purpose: Pre-production testing
# Database: Staging database (copy of production)
# Email: Resend test domain
# Storage: Staging MinIO instance

# Deploy to staging
npm run deploy:staging
```

### Production

```bash
# Environment: taxgeniuspro.tax
# Purpose: Live environment
# Database: Production PostgreSQL
# Email: Resend production
# Storage: Production MinIO

# Monitor production
pm2 logs taxgeniuspro
```

---

## Email Migration Testing

### Pre-Deployment Testing

**Template Rendering:**
- [ ] Templates render correctly in development
- [ ] All dynamic data displays properly
- [ ] Links work correctly
- [ ] Images load (if any)
- [ ] Styles applied correctly

**Email Client Compatibility:**
- [ ] Gmail (desktop)
- [ ] Gmail (mobile)
- [ ] Outlook (desktop)
- [ ] Outlook (mobile)
- [ ] Apple Mail
- [ ] Yahoo Mail
- [ ] ProtonMail

**Email Types:**
- [ ] Welcome email
- [ ] Password reset
- [ ] Email verification
- [ ] Lead notification (to preparer)
- [ ] Document received confirmation
- [ ] Return filed notification
- [ ] Referral invitation

### Testing Procedure

```bash
# 1. Test email service locally
npm run dev

# 2. Trigger test email
# Create test account or use test API route

# 3. Verify in Resend dashboard
# https://resend.com/emails
# Check delivery status

# 4. Check inbox
# Verify email received
# Click all links
# Verify formatting
```

### Validation Checklist

**Delivery:**
- [ ] Email sends successfully (status 200)
- [ ] Email delivered to inbox (not spam)
- [ ] Delivery time < 30 seconds
- [ ] No bounce errors

**Content:**
- [ ] Subject line correct
- [ ] From name displays correctly ("Tax Genius")
- [ ] From email correct (noreply@taxgeniuspro.tax)
- [ ] Body text renders properly
- [ ] No typos or formatting issues

**Links:**
- [ ] All links clickable
- [ ] Links go to correct destination
- [ ] Links use HTTPS
- [ ] Tracking works (if enabled)

**Unsubscribe:**
- [ ] Unsubscribe link present
- [ ] Unsubscribe works
- [ ] User removed from mailing list

### Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Delivery Time | < 30s | Resend dashboard |
| Delivery Rate | > 99% | Resend analytics |
| Bounce Rate | < 1% | Resend analytics |
| Spam Rate | < 0.1% | Resend analytics |
| Open Rate | > 40% | Resend analytics (if enabled) |

---

## Storage Migration Testing

### Pre-Migration Testing

**MinIO Setup:**
- [ ] MinIO container running
- [ ] MinIO accessible via Nginx
- [ ] SSL certificate valid
- [ ] Console login works
- [ ] Buckets created

**Network:**
- [ ] DNS resolves correctly
- [ ] HTTPS works
- [ ] No SSL warnings
- [ ] Acceptable latency (<100ms)

### File Operation Testing

**Upload Tests:**
```bash
# Small file (< 1MB)
curl -X PUT -T small-file.pdf \
  "$(npm run generate-upload-url -- tax-documents test-small.pdf)"

# Medium file (1-10MB)
curl -X PUT -T medium-file.pdf \
  "$(npm run generate-upload-url -- tax-documents test-medium.pdf)"

# Large file (10-50MB)
curl -X PUT -T large-file.pdf \
  "$(npm run generate-upload-url -- tax-documents test-large.pdf)"
```

**Download Tests:**
```bash
# Generate download URL
npm run generate-download-url -- tax-documents test-small.pdf

# Test download
curl -o downloaded.pdf "<PRESIGNED_URL>"

# Verify file integrity
md5sum small-file.pdf downloaded.pdf
# Should match
```

### Validation Checklist

**Basic Operations:**
- [ ] Upload file succeeds
- [ ] Download file succeeds
- [ ] Delete file succeeds
- [ ] List files works
- [ ] File metadata correct

**Presigned URLs:**
- [ ] Upload URL works
- [ ] Download URL works
- [ ] URLs expire correctly (600s for upload, 3600s for download)
- [ ] Expired URLs return 403
- [ ] Invalid URLs return 403

**Public vs Private:**
- [ ] Public bucket files accessible without auth
- [ ] Private bucket files require presigned URL
- [ ] Anonymous access blocked on private buckets

**File Types:**
- [ ] PDF files upload/download correctly
- [ ] Image files (PNG, JPG) work
- [ ] Excel files (XLSX) work
- [ ] ZIP files work
- [ ] Large files (>10MB) work

**Error Handling:**
- [ ] Invalid bucket returns 404
- [ ] Missing file returns 404
- [ ] Network errors handled gracefully
- [ ] Timeout errors handled
- [ ] Disk full handled

### Data Migration Validation

**Pre-Migration:**
```bash
# Count files in source (R2)
aws s3 ls s3://tax-documents --recursive | wc -l

# Calculate total size
aws s3 ls s3://tax-documents --recursive --summarize
```

**Post-Migration:**
```bash
# Count files in MinIO
mc ls local/tax-documents --recursive | wc -l

# Calculate total size
mc du local/tax-documents

# Compare counts
# Should match source
```

**Spot Check:**
- [ ] Random sample of 10 files
- [ ] Verify file sizes match
- [ ] Verify files download correctly
- [ ] Verify file content identical (checksum)

### Performance Metrics

| Operation | Target | Measurement |
|-----------|--------|-------------|
| Upload (1MB) | < 2s | Time command |
| Download (1MB) | < 2s | Time command |
| Upload (10MB) | < 10s | Time command |
| Download (10MB) | < 10s | Time command |
| List files (100 files) | < 1s | Time command |
| Generate presigned URL | < 100ms | Application logs |

---

## Auth Migration Testing

### Pre-Migration Testing

**Clerk Setup:**
- [ ] Clerk application created
- [ ] API keys valid
- [ ] Webhook endpoint accessible
- [ ] Webhook secret configured
- [ ] OAuth configured (Google)

**Application Setup:**
- [ ] Clerk package installed
- [ ] Environment variables set
- [ ] Middleware configured
- [ ] ClerkProvider added to layout
- [ ] Auth pages created

### User Flow Testing

**New User Signup:**

```
Test Case: Sign up with email/password
1. Go to /auth/signup
2. Enter: test-new@example.com
3. Enter: Strong_Password123
4. Submit form
5. Verify email sent
6. Click verification link
7. Redirected to dashboard

Expected:
✓ Account created
✓ Email verified
✓ User in database (via webhook)
✓ Session created
✓ Dashboard accessible
```

**Existing User Login:**

```
Test Case: Log in with email/password
1. Go to /auth/login
2. Enter: existing@example.com
3. Enter: password
4. Submit form
5. Redirected to dashboard

Expected:
✓ Session created
✓ Dashboard accessible
✓ User data displayed
```

**Magic Link:**

```
Test Case: Log in with magic link
1. Go to /auth/login
2. Click "Use magic link"
3. Enter: test@example.com
4. Check email
5. Click magic link
6. Redirected to dashboard

Expected:
✓ Email received within 30s
✓ Link works
✓ Session created
✓ Dashboard accessible
```

**OAuth (Google):**

```
Test Case: Sign up with Google
1. Go to /auth/signup
2. Click "Continue with Google"
3. Select Google account
4. Grant permissions
5. Redirected to dashboard

Expected:
✓ OAuth flow completes
✓ Account created
✓ User in database (via webhook)
✓ Dashboard accessible
```

**Password Reset:**

```
Test Case: Reset password
1. Go to /auth/login
2. Click "Forgot password?"
3. Enter: test@example.com
4. Check email
5. Click reset link
6. Enter new password
7. Submit
8. Redirected to login
9. Log in with new password

Expected:
✓ Reset email received
✓ Link works
✓ Password updated
✓ Can log in with new password
```

### Migration Testing

**Parallel Auth:**
- [ ] Lucia users can still log in
- [ ] Clerk users can log in
- [ ] Hybrid auth middleware works
- [ ] Both providers protected routes work

**User Migration:**
- [ ] Migration script runs without errors
- [ ] User created in Clerk
- [ ] Database updated with clerkUserId
- [ ] Password reset email sent
- [ ] User can log in with Clerk

**Migration Prompt:**
- [ ] Prompt appears for Lucia users
- [ ] Prompt explains migration clearly
- [ ] Migration button works
- [ ] User redirected to login
- [ ] User can log in after migration

### Validation Checklist

**Authentication:**
- [ ] Email/password login works
- [ ] Magic link login works
- [ ] Google OAuth works
- [ ] Session persists across refreshes
- [ ] Session expires after 7 days
- [ ] Logout works

**Authorization:**
- [ ] Protected routes require auth
- [ ] Public routes accessible without auth
- [ ] API routes protected
- [ ] Role-based access works (CLIENT, PREPARER, ADMIN)

**User Profile:**
- [ ] Profile data displays correctly
- [ ] Profile update works
- [ ] Email change works
- [ ] Password change works

**Webhook:**
- [ ] user.created event creates database user
- [ ] user.updated event updates database user
- [ ] user.deleted event soft-deletes user
- [ ] Webhook signature verified
- [ ] Invalid webhooks rejected

### Performance Metrics

| Operation | Target | Measurement |
|-----------|--------|-------------|
| Sign up | < 2s | Browser DevTools |
| Log in | < 1s | Browser DevTools |
| Session validation | < 100ms | Application logs |
| Password reset | < 30s | Email delivery time |
| OAuth flow | < 5s | Browser DevTools |

---

## Integration Testing

### End-to-End User Flows

**Client Onboarding Flow:**
```
1. User signs up (Clerk)
2. Welcome email sent (Resend)
3. User uploads documents (MinIO)
4. Tax preparer notified (Resend)
5. Preparer downloads documents (MinIO)
6. Return filed notification (Resend)

Test all steps work together
```

**Referral Flow:**
```
1. User sends referral (Resend)
2. Friend signs up (Clerk)
3. Referral credit applied
4. Confirmation email (Resend)

Test all steps work together
```

### Integration Points

**Clerk + Database:**
- [ ] Webhook creates user in database
- [ ] User roles sync correctly
- [ ] User metadata sync correctly

**Resend + Application:**
- [ ] Email service called correctly
- [ ] Templates render with real data
- [ ] Error handling works

**MinIO + Application:**
- [ ] File uploads work
- [ ] Presigned URLs work
- [ ] Files associated with correct users

### Cross-Migration Testing

- [ ] User signs up (Clerk) → Welcome email (Resend)
- [ ] User uploads file (MinIO) → Notification email (Resend)
- [ ] User logs in (Clerk) → Access files (MinIO)

---

## Performance Testing

### Application Performance

```bash
# Install Apache Bench
apt install apache2-utils

# Test homepage
ab -n 1000 -c 10 https://taxgeniuspro.tax/
# Target: > 100 req/sec

# Test API endpoint
ab -n 1000 -c 10 https://taxgeniuspro.tax/api/health
# Target: > 200 req/sec

# Test authenticated endpoint (with token)
ab -n 100 -c 5 \
  -H "Authorization: Bearer TOKEN" \
  https://taxgeniuspro.tax/api/user
# Target: > 50 req/sec
```

### Database Performance

```sql
-- Query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
-- Target: < 10ms

-- Index usage
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE tablename = 'users';
-- Verify indexes exist

-- Connection pool
SELECT count(*) FROM pg_stat_activity;
-- Target: < 50 connections
```

### File Upload Performance

```bash
# Test file upload speed
time curl -X PUT -T 10mb-file.pdf \
  "$(npm run generate-upload-url -- tax-documents test.pdf)"
# Target: < 10s for 10MB
```

---

## Load Testing

### Load Testing with k6

**Install k6:**
```bash
curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz -L | tar xvz
mv k6-*/k6 /usr/local/bin/
```

**Create load test script:**

**File:** `tests/load-test.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },  // Ramp up to 10 users
    { duration: '3m', target: 10 },  // Stay at 10 users
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 0 },   // Ramp down to 0
  ],
};

export default function () {
  // Test homepage
  let res = http.get('https://taxgeniuspro.tax');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test API
  res = http.get('https://taxgeniuspro.tax/api/health');
  check(res, {
    'api status is 200': (r) => r.status === 200,
    'api response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

**Run load test:**
```bash
k6 run tests/load-test.js
```

### Load Test Targets

| Metric | Target |
|--------|--------|
| Concurrent users | 50 |
| Response time (p95) | < 500ms |
| Error rate | < 1% |
| Requests/second | > 100 |

---

## Security Testing

### Authentication Security

**Test Cases:**
- [ ] SQL injection in login form
- [ ] XSS in user inputs
- [ ] CSRF protection enabled
- [ ] Session hijacking prevented
- [ ] Password brute-force protection
- [ ] Email enumeration prevented

### Authorization Security

**Test Cases:**
- [ ] Unauthorized access blocked
- [ ] Horizontal privilege escalation prevented
- [ ] Vertical privilege escalation prevented
- [ ] API routes require auth
- [ ] Role-based access enforced

### Data Security

**Test Cases:**
- [ ] Sensitive data encrypted in database
- [ ] Passwords hashed (bcrypt/Clerk)
- [ ] File access restricted
- [ ] Presigned URLs expire
- [ ] No data leakage in errors

### Infrastructure Security

**Test Cases:**
- [ ] HTTPS enforced
- [ ] SSL certificate valid
- [ ] Security headers present
- [ ] No exposed environment variables
- [ ] Database not publicly accessible
- [ ] MinIO not publicly accessible (only via Nginx)

### Security Scan

```bash
# Install OWASP ZAP (optional)
# Run security scan
zap-cli quick-scan https://taxgeniuspro.tax

# Check for known vulnerabilities
npm audit
npm audit fix

# Check dependencies
npx depcheck
```

---

## User Acceptance Testing

### UAT Participants

- Internal team members
- Beta users (if available)
- Tax preparers
- Sample clients

### UAT Scenarios

**Scenario 1: New Client Signup**
```
As a new client:
1. I can sign up easily
2. I receive a welcome email
3. I can upload my documents
4. I can track my return status
5. I receive notifications
```

**Scenario 2: Tax Preparer Workflow**
```
As a tax preparer:
1. I can log in
2. I can see assigned clients
3. I can download client documents
4. I can update return status
5. Clients receive notifications
```

**Scenario 3: Migration Experience**
```
As an existing user:
1. I see migration prompt
2. Migration process is clear
3. Migration completes quickly
4. I can log in after migration
5. All my data is intact
```

### UAT Feedback Form

```
Migration: [Email/Storage/Auth]
User Type: [Client/Preparer/Admin]

1. Was the process smooth? [Yes/No]
2. Did you encounter any errors? [Yes/No]
   If yes, describe:

3. Rate ease of use: [1-5]
4. Rate performance: [1-5]
5. Any suggestions?
```

---

## Testing Reports

### Test Results Template

```markdown
# Migration Test Results

**Migration:** [Email/Storage/Auth]
**Date:** YYYY-MM-DD
**Tester:** Name
**Environment:** [Local/Staging/Production]

## Summary
- Total Tests: X
- Passed: X
- Failed: X
- Pass Rate: X%

## Failed Tests
1. Test Name
   - Expected: ...
   - Actual: ...
   - Action: ...

## Performance Metrics
- Metric: Value (Target: X)

## Recommendations
- Action items
- Improvements needed
```

### Sign-Off Checklist

**Email Migration:**
- [ ] All tests passed
- [ ] Performance acceptable
- [ ] No critical bugs
- [ ] Approved by: ___________
- [ ] Date: ___________

**Storage Migration:**
- [ ] All tests passed
- [ ] Data integrity verified
- [ ] Performance acceptable
- [ ] Approved by: ___________
- [ ] Date: ___________

**Auth Migration:**
- [ ] All tests passed
- [ ] User migration successful
- [ ] Security validated
- [ ] Approved by: ___________
- [ ] Date: ___________

---

## References

### Related Documents
- [Migration Overview](./README.md)
- [Resend Email Migration](./01-resend-email.md)
- [MinIO Storage Migration](./02-minio-storage.md)
- [Clerk Auth Migration](./03-clerk-auth.md)
- [Rollback Procedures](./rollback-procedures.md)

### Testing Tools
- Jest: https://jestjs.io
- Playwright: https://playwright.dev
- k6: https://k6.io
- Apache Bench: https://httpd.apache.org/docs/2.4/programs/ab.html
- OWASP ZAP: https://www.zaproxy.org

---

**Document Status:** ✅ Active
**Last Updated:** October 9, 2025
**Maintained By:** QA Team
