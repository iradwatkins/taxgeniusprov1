# Migration 1: SendGrid → Resend

**Status:** ✅ COMPLETED (October 9, 2025)
**Complexity:** 🟢 Low
**Duration:** 4-6 hours
**Risk:** Low (email only, easy rollback)

---

## Migration Status

🎉 **This migration is COMPLETE and live in production as of October 9, 2025.**

This document serves as:
- Historical record of the migration
- Reference for troubleshooting
- Guide for similar email migrations
- Documentation for new team members

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Implementation](#implementation)
5. [Testing](#testing)
6. [Deployment](#deployment)
7. [Rollback Procedure](#rollback-procedure)
8. [Post-Migration](#post-migration)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### Why Resend?

- **Modern API:** Better developer experience than SendGrid
- **React Email:** Type-safe, component-based templates
- **Cost-effective:** Lower pricing for our volume
- **Performance:** Faster delivery times
- **Already installed:** Package was pre-installed in dependencies

### What Changed

- Email service provider: SendGrid → Resend
- Template system: HTML strings → React components
- API client: `@sendgrid/mail` → `resend`

### Impact

- **Users:** No visible changes (emails look/work the same)
- **Developers:** Better DX with React Email templates
- **Operations:** Simpler monitoring via Resend dashboard

---

## Prerequisites

### 1. Verify Package Installation

```bash
# Check Resend is installed
npm list resend
# Expected: resend@6.0.3 or higher

# Check React Email is installed
npm list @react-email/components
# Expected: @react-email/components@0.5.3 or higher
```

### 2. Resend Account Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify sending domain: `taxgeniuspro.tax`
   - Add DNS records (SPF, DKIM, DMARC)
   - Wait for verification (usually 5-10 minutes)
3. Create API key with full send permissions
4. Save API key securely

### 3. Environment Variables

Add to `.env.local`:

```bash
RESEND_API_KEY="re_xxxxxxxxxxxxx"
RESEND_FROM_EMAIL="noreply@taxgeniuspro.tax"
```

---

## Setup Instructions

### Step 1: Domain Verification

Add these DNS records to your domain registrar:

```
Type    Name                         Value
TXT     @                            v=spf1 include:_spf.resend.com ~all
TXT     resend._domainkey            [provided by Resend]
TXT     _dmarc                       v=DMARC1; p=none; rua=mailto:admin@taxgeniuspro.tax
```

Verify in Resend dashboard: Settings → Domains → taxgeniuspro.tax

### Step 2: API Key Configuration

1. Go to: https://resend.com/api-keys
2. Click "Create API Key"
3. Name: "Production - Tax Genius"
4. Permissions: "Full Access" (or "Sending Access" minimum)
5. Copy key and add to `.env.local`

---

## Implementation

### Email Service Migration

**File:** `src/lib/services/email.service.ts`

#### Before (SendGrid)

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendWelcomeEmail(to: string, data: any) {
  await sgMail.send({
    to,
    from: 'noreply@taxgeniuspro.tax',
    subject: 'Welcome to Tax Genius',
    html: '<h1>Welcome!</h1>',
  });
}
```

#### After (Resend)

```typescript
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(
  to: string,
  data: { name: string; dashboardUrl: string }
) {
  const { data: result, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: 'Welcome to Tax Genius',
    react: WelcomeEmail(data),
  });

  if (error) {
    throw new Error(`Email send failed: ${error.message}`);
  }

  return result;
}
```

### React Email Templates

**Create:** `emails/WelcomeEmail.tsx`

```tsx
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ name, dashboardUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Tax Genius, {name}!</Heading>

          <Text style={text}>
            Thank you for joining Tax Genius. We're excited to help you with your tax
            preparation needs.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Go to Dashboard
            </Button>
          </Section>

          <Text style={footer}>
            If you have any questions, reply to this email or visit our help center.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'center' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '27px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  marginTop: '32px',
};
```

### Email Types Migrated

All email sends were updated to use Resend:

1. ✅ **Welcome email** - New user registration
2. ✅ **Password reset** - Account recovery
3. ✅ **Email verification** - Email confirmation
4. ✅ **Lead notification** - To tax preparers
5. ✅ **Document received** - Confirmation to clients
6. ✅ **Return filed** - Completion notification
7. ✅ **Referral invitation** - Referral program emails

---

## Testing

### Development Testing

```bash
# 1. Start development server
npm run dev

# 2. Test email preview (if configured)
npm run email:dev
# Opens: http://localhost:3000/emails/preview

# 3. Trigger test emails through application
# - Create test account
# - Reset password
# - Upload document
```

### Verification Checklist

- [x] Email sends successfully
- [x] Templates render correctly in Gmail
- [x] Templates render correctly in Outlook
- [x] Templates render correctly on mobile
- [x] Links in emails work
- [x] Unsubscribe links work
- [x] From address displays correctly
- [x] Subject lines are correct
- [x] No broken images
- [x] Proper error handling

### Monitoring

Check Resend dashboard for:
- Delivery rates
- Bounce rates
- Spam reports
- Open rates (if tracking enabled)

Dashboard: https://resend.com/emails

---

## Deployment

### Production Deployment Steps

```bash
# 1. SSH to production server
ssh root@72.60.28.175

# 2. Navigate to project
cd /root/websites/taxgeniuspro

# 3. Add environment variables
nano .env.local
# Add:
# RESEND_API_KEY="re_xxxxxxxxxxxxx"
# RESEND_FROM_EMAIL="noreply@taxgeniuspro.tax"

# 4. Pull latest code (if not already)
git pull origin main

# 5. Install dependencies
npm install

# 6. Build application
npm run build

# 7. Restart application
pm2 restart taxgeniuspro

# 8. Monitor logs for errors
pm2 logs taxgeniuspro --lines 100
```

### Post-Deployment Verification

```bash
# Test email sending
# 1. Create test account on production
# 2. Verify welcome email arrives
# 3. Test password reset
# 4. Check Resend dashboard for delivery
```

---

## Rollback Procedure

### If Resend Fails

```bash
# 1. SSH to production
ssh root@72.60.28.175
cd /root/websites/taxgeniuspro

# 2. Revert email service changes
git checkout HEAD~1 -- src/lib/services/email.service.ts

# 3. Update environment variables
nano .env.local
# Restore: SENDGRID_API_KEY="SG.xxxxx"

# 4. Rebuild
npm run build

# 5. Restart
pm2 restart taxgeniuspro

# 6. Verify SendGrid works
pm2 logs taxgeniuspro
```

### Impact of Rollback

- **User Impact:** None (users won't notice)
- **Data Loss:** None (email delivery continues)
- **Recovery Time:** 5-10 minutes

---

## Post-Migration

### Cleanup (After 1-2 Weeks)

Once Resend is confirmed stable:

```bash
# Remove SendGrid package
npm uninstall @sendgrid/mail

# Remove old environment variables
nano .env.local
# Delete: SENDGRID_API_KEY

# Commit cleanup
git add package.json package-lock.json .env.local
git commit -m "chore: Remove SendGrid after successful Resend migration"
```

### Monitoring

**Week 1:** Daily monitoring
- Check Resend dashboard daily
- Monitor error logs
- Verify all email types are sending

**Week 2+:** Weekly monitoring
- Review delivery rates
- Check for bounces
- Monitor spam complaints

---

## Troubleshooting

### Email Not Sending

**Symptom:** Emails fail to send

**Possible Causes:**
1. Invalid API key
2. Domain not verified
3. Rate limit exceeded
4. Invalid recipient address

**Solution:**
```bash
# Check logs
pm2 logs taxgeniuspro | grep -i "email"

# Verify API key
echo $RESEND_API_KEY

# Check Resend dashboard
# https://resend.com/emails
```

### Template Rendering Issues

**Symptom:** Email looks broken in inbox

**Possible Causes:**
1. Missing styles
2. Unsupported CSS
3. Email client compatibility

**Solution:**
- Test in multiple email clients
- Use inline styles (React Email handles this)
- Check Resend dashboard preview

### Domain Not Verified

**Symptom:** Error: "Domain not verified"

**Solution:**
1. Check DNS records: https://resend.com/domains
2. Wait 5-10 minutes for DNS propagation
3. Click "Verify" in Resend dashboard
4. Contact Resend support if still failing

### Rate Limits

**Symptom:** Error: "Rate limit exceeded"

**Free Tier Limits:**
- 100 emails/day
- 3,000 emails/month

**Solution:**
- Upgrade to paid plan
- Implement email queuing
- Add retry logic with backoff

---

## References

### Documentation
- [Resend Docs](https://resend.com/docs)
- [React Email Docs](https://react.email/docs)
- [Migration Overview](./README.md)

### Related Files
- `src/lib/services/email.service.ts` - Email service
- `emails/` - React Email templates
- `.env.local` - Environment configuration

---

**Migration Completed:** October 9, 2025
**Status:** ✅ Live in Production
**Next Migration:** [MinIO Storage](./02-minio-storage.md)
