# Rollback Procedures

Emergency rollback procedures for all Tax Genius platform migrations.

**IMPORTANT:** Only execute rollbacks when absolutely necessary. Each rollback has risks and impacts.

---

## Table of Contents

1. [When to Rollback](#when-to-rollback)
2. [Rollback Decision Matrix](#rollback-decision-matrix)
3. [Email Migration Rollback](#email-migration-rollback)
4. [Storage Migration Rollback](#storage-migration-rollback)
5. [Auth Migration Rollback](#auth-migration-rollback)
6. [Rollback Testing](#rollback-testing)
7. [Post-Rollback Actions](#post-rollback-actions)

---

## When to Rollback

### Rollback Criteria

Execute rollback if:
- **Critical functionality broken** - Core features completely unavailable
- **Data loss detected** - User data corrupted or missing
- **Mass user impact** - >50% of users cannot access system
- **Security breach** - Active security vulnerability discovered
- **Unrecoverable errors** - System cannot self-heal

### Do NOT Rollback if:
- Minor bugs that don't affect core functionality
- Isolated user issues (< 5% of users)
- Cosmetic problems
- Performance slightly degraded but acceptable
- Issues that can be fixed with hotfix

### Escalation Process

```
1. Identify Issue
   ↓
2. Assess Severity (use Decision Matrix below)
   ↓
3. If Critical → Notify stakeholders
   ↓
4. Decision: Fix Forward vs Rollback
   ↓
5. If Rollback → Execute procedure
   ↓
6. Verify rollback successful
   ↓
7. Post-mortem
```

---

## Rollback Decision Matrix

| Severity | Impact | Users Affected | Action | Timeline |
|----------|--------|----------------|--------|----------|
| **Critical** | System down | >50% | **ROLLBACK** | Immediate |
| **High** | Core feature broken | 25-50% | Consider rollback | 30 min |
| **Medium** | Secondary feature broken | 10-25% | Fix forward | 2 hours |
| **Low** | Minor issue | <10% | Fix forward | Next release |

### Examples by Severity

**Critical (Rollback):**
- Users cannot log in at all
- All file uploads fail
- Database corruption
- Security vulnerability (SQL injection, XSS)
- Complete service outage

**High (Consider Rollback):**
- Some users cannot log in
- File uploads fail for large files
- Slow response times (>10s)
- Data inconsistencies affecting multiple users

**Medium (Fix Forward):**
- Email delays (> 5 minutes)
- UI rendering issues
- Non-critical API errors
- Performance degradation (2-5s)

**Low (Fix Forward):**
- Cosmetic issues
- Typos in emails
- Minor UX improvements needed
- Single user reports

---

## Email Migration Rollback

### Overview

**Migration:** SendGrid → Resend (✅ COMPLETED)
**Rollback Risk:** 🟢 Low
**Rollback Impact:** Minimal

### When to Rollback

Rollback if:
- Emails not sending at all
- Bounce rate > 10%
- Delivery time > 5 minutes
- Resend service outage

Do NOT rollback if:
- Minor template issues (fix template instead)
- Isolated delivery failures
- Temporary delays < 5 minutes

### Rollback Procedure

```bash
# 1. SSH to production server
ssh root@72.60.28.175

# 2. Navigate to project
cd /root/websites/taxgeniuspro

# 3. Backup current state
git log -1 > /tmp/rollback-email-from-commit.txt
npm run db:backup

# 4. Revert email service code
git checkout HEAD~1 -- src/lib/services/email.service.ts
git checkout HEAD~1 -- emails/

# 5. Update environment variables
nano .env.local
# Comment out Resend:
# RESEND_API_KEY="re_xxxxx"
# RESEND_FROM_EMAIL="noreply@taxgeniuspro.tax"

# Uncomment SendGrid:
SENDGRID_API_KEY="SG.xxxxxxxxxxxxx"

# 6. Reinstall SendGrid package (if removed)
npm install @sendgrid/mail

# 7. Rebuild application
npm run build

# 8. Restart application
pm2 restart taxgeniuspro

# 9. Monitor logs
pm2 logs taxgeniuspro --lines 100 | grep -i email

# 10. Test email sending
# Trigger test email via application
# Verify delivery in SendGrid dashboard
```

### Verification Steps

```bash
# 1. Check application is running
pm2 status taxgeniuspro
# Should show: online

# 2. Test email endpoint
curl -X POST https://taxgeniuspro.tax/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com"}'

# 3. Verify in SendGrid
# Login to SendGrid dashboard
# Check Activity Feed for test email

# 4. Monitor error rate
pm2 logs taxgeniuspro --lines 500 | grep -i error | wc -l
# Should be low
```

### Rollback Impact

- **Downtime:** ~2 minutes during restart
- **User Impact:** None (users won't notice)
- **Data Loss:** None (emails queued or can be resent)
- **Recovery Time:** 5-10 minutes

### Post-Rollback Actions

1. **Investigate root cause**
   - Check Resend dashboard for errors
   - Review application logs
   - Contact Resend support if needed

2. **Document issue**
   - Create incident report
   - Note symptoms and resolution
   - Update runbook

3. **Plan fix**
   - Schedule retry with fixes
   - Test thoroughly before re-attempting
   - Communicate timeline to team

---

## Storage Migration Rollback

### Overview

**Migration:** AWS S3/R2 → MinIO (⏳ PENDING)
**Rollback Risk:** 🟡 Medium
**Rollback Impact:** Moderate

### When to Rollback

Rollback if:
- File uploads fail consistently (>80%)
- File downloads timeout consistently
- Data corruption detected
- MinIO service crashes repeatedly
- Severe performance degradation (>30s uploads)

Do NOT rollback if:
- Isolated upload failures (<20%)
- Slow uploads but succeeding
- MinIO restart resolves issue
- Only affecting new uploads (old files still accessible)

### Rollback Procedure

```bash
# 1. SSH to production
ssh root@72.60.28.175
cd /root/websites/taxgeniuspro

# 2. Backup current state
git log -1 > /tmp/rollback-storage-from-commit.txt
docker logs minio > /tmp/minio-logs-before-rollback.txt

# 3. Revert storage service code
git checkout HEAD~1 -- src/lib/storage.ts
git checkout HEAD~1 -- src/lib/s3.ts

# 4. Update environment variables
nano .env.local

# Comment out MinIO:
# MINIO_ENDPOINT="https://storage.taxgeniuspro.tax"
# MINIO_ACCESS_KEY="admin"
# MINIO_SECRET_KEY="xxxxx"

# Uncomment R2/S3:
R2_ENDPOINT="https://xxxxx.r2.cloudflarestorage.com"
R2_ACCESS_KEY="xxxxxxxxxxxxx"
R2_SECRET_KEY="xxxxxxxxxxxxx"
R2_BUCKET="tax-documents"

# 5. Rebuild application
npm run build

# 6. Restart application
pm2 restart taxgeniuspro

# 7. Monitor logs
pm2 logs taxgeniuspro --lines 100 | grep -i storage

# 8. Test file operations
# Upload test file
# Download test file
# Verify both work
```

### Data Considerations

**Files in MinIO:**
- Files remain in MinIO (not deleted)
- Can be migrated back to R2 if needed
- Keep MinIO running for potential recovery

**Files in R2:**
- Old files still accessible
- New uploads during MinIO period may be missing
- May need to sync back to R2

**Hybrid Approach:**
```typescript
// Temporary: Read from both locations
export async function getFile(key: string) {
  try {
    // Try MinIO first
    return await minioClient.getObject(key);
  } catch (error) {
    // Fall back to R2
    return await r2Client.getObject(key);
  }
}
```

### Verification Steps

```bash
# 1. Test file upload to R2
curl -X POST https://taxgeniuspro.tax/api/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "file=@test.pdf"
# Should succeed

# 2. Test file download from R2
curl https://taxgeniuspro.tax/api/files/test.pdf \
  -H "Authorization: Bearer TOKEN" \
  -o downloaded.pdf
# Should succeed

# 3. Verify old files accessible
# Login to application
# Navigate to documents
# Verify files load

# 4. Check error rate
pm2 logs taxgeniuspro --lines 500 | grep -i "storage error" | wc -l
# Should be 0 or very low
```

### Rollback Impact

- **Downtime:** ~5 minutes during restart
- **User Impact:** Brief file access interruption
- **Data Loss:** Files uploaded to MinIO during migration period may be inaccessible
- **Recovery Time:** 10-15 minutes

### Post-Rollback Actions

1. **Assess data gap**
   - Identify files only in MinIO
   - Migrate back to R2 if needed
   - Notify affected users

2. **Investigate root cause**
   - Check MinIO logs: `docker logs minio`
   - Check Nginx logs: `tail -100 /var/log/nginx/error.log`
   - Check disk space: `df -h`

3. **Plan retry**
   - Fix identified issues
   - Test thoroughly
   - Schedule new migration window

---

## Auth Migration Rollback

### Overview

**Migration:** Lucia → Clerk (⏳ PENDING)
**Rollback Risk:** 🔴 High
**Rollback Impact:** Severe

### When to Rollback

Rollback if:
- **Critical:** Users cannot log in at all (>80% failure rate)
- **Critical:** Mass account lockouts
- **Critical:** Session data corrupted
- **Critical:** Data breach or security vulnerability
- **High:** User data loss detected
- **High:** Webhook failures causing database inconsistencies

Do NOT rollback if:
- Isolated login issues (<10% users)
- OAuth temporarily unavailable (magic link still works)
- Clerk service degradation (but functional)
- Minor UI issues with auth pages

### ⚠️ ROLLBACK WARNING

**Auth rollback is HIGH RISK because:**
- Users created during Clerk period lose access
- Session data must be migrated back
- Database changes may be hard to reverse
- Clerk users need manual migration back to Lucia

**Before rolling back:**
1. Confirm issue is truly critical
2. Attempt hotfix first
3. Get stakeholder approval
4. Notify all users
5. Backup database

### Rollback Procedure

```bash
# ⚠️ CRITICAL: Backup database first!
ssh root@72.60.28.175
cd /root/websites/taxgeniuspro

# 1. BACKUP DATABASE
npm run db:backup
# Or manually:
pg_dump taxgeniuspro > /tmp/db-backup-$(date +%Y%m%d-%H%M%S).sql

# 2. Save current state
git log -1 > /tmp/rollback-auth-from-commit.txt

# 3. Export Clerk users (for later migration back to Lucia)
npm run export-clerk-users > /tmp/clerk-users-$(date +%Y%m%d).json

# 4. Revert code changes
git checkout HEAD~5 -- src/middleware.ts
git checkout HEAD~5 -- src/app/layout.tsx
git checkout HEAD~5 -- src/app/auth/
git checkout HEAD~5 -- src/lib/auth.ts
git checkout HEAD~5 -- src/app/api/webhooks/clerk/

# 5. Remove Clerk package
npm uninstall @clerk/nextjs

# 6. Reinstall Lucia
npm install lucia @lucia-auth/adapter-prisma arctic

# 7. Update environment variables
nano .env.local

# Comment out Clerk:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx"
# CLERK_SECRET_KEY="sk_test_xxxxx"
# CLERK_WEBHOOK_SECRET="whsec_xxxxx"

# Uncomment Lucia:
LUCIA_SECRET="xxxxxxxxxxxxx"

# 8. Restore Lucia database schema (if changed)
npx prisma migrate deploy

# 9. Rebuild application
npm run build

# 10. Restart application
pm2 restart taxgeniuspro

# 11. CRITICAL: Monitor logs closely
pm2 logs taxgeniuspro --lines 200

# 12. Test Lucia authentication
# Try logging in with pre-migration account
```

### Data Migration Considerations

**Users created during Clerk period:**

These users need manual intervention:

```typescript
// scripts/migrate-clerk-users-back.ts
import { prisma } from '@/lib/db';
import { hash } from '@node-rs/argon2';

async function migrateClerkUsersBack() {
  // Get users created during Clerk period
  const clerkUsers = await prisma.user.findMany({
    where: {
      clerkUserId: { not: null },
      luciaUserId: null, // Didn't exist in Lucia
    },
  });

  console.log(`Found ${clerkUsers.length} Clerk-only users to migrate`);

  for (const user of clerkUsers) {
    // Generate temporary password
    const tempPassword = crypto.randomUUID();
    const hashedPassword = await hash(tempPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Create Lucia user
    await prisma.authUser.create({
      data: {
        id: user.id,
        email: user.email,
        hashedPassword,
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(user.email);

    console.log(`✅ Migrated ${user.email} back to Lucia`);
  }
}

migrateClerkUsersBack().catch(console.error);
```

### Verification Steps

```bash
# 1. Test login with existing Lucia account
curl -X POST https://taxgeniuspro.tax/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"existing@example.com","password":"password123"}'
# Should return session cookie

# 2. Verify session persists
curl https://taxgeniuspro.tax/api/auth/me \
  -H "Cookie: auth_session=xxxxx"
# Should return user data

# 3. Test signup
curl -X POST https://taxgeniuspro.tax/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
# Should create account

# 4. Check error rate
pm2 logs taxgeniuspro --lines 1000 | grep -i "auth error" | wc -l
# Should be 0 or very low

# 5. Monitor user reports
# Check support channels
# Verify login success rate
```

### Rollback Impact

- **Downtime:** 10-15 minutes
- **User Impact:** HIGH
  - All users must re-authenticate
  - Clerk-only users lose access temporarily
  - Sessions invalidated
- **Data Loss:** Potential
  - Users created during Clerk period need migration
  - Session data lost
- **Recovery Time:** 30-60 minutes + user migration time

### Communication Plan

**Immediate notification:**
```
Subject: [URGENT] Authentication System Maintenance

We're performing emergency maintenance on our authentication system.

Impact:
- You'll need to log in again
- If you signed up in the last [X] days, please check your email for password reset

Expected resolution: [TIME]

We apologize for the inconvenience.
```

**Follow-up (Clerk-only users):**
```
Subject: Action Required: Reset Your Password

We've updated our authentication system. Please reset your password:

1. Go to: https://taxgeniuspro.tax/reset-password
2. Enter your email
3. Check email for reset link
4. Set new password

If you have issues, contact support.
```

### Post-Rollback Actions

1. **Migrate Clerk-only users**
   - Run migration script
   - Send password reset emails
   - Monitor completion rate
   - Provide support

2. **Root cause analysis**
   - Document what went wrong
   - Identify preventable causes
   - Update migration plan
   - Add safeguards

3. **Plan retry**
   - Fix identified issues
   - Extended testing period
   - Gradual rollout (10% → 50% → 100%)
   - Better monitoring

4. **Communicate lessons learned**
   - Share post-mortem
   - Update documentation
   - Train support team

---

## Rollback Testing

### Test Rollback Procedures

**DO NOT test rollbacks in production!**

Use staging or local environment:

```bash
# 1. Clone production environment
npm run setup:staging

# 2. Apply migration
npm run migrate:staging

# 3. Test rollback procedure
npm run rollback:staging

# 4. Verify rollback worked
npm run test:rollback

# 5. Document any issues
```

### Rollback Drills

Schedule regular rollback drills:

- **Monthly:** Practice email rollback
- **Quarterly:** Practice storage rollback
- **Before auth migration:** Full auth rollback drill

**Drill checklist:**
- [ ] Backup procedures work
- [ ] Rollback commands correct
- [ ] Verification steps complete
- [ ] Team knows procedures
- [ ] Documentation up to date

---

## Post-Rollback Actions

### Immediate (Within 1 Hour)

1. **Verify system stability**
   - Monitor error rates
   - Check user reports
   - Verify all features work

2. **Communicate status**
   - Update status page
   - Notify stakeholders
   - Email affected users

3. **Begin investigation**
   - Collect logs
   - Identify root cause
   - Document timeline

### Short-term (Within 24 Hours)

1. **Detailed analysis**
   - Review all logs
   - Reproduce issue in staging
   - Identify fix

2. **User support**
   - Respond to support tickets
   - Provide workarounds
   - Compensate if needed (credits, etc.)

3. **Update monitoring**
   - Add alerts for similar issues
   - Improve dashboards
   - Set up better logging

### Long-term (Within 1 Week)

1. **Post-mortem**
   - What happened?
   - Why did it happen?
   - How to prevent?
   - Action items

2. **Update procedures**
   - Fix migration guide
   - Update rollback procedures
   - Improve testing
   - Add safeguards

3. **Plan retry**
   - Schedule new attempt
   - Implement fixes
   - Extra testing
   - Gradual rollout

---

## Rollback Checklist Template

Use this checklist for any rollback:

```markdown
# Rollback Checklist

**Migration:** [Email/Storage/Auth]
**Date:** YYYY-MM-DD HH:MM
**Issue:** [Description]
**Severity:** [Critical/High/Medium/Low]
**Decision Maker:** [Name]

## Pre-Rollback
- [ ] Severity confirmed (Critical or High)
- [ ] Fix-forward attempted and failed
- [ ] Stakeholders notified
- [ ] Database backed up
- [ ] Rollback procedure reviewed
- [ ] Team on standby

## Rollback Execution
- [ ] Code reverted
- [ ] Environment variables updated
- [ ] Dependencies restored
- [ ] Application rebuilt
- [ ] Application restarted
- [ ] Logs monitored

## Verification
- [ ] System online
- [ ] Core features work
- [ ] Error rate acceptable
- [ ] Users can access system
- [ ] Data integrity confirmed

## Communication
- [ ] Users notified
- [ ] Status page updated
- [ ] Support team briefed
- [ ] Stakeholders updated

## Post-Rollback
- [ ] Root cause identified
- [ ] Incident report created
- [ ] Fix planned
- [ ] Retry scheduled
- [ ] Lessons documented
```

---

## Emergency Contacts

### Internal Team

```
Development Lead: [Name]
Email: [email]
Phone: [phone]

DevOps Lead: [Name]
Email: [email]
Phone: [phone]

Support Lead: [Name]
Email: [email]
Phone: [phone]
```

### External Vendors

```
Resend Support:
Email: support@resend.com
Dashboard: https://resend.com/support

Clerk Support:
Email: support@clerk.com
Dashboard: https://dashboard.clerk.com/support

VPS Provider:
Email: [support email]
Phone: [support phone]
```

---

## References

### Related Documents
- [Migration Overview](./README.md)
- [Resend Email Migration](./01-resend-email.md)
- [MinIO Storage Migration](./02-minio-storage.md)
- [Clerk Auth Migration](./03-clerk-auth.md)
- [Testing & Validation](./testing-validation.md)

### External Resources
- [Incident Response Best Practices](https://www.atlassian.com/incident-management/incident-response)
- [Database Backup Strategies](https://www.postgresql.org/docs/current/backup.html)
- [PM2 Process Management](https://pm2.keymetrics.io/docs/usage/quick-start/)

---

**Document Status:** ✅ Active
**Last Updated:** October 9, 2025
**Maintained By:** DevOps Team

**⚠️ CRITICAL: Keep this document updated and test rollback procedures regularly!**
