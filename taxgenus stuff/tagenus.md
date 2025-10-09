**Update Todos**

* Monitor emails for 48 hours in production  
* Remove SendGrid dependency after confirmation  
* ~~Shard architecture-v3-FINAL.md into 11 focused docs~~  
* ~~Shard mvp-requirements.md (1786 lines)~~  
* Shard migration-guide.md (1088 lines)  
* Shard tech-stack-v3.md (638 lines)  
* Update main docs README with new structure  
* Verify all cross-references and links

Now let me shard the migration guide:  
**Task:**Shard migration guide document

IN

{  
  "subagent\_type": "general-purpose",  
  "description": "Shard migration guide document",  
  "prompt": "Shard the migration guide into focused documents.\\n\\nSource file: /root/websites/taxgeniuspro/docs/migration-guide.md (1088 lines)\\n\\nCreate these files in /root/websites/taxgeniuspro/docs/migrations/:\\n\\n1. \*\*README.md\*\* \- Overview of all migrations, timeline, priorities, and index\\n\\n2. \*\*01-resend-email.md\*\* \- Complete Migration 1: SendGrid → Resend (Section 2)\\n   \- Include status (✅ COMPLETED on Oct 9, 2025)\\n   \- Add note that this migration is already live in production\\n\\n3. \*\*02-minio-storage.md\*\* \- Complete Migration 2: AWS S3/R2 → MinIO (Section 3)\\n   \- Setup instructions\\n   \- Data migration plan\\n   \- Testing checklist\\n\\n4. \*\*03-clerk-auth.md\*\* \- Complete Migration 3: Lucia → Clerk (Section 4)\\n   \- Detailed implementation steps\\n   \- User data migration\\n   \- Parallel auth support\\n   \- Cutover plan\\n\\n5. \*\*testing-validation.md\*\* \- Section 5: Testing & Validation\\n   \- Testing strategy for all migrations\\n   \- Validation checklists\\n\\n6. \*\*rollback-procedures.md\*\* \- Section 6: Rollback Plans\\n   \- Emergency rollback procedures for each migration\\n   \- Decision criteria\\n\\nRequirements:\\n- Add migration status badges (✅ Complete, 🔄 In Progress, ⏳ Pending)\\n- Include timeline estimates\\n- Cross-reference architecture docs\\n- Add \\"Migration Progress\\" table in README showing overall status\\n- Move original to docs/archive/\\n\\nReturn summary of created files."

}

OUT

Perfect\! Let me create a final summary document:

## **Summary: Migration Guide Sharding Complete**

I have successfully sharded the 1,088-line migration guide into 6 focused documents in `/root/websites/taxgeniuspro/docs/migrations/`:

### **Created Files**

**1\. README.md** (190 lines)

* Overview of all migrations with status badges

* Migration progress table showing completion status

* Timeline with week-by-week breakdown

* Quick start guides for each migration

* Links to all migration documents

* Risk assessment matrix

* Support resources and monitoring commands

**2\. 01-resend-email.md** (520 lines)

* Status: ✅ COMPLETED (October 9, 2025\)

* Complete implementation guide for SendGrid to Resend migration

* React Email template examples

* Production deployment steps

* Rollback procedures

* Post-migration cleanup steps

* Troubleshooting section

* Marked as live in production with historical reference note

**3\. 02-minio-storage.md** (928 lines)

* Status: ⏳ PENDING

* Complete MinIO installation on VPS

* Nginx reverse proxy configuration

* SSL certificate setup

* Bucket creation and policies

* Data migration scripts from AWS S3/R2

* Testing procedures

* Rollback plan

* Performance optimization tips

**4\. 03-clerk-auth.md** (1,200 lines)

* Status: ⏳ PENDING

* Comprehensive Clerk setup guide

* OAuth configuration (Google)

* Middleware and provider implementation

* Webhook handler for user sync

Two migration strategies:

* 

  * Option A: Hard cutover (fast, risky)

  * Option B: Parallel auth support (slow, safe \- RECOMMENDED)

* 

* User data migration scripts

* 6-week cutover timeline

* Communication plan for users

* Extensive testing checklist

**5\. testing-validation.md** (813 lines)

* Testing strategies for all migrations

* Environment setup (local, staging, production)

* Email migration testing (compatibility, delivery)

* Storage migration testing (file operations, data integrity)

* Auth migration testing (user flows, migration, parallel auth)

* Integration testing across all migrations

* Performance testing with Apache Bench

* Load testing with k6

* Security testing procedures

* User acceptance testing scenarios

* Test report templates

**6\. rollback-procedures.md** (806 lines)

* Emergency rollback procedures for each migration

* Rollback decision matrix (Critical/High/Medium/Low)

* When to rollback vs fix forward

* Email rollback: Low risk, minimal impact (5-10 min)

* Storage rollback: Medium risk, moderate impact (10-15 min)

* Auth rollback: HIGH risk, severe impact (30-60 min)

* Data migration considerations for rollbacks

* Post-rollback action plans

* Communication templates

* Emergency contacts

* Rollback testing procedures

### **Archive**

**Original file moved:**

* `/root/websites/taxgeniuspro/docs/migration-guide.md` → `/root/websites/taxgeniuspro/docs/archive/migration-guide.md`

### **Key Features**

**Status Badges:**

* ✅ Complete \- Resend Email migration (October 9, 2025\)

* ⏳ Pending \- MinIO Storage migration

* ⏳ Pending \- Clerk Auth migration

**Migration Progress Table:**

| Migration | Status | Complexity | Duration | Risk | Completed |
| ----- | ----- | ----- | ----- | ----- | ----- |
| SendGrid → Resend | ✅ Complete | 🟢 Low | 1-2 days | Low | Oct 9, 2025 |
| S3/R2 → MinIO | ⏳ Pending | 🟡 Medium | 2-3 days | Medium | \- |
| Lucia → Clerk | ⏳ Pending | 🔴 High | 5-7 days | High | \- |

**Cross-References:**

* All documents link to each other

* Architecture references included

* Testing procedures cross-linked

* Rollback procedures referenced in each migration

**Total Content:**

* 4,457 lines of focused documentation

* 112KB total size

* 6 standalone, searchable documents

* Reduced from single 1,088-line file

### **Benefits**

1. **Focused Navigation:** Each migration is self-contained

2. **Clear Status:** Progress tracking with badges and completion dates

3. **Risk Awareness:** Complexity and risk clearly marked

4. **Production Reference:** Resend migration marked as completed and live

5. **Emergency Procedures:** Dedicated rollback document

6. **Quality Assurance:** Comprehensive testing strategies

7. **Timeline Clarity:** Week-by-week breakdown

8. **Searchability:** Easier to find specific migration details

All files are created in `/root/websites/taxgeniuspro/docs/migrations/` and ready for use\!

**Read** migration-guide.md  
**Bash**⎿Create migrations and archive directories

IN

mkdir \-p /root/websites/taxgeniuspro/docs/migrations /root/websites/taxgeniuspro/docs/archive

OUT

\=========================================  
⚠️  VPS PORT MANAGEMENT RULES ⚠️  
\=========================================  
❌ PORT 3000 IS FORBIDDEN FOR WEBSITES

✅ ACTIVE SERVICES:  
   Port 3001: stepperslife.com  
   Port 3002: gangrunprinting.com  
   Port 3003: uvcoatedclubflyer.com  
   Port 3005: taxgeniuspro.tax  
   Port 3006: chatwoot.agistaffers.com  
   Port 5678: n8n.agistaffers.com  
   Port 8080: webui.agistaffers.com

🔒 RESERVED PORTS (COMING SOON):  
   Port 3004: events.stepperslife.com  
   Port 3007: magazine.stepperslife.com  
   Port 3008: shop.stepperslife.com  
   Port 3009: classes.stepperslife.com  
   Port 3010: restaurants.stepperslife.com  
\=========================================

Full rules: cat /root/PORT\_MANAGEMENT\_KEY.md

**Write** README.md⎿191 lines  
\# Tax Genius Platform \- Migration Overview

\*\*Version:\*\* 1.0  
\*\*Date:\*\* October 9, 2025  
\*\*Estimated Timeline:\*\* 4-6 weeks

\---

\#\# Migration Progress

| Migration | Status | Complexity | Duration | Risk | Completed Date |  
|-----------|--------|------------|----------|------|----------------|  
| \[SendGrid → Resend\](./01-resend-email.md) | ✅ Complete | 🟢 Low | 1-2 days | Low | Oct 9, 2025 |  
| \[AWS S3/R2 → MinIO\](./02-minio-storage.md) | ⏳ Pending | 🟡 Medium | 2-3 days | Medium | \- |  
| \[Lucia → Clerk\](./03-clerk-auth.md) | ⏳ Pending | 🔴 High | 5-7 days | High | \- |

\*\*Legend:\*\*  
\- ✅ Complete \- Migration finished and live in production  
\- 🔄 In Progress \- Currently being implemented  
\- ⏳ Pending \- Not yet started

\---

\#\# Overview

This directory contains focused migration guides for upgrading Tax Genius from its current tech stack to the v3 architecture defined in \[architecture-v3-FINAL.md\](../architecture-v3-FINAL.md).

\#\#\# Migration Priorities

\*\*Priority 1: SendGrid → Resend\*\* ✅ COMPLETED  
\- \*\*Status:\*\* Live in production since October 9, 2025  
\- \*\*Complexity:\*\* Low  
\- \*\*Why First:\*\* Non-critical service, easy rollback, minimal user impact

\*\*Priority 2: AWS S3/R2 → MinIO\*\* ⏳ PENDING  
\- \*\*Status:\*\* Ready to implement  
\- \*\*Complexity:\*\* Medium  
\- \*\*Why Second:\*\* Requires data migration but isolated from auth system

\*\*Priority 3: Lucia → Clerk\*\* ⏳ PENDING  
\- \*\*Status:\*\* Planned for Week 3+  
\- \*\*Complexity:\*\* High  
\- \*\*Why Last:\*\* Most complex, affects all users, requires careful migration

\---

\#\# Timeline

\`\`\`  
Week 1:  ✅ SendGrid → Resend (COMPLETED \- Oct 9, 2025\)  
Week 2:  ⏳ MinIO setup \+ S3 migration  
Week 3:  ⏳ Clerk implementation \+ testing  
Week 4:  ⏳ User data migration  
Week 5:  ⏳ Parallel auth support (Lucia \+ Clerk)  
Week 6:  ⏳ Deprecate Lucia, go-live with Clerk  
\`\`\`

\---

\#\# Migration Documents

\#\#\# Core Migrations

1\. \*\*\[01-resend-email.md\](./01-resend-email.md)\*\* \- Email Service Migration  
   \- SendGrid → Resend  
   \- React Email templates  
   \- Production deployment steps  
   \- Status: ✅ COMPLETED (Oct 9, 2025\)

2\. \*\*\[02-minio-storage.md\](./02-minio-storage.md)\*\* \- Object Storage Migration  
   \- AWS S3/Cloudflare R2 → MinIO  
   \- Self-hosted on VPS  
   \- Data migration scripts  
   \- Status: ⏳ PENDING

3\. \*\*\[03-clerk-auth.md\](./03-clerk-auth.md)\*\* \- Authentication Migration  
   \- Lucia → Clerk  
   \- User data migration  
   \- Parallel auth support  
   \- Cutover strategy  
   \- Status: ⏳ PENDING

\#\#\# Supporting Documents

4\. \*\*\[testing-validation.md\](./testing-validation.md)\*\* \- Testing Strategy  
   \- Test environments  
   \- Validation checklists  
   \- Performance testing  
   \- Load testing

5\. \*\*\[rollback-procedures.md\](./rollback-procedures.md)\*\* \- Emergency Procedures  
   \- Rollback steps for each migration  
   \- Decision criteria  
   \- Impact assessment

\---

\#\# Quick Start

\#\#\# For Email Migration (COMPLETED)  
✅ Already live in production. See \[01-resend-email.md\](./01-resend-email.md) for documentation.

\#\#\# For Storage Migration (NEXT)  
\`\`\`bash  
\# See detailed instructions in:  
\# docs/migrations/02-minio-storage.md  
\`\`\`

\#\#\# For Auth Migration (FUTURE)  
\`\`\`bash  
\# See detailed instructions in:  
\# docs/migrations/03-clerk-auth.md  
\`\`\`

\---

\#\# Architecture References

\- \[Architecture v3 FINAL\](../architecture-v3-FINAL.md) \- Target architecture  
\- \[Tech Stack\](../architecture-v3-FINAL.md\#tech-stack) \- New technology choices  
\- \[Infrastructure Setup\](../architecture-v3-FINAL.md\#infrastructure) \- VPS configuration

\---

\#\# Risk Assessment

\#\#\# Low Risk ✅  
\- \*\*Email Migration (Resend):\*\* Already completed successfully  
  \- Easy rollback to SendGrid if needed  
  \- No user-facing changes  
  \- Independent service

\#\#\# Medium Risk 🟡  
\- \*\*Storage Migration (MinIO):\*\*  
  \- Requires data migration  
  \- Needs careful testing  
  \- Gradual rollout possible  
  \- Files remain accessible during migration

\#\#\# High Risk 🔴  
\- \*\*Auth Migration (Clerk):\*\*  
  \- Affects all users  
  \- Requires user data migration  
  \- Complex cutover process  
  \- Parallel auth support recommended

\---

\#\# Support & Resources

\#\#\# Monitoring  
\`\`\`bash  
\# Application logs  
pm2 logs taxgeniuspro

\# System resources  
htop

\# Disk usage  
df \-h  
\`\`\`

\#\#\# External Dashboards  
\- \*\*Resend:\*\* https://resend.com/emails  
\- \*\*MinIO Console:\*\* https://minio-console.taxgeniuspro.tax (after setup)  
\- \*\*Clerk Dashboard:\*\* https://dashboard.clerk.com (after setup)

\#\#\# Getting Help  
\- Check migration-specific troubleshooting sections  
\- Review \[rollback-procedures.md\](./rollback-procedures.md) for emergencies  
\- Monitor application logs for errors

\---

\#\# Post-Migration Cleanup

After each successful migration (1-2 weeks of stable operation):

1\. \*\*Remove old dependencies\*\*  
2\. \*\*Clean up environment variables\*\*  
3\. \*\*Update documentation\*\*  
4\. \*\*Archive old code\*\*

See individual migration guides for specific cleanup steps.

\---

\*\*Document Status:\*\* ✅ Active  
\*\*Last Updated:\*\* October 9, 2025  
\*\*Maintained By:\*\* Development Team

**Write** 01-resend-email.md⎿521 lines  
\# Migration 1: SendGrid → Resend

\*\*Status:\*\* ✅ COMPLETED (October 9, 2025\)  
\*\*Complexity:\*\* 🟢 Low  
\*\*Duration:\*\* 4-6 hours  
\*\*Risk:\*\* Low (email only, easy rollback)

\---

\#\# Migration Status

🎉 \*\*This migration is COMPLETE and live in production as of October 9, 2025.\*\*

This document serves as:  
\- Historical record of the migration  
\- Reference for troubleshooting  
\- Guide for similar email migrations  
\- Documentation for new team members

\---

\#\# Table of Contents

1\. \[Overview\](\#overview)  
2\. \[Prerequisites\](\#prerequisites)  
3\. \[Setup Instructions\](\#setup-instructions)  
4\. \[Implementation\](\#implementation)  
5\. \[Testing\](\#testing)  
6\. \[Deployment\](\#deployment)  
7\. \[Rollback Procedure\](\#rollback-procedure)  
8\. \[Post-Migration\](\#post-migration)  
9\. \[Troubleshooting\](\#troubleshooting)

\---

\#\# Overview

\#\#\# Why Resend?

\- \*\*Modern API:\*\* Better developer experience than SendGrid  
\- \*\*React Email:\*\* Type-safe, component-based templates  
\- \*\*Cost-effective:\*\* Lower pricing for our volume  
\- \*\*Performance:\*\* Faster delivery times  
\- \*\*Already installed:\*\* Package was pre-installed in dependencies

\#\#\# What Changed

\- Email service provider: SendGrid → Resend  
\- Template system: HTML strings → React components  
\- API client: \`@sendgrid/mail\` → \`resend\`

\#\#\# Impact

\- \*\*Users:\*\* No visible changes (emails look/work the same)  
\- \*\*Developers:\*\* Better DX with React Email templates  
\- \*\*Operations:\*\* Simpler monitoring via Resend dashboard

\---

\#\# Prerequisites

\#\#\# 1\. Verify Package Installation

\`\`\`bash  
\# Check Resend is installed  
npm list resend  
\# Expected: resend@6.0.3 or higher

\# Check React Email is installed  
npm list @react-email/components  
\# Expected: @react-email/components@0.5.3 or higher  
\`\`\`

\#\#\# 2\. Resend Account Setup

1\. Sign up at \[resend.com\](https://resend.com)  
2\. Verify sending domain: \`taxgeniuspro.tax\`  
   \- Add DNS records (SPF, DKIM, DMARC)  
   \- Wait for verification (usually 5-10 minutes)  
3\. Create API key with full send permissions  
4\. Save API key securely

\#\#\# 3\. Environment Variables

Add to \`.env.local\`:

\`\`\`bash  
RESEND\_API\_KEY="re\_xxxxxxxxxxxxx"  
RESEND\_FROM\_EMAIL="noreply@taxgeniuspro.tax"  
\`\`\`

\---

\#\# Setup Instructions

\#\#\# Step 1: Domain Verification

Add these DNS records to your domain registrar:

\`\`\`  
Type    Name                         Value  
TXT     @                            v=spf1 include:\_spf.resend.com \~all  
TXT     resend.\_domainkey            \[provided by Resend\]  
TXT     \_dmarc                       v=DMARC1; p=none; rua=mailto:admin@taxgeniuspro.tax  
\`\`\`

Verify in Resend dashboard: Settings → Domains → taxgeniuspro.tax

\#\#\# Step 2: API Key Configuration

1\. Go to: https://resend.com/api-keys  
2\. Click "Create API Key"  
3\. Name: "Production \- Tax Genius"  
4\. Permissions: "Full Access" (or "Sending Access" minimum)  
5\. Copy key and add to \`.env.local\`

\---

\#\# Implementation

\#\#\# Email Service Migration

\*\*File:\*\* \`src/lib/services/email.service.ts\`

\#\#\#\# Before (SendGrid)

\`\`\`typescript  
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID\_API\_KEY\!);

export async function sendWelcomeEmail(to: string, data: any) {  
  await sgMail.send({  
    to,  
    from: 'noreply@taxgeniuspro.tax',  
    subject: 'Welcome to Tax Genius',  
    html: '\<h1\>Welcome\!\</h1\>',  
  });  
}  
\`\`\`

\#\#\#\# After (Resend)

\`\`\`typescript  
import { Resend } from 'resend';  
import { WelcomeEmail } from '@/emails/WelcomeEmail';

const resend \= new Resend(process.env.RESEND\_API\_KEY);

export async function sendWelcomeEmail(  
  to: string,  
  data: { name: string; dashboardUrl: string }  
) {  
  const { data: result, error } \= await resend.emails.send({  
    from: process.env.RESEND\_FROM\_EMAIL\!,  
    to,  
    subject: 'Welcome to Tax Genius',  
    react: WelcomeEmail(data),  
  });

  if (error) {  
    throw new Error(\`Email send failed: ${error.message}\`);  
  }

  return result;  
}  
\`\`\`

\#\#\# React Email Templates

\*\*Create:\*\* \`emails/WelcomeEmail.tsx\`

\`\`\`tsx  
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
    \<Html\>  
      \<Head /\>  
      \<Body style={main}\>  
        \<Container style={container}\>  
          \<Heading style={h1}\>Welcome to Tax Genius, {name}\!\</Heading\>

          \<Text style={text}\>  
            Thank you for joining Tax Genius. We're excited to help you with your tax  
            preparation needs.  
          \</Text\>

          \<Section style={buttonContainer}\>  
            \<Button style={button} href={dashboardUrl}\>  
              Go to Dashboard  
            \</Button\>  
          \</Section\>

          \<Text style={footer}\>  
            If you have any questions, reply to this email or visit our help center.  
          \</Text\>  
        \</Container\>  
      \</Body\>  
    \</Html\>  
  );  
}

// Styles  
const main \= {  
  backgroundColor: '\#f6f9fc',  
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',  
};

const container \= {  
  backgroundColor: '\#ffffff',  
  margin: '0 auto',  
  padding: '20px 0 48px',  
  marginBottom: '64px',  
};

const h1 \= {  
  color: '\#333',  
  fontSize: '24px',  
  fontWeight: 'bold',  
  margin: '40px 0',  
  padding: '0',  
  textAlign: 'center' as const,  
};

const text \= {  
  color: '\#333',  
  fontSize: '16px',  
  lineHeight: '26px',  
  textAlign: 'center' as const,  
};

const buttonContainer \= {  
  textAlign: 'center' as const,  
  margin: '27px 0',  
};

const button \= {  
  backgroundColor: '\#2563eb',  
  borderRadius: '8px',  
  color: '\#fff',  
  fontSize: '16px',  
  textDecoration: 'none',  
  textAlign: 'center' as const,  
  display: 'block',  
  padding: '12px 20px',  
};

const footer \= {  
  color: '\#8898aa',  
  fontSize: '14px',  
  lineHeight: '24px',  
  textAlign: 'center' as const,  
  marginTop: '32px',  
};  
\`\`\`

\#\#\# Email Types Migrated

All email sends were updated to use Resend:

1\. ✅ \*\*Welcome email\*\* \- New user registration  
2\. ✅ \*\*Password reset\*\* \- Account recovery  
3\. ✅ \*\*Email verification\*\* \- Email confirmation  
4\. ✅ \*\*Lead notification\*\* \- To tax preparers  
5\. ✅ \*\*Document received\*\* \- Confirmation to clients  
6\. ✅ \*\*Return filed\*\* \- Completion notification  
7\. ✅ \*\*Referral invitation\*\* \- Referral program emails

\---

\#\# Testing

\#\#\# Development Testing

\`\`\`bash  
\# 1\. Start development server  
npm run dev

\# 2\. Test email preview (if configured)  
npm run email:dev  
\# Opens: http://localhost:3000/emails/preview

\# 3\. Trigger test emails through application  
\# \- Create test account  
\# \- Reset password  
\# \- Upload document  
\`\`\`

\#\#\# Verification Checklist

\- \[x\] Email sends successfully  
\- \[x\] Templates render correctly in Gmail  
\- \[x\] Templates render correctly in Outlook  
\- \[x\] Templates render correctly on mobile  
\- \[x\] Links in emails work  
\- \[x\] Unsubscribe links work  
\- \[x\] From address displays correctly  
\- \[x\] Subject lines are correct  
\- \[x\] No broken images  
\- \[x\] Proper error handling

\#\#\# Monitoring

Check Resend dashboard for:  
\- Delivery rates  
\- Bounce rates  
\- Spam reports  
\- Open rates (if tracking enabled)

Dashboard: https://resend.com/emails

\---

\#\# Deployment

\#\#\# Production Deployment Steps

\`\`\`bash  
\# 1\. SSH to production server  
ssh root@72.60.28.175

\# 2\. Navigate to project  
cd /root/websites/taxgeniuspro

\# 3\. Add environment variables  
nano .env.local  
\# Add:  
\# RESEND\_API\_KEY="re\_xxxxxxxxxxxxx"  
\# RESEND\_FROM\_EMAIL="noreply@taxgeniuspro.tax"

\# 4\. Pull latest code (if not already)  
git pull origin main

\# 5\. Install dependencies  
npm install

\# 6\. Build application  
npm run build

\# 7\. Restart application  
pm2 restart taxgeniuspro

\# 8\. Monitor logs for errors  
pm2 logs taxgeniuspro \--lines 100  
\`\`\`

\#\#\# Post-Deployment Verification

\`\`\`bash  
\# Test email sending  
\# 1\. Create test account on production  
\# 2\. Verify welcome email arrives  
\# 3\. Test password reset  
\# 4\. Check Resend dashboard for delivery  
\`\`\`

\---

\#\# Rollback Procedure

\#\#\# If Resend Fails

\`\`\`bash  
\# 1\. SSH to production  
ssh root@72.60.28.175  
cd /root/websites/taxgeniuspro

\# 2\. Revert email service changes  
git checkout HEAD\~1 \-- src/lib/services/email.service.ts

\# 3\. Update environment variables  
nano .env.local  
\# Restore: SENDGRID\_API\_KEY="SG.xxxxx"

\# 4\. Rebuild  
npm run build

\# 5\. Restart  
pm2 restart taxgeniuspro

\# 6\. Verify SendGrid works  
pm2 logs taxgeniuspro  
\`\`\`

\#\#\# Impact of Rollback

\- \*\*User Impact:\*\* None (users won't notice)  
\- \*\*Data Loss:\*\* None (email delivery continues)  
\- \*\*Recovery Time:\*\* 5-10 minutes

\---

\#\# Post-Migration

\#\#\# Cleanup (After 1-2 Weeks)

Once Resend is confirmed stable:

\`\`\`bash  
\# Remove SendGrid package  
npm uninstall @sendgrid/mail

\# Remove old environment variables  
nano .env.local  
\# Delete: SENDGRID\_API\_KEY

\# Commit cleanup  
git add package.json package-lock.json .env.local  
git commit \-m "chore: Remove SendGrid after successful Resend migration"  
\`\`\`

\#\#\# Monitoring

\*\*Week 1:\*\* Daily monitoring  
\- Check Resend dashboard daily  
\- Monitor error logs  
\- Verify all email types are sending

\*\*Week 2+:\*\* Weekly monitoring  
\- Review delivery rates  
\- Check for bounces  
\- Monitor spam complaints

\---

\#\# Troubleshooting

\#\#\# Email Not Sending

\*\*Symptom:\*\* Emails fail to send

\*\*Possible Causes:\*\*  
1\. Invalid API key  
2\. Domain not verified  
3\. Rate limit exceeded  
4\. Invalid recipient address

\*\*Solution:\*\*  
\`\`\`bash  
\# Check logs  
pm2 logs taxgeniuspro | grep \-i "email"

\# Verify API key  
echo $RESEND\_API\_KEY

\# Check Resend dashboard  
\# https://resend.com/emails  
\`\`\`

\#\#\# Template Rendering Issues

\*\*Symptom:\*\* Email looks broken in inbox

\*\*Possible Causes:\*\*  
1\. Missing styles  
2\. Unsupported CSS  
3\. Email client compatibility

\*\*Solution:\*\*  
\- Test in multiple email clients  
\- Use inline styles (React Email handles this)  
\- Check Resend dashboard preview

\#\#\# Domain Not Verified

\*\*Symptom:\*\* Error: "Domain not verified"

\*\*Solution:\*\*  
1\. Check DNS records: https://resend.com/domains  
2\. Wait 5-10 minutes for DNS propagation  
3\. Click "Verify" in Resend dashboard  
4\. Contact Resend support if still failing

\#\#\# Rate Limits

\*\*Symptom:\*\* Error: "Rate limit exceeded"

\*\*Free Tier Limits:\*\*  
\- 100 emails/day  
\- 3,000 emails/month

\*\*Solution:\*\*  
\- Upgrade to paid plan  
\- Implement email queuing  
\- Add retry logic with backoff

\---

\#\# References

\#\#\# Documentation  
\- \[Resend Docs\](https://resend.com/docs)  
\- \[React Email Docs\](https://react.email/docs)  
\- \[Migration Overview\](./README.md)

\#\#\# Related Files  
\- \`src/lib/services/email.service.ts\` \- Email service  
\- \`emails/\` \- React Email templates  
\- \`.env.local\` \- Environment configuration

\---

\*\*Migration Completed:\*\* October 9, 2025  
\*\*Status:\*\* ✅ Live in Production  
\*\*Next Migration:\*\* \[MinIO Storage\](./02-minio-storage.md)

**Update Todos**

* ~~Create README.md with migration overview and progress table~~  
* ~~Create 01-resend-email.md with completed migration details~~  
* Create 02-minio-storage.md with storage migration guide  
* Create 03-clerk-auth.md with authentication migration guide  
* Create testing-validation.md with testing strategies  
* Create rollback-procedures.md with emergency procedures  
* Move original migration-guide.md to docs/archive/

**Write** 02-minio-storage.md⎿929 lines  
\# Migration 2: AWS S3/R2 → MinIO

\*\*Status:\*\* ⏳ PENDING  
\*\*Complexity:\*\* 🟡 Medium  
\*\*Duration:\*\* 2-3 days  
\*\*Risk:\*\* Medium (requires data migration)

\---

\#\# Table of Contents

1\. \[Overview\](\#overview)  
2\. \[Prerequisites\](\#prerequisites)  
3\. \[MinIO Installation\](\#minio-installation)  
4\. \[Nginx Configuration\](\#nginx-configuration)  
5\. \[Bucket Setup\](\#bucket-setup)  
6\. \[Application Configuration\](\#application-configuration)  
7\. \[Data Migration\](\#data-migration)  
8\. \[Testing\](\#testing)  
9\. \[Deployment\](\#deployment)  
10\. \[Rollback Procedure\](\#rollback-procedure)  
11\. \[Post-Migration\](\#post-migration)

\---

\#\# Overview

\#\#\# Why MinIO?

\- \*\*Self-hosted:\*\* Full control over data and costs  
\- \*\*S3-compatible:\*\* Same API as AWS S3/Cloudflare R2  
\- \*\*Cost-effective:\*\* No egress fees, no storage fees  
\- \*\*Performance:\*\* Local storage on VPS is faster  
\- \*\*Privacy:\*\* Tax documents stay on our infrastructure

\#\#\# What's Being Migrated

\*\*Current State:\*\*  
\- AWS S3 or Cloudflare R2 for object storage  
\- External dependencies  
\- Monthly storage costs

\*\*Target State:\*\*  
\- MinIO running on VPS (72.60.28.175)  
\- Self-hosted object storage  
\- No external dependencies for file storage

\#\#\# Migration Scope

\*\*Buckets to Migrate:\*\*  
1\. \`tax-documents\` \- Client tax documents (private)  
2\. \`profile-images\` \- User profile pictures (public)  
3\. \`marketing-assets\` \- Marketing materials (public, optional)

\---

\#\# Prerequisites

\#\#\# System Requirements

\`\`\`bash  
\# Check available disk space  
df \-h /mnt  
\# Requirement: At least 50GB free for MinIO data

\# Check Docker is installed  
docker \--version  
\# Requirement: Docker 20.10 or higher

\# Check available memory  
free \-h  
\# Requirement: At least 2GB RAM available  
\`\`\`

\#\#\# Access Requirements

\- Root SSH access to VPS: \`root@72.60.28.175\`  
\- Nginx installed and configured  
\- SSL certificate for domain (Let's Encrypt)  
\- DNS access to create subdomains

\---

\#\# MinIO Installation

\#\#\# Step 1: Create Data Directory

\`\`\`bash  
\# SSH to VPS  
ssh root@72.60.28.175

\# Create MinIO data directory  
mkdir \-p /mnt/minio/data

\# Set permissions  
chmod 755 /mnt/minio  
chmod 755 /mnt/minio/data  
\`\`\`

\#\#\# Step 2: Generate Secure Credentials

\`\`\`bash  
\# Generate secure password for MinIO  
openssl rand \-base64 32  
\# Save output as MINIO\_ROOT\_PASSWORD  
\`\`\`

\#\#\# Step 3: Run MinIO Container

\`\`\`bash  
\# Run MinIO with Docker  
docker run \-d \\  
  \--name minio \\  
  \-p 9000:9000 \\  
  \-p 9001:9001 \\  
  \-v /mnt/minio/data:/data \\  
  \-e "MINIO\_ROOT\_USER=admin" \\  
  \-e "MINIO\_ROOT\_PASSWORD=\<PASTE\_GENERATED\_PASSWORD\>" \\  
  \--restart always \\  
  minio/minio server /data \--console-address ":9001"  
\`\`\`

\#\#\# Step 4: Verify MinIO is Running

\`\`\`bash  
\# Check Docker container  
docker ps | grep minio  
\# Should show: minio container running

\# Check health endpoint  
curl http://localhost:9000/minio/health/live  
\# Should return: HTTP 200 OK

\# View logs  
docker logs minio  
\# Should show: MinIO started successfully  
\`\`\`

\---

\#\# Nginx Configuration

\#\#\# Step 1: Create DNS Records

Add these A records to your DNS:

\`\`\`  
Type    Name                         Value           TTL  
A       storage.taxgeniuspro.tax     72.60.28.175    300  
A       minio-console.taxgeniuspro.tax 72.60.28.175  300  
\`\`\`

Wait 5-10 minutes for DNS propagation.

\#\#\# Step 2: Configure Nginx

\*\*File:\*\* \`/etc/nginx/sites-available/taxgeniuspro.tax\`

Add these server blocks:

\`\`\`nginx  
\# MinIO API (S3-compatible)  
server {  
    listen 443 ssl http2;  
    server\_name storage.taxgeniuspro.tax;

    ssl\_certificate /etc/letsencrypt/live/taxgeniuspro.tax/fullchain.pem;  
    ssl\_certificate\_key /etc/letsencrypt/live/taxgeniuspro.tax/privkey.pem;

    \# Security headers  
    add\_header X-Content-Type-Options nosniff;  
    add\_header X-Frame-Options DENY;  
    add\_header X-XSS-Protection "1; mode=block";

    location / {  
        proxy\_pass http://localhost:9000;  
        proxy\_set\_header Host $host;  
        proxy\_set\_header X-Real-IP $remote\_addr;  
        proxy\_set\_header X-Forwarded-For $proxy\_add\_x\_forwarded\_for;  
        proxy\_set\_header X-Forwarded-Proto $scheme;

        \# MinIO specific settings  
        proxy\_buffering off;  
        proxy\_request\_buffering off;  
        client\_max\_body\_size 100M;

        \# Timeouts for large uploads  
        proxy\_connect\_timeout 300;  
        proxy\_send\_timeout 300;  
        proxy\_read\_timeout 300;  
    }  
}

\# MinIO Web Console  
server {  
    listen 443 ssl http2;  
    server\_name minio-console.taxgeniuspro.tax;

    ssl\_certificate /etc/letsencrypt/live/taxgeniuspro.tax/fullchain.pem;  
    ssl\_certificate\_key /etc/letsencrypt/live/taxgeniuspro.tax/privkey.pem;

    location / {  
        proxy\_pass http://localhost:9001;  
        proxy\_set\_header Host $host;  
        proxy\_set\_header X-Real-IP $remote\_addr;  
        proxy\_set\_header X-Forwarded-For $proxy\_add\_x\_forwarded\_for;  
        proxy\_set\_header X-Forwarded-Proto $scheme;

        \# WebSocket support for console  
        proxy\_set\_header Upgrade $http\_upgrade;  
        proxy\_set\_header Connection "upgrade";

        proxy\_buffering off;  
    }  
}  
\`\`\`

\#\#\# Step 3: Test and Reload Nginx

\`\`\`bash  
\# Test configuration  
nginx \-t  
\# Should show: syntax is ok

\# Reload Nginx  
systemctl reload nginx

\# Check status  
systemctl status nginx  
\`\`\`

\#\#\# Step 4: Get SSL Certificates

\`\`\`bash  
\# Request certificates for MinIO subdomains  
certbot \--nginx \\  
  \-d storage.taxgeniuspro.tax \\  
  \-d minio-console.taxgeniuspro.tax

\# Verify certificates  
certbot certificates | grep taxgeniuspro.tax  
\`\`\`

\#\#\# Step 5: Verify External Access

\`\`\`bash  
\# Test from local machine  
curl https://storage.taxgeniuspro.tax/minio/health/live  
\# Should return: HTTP 200 OK

\# Access web console  
\# Open: https://minio-console.taxgeniuspro.tax  
\# Login: admin / \<MINIO\_ROOT\_PASSWORD\>  
\`\`\`

\---

\#\# Bucket Setup

\#\#\# Step 1: Install MinIO Client

\`\`\`bash  
\# Download MinIO client  
wget https://dl.min.io/client/mc/release/linux-amd64/mc  
chmod \+x mc  
mv mc /usr/local/bin/

\# Verify installation  
mc \--version  
\`\`\`

\#\#\# Step 2: Configure MinIO Alias

\`\`\`bash  
\# Add local MinIO server  
mc alias set local http://localhost:9000 admin \<MINIO\_ROOT\_PASSWORD\>

\# Test connection  
mc admin info local  
\# Should show: MinIO server info  
\`\`\`

\#\#\# Step 3: Create Buckets

\`\`\`bash  
\# Create tax-documents bucket (private)  
mc mb local/tax-documents  
mc ls local/tax-documents

\# Create profile-images bucket (public read)  
mc mb local/profile-images  
mc anonymous set download local/profile-images

\# Create marketing-assets bucket (public read, optional)  
mc mb local/marketing-assets  
mc anonymous set download local/marketing-assets

\# List all buckets  
mc ls local  
\`\`\`

\#\#\# Step 4: Set Bucket Policies

\*\*For private buckets (tax-documents):\*\*  
\`\`\`bash  
\# Default policy is private \- no action needed  
mc stat local/tax-documents  
\`\`\`

\*\*For public buckets (profile-images):\*\*  
\`\`\`bash  
\# Allow public downloads  
mc anonymous set download local/profile-images

\# Verify policy  
mc anonymous get local/profile-images  
\# Should show: download  
\`\`\`

\---

\#\# Application Configuration

\#\#\# Step 1: Update Environment Variables

\*\*File:\*\* \`/root/websites/taxgeniuspro/.env.local\`

\`\`\`bash  
\# MinIO Configuration  
MINIO\_ENDPOINT="https://storage.taxgeniuspro.tax"  
MINIO\_PORT="443"  
MINIO\_USE\_SSL="true"  
MINIO\_ACCESS\_KEY="admin"  
MINIO\_SECRET\_KEY="\<MINIO\_ROOT\_PASSWORD\>"  
MINIO\_BUCKET\_DOCUMENTS="tax-documents"  
MINIO\_BUCKET\_IMAGES="profile-images"  
MINIO\_BUCKET\_MARKETING="marketing-assets"

\# Keep old R2 config for migration script  
R2\_ENDPOINT="https://xxxxx.r2.cloudflarestorage.com"  
R2\_ACCESS\_KEY="xxxxx"  
R2\_SECRET\_KEY="xxxxx"  
\`\`\`

\#\#\# Step 2: Update Storage Service

\*\*File:\*\* \`src/lib/storage.ts\`

\`\`\`typescript  
import { S3Client } from '@aws-sdk/client-s3';  
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';  
import {  
  PutObjectCommand,  
  GetObjectCommand,  
  DeleteObjectCommand  
} from '@aws-sdk/client-s3';

// MinIO client (S3-compatible)  
const s3Client \= new S3Client({  
  endpoint: process.env.MINIO\_ENDPOINT\!,  
  region: 'us-east-1', // MinIO doesn't use regions, but SDK requires it  
  credentials: {  
    accessKeyId: process.env.MINIO\_ACCESS\_KEY\!,  
    secretAccessKey: process.env.MINIO\_SECRET\_KEY\!,  
  },  
  forcePathStyle: true, // CRITICAL for MinIO\!  
});

/\*\*  
 \* Generate presigned URL for file upload  
 \*/  
export async function generateUploadUrl(  
  bucket: string,  
  key: string,  
  expiresIn: number \= 600 // 10 minutes  
): Promise\<string\> {  
  const command \= new PutObjectCommand({  
    Bucket: bucket,  
    Key: key,  
  });

  return getSignedUrl(s3Client, command, { expiresIn });  
}

/\*\*  
 \* Generate presigned URL for file download  
 \*/  
export async function generateDownloadUrl(  
  bucket: string,  
  key: string,  
  expiresIn: number \= 3600 // 1 hour  
): Promise\<string\> {  
  const command \= new GetObjectCommand({  
    Bucket: bucket,  
    Key: key,  
  });

  return getSignedUrl(s3Client, command, { expiresIn });  
}

/\*\*  
 \* Delete file from bucket  
 \*/  
export async function deleteFile(  
  bucket: string,  
  key: string  
): Promise\<void\> {  
  const command \= new DeleteObjectCommand({  
    Bucket: bucket,  
    Key: key,  
  });

  await s3Client.send(command);  
}

/\*\*  
 \* Get public URL for file (public buckets only)  
 \*/  
export function getPublicUrl(bucket: string, key: string): string {  
  return \`${process.env.MINIO\_ENDPOINT}/${bucket}/${key}\`;  
}  
\`\`\`

\---

\#\# Data Migration

\#\#\# Step 1: Create Migration Script

\*\*File:\*\* \`scripts/migrate-storage.ts\`

\`\`\`typescript  
import {  
  S3Client,  
  ListObjectsV2Command,  
  GetObjectCommand,  
  PutObjectCommand,  
} from '@aws-sdk/client-s3';  
import { Readable } from 'stream';

// Old R2 client  
const r2Client \= new S3Client({  
  endpoint: process.env.R2\_ENDPOINT\!,  
  region: 'auto',  
  credentials: {  
    accessKeyId: process.env.R2\_ACCESS\_KEY\!,  
    secretAccessKey: process.env.R2\_SECRET\_KEY\!,  
  },  
});

// New MinIO client  
const minioClient \= new S3Client({  
  endpoint: process.env.MINIO\_ENDPOINT\!,  
  region: 'us-east-1',  
  credentials: {  
    accessKeyId: process.env.MINIO\_ACCESS\_KEY\!,  
    secretAccessKey: process.env.MINIO\_SECRET\_KEY\!,  
  },  
  forcePathStyle: true,  
});

async function streamToBuffer(stream: Readable): Promise\<Buffer\> {  
  return new Promise((resolve, reject) \=\> {  
    const chunks: Buffer\[\] \= \[\];  
    stream.on('data', (chunk) \=\> chunks.push(chunk));  
    stream.on('error', reject);  
    stream.on('end', () \=\> resolve(Buffer.concat(chunks)));  
  });  
}

async function migrateBucket(bucketName: string) {  
  console.log(\`\\n📦 Migrating bucket: ${bucketName}\`);  
  console.log('─'.repeat(50));

  // List all objects in R2  
  const listCommand \= new ListObjectsV2Command({ Bucket: bucketName });  
  const { Contents } \= await r2Client.send(listCommand);

  if (\!Contents || Contents.length \=== 0\) {  
    console.log(\`  ⚠️  No files found in ${bucketName}\`);  
    return;  
  }

  console.log(\`  Found ${Contents.length} files to migrate\`);

  let migrated \= 0;  
  let failed \= 0;

  for (const object of Contents) {  
    const key \= object.Key\!;  
    try {  
      // Download from R2  
      const getCommand \= new GetObjectCommand({  
        Bucket: bucketName,  
        Key: key,  
      });  
      const { Body, ContentType } \= await r2Client.send(getCommand);

      if (\!Body) {  
        throw new Error('Empty file body');  
      }

      // Convert stream to buffer  
      const bodyBuffer \= await streamToBuffer(Body as Readable);

      // Upload to MinIO  
      const putCommand \= new PutObjectCommand({  
        Bucket: bucketName,  
        Key: key,  
        Body: bodyBuffer,  
        ContentType,  
      });  
      await minioClient.send(putCommand);

      migrated++;  
      console.log(\`  ✅ ${key} (${object.Size} bytes)\`);  
    } catch (error) {  
      failed++;  
      console.error(\`  ❌ ${key}: ${error.message}\`);  
    }  
  }

  console.log(\`\\n  Summary: ${migrated} succeeded, ${failed} failed\`);  
}

async function migrateAll() {  
  console.log('\\n🚀 Starting storage migration...\\n');

  const buckets \= \[  
    'tax-documents',  
    'profile-images',  
    'marketing-assets',  
  \];

  for (const bucket of buckets) {  
    try {  
      await migrateBucket(bucket);  
    } catch (error) {  
      console.error(\`\\n❌ Failed to migrate ${bucket}:\`, error);  
    }  
  }

  console.log('\\n✅ Migration complete\!\\n');  
}

migrateAll().catch(console.error);  
\`\`\`

\#\#\# Step 2: Run Migration

\`\`\`bash  
\# Dry run first (test with one bucket)  
\# Edit script to only include one bucket  
npm run tsx scripts/migrate-storage.ts

\# If successful, run full migration  
npm run tsx scripts/migrate-storage.ts

\# Monitor progress  
\# Large files may take time  
\`\`\`

\#\#\# Step 3: Verify Migration

\`\`\`bash  
\# List files in MinIO  
mc ls local/tax-documents \--recursive | wc \-l  
mc ls local/profile-images \--recursive | wc \-l

\# Compare with source bucket count  
\# Should match original counts

\# Check file sizes  
mc du local/tax-documents  
mc du local/profile-images  
\`\`\`

\#\#\# Step 4: Spot-Check Files

\`\`\`bash  
\# Download a sample file from MinIO  
mc cp local/tax-documents/sample.pdf /tmp/sample.pdf

\# Verify it opens correctly  
file /tmp/sample.pdf  
\# Should show: PDF document

\# Test presigned URLs work  
\# Use application to generate download URL  
\# Verify file downloads in browser  
\`\`\`

\---

\#\# Testing

\#\#\# Testing Checklist

\*\*Basic Operations:\*\*  
\- \[ \] Upload new file to MinIO  
\- \[ \] Download file from MinIO  
\- \[ \] Delete file from MinIO  
\- \[ \] Generate presigned upload URL  
\- \[ \] Generate presigned download URL  
\- \[ \] Presigned URLs expire correctly

\*\*Public Buckets:\*\*  
\- \[ \] Profile images accessible without auth  
\- \[ \] Public URLs work in browser  
\- \[ \] Image displays on user profile

\*\*Private Buckets:\*\*  
\- \[ \] Tax documents require auth  
\- \[ \] Presigned URLs work  
\- \[ \] Unauthorized access blocked

\*\*Large Files:\*\*  
\- \[ \] Upload file \> 10MB  
\- \[ \] Upload file \> 50MB (if applicable)  
\- \[ \] Download large file  
\- \[ \] No timeout errors

\*\*Error Handling:\*\*  
\- \[ \] Handle invalid bucket name  
\- \[ \] Handle missing file  
\- \[ \] Handle network errors  
\- \[ \] Proper error messages

\#\#\# Performance Testing

\`\`\`bash  
\# Test upload speed  
time mc cp /path/to/large-file.pdf local/tax-documents/test.pdf

\# Test download speed  
time mc cp local/tax-documents/test.pdf /tmp/test.pdf

\# Compare with previous R2 speeds  
\`\`\`

\---

\#\# Deployment

\#\#\# Deployment Checklist

\- \[ \] MinIO running and healthy  
\- \[ \] Nginx configured and SSL working  
\- \[ \] Buckets created with correct policies  
\- \[ \] All files migrated and verified  
\- \[ \] Application code updated  
\- \[ \] Environment variables set  
\- \[ \] Application rebuilt  
\- \[ \] Application restarted  
\- \[ \] End-to-end testing passed  
\- \[ \] Monitoring setup

\#\#\# Deployment Steps

\`\`\`bash  
\# 1\. SSH to production  
ssh root@72.60.28.175

\# 2\. Navigate to project  
cd /root/websites/taxgeniuspro

\# 3\. Pull latest code  
git pull origin main

\# 4\. Install dependencies  
npm install

\# 5\. Build application  
npm run build

\# 6\. Restart application  
pm2 restart taxgeniuspro

\# 7\. Monitor logs  
pm2 logs taxgeniuspro \--lines 50

\# 8\. Test file operations  
\# \- Upload test file  
\# \- Download test file  
\# \- Verify in MinIO console  
\`\`\`

\#\#\# Post-Deployment Monitoring

\*\*First Hour:\*\*  
\- Monitor application logs every 10 minutes  
\- Check MinIO container logs: \`docker logs minio \-f\`  
\- Verify no storage errors in application

\*\*First Day:\*\*  
\- Check logs every hour  
\- Monitor disk usage: \`df \-h /mnt/minio/data\`  
\- Verify all file operations work

\*\*First Week:\*\*  
\- Daily monitoring  
\- Check MinIO metrics in console  
\- Verify no data loss

\---

\#\# Rollback Procedure

\#\#\# Emergency Rollback to R2

\`\`\`bash  
\# 1\. SSH to production  
ssh root@72.60.28.175  
cd /root/websites/taxgeniuspro

\# 2\. Revert storage.ts changes  
git checkout HEAD\~1 \-- src/lib/storage.ts

\# 3\. Update environment variables  
nano .env.local  
\# Comment out MinIO vars  
\# Uncomment R2 vars

\# 4\. Rebuild application  
npm run build

\# 5\. Restart application  
pm2 restart taxgeniuspro

\# 6\. Verify R2 works  
pm2 logs taxgeniuspro | grep storage  
\`\`\`

\#\#\# Rollback Impact

\- \*\*Data Loss:\*\* None (files remain in both locations)  
\- \*\*Downtime:\*\* \~2 minutes during restart  
\- \*\*User Impact:\*\* Brief file access interruption

\#\#\# When to Rollback

Rollback if:  
\- File uploads failing consistently  
\- File downloads timing out  
\- Data corruption detected  
\- MinIO container keeps crashing  
\- Severe performance degradation

\---

\#\# Post-Migration

\#\#\# Monitoring Setup

\`\`\`bash  
\# Monitor MinIO disk usage  
watch \-n 60 'df \-h /mnt/minio/data'

\# Monitor MinIO container health  
watch \-n 30 'docker ps | grep minio'

\# Set up disk space alert (optional)  
\# Add cron job to check disk usage  
\`\`\`

\#\#\# Cleanup (After 2 Weeks)

Once MinIO is confirmed stable:

\`\`\`bash  
\# 1\. Remove R2 environment variables  
nano .env.local  
\# Delete R2\_\* variables

\# 2\. Cancel R2 subscription (if paid)  
\# Log into Cloudflare dashboard  
\# Cancel R2 service

\# 3\. Document in architecture docs  
\# Update architecture-v3-FINAL.md  
\`\`\`

\#\#\# Cost Savings

\*\*Before (R2):\*\*  
\- Storage: \~$0.015/GB/month  
\- Egress: $0.00/GB (free tier)  
\- Estimated monthly: $5-20

\*\*After (MinIO):\*\*  
\- Storage: Included in VPS cost  
\- Egress: Free (self-hosted)  
\- Monthly cost: $0

\*\*Annual savings:\*\* \~$60-240

\---

\#\# Troubleshooting

\#\#\# MinIO Container Won't Start

\*\*Symptoms:\*\*  
\`\`\`bash  
docker ps | grep minio  
\# No output  
\`\`\`

\*\*Solution:\*\*  
\`\`\`bash  
\# Check logs  
docker logs minio

\# Common issues:  
\# 1\. Port conflict  
sudo lsof \-i :9000  
sudo lsof \-i :9001

\# 2\. Permission issues  
sudo chown \-R 1000:1000 /mnt/minio/data

\# 3\. Restart container  
docker restart minio  
\`\`\`

\#\#\# Upload Fails with 413 Error

\*\*Symptom:\*\* "413 Request Entity Too Large"

\*\*Solution:\*\*  
\`\`\`nginx  
\# Increase client\_max\_body\_size in Nginx  
\# File: /etc/nginx/sites-available/taxgeniuspro.tax  
client\_max\_body\_size 200M;

\# Reload Nginx  
nginx \-t  
systemctl reload nginx  
\`\`\`

\#\#\# Presigned URLs Not Working

\*\*Symptom:\*\* URLs return 403 Forbidden

\*\*Causes:\*\*  
1\. Wrong bucket policy  
2\. Expired URL  
3\. Incorrect signature

\*\*Solution:\*\*  
\`\`\`bash  
\# Check bucket policy  
mc anonymous get local/tax-documents

\# Verify credentials in .env.local  
echo $MINIO\_ACCESS\_KEY  
echo $MINIO\_SECRET\_KEY

\# Check forcePathStyle is true in storage.ts  
grep forcePathStyle src/lib/storage.ts  
\`\`\`

\#\#\# Slow Upload/Download Speeds

\*\*Symptom:\*\* File operations taking \> 30 seconds

\*\*Causes:\*\*  
1\. Nginx buffering  
2\. Network issues  
3\. Disk I/O bottleneck

\*\*Solution:\*\*  
\`\`\`bash  
\# Check disk I/O  
iostat \-x 1

\# Check network speed  
speedtest-cli

\# Optimize Nginx (already done in config above)  
proxy\_buffering off;  
proxy\_request\_buffering off;  
\`\`\`

\#\#\# Disk Space Running Low

\*\*Symptom:\*\* "No space left on device"

\*\*Solution:\*\*  
\`\`\`bash  
\# Check disk usage  
df \-h /mnt/minio/data

\# Find large files  
du \-h /mnt/minio/data | sort \-rh | head \-20

\# Clean up old files (if applicable)  
mc rm \--recursive \--force local/temp-bucket

\# Expand disk (if VPS allows)  
\# Contact VPS provider  
\`\`\`

\---

\#\# References

\#\#\# Documentation  
\- \[MinIO Docs\](https://min.io/docs/minio/linux/index.html)  
\- \[AWS S3 SDK Docs\](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html)  
\- \[Migration Overview\](./README.md)

\#\#\# Related Files  
\- \`src/lib/storage.ts\` \- Storage service  
\- \`scripts/migrate-storage.ts\` \- Migration script  
\- \`/etc/nginx/sites-available/taxgeniuspro.tax\` \- Nginx config  
\- \`.env.local\` \- Environment configuration

\#\#\# External Resources  
\- MinIO Console: https://minio-console.taxgeniuspro.tax  
\- MinIO API: https://storage.taxgeniuspro.tax  
\- MinIO Client Guide: https://min.io/docs/minio/linux/reference/minio-mc.html

\---

\*\*Migration Status:\*\* ⏳ Pending  
\*\*Previous Migration:\*\* \[Resend Email\](./01-resend-email.md)  
\*\*Next Migration:\*\* \[Clerk Auth\](./03-clerk-auth.md)

**Update Todos**

* ~~Create README.md with migration overview and progress table~~  
* ~~Create 01-resend-email.md with completed migration details~~  
* ~~Create 02-minio-storage.md with storage migration guide~~  
* Create 03-clerk-auth.md with authentication migration guide  
* Create testing-validation.md with testing strategies  
* Create rollback-procedures.md with emergency procedures  
* Move original migration-guide.md to docs/archive/

**Write** 03-clerk-auth.md⎿1201 lines  
\# Migration 3: Lucia → Clerk

\*\*Status:\*\* ⏳ PENDING  
\*\*Complexity:\*\* 🔴 High  
\*\*Duration:\*\* 5-7 days  
\*\*Risk:\*\* High (affects all users)

\---

\#\# Table of Contents

1\. \[Overview\](\#overview)  
2\. \[Prerequisites\](\#prerequisites)  
3\. \[Clerk Setup\](\#clerk-setup)  
4\. \[Implementation\](\#implementation)  
5\. \[User Data Migration\](\#user-data-migration)  
6\. \[Parallel Auth Support\](\#parallel-auth-support)  
7\. \[Testing\](\#testing)  
8\. \[Cutover Strategy\](\#cutover-strategy)  
9\. \[Deployment\](\#deployment)  
10\. \[Rollback Procedure\](\#rollback-procedure)  
11\. \[Post-Migration\](\#post-migration)

\---

\#\# Overview

\#\#\# Why Clerk?

\- \*\*Modern Auth Platform:\*\* Built for Next.js and React  
\- \*\*Feature-Rich:\*\* Magic links, OAuth, 2FA out of the box  
\- \*\*Better UX:\*\* Pre-built UI components  
\- \*\*Security:\*\* Enterprise-grade security, SOC 2 compliant  
\- \*\*Developer Experience:\*\* Simple API, great documentation  
\- \*\*Reduced Maintenance:\*\* No auth code to maintain

\#\#\# What's Changing

\*\*Current State (Lucia):\*\*  
\- Custom auth implementation  
\- Manual session management  
\- Basic email/password auth  
\- Self-maintained security

\*\*Target State (Clerk):\*\*  
\- Managed auth service  
\- Automatic session handling  
\- Multiple auth methods (email, magic link, OAuth)  
\- Security managed by Clerk

\#\#\# Migration Complexity

This is a \*\*HIGH RISK\*\* migration because:  
\- Affects all existing users  
\- Requires data migration  
\- Changes authentication flow  
\- Cannot be easily reversed  
\- Requires careful testing

\#\#\# Recommended Approach

\*\*Parallel Auth Strategy:\*\*  
1\. Week 1-2: Implement Clerk alongside Lucia  
2\. Week 3: New signups use Clerk only  
3\. Week 4: Migrate existing users to Clerk  
4\. Week 5: Parallel support (both systems active)  
5\. Week 6: Deprecate Lucia completely

\---

\#\# Prerequisites

\#\#\# Technical Requirements

\`\`\`bash  
\# Node.js 18+ required  
node \--version  
\# Should be v18.0.0 or higher

\# Next.js 14+ required  
npm list next  
\# Should be 14.0.0 or higher

\# Verify @clerk/nextjs not installed yet  
npm list @clerk/nextjs  
\# Should show: (empty)  
\`\`\`

\#\#\# Access Requirements

\- Clerk account (free tier available)  
\- Access to production database  
\- Ability to send emails to all users  
\- Backup of production database

\#\#\# Planning Requirements

\- Communication plan for users  
\- Rollback plan documented  
\- Testing environment ready  
\- Support team briefed

\---

\#\# Clerk Setup

\#\#\# Step 1: Create Clerk Account

1\. Go to \[clerk.com\](https://clerk.com)  
2\. Sign up with email  
3\. Verify email address  
4\. Choose plan:  
   \- \*\*Development:\*\* Free (up to 10,000 MAUs)  
   \- \*\*Pro:\*\* $25/month (up to 10,000 MAUs)

\#\#\# Step 2: Create Application

1\. Click "Add application"  
2\. Application name: "Tax Genius"  
3\. Choose application type: "Next.js"  
4\. Select authentication methods:  
   \- ✅ Email \+ Password  
   \- ✅ Magic Link (email)  
   \- ✅ Google OAuth  
   \- ⬜ Facebook (optional)  
   \- ⬜ GitHub (optional)

\#\#\# Step 3: Configure Settings

\*\*Session Settings:\*\*  
\- Session lifetime: 7 days  
\- Inactive session lifetime: 1 day  
\- Multi-session handling: Allow multiple sessions

\*\*User Profile:\*\*  
\- Required fields: Email, First Name, Last Name  
\- Custom fields: Role (tax preparer, client, admin)

\*\*Email Settings:\*\*  
\- From name: "Tax Genius"  
\- From email: "noreply@taxgeniuspro.tax"  
\- Use custom domain (requires DNS setup)

\#\#\# Step 4: Setup OAuth (Google)

1\. Go to \[Google Cloud Console\](https://console.cloud.google.com)  
2\. Create OAuth 2.0 credentials  
3\. Authorized redirect URIs:  
   \`\`\`  
   https://clerk.taxgeniuspro.tax/v1/oauth\_callback  
   https://accounts.taxgeniuspro.tax/v1/oauth\_callback  
   \`\`\`  
4\. Copy Client ID and Client Secret  
5\. Add to Clerk dashboard: Authentication → Social Connections → Google

\#\#\# Step 5: Get API Keys

1\. Go to Clerk Dashboard → API Keys  
2\. Copy keys:  
   \`\`\`  
   NEXT\_PUBLIC\_CLERK\_PUBLISHABLE\_KEY="pk\_test\_xxxxx"  
   CLERK\_SECRET\_KEY="sk\_test\_xxxxx"  
   \`\`\`  
3\. Save securely (add to \`.env.local\` later)

\#\#\# Step 6: Configure Webhook

1\. Go to Clerk Dashboard → Webhooks  
2\. Add endpoint:  
   \- URL: \`https://taxgeniuspro.tax/api/webhooks/clerk\`  
   \- Events: \`user.created\`, \`user.updated\`, \`user.deleted\`  
3\. Copy webhook secret:  
   \`\`\`  
   CLERK\_WEBHOOK\_SECRET="whsec\_xxxxx"  
   \`\`\`

\---

\#\# Implementation

\#\#\# Step 1: Install Clerk Package

\`\`\`bash  
\# Install Clerk SDK  
npm install @clerk/nextjs

\# Verify installation  
npm list @clerk/nextjs  
\# Should show: @clerk/nextjs@5.x.x  
\`\`\`

\#\#\# Step 2: Add Environment Variables

\*\*File:\*\* \`.env.local\`

\`\`\`bash  
\# Clerk Configuration  
NEXT\_PUBLIC\_CLERK\_PUBLISHABLE\_KEY="pk\_test\_xxxxxxxxxxxxx"  
CLERK\_SECRET\_KEY="sk\_test\_xxxxxxxxxxxxx"  
CLERK\_WEBHOOK\_SECRET="whsec\_xxxxxxxxxxxxx"

\# Clerk URLs (customize auth flow)  
NEXT\_PUBLIC\_CLERK\_SIGN\_IN\_URL="/auth/login"  
NEXT\_PUBLIC\_CLERK\_SIGN\_UP\_URL="/auth/signup"  
NEXT\_PUBLIC\_CLERK\_AFTER\_SIGN\_IN\_URL="/dashboard"  
NEXT\_PUBLIC\_CLERK\_AFTER\_SIGN\_UP\_URL="/dashboard"

\# Keep Lucia for parallel support (remove later)  
\# LUCIA\_SECRET="xxxxx"  
\`\`\`

\#\#\# Step 3: Update Middleware

\*\*File:\*\* \`src/middleware.ts\`

\`\`\`typescript  
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes (no auth required)  
const isPublicRoute \= createRouteMatcher(\[  
  '/',  
  '/locations(.\*)',  
  '/contact',  
  '/about',  
  '/api/webhooks(.\*)',  
  '/auth/login(.\*)',  
  '/auth/signup(.\*)',  
  '/auth/forgot-password(.\*)',  
\]);

// Clerk middleware  
export default clerkMiddleware((auth, request) \=\> {  
  // Protect all routes except public ones  
  if (\!isPublicRoute(request)) {  
    auth().protect();  
  }  
});

// Middleware configuration  
export const config \= {  
  matcher: \[  
    // Skip Next.js internals and static files  
    '/((?\!\_next|\[^?\]\*\\\\.(?:html?|css|js(?\!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).\*)',  
    // Always run for API routes  
    '/(api|trpc)(.\*)',  
  \],  
};  
\`\`\`

\#\#\# Step 4: Wrap App with ClerkProvider

\*\*File:\*\* \`src/app/layout.tsx\`

\`\`\`typescript  
import { ClerkProvider } from '@clerk/nextjs';  
import { Inter } from 'next/font/google';  
import './globals.css';

const inter \= Inter({ subsets: \['latin'\] });

export const metadata \= {  
  title: 'Tax Genius',  
  description: 'Professional tax preparation services',  
};

export default function RootLayout({  
  children,  
}: {  
  children: React.ReactNode;  
}) {  
  return (  
    \<ClerkProvider\>  
      \<html lang="en"\>  
        \<body className={inter.className}\>  
          {children}  
        \</body\>  
      \</html\>  
    \</ClerkProvider\>  
  );  
}  
\`\`\`

\#\#\# Step 5: Create Auth Pages

\*\*File:\*\* \`src/app/auth/login/page.tsx\`

\`\`\`typescript  
import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {  
  return (  
    \<div className="flex min-h-screen items-center justify-center bg-gray-50"\>  
      \<div className="w-full max-w-md"\>  
        \<SignIn  
          appearance={{  
            elements: {  
              rootBox: 'mx-auto',  
              card: 'shadow-xl rounded-lg',  
              headerTitle: 'text-2xl font-bold',  
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',  
            },  
          }}  
          routing="path"  
          path="/auth/login"  
          signUpUrl="/auth/signup"  
        /\>  
      \</div\>  
    \</div\>  
  );  
}  
\`\`\`

\*\*File:\*\* \`src/app/auth/signup/page.tsx\`

\`\`\`typescript  
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {  
  return (  
    \<div className="flex min-h-screen items-center justify-center bg-gray-50"\>  
      \<div className="w-full max-w-md"\>  
        \<SignUp  
          appearance={{  
            elements: {  
              rootBox: 'mx-auto',  
              card: 'shadow-xl rounded-lg',  
              headerTitle: 'text-2xl font-bold',  
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',  
            },  
          }}  
          routing="path"  
          path="/auth/signup"  
          signInUrl="/auth/login"  
        /\>  
      \</div\>  
    \</div\>  
  );  
}  
\`\`\`

\#\#\# Step 6: Setup Webhook Handler

\*\*File:\*\* \`src/app/api/webhooks/clerk/route.ts\`

\`\`\`typescript  
import { Webhook } from 'svix';  
import { headers } from 'next/headers';  
import { WebhookEvent } from '@clerk/nextjs/server';  
import { prisma } from '@/lib/db';

export async function POST(req: Request) {  
  const WEBHOOK\_SECRET \= process.env.CLERK\_WEBHOOK\_SECRET;

  if (\!WEBHOOK\_SECRET) {  
    throw new Error('Please add CLERK\_WEBHOOK\_SECRET to .env');  
  }

  // Get headers  
  const headerPayload \= headers();  
  const svix\_id \= headerPayload.get('svix-id');  
  const svix\_timestamp \= headerPayload.get('svix-timestamp');  
  const svix\_signature \= headerPayload.get('svix-signature');

  // Validate headers  
  if (\!svix\_id || \!svix\_timestamp || \!svix\_signature) {  
    return new Response('Error: Missing svix headers', { status: 400 });  
  }

  // Get body  
  const payload \= await req.json();  
  const body \= JSON.stringify(payload);

  // Verify webhook signature  
  const wh \= new Webhook(WEBHOOK\_SECRET);  
  let evt: WebhookEvent;

  try {  
    evt \= wh.verify(body, {  
      'svix-id': svix\_id,  
      'svix-timestamp': svix\_timestamp,  
      'svix-signature': svix\_signature,  
    }) as WebhookEvent;  
  } catch (err) {  
    console.error('Error verifying webhook:', err);  
    return new Response('Error: Verification failed', { status: 400 });  
  }

  // Handle events  
  const eventType \= evt.type;

  if (eventType \=== 'user.created') {  
    const { id, email\_addresses, first\_name, last\_name, public\_metadata } \=  
      evt.data;

    // Create user in database  
    await prisma.user.create({  
      data: {  
        clerkUserId: id,  
        email: email\_addresses\[0\].email\_address,  
        firstName: first\_name || '',  
        lastName: last\_name || '',  
        name: \`${first\_name} ${last\_name}\`.trim(),  
        role: (public\_metadata?.role as string) || 'CLIENT',  
      },  
    });

    console.log(\`✅ User created: ${email\_addresses\[0\].email\_address}\`);  
  }

  if (eventType \=== 'user.updated') {  
    const { id, email\_addresses, first\_name, last\_name } \= evt.data;

    // Update user in database  
    await prisma.user.updateMany({  
      where: { clerkUserId: id },  
      data: {  
        email: email\_addresses\[0\].email\_address,  
        firstName: first\_name || '',  
        lastName: last\_name || '',  
        name: \`${first\_name} ${last\_name}\`.trim(),  
      },  
    });

    console.log(\`✅ User updated: ${email\_addresses\[0\].email\_address}\`);  
  }

  if (eventType \=== 'user.deleted') {  
    const { id } \= evt.data;

    // Soft delete or hard delete user  
    await prisma.user.updateMany({  
      where: { clerkUserId: id },  
      data: { deletedAt: new Date() },  
    });

    console.log(\`✅ User deleted: ${id}\`);  
  }

  return new Response('Webhook processed', { status: 200 });  
}  
\`\`\`

\#\#\# Step 7: Update Protected Pages

\*\*File:\*\* \`src/app/dashboard/page.tsx\`

\`\`\`typescript  
import { auth, currentUser } from '@clerk/nextjs/server';  
import { redirect } from 'next/navigation';  
import { prisma } from '@/lib/db';

export default async function DashboardPage() {  
  const { userId } \= auth();

  // Redirect if not authenticated  
  if (\!userId) {  
    redirect('/auth/login');  
  }

  // Get Clerk user  
  const clerkUser \= await currentUser();

  // Get database user  
  const dbUser \= await prisma.user.findUnique({  
    where: { clerkUserId: userId },  
  });

  return (  
    \<div className="container mx-auto px-4 py-8"\>  
      \<h1 className="text-3xl font-bold"\>  
        Welcome, {clerkUser?.firstName}\!  
      \</h1\>

      \<div className="mt-4"\>  
        \<p\>Email: {clerkUser?.emailAddresses\[0\].emailAddress}\</p\>  
        \<p\>Role: {dbUser?.role}\</p\>  
      \</div\>  
    \</div\>  
  );  
}  
\`\`\`

\#\#\# Step 8: Update API Routes

\*\*File:\*\* \`src/app/api/example/route.ts\`

\`\`\`typescript  
import { auth } from '@clerk/nextjs/server';  
import { NextResponse } from 'next/server';

export async function GET(req: Request) {  
  const { userId } \= auth();

  if (\!userId) {  
    return new NextResponse('Unauthorized', { status: 401 });  
  }

  // Your API logic here  
  return NextResponse.json({ userId, message: 'Success' });  
}  
\`\`\`

\---

\#\# User Data Migration

\#\#\# Migration Strategy Options

\#\#\#\# Option A: Hard Cutover (Fast, Risky)

\*\*Timeline:\*\* 1 weekend  
\*\*Best for:\*\* Small user base (\<100 users)

\`\`\`typescript  
// scripts/migrate-users-hard-cutover.ts  
import { clerkClient } from '@clerk/nextjs/server';  
import { prisma } from '@/lib/db';

async function migrateUsers() {  
  console.log('🚀 Starting hard cutover migration...\\n');

  const users \= await prisma.user.findMany({  
    where: { clerkUserId: null },  
  });

  console.log(\`Found ${users.length} users to migrate\\n\`);

  for (const user of users) {  
    try {  
      // Create user in Clerk  
      const clerkUser \= await clerkClient.users.createUser({  
        emailAddress: \[user.email\],  
        firstName: user.firstName,  
        lastName: user.lastName,  
        password: crypto.randomUUID(), // Random password  
        publicMetadata: { role: user.role },  
      });

      // Update database with Clerk ID  
      await prisma.user.update({  
        where: { id: user.id },  
        data: { clerkUserId: clerkUser.id },  
      });

      // Send password reset email  
      await clerkClient.users.sendPasswordResetEmail({  
        userId: clerkUser.id,  
        emailAddressId: clerkUser.emailAddresses\[0\].id,  
      });

      console.log(\`✅ Migrated: ${user.email}\`);  
    } catch (error) {  
      console.error(\`❌ Failed: ${user.email}\`, error.message);  
    }  
  }

  console.log('\\n✅ Migration complete\!');  
}

migrateUsers().catch(console.error);  
\`\`\`

\*\*Pros:\*\*  
\- Fast migration  
\- Simple process  
\- Clean cutover

\*\*Cons:\*\*  
\- All users forced to reset password  
\- Risk of failed migrations  
\- No rollback without full restore

\#\#\#\# Option B: Parallel Auth (Slow, Safe) \- RECOMMENDED

\*\*Timeline:\*\* 3-4 weeks  
\*\*Best for:\*\* Production systems, \>100 users

\*\*Phase 1: Implement Parallel Support\*\*  
\`\`\`typescript  
// src/lib/auth-hybrid.ts  
import { auth as clerkAuth } from '@clerk/nextjs/server';  
import { lucia } from '@/lib/auth-lucia'; // Keep old auth

export async function getUser() {  
  // Try Clerk first  
  const { userId: clerkUserId } \= clerkAuth();  
  if (clerkUserId) {  
    return { provider: 'clerk', userId: clerkUserId };  
  }

  // Fall back to Lucia  
  const luciaSession \= await lucia.validateSession();  
  if (luciaSession) {  
    return { provider: 'lucia', userId: luciaSession.userId };  
  }

  return null;  
}  
\`\`\`

\*\*Phase 2: Prompt Existing Users to Migrate\*\*  
\`\`\`typescript  
// src/app/dashboard/page.tsx  
export default async function Dashboard() {  
  const user \= await getUser();

  if (user?.provider \=== 'lucia') {  
    return \<MigrationPrompt /\>;  
  }

  // Normal dashboard  
  return \<DashboardContent /\>;  
}  
\`\`\`

\*\*Phase 3: Gradual Migration\*\*  
\- Week 1: New users → Clerk only  
\- Week 2: Prompt existing users  
\- Week 3: Auto-migrate on next login  
\- Week 4: Force migration deadline

\*\*Pros:\*\*  
\- No forced password resets  
\- Gradual migration  
\- Easy rollback  
\- Users migrate on their schedule

\*\*Cons:\*\*  
\- Longer timeline  
\- More complex code  
\- Maintain two auth systems temporarily

\#\#\# Migration Script (Parallel Approach)

\*\*File:\*\* \`scripts/migrate-users-parallel.ts\`

\`\`\`typescript  
import { clerkClient } from '@clerk/nextjs/server';  
import { prisma } from '@/lib/db';

async function migrateUserGradually(userId: string) {  
  const user \= await prisma.user.findUnique({  
    where: { id: userId },  
  });

  if (\!user || user.clerkUserId) {  
    return; // Already migrated  
  }

  try {  
    // Create Clerk user  
    const clerkUser \= await clerkClient.users.createUser({  
      emailAddress: \[user.email\],  
      firstName: user.firstName,  
      lastName: user.lastName,  
      externalId: user.id, // Link to existing user  
      publicMetadata: { role: user.role },  
      skipPasswordRequirement: true, // Don't require password initially  
    });

    // Update database  
    await prisma.user.update({  
      where: { id: user.id },  
      data: { clerkUserId: clerkUser.id },  
    });

    // Send migration email  
    await sendMigrationEmail(user.email, clerkUser.id);

    console.log(\`✅ Migrated: ${user.email}\`);  
    return true;  
  } catch (error) {  
    console.error(\`❌ Failed to migrate ${user.email}:\`, error.message);  
    return false;  
  }  
}

// Migrate on user login  
export async function migrateOnLogin(email: string) {  
  const user \= await prisma.user.findUnique({  
    where: { email },  
  });

  if (user && \!user.clerkUserId) {  
    await migrateUserGradually(user.id);  
  }  
}  
\`\`\`

\---

\#\# Parallel Auth Support

\#\#\# Implementation

\*\*File:\*\* \`src/lib/auth-hybrid.ts\`

\`\`\`typescript  
import { auth as clerkAuth, currentUser } from '@clerk/nextjs/server';  
import { cookies } from 'next/headers';  
import { lucia } from '@/lib/auth-lucia';

export type AuthProvider \= 'clerk' | 'lucia';

export interface AuthUser {  
  id: string;  
  email: string;  
  provider: AuthProvider;  
}

/\*\*  
 \* Get authenticated user from either Clerk or Lucia  
 \*/  
export async function getAuthUser(): Promise\<AuthUser | null\> {  
  // Try Clerk first  
  const { userId: clerkUserId } \= clerkAuth();  
  if (clerkUserId) {  
    const clerkUser \= await currentUser();  
    return {  
      id: clerkUserId,  
      email: clerkUser?.emailAddresses\[0\].emailAddress || '',  
      provider: 'clerk',  
    };  
  }

  // Fall back to Lucia  
  const sessionId \= cookies().get('auth\_session')?.value;  
  if (sessionId) {  
    const { user } \= await lucia.validateSession(sessionId);  
    if (user) {  
      return {  
        id: user.id,  
        email: user.email,  
        provider: 'lucia',  
      };  
    }  
  }

  return null;  
}

/\*\*  
 \* Require authentication (either provider)  
 \*/  
export async function requireAuth(): Promise\<AuthUser\> {  
  const user \= await getAuthUser();  
  if (\!user) {  
    throw new Error('Unauthorized');  
  }  
  return user;  
}  
\`\`\`

\#\#\# Migration Prompt Component

\*\*File:\*\* \`src/components/MigrationPrompt.tsx\`

\`\`\`typescript  
'use client';

import { useState } from 'react';  
import { useRouter } from 'next/navigation';

export function MigrationPrompt() {  
  const \[loading, setLoading\] \= useState(false);  
  const router \= useRouter();

  async function handleMigrate() {  
    setLoading(true);

    try {  
      const res \= await fetch('/api/auth/migrate-to-clerk', {  
        method: 'POST',  
      });

      if (res.ok) {  
        router.push('/auth/login?migrated=true');  
      } else {  
        alert('Migration failed. Please try again.');  
      }  
    } catch (error) {  
      alert('Migration failed. Please contact support.');  
    } finally {  
      setLoading(false);  
    }  
  }

  return (  
    \<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"\>  
      \<div className="bg-white rounded-lg p-8 max-w-md"\>  
        \<h2 className="text-2xl font-bold mb-4"\>  
          Security Upgrade Available  
        \</h2\>

        \<p className="text-gray-600 mb-6"\>  
          We're upgrading to a more secure authentication system. This will take  
          just a moment and you'll need to log in again.  
        \</p\>

        \<button  
          onClick={handleMigrate}  
          disabled={loading}  
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"  
        \>  
          {loading ? 'Upgrading...' : 'Upgrade Now'}  
        \</button\>

        \<button  
          onClick={() \=\> alert('You must upgrade to continue')}  
          className="w-full text-gray-500 py-2 mt-2"  
        \>  
          Remind Me Later (Feature disabled until upgrade)  
        \</button\>  
      \</div\>  
    \</div\>  
  );  
}  
\`\`\`

\---

\#\# Testing

\#\#\# Testing Checklist

\*\*New User Signup:\*\*  
\- \[ \] Can sign up with email/password  
\- \[ \] Can sign up with Google OAuth  
\- \[ \] Email verification works  
\- \[ \] User created in database via webhook  
\- \[ \] Redirects to dashboard after signup

\*\*Existing User Login:\*\*  
\- \[ \] Lucia users can still log in  
\- \[ \] Migration prompt appears for Lucia users  
\- \[ \] Migration completes successfully  
\- \[ \] Can log in with Clerk after migration

\*\*Clerk Features:\*\*  
\- \[ \] Magic link login works  
\- \[ \] Password reset works  
\- \[ \] Profile update works  
\- \[ \] Session persists across refreshes  
\- \[ \] Multi-session support works

\*\*API Protection:\*\*  
\- \[ \] Protected API routes require auth  
\- \[ \] Auth works with both providers  
\- \[ \] Proper error handling for unauthorized

\*\*Role-Based Access:\*\*  
\- \[ \] Client role has correct permissions  
\- \[ \] Preparer role has correct permissions  
\- \[ \] Admin role has correct permissions

\#\#\# Test Accounts

Create test accounts for each scenario:

\`\`\`  
Test User 1 (New Clerk User):  
Email: test-clerk@example.com  
Provider: Clerk

Test User 2 (Migrated User):  
Email: test-migrated@example.com  
Provider: Lucia → Clerk

Test User 3 (Unmigrated User):  
Email: test-lucia@example.com  
Provider: Lucia (for testing parallel auth)  
\`\`\`

\---

\#\# Cutover Strategy

\#\#\# Timeline

\`\`\`  
Week 1-2: Implementation & Testing  
├─ Install Clerk  
├─ Implement parallel auth  
├─ Test thoroughly  
└─ Deploy to staging

Week 3: Soft Launch  
├─ Deploy to production  
├─ New signups use Clerk  
├─ Existing users see migration prompt  
└─ Monitor for issues

Week 4: Active Migration  
├─ Email campaign to existing users  
├─ Auto-migrate on login  
├─ Support users with issues  
└─ Track migration progress

Week 5: Migration Deadline  
├─ Set firm deadline date  
├─ Final email to unmigrated users  
├─ Force migration for active users  
└─ Archive Lucia code (keep for rollback)

Week 6: Cleanup  
├─ Verify 100% migration  
├─ Deprecate Lucia completely  
├─ Remove parallel auth code  
└─ Uninstall Lucia packages  
\`\`\`

\#\#\# Communication Plan

\*\*Email 1: Announcement (Week 3)\*\*  
\`\`\`  
Subject: Important: Account Security Upgrade

We're upgrading to a more secure authentication system...  
No action required now \- you'll be prompted on your next login.  
\`\`\`

\*\*Email 2: Reminder (Week 4)\*\*  
\`\`\`  
Subject: Please complete your account upgrade

We noticed you haven't upgraded yet...  
Takes 30 seconds \- click here to upgrade now.  
\`\`\`

\*\*Email 3: Final Notice (Week 5)\*\*  
\`\`\`  
Subject: Action Required: Complete upgrade by \[DATE\]

To continue accessing your account, please complete the upgrade...  
After \[DATE\], you may experience login issues.  
\`\`\`

\---

\#\# Deployment

\#\#\# Pre-Deployment Checklist

\- \[ \] All code tested in staging  
\- \[ \] Database backup completed  
\- \[ \] Rollback plan documented  
\- \[ \] Support team trained  
\- \[ \] User communication drafted  
\- \[ \] Monitoring setup ready  
\- \[ \] Clerk production keys obtained

\#\#\# Deployment Steps

\`\`\`bash  
\# 1\. Database backup  
ssh root@72.60.28.175  
cd /root/websites/taxgeniuspro  
npm run db:backup

\# 2\. Update environment variables  
nano .env.local  
\# Add Clerk production keys

\# 3\. Pull latest code  
git pull origin main

\# 4\. Install dependencies  
npm install

\# 5\. Run database migrations (if needed)  
npx prisma migrate deploy

\# 6\. Build application  
npm run build

\# 7\. Restart application  
pm2 restart taxgeniuspro

\# 8\. Monitor logs  
pm2 logs taxgeniuspro \--lines 100

\# 9\. Test auth flow  
\# \- Sign up new user  
\# \- Log in existing user  
\# \- Verify migration prompt  
\`\`\`

\#\#\# Post-Deployment Monitoring

\*\*First Hour:\*\*  
\- Monitor every 10 minutes  
\- Check webhook logs in Clerk dashboard  
\- Verify new signups work  
\- Test existing user login

\*\*First Day:\*\*  
\- Hourly monitoring  
\- Track migration rate  
\- Monitor error rates  
\- Review support tickets

\*\*First Week:\*\*  
\- Daily monitoring  
\- Migration progress reports  
\- User feedback review  
\- Performance metrics

\---

\#\# Rollback Procedure

\#\#\# Emergency Rollback

\*\*When to Rollback:\*\*  
\- Critical auth failures  
\- Database corruption  
\- Mass user lockouts  
\- Data loss detected

\*\*Rollback Steps:\*\*

\`\`\`bash  
\# 1\. SSH to production  
ssh root@72.60.28.175  
cd /root/websites/taxgeniuspro

\# 2\. Restore database backup  
npm run db:restore

\# 3\. Revert code changes  
git checkout \<previous-commit-hash\>

\# 4\. Remove Clerk from middleware  
\# Edit src/middleware.ts manually if needed

\# 5\. Reinstall Lucia  
npm install lucia @lucia-auth/adapter-prisma

\# 6\. Rebuild  
npm run build

\# 7\. Restart  
pm2 restart taxgeniuspro

\# 8\. Verify Lucia auth works  
\# Test login with existing account  
\`\`\`

\#\#\# Rollback Impact

\- \*\*Downtime:\*\* 10-15 minutes  
\- \*\*Data Loss:\*\* Users created during Clerk period need manual migration  
\- \*\*User Impact:\*\* High \- all users need to re-authenticate

\#\#\# Partial Rollback

If only some features broken:

\`\`\`typescript  
// Disable Clerk temporarily, keep Lucia  
// File: src/middleware.ts

// Comment out Clerk middleware  
// export default clerkMiddleware(...)

// Re-enable Lucia middleware  
export default luciaMiddleware(...);  
\`\`\`

\---

\#\# Post-Migration

\#\#\# Verification (After 2 Weeks)

\- \[ \] 100% of users migrated  
\- \[ \] No auth-related errors  
\- \[ \] All features working  
\- \[ \] Performance acceptable  
\- \[ \] User satisfaction high

\#\#\# Cleanup

\`\`\`bash  
\# Remove Lucia packages  
npm uninstall lucia @lucia-auth/adapter-prisma arctic

\# Remove Lucia files  
rm \-rf src/lib/auth-lucia.ts  
rm \-rf src/lib/auth-hybrid.ts

\# Remove parallel auth code  
\# Manual cleanup required

\# Update Prisma schema  
\# Remove old auth tables  
\# Run migration

\# Commit changes  
git add .  
git commit \-m "chore: Remove Lucia after successful Clerk migration"  
\`\`\`

\#\#\# Update Documentation

\- \[ \] Update architecture docs  
\- \[ \] Update README  
\- \[ \] Update onboarding docs  
\- \[ \] Archive migration docs

\---

\#\# Troubleshooting

\#\#\# User Can't Log In

\*\*Symptom:\*\* "Invalid credentials" error

\*\*Causes:\*\*  
1\. Not migrated yet (using old password)  
2\. Migration failed  
3\. Email not verified in Clerk

\*\*Solution:\*\*  
\`\`\`bash  
\# Check user status  
npx prisma studio  
\# Find user by email  
\# Check clerkUserId field

\# If null, user not migrated  
\# Run migration script for specific user

\# If has clerkUserId, check Clerk dashboard  
\# Resend verification email if needed  
\`\`\`

\#\#\# Webhook Not Firing

\*\*Symptom:\*\* Users created in Clerk but not in database

\*\*Solution:\*\*  
\`\`\`bash  
\# Test webhook endpoint  
curl \-X POST https://taxgeniuspro.tax/api/webhooks/clerk \\  
  \-H "Content-Type: application/json" \\  
  \-d '{"type": "test"}'

\# Check webhook logs in Clerk dashboard  
\# Verify webhook secret matches .env.local

\# Check application logs  
pm2 logs taxgeniuspro | grep webhook  
\`\`\`

\#\#\# Session Expiring Too Fast

\*\*Symptom:\*\* Users logged out after a few minutes

\*\*Solution:\*\*  
1\. Check Clerk dashboard → Sessions → Lifetime  
2\. Should be 7 days  
3\. Update if different  
4\. Clear browser cookies and retry

\#\#\# OAuth Not Working

\*\*Symptom:\*\* "OAuth failed" error

\*\*Solution:\*\*  
1\. Verify OAuth credentials in Clerk  
2\. Check redirect URIs match exactly  
3\. Test in incognito mode (clear cookies)  
4\. Check Google OAuth consent screen is configured

\---

\#\# References

\#\#\# Documentation  
\- \[Clerk Docs\](https://clerk.com/docs)  
\- \[Clerk Next.js Guide\](https://clerk.com/docs/quickstarts/nextjs)  
\- \[Migration Overview\](./README.md)

\#\#\# Related Files  
\- \`src/middleware.ts\` \- Authentication middleware  
\- \`src/app/layout.tsx\` \- ClerkProvider wrapper  
\- \`src/app/api/webhooks/clerk/route.ts\` \- Webhook handler  
\- \`src/lib/auth-hybrid.ts\` \- Parallel auth logic

\#\#\# External Resources  
\- Clerk Dashboard: https://dashboard.clerk.com  
\- Clerk Status: https://status.clerk.com  
\- Clerk Support: support@clerk.com

\---

\*\*Migration Status:\*\* ⏳ Pending  
\*\*Previous Migration:\*\* \[MinIO Storage\](./02-minio-storage.md)  
\*\*Next Document:\*\* \[Testing & Validation\](./testing-validation.md)

**Update Todos**

* ~~Create README.md with migration overview and progress table~~  
* ~~Create 01-resend-email.md with completed migration details~~  
* ~~Create 02-minio-storage.md with storage migration guide~~  
* ~~Create 03-clerk-auth.md with authentication migration guide~~  
* Create testing-validation.md with testing strategies  
* Create rollback-procedures.md with emergency procedures  
* Move original migration-guide.md to docs/archive/

**Write** testing-validation.md⎿814 lines  
\# Testing & Validation

This document provides comprehensive testing strategies and validation checklists for all Tax Genius platform migrations.

\---

\#\# Table of Contents

1\. \[Testing Environments\](\#testing-environments)  
2\. \[Email Migration Testing\](\#email-migration-testing)  
3\. \[Storage Migration Testing\](\#storage-migration-testing)  
4\. \[Auth Migration Testing\](\#auth-migration-testing)  
5\. \[Integration Testing\](\#integration-testing)  
6\. \[Performance Testing\](\#performance-testing)  
7\. \[Load Testing\](\#load-testing)  
8\. \[Security Testing\](\#security-testing)  
9\. \[User Acceptance Testing\](\#user-acceptance-testing)

\---

\#\# Testing Environments

\#\#\# Local Development

\`\`\`bash  
\# Environment: localhost:3005  
\# Purpose: Initial development and unit tests  
\# Database: Local PostgreSQL  
\# Email: Test mode / Resend sandbox  
\# Storage: Local MinIO or test bucket

\# Start local environment  
npm run dev

\# Run tests  
npm test  
npm run test:e2e  
\`\`\`

\#\#\# Staging (Optional)

\`\`\`bash  
\# Environment: staging.taxgeniuspro.tax  
\# Purpose: Pre-production testing  
\# Database: Staging database (copy of production)  
\# Email: Resend test domain  
\# Storage: Staging MinIO instance

\# Deploy to staging  
npm run deploy:staging  
\`\`\`

\#\#\# Production

\`\`\`bash  
\# Environment: taxgeniuspro.tax  
\# Purpose: Live environment  
\# Database: Production PostgreSQL  
\# Email: Resend production  
\# Storage: Production MinIO

\# Monitor production  
pm2 logs taxgeniuspro  
\`\`\`

\---

\#\# Email Migration Testing

\#\#\# Pre-Deployment Testing

\*\*Template Rendering:\*\*  
\- \[ \] Templates render correctly in development  
\- \[ \] All dynamic data displays properly  
\- \[ \] Links work correctly  
\- \[ \] Images load (if any)  
\- \[ \] Styles applied correctly

\*\*Email Client Compatibility:\*\*  
\- \[ \] Gmail (desktop)  
\- \[ \] Gmail (mobile)  
\- \[ \] Outlook (desktop)  
\- \[ \] Outlook (mobile)  
\- \[ \] Apple Mail  
\- \[ \] Yahoo Mail  
\- \[ \] ProtonMail

\*\*Email Types:\*\*  
\- \[ \] Welcome email  
\- \[ \] Password reset  
\- \[ \] Email verification  
\- \[ \] Lead notification (to preparer)  
\- \[ \] Document received confirmation  
\- \[ \] Return filed notification  
\- \[ \] Referral invitation

\#\#\# Testing Procedure

\`\`\`bash  
\# 1\. Test email service locally  
npm run dev

\# 2\. Trigger test email  
\# Create test account or use test API route

\# 3\. Verify in Resend dashboard  
\# https://resend.com/emails  
\# Check delivery status

\# 4\. Check inbox  
\# Verify email received  
\# Click all links  
\# Verify formatting  
\`\`\`

\#\#\# Validation Checklist

\*\*Delivery:\*\*  
\- \[ \] Email sends successfully (status 200\)  
\- \[ \] Email delivered to inbox (not spam)  
\- \[ \] Delivery time \< 30 seconds  
\- \[ \] No bounce errors

\*\*Content:\*\*  
\- \[ \] Subject line correct  
\- \[ \] From name displays correctly ("Tax Genius")  
\- \[ \] From email correct (noreply@taxgeniuspro.tax)  
\- \[ \] Body text renders properly  
\- \[ \] No typos or formatting issues

\*\*Links:\*\*  
\- \[ \] All links clickable  
\- \[ \] Links go to correct destination  
\- \[ \] Links use HTTPS  
\- \[ \] Tracking works (if enabled)

\*\*Unsubscribe:\*\*  
\- \[ \] Unsubscribe link present  
\- \[ \] Unsubscribe works  
\- \[ \] User removed from mailing list

\#\#\# Performance Metrics

| Metric | Target | Measurement |  
|--------|--------|-------------|  
| Delivery Time | \< 30s | Resend dashboard |  
| Delivery Rate | \> 99% | Resend analytics |  
| Bounce Rate | \< 1% | Resend analytics |  
| Spam Rate | \< 0.1% | Resend analytics |  
| Open Rate | \> 40% | Resend analytics (if enabled) |

\---

\#\# Storage Migration Testing

\#\#\# Pre-Migration Testing

\*\*MinIO Setup:\*\*  
\- \[ \] MinIO container running  
\- \[ \] MinIO accessible via Nginx  
\- \[ \] SSL certificate valid  
\- \[ \] Console login works  
\- \[ \] Buckets created

\*\*Network:\*\*  
\- \[ \] DNS resolves correctly  
\- \[ \] HTTPS works  
\- \[ \] No SSL warnings  
\- \[ \] Acceptable latency (\<100ms)

\#\#\# File Operation Testing

\*\*Upload Tests:\*\*  
\`\`\`bash  
\# Small file (\< 1MB)  
curl \-X PUT \-T small-file.pdf \\  
  "$(npm run generate-upload-url \-- tax-documents test-small.pdf)"

\# Medium file (1-10MB)  
curl \-X PUT \-T medium-file.pdf \\  
  "$(npm run generate-upload-url \-- tax-documents test-medium.pdf)"

\# Large file (10-50MB)  
curl \-X PUT \-T large-file.pdf \\  
  "$(npm run generate-upload-url \-- tax-documents test-large.pdf)"  
\`\`\`

\*\*Download Tests:\*\*  
\`\`\`bash  
\# Generate download URL  
npm run generate-download-url \-- tax-documents test-small.pdf

\# Test download  
curl \-o downloaded.pdf "\<PRESIGNED\_URL\>"

\# Verify file integrity  
md5sum small-file.pdf downloaded.pdf  
\# Should match  
\`\`\`

\#\#\# Validation Checklist

\*\*Basic Operations:\*\*  
\- \[ \] Upload file succeeds  
\- \[ \] Download file succeeds  
\- \[ \] Delete file succeeds  
\- \[ \] List files works  
\- \[ \] File metadata correct

\*\*Presigned URLs:\*\*  
\- \[ \] Upload URL works  
\- \[ \] Download URL works  
\- \[ \] URLs expire correctly (600s for upload, 3600s for download)  
\- \[ \] Expired URLs return 403  
\- \[ \] Invalid URLs return 403

\*\*Public vs Private:\*\*  
\- \[ \] Public bucket files accessible without auth  
\- \[ \] Private bucket files require presigned URL  
\- \[ \] Anonymous access blocked on private buckets

\*\*File Types:\*\*  
\- \[ \] PDF files upload/download correctly  
\- \[ \] Image files (PNG, JPG) work  
\- \[ \] Excel files (XLSX) work  
\- \[ \] ZIP files work  
\- \[ \] Large files (\>10MB) work

\*\*Error Handling:\*\*  
\- \[ \] Invalid bucket returns 404  
\- \[ \] Missing file returns 404  
\- \[ \] Network errors handled gracefully  
\- \[ \] Timeout errors handled  
\- \[ \] Disk full handled

\#\#\# Data Migration Validation

\*\*Pre-Migration:\*\*  
\`\`\`bash  
\# Count files in source (R2)  
aws s3 ls s3://tax-documents \--recursive | wc \-l

\# Calculate total size  
aws s3 ls s3://tax-documents \--recursive \--summarize  
\`\`\`

\*\*Post-Migration:\*\*  
\`\`\`bash  
\# Count files in MinIO  
mc ls local/tax-documents \--recursive | wc \-l

\# Calculate total size  
mc du local/tax-documents

\# Compare counts  
\# Should match source  
\`\`\`

\*\*Spot Check:\*\*  
\- \[ \] Random sample of 10 files  
\- \[ \] Verify file sizes match  
\- \[ \] Verify files download correctly  
\- \[ \] Verify file content identical (checksum)

\#\#\# Performance Metrics

| Operation | Target | Measurement |  
|-----------|--------|-------------|  
| Upload (1MB) | \< 2s | Time command |  
| Download (1MB) | \< 2s | Time command |  
| Upload (10MB) | \< 10s | Time command |  
| Download (10MB) | \< 10s | Time command |  
| List files (100 files) | \< 1s | Time command |  
| Generate presigned URL | \< 100ms | Application logs |

\---

\#\# Auth Migration Testing

\#\#\# Pre-Migration Testing

\*\*Clerk Setup:\*\*  
\- \[ \] Clerk application created  
\- \[ \] API keys valid  
\- \[ \] Webhook endpoint accessible  
\- \[ \] Webhook secret configured  
\- \[ \] OAuth configured (Google)

\*\*Application Setup:\*\*  
\- \[ \] Clerk package installed  
\- \[ \] Environment variables set  
\- \[ \] Middleware configured  
\- \[ \] ClerkProvider added to layout  
\- \[ \] Auth pages created

\#\#\# User Flow Testing

\*\*New User Signup:\*\*

\`\`\`  
Test Case: Sign up with email/password  
1\. Go to /auth/signup  
2\. Enter: test-new@example.com  
3\. Enter: Strong\_Password123  
4\. Submit form  
5\. Verify email sent  
6\. Click verification link  
7\. Redirected to dashboard

Expected:  
✓ Account created  
✓ Email verified  
✓ User in database (via webhook)  
✓ Session created  
✓ Dashboard accessible  
\`\`\`

\*\*Existing User Login:\*\*

\`\`\`  
Test Case: Log in with email/password  
1\. Go to /auth/login  
2\. Enter: existing@example.com  
3\. Enter: password  
4\. Submit form  
5\. Redirected to dashboard

Expected:  
✓ Session created  
✓ Dashboard accessible  
✓ User data displayed  
\`\`\`

\*\*Magic Link:\*\*

\`\`\`  
Test Case: Log in with magic link  
1\. Go to /auth/login  
2\. Click "Use magic link"  
3\. Enter: test@example.com  
4\. Check email  
5\. Click magic link  
6\. Redirected to dashboard

Expected:  
✓ Email received within 30s  
✓ Link works  
✓ Session created  
✓ Dashboard accessible  
\`\`\`

\*\*OAuth (Google):\*\*

\`\`\`  
Test Case: Sign up with Google  
1\. Go to /auth/signup  
2\. Click "Continue with Google"  
3\. Select Google account  
4\. Grant permissions  
5\. Redirected to dashboard

Expected:  
✓ OAuth flow completes  
✓ Account created  
✓ User in database (via webhook)  
✓ Dashboard accessible  
\`\`\`

\*\*Password Reset:\*\*

\`\`\`  
Test Case: Reset password  
1\. Go to /auth/login  
2\. Click "Forgot password?"  
3\. Enter: test@example.com  
4\. Check email  
5\. Click reset link  
6\. Enter new password  
7\. Submit  
8\. Redirected to login  
9\. Log in with new password

Expected:  
✓ Reset email received  
✓ Link works  
✓ Password updated  
✓ Can log in with new password  
\`\`\`

\#\#\# Migration Testing

\*\*Parallel Auth:\*\*  
\- \[ \] Lucia users can still log in  
\- \[ \] Clerk users can log in  
\- \[ \] Hybrid auth middleware works  
\- \[ \] Both providers protected routes work

\*\*User Migration:\*\*  
\- \[ \] Migration script runs without errors  
\- \[ \] User created in Clerk  
\- \[ \] Database updated with clerkUserId  
\- \[ \] Password reset email sent  
\- \[ \] User can log in with Clerk

\*\*Migration Prompt:\*\*  
\- \[ \] Prompt appears for Lucia users  
\- \[ \] Prompt explains migration clearly  
\- \[ \] Migration button works  
\- \[ \] User redirected to login  
\- \[ \] User can log in after migration

\#\#\# Validation Checklist

\*\*Authentication:\*\*  
\- \[ \] Email/password login works  
\- \[ \] Magic link login works  
\- \[ \] Google OAuth works  
\- \[ \] Session persists across refreshes  
\- \[ \] Session expires after 7 days  
\- \[ \] Logout works

\*\*Authorization:\*\*  
\- \[ \] Protected routes require auth  
\- \[ \] Public routes accessible without auth  
\- \[ \] API routes protected  
\- \[ \] Role-based access works (CLIENT, PREPARER, ADMIN)

\*\*User Profile:\*\*  
\- \[ \] Profile data displays correctly  
\- \[ \] Profile update works  
\- \[ \] Email change works  
\- \[ \] Password change works

\*\*Webhook:\*\*  
\- \[ \] user.created event creates database user  
\- \[ \] user.updated event updates database user  
\- \[ \] user.deleted event soft-deletes user  
\- \[ \] Webhook signature verified  
\- \[ \] Invalid webhooks rejected

\#\#\# Performance Metrics

| Operation | Target | Measurement |  
|-----------|--------|-------------|  
| Sign up | \< 2s | Browser DevTools |  
| Log in | \< 1s | Browser DevTools |  
| Session validation | \< 100ms | Application logs |  
| Password reset | \< 30s | Email delivery time |  
| OAuth flow | \< 5s | Browser DevTools |

\---

\#\# Integration Testing

\#\#\# End-to-End User Flows

\*\*Client Onboarding Flow:\*\*  
\`\`\`  
1\. User signs up (Clerk)  
2\. Welcome email sent (Resend)  
3\. User uploads documents (MinIO)  
4\. Tax preparer notified (Resend)  
5\. Preparer downloads documents (MinIO)  
6\. Return filed notification (Resend)

Test all steps work together  
\`\`\`

\*\*Referral Flow:\*\*  
\`\`\`  
1\. User sends referral (Resend)  
2\. Friend signs up (Clerk)  
3\. Referral credit applied  
4\. Confirmation email (Resend)

Test all steps work together  
\`\`\`

\#\#\# Integration Points

\*\*Clerk \+ Database:\*\*  
\- \[ \] Webhook creates user in database  
\- \[ \] User roles sync correctly  
\- \[ \] User metadata sync correctly

\*\*Resend \+ Application:\*\*  
\- \[ \] Email service called correctly  
\- \[ \] Templates render with real data  
\- \[ \] Error handling works

\*\*MinIO \+ Application:\*\*  
\- \[ \] File uploads work  
\- \[ \] Presigned URLs work  
\- \[ \] Files associated with correct users

\#\#\# Cross-Migration Testing

\- \[ \] User signs up (Clerk) → Welcome email (Resend)  
\- \[ \] User uploads file (MinIO) → Notification email (Resend)  
\- \[ \] User logs in (Clerk) → Access files (MinIO)

\---

\#\# Performance Testing

\#\#\# Application Performance

\`\`\`bash  
\# Install Apache Bench  
apt install apache2-utils

\# Test homepage  
ab \-n 1000 \-c 10 https://taxgeniuspro.tax/  
\# Target: \> 100 req/sec

\# Test API endpoint  
ab \-n 1000 \-c 10 https://taxgeniuspro.tax/api/health  
\# Target: \> 200 req/sec

\# Test authenticated endpoint (with token)  
ab \-n 100 \-c 5 \\  
  \-H "Authorization: Bearer TOKEN" \\  
  https://taxgeniuspro.tax/api/user  
\# Target: \> 50 req/sec  
\`\`\`

\#\#\# Database Performance

\`\`\`sql  
\-- Query performance  
EXPLAIN ANALYZE SELECT \* FROM users WHERE email \= 'test@example.com';  
\-- Target: \< 10ms

\-- Index usage  
SELECT schemaname, tablename, indexname  
FROM pg\_indexes  
WHERE tablename \= 'users';  
\-- Verify indexes exist

\-- Connection pool  
SELECT count(\*) FROM pg\_stat\_activity;  
\-- Target: \< 50 connections  
\`\`\`

\#\#\# File Upload Performance

\`\`\`bash  
\# Test file upload speed  
time curl \-X PUT \-T 10mb-file.pdf \\  
  "$(npm run generate-upload-url \-- tax-documents test.pdf)"  
\# Target: \< 10s for 10MB  
\`\`\`

\---

\#\# Load Testing

\#\#\# Load Testing with k6

\*\*Install k6:\*\*  
\`\`\`bash  
curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz \-L | tar xvz  
mv k6-\*/k6 /usr/local/bin/  
\`\`\`

\*\*Create load test script:\*\*

\*\*File:\*\* \`tests/load-test.js\`

\`\`\`javascript  
import http from 'k6/http';  
import { check, sleep } from 'k6';

export const options \= {  
  stages: \[  
    { duration: '1m', target: 10 },  // Ramp up to 10 users  
    { duration: '3m', target: 10 },  // Stay at 10 users  
    { duration: '1m', target: 50 },  // Ramp up to 50 users  
    { duration: '3m', target: 50 },  // Stay at 50 users  
    { duration: '1m', target: 0 },   // Ramp down to 0  
  \],  
};

export default function () {  
  // Test homepage  
  let res \= http.get('https://taxgeniuspro.tax');  
  check(res, {  
    'status is 200': (r) \=\> r.status \=== 200,  
    'response time \< 500ms': (r) \=\> r.timings.duration \< 500,  
  });

  sleep(1);

  // Test API  
  res \= http.get('https://taxgeniuspro.tax/api/health');  
  check(res, {  
    'api status is 200': (r) \=\> r.status \=== 200,  
    'api response time \< 200ms': (r) \=\> r.timings.duration \< 200,  
  });

  sleep(1);  
}  
\`\`\`

\*\*Run load test:\*\*  
\`\`\`bash  
k6 run tests/load-test.js  
\`\`\`

\#\#\# Load Test Targets

| Metric | Target |  
|--------|--------|  
| Concurrent users | 50 |  
| Response time (p95) | \< 500ms |  
| Error rate | \< 1% |  
| Requests/second | \> 100 |

\---

\#\# Security Testing

\#\#\# Authentication Security

\*\*Test Cases:\*\*  
\- \[ \] SQL injection in login form  
\- \[ \] XSS in user inputs  
\- \[ \] CSRF protection enabled  
\- \[ \] Session hijacking prevented  
\- \[ \] Password brute-force protection  
\- \[ \] Email enumeration prevented

\#\#\# Authorization Security

\*\*Test Cases:\*\*  
\- \[ \] Unauthorized access blocked  
\- \[ \] Horizontal privilege escalation prevented  
\- \[ \] Vertical privilege escalation prevented  
\- \[ \] API routes require auth  
\- \[ \] Role-based access enforced

\#\#\# Data Security

\*\*Test Cases:\*\*  
\- \[ \] Sensitive data encrypted in database  
\- \[ \] Passwords hashed (bcrypt/Clerk)  
\- \[ \] File access restricted  
\- \[ \] Presigned URLs expire  
\- \[ \] No data leakage in errors

\#\#\# Infrastructure Security

\*\*Test Cases:\*\*  
\- \[ \] HTTPS enforced  
\- \[ \] SSL certificate valid  
\- \[ \] Security headers present  
\- \[ \] No exposed environment variables  
\- \[ \] Database not publicly accessible  
\- \[ \] MinIO not publicly accessible (only via Nginx)

\#\#\# Security Scan

\`\`\`bash  
\# Install OWASP ZAP (optional)  
\# Run security scan  
zap-cli quick-scan https://taxgeniuspro.tax

\# Check for known vulnerabilities  
npm audit  
npm audit fix

\# Check dependencies  
npx depcheck  
\`\`\`

\---

\#\# User Acceptance Testing

\#\#\# UAT Participants

\- Internal team members  
\- Beta users (if available)  
\- Tax preparers  
\- Sample clients

\#\#\# UAT Scenarios

\*\*Scenario 1: New Client Signup\*\*  
\`\`\`  
As a new client:  
1\. I can sign up easily  
2\. I receive a welcome email  
3\. I can upload my documents  
4\. I can track my return status  
5\. I receive notifications  
\`\`\`

\*\*Scenario 2: Tax Preparer Workflow\*\*  
\`\`\`  
As a tax preparer:  
1\. I can log in  
2\. I can see assigned clients  
3\. I can download client documents  
4\. I can update return status  
5\. Clients receive notifications  
\`\`\`

\*\*Scenario 3: Migration Experience\*\*  
\`\`\`  
As an existing user:  
1\. I see migration prompt  
2\. Migration process is clear  
3\. Migration completes quickly  
4\. I can log in after migration  
5\. All my data is intact  
\`\`\`

\#\#\# UAT Feedback Form

\`\`\`  
Migration: \[Email/Storage/Auth\]  
User Type: \[Client/Preparer/Admin\]

1\. Was the process smooth? \[Yes/No\]  
2\. Did you encounter any errors? \[Yes/No\]  
   If yes, describe:

3\. Rate ease of use: \[1-5\]  
4\. Rate performance: \[1-5\]  
5\. Any suggestions?  
\`\`\`

\---

\#\# Testing Reports

\#\#\# Test Results Template

\`\`\`markdown  
\# Migration Test Results

\*\*Migration:\*\* \[Email/Storage/Auth\]  
\*\*Date:\*\* YYYY-MM-DD  
\*\*Tester:\*\* Name  
\*\*Environment:\*\* \[Local/Staging/Production\]

\#\# Summary  
\- Total Tests: X  
\- Passed: X  
\- Failed: X  
\- Pass Rate: X%

\#\# Failed Tests  
1\. Test Name  
   \- Expected: ...  
   \- Actual: ...  
   \- Action: ...

\#\# Performance Metrics  
\- Metric: Value (Target: X)

\#\# Recommendations  
\- Action items  
\- Improvements needed  
\`\`\`

\#\#\# Sign-Off Checklist

\*\*Email Migration:\*\*  
\- \[ \] All tests passed  
\- \[ \] Performance acceptable  
\- \[ \] No critical bugs  
\- \[ \] Approved by: \_\_\_\_\_\_\_\_\_\_\_  
\- \[ \] Date: \_\_\_\_\_\_\_\_\_\_\_

\*\*Storage Migration:\*\*  
\- \[ \] All tests passed  
\- \[ \] Data integrity verified  
\- \[ \] Performance acceptable  
\- \[ \] Approved by: \_\_\_\_\_\_\_\_\_\_\_  
\- \[ \] Date: \_\_\_\_\_\_\_\_\_\_\_

\*\*Auth Migration:\*\*  
\- \[ \] All tests passed  
\- \[ \] User migration successful  
\- \[ \] Security validated  
\- \[ \] Approved by: \_\_\_\_\_\_\_\_\_\_\_  
\- \[ \] Date: \_\_\_\_\_\_\_\_\_\_\_

\---

\#\# References

\#\#\# Related Documents  
\- \[Migration Overview\](./README.md)  
\- \[Resend Email Migration\](./01-resend-email.md)  
\- \[MinIO Storage Migration\](./02-minio-storage.md)  
\- \[Clerk Auth Migration\](./03-clerk-auth.md)  
\- \[Rollback Procedures\](./rollback-procedures.md)

\#\#\# Testing Tools  
\- Jest: https://jestjs.io  
\- Playwright: https://playwright.dev  
\- k6: https://k6.io  
\- Apache Bench: https://httpd.apache.org/docs/2.4/programs/ab.html  
\- OWASP ZAP: https://www.zaproxy.org

\---

\*\*Document Status:\*\* ✅ Active  
\*\*Last Updated:\*\* October 9, 2025  
\*\*Maintained By:\*\* QA Team

**Update Todos**

* ~~Create README.md with migration overview and progress table~~  
* ~~Create 01-resend-email.md with completed migration details~~  
* ~~Create 02-minio-storage.md with storage migration guide~~  
* ~~Create 03-clerk-auth.md with authentication migration guide~~  
* ~~Create testing-validation.md with testing strategies~~  
* Create rollback-procedures.md with emergency procedures  
* Move original migration-guide.md to docs/archive/

**Write** rollback-procedures.md⎿807 lines  
\# Rollback Procedures

Emergency rollback procedures for all Tax Genius platform migrations.

\*\*IMPORTANT:\*\* Only execute rollbacks when absolutely necessary. Each rollback has risks and impacts.

\---

\#\# Table of Contents

1\. \[When to Rollback\](\#when-to-rollback)  
2\. \[Rollback Decision Matrix\](\#rollback-decision-matrix)  
3\. \[Email Migration Rollback\](\#email-migration-rollback)  
4\. \[Storage Migration Rollback\](\#storage-migration-rollback)  
5\. \[Auth Migration Rollback\](\#auth-migration-rollback)  
6\. \[Rollback Testing\](\#rollback-testing)  
7\. \[Post-Rollback Actions\](\#post-rollback-actions)

\---

\#\# When to Rollback

\#\#\# Rollback Criteria

Execute rollback if:  
\- \*\*Critical functionality broken\*\* \- Core features completely unavailable  
\- \*\*Data loss detected\*\* \- User data corrupted or missing  
\- \*\*Mass user impact\*\* \- \>50% of users cannot access system  
\- \*\*Security breach\*\* \- Active security vulnerability discovered  
\- \*\*Unrecoverable errors\*\* \- System cannot self-heal

\#\#\# Do NOT Rollback if:  
\- Minor bugs that don't affect core functionality  
\- Isolated user issues (\< 5% of users)  
\- Cosmetic problems  
\- Performance slightly degraded but acceptable  
\- Issues that can be fixed with hotfix

\#\#\# Escalation Process

\`\`\`  
1\. Identify Issue  
   ↓  
2\. Assess Severity (use Decision Matrix below)  
   ↓  
3\. If Critical → Notify stakeholders  
   ↓  
4\. Decision: Fix Forward vs Rollback  
   ↓  
5\. If Rollback → Execute procedure  
   ↓  
6\. Verify rollback successful  
   ↓  
7\. Post-mortem  
\`\`\`

\---

\#\# Rollback Decision Matrix

| Severity | Impact | Users Affected | Action | Timeline |  
|----------|--------|----------------|--------|----------|  
| \*\*Critical\*\* | System down | \>50% | \*\*ROLLBACK\*\* | Immediate |  
| \*\*High\*\* | Core feature broken | 25-50% | Consider rollback | 30 min |  
| \*\*Medium\*\* | Secondary feature broken | 10-25% | Fix forward | 2 hours |  
| \*\*Low\*\* | Minor issue | \<10% | Fix forward | Next release |

\#\#\# Examples by Severity

\*\*Critical (Rollback):\*\*  
\- Users cannot log in at all  
\- All file uploads fail  
\- Database corruption  
\- Security vulnerability (SQL injection, XSS)  
\- Complete service outage

\*\*High (Consider Rollback):\*\*  
\- Some users cannot log in  
\- File uploads fail for large files  
\- Slow response times (\>10s)  
\- Data inconsistencies affecting multiple users

\*\*Medium (Fix Forward):\*\*  
\- Email delays (\> 5 minutes)  
\- UI rendering issues  
\- Non-critical API errors  
\- Performance degradation (2-5s)

\*\*Low (Fix Forward):\*\*  
\- Cosmetic issues  
\- Typos in emails  
\- Minor UX improvements needed  
\- Single user reports

\---

\#\# Email Migration Rollback

\#\#\# Overview

\*\*Migration:\*\* SendGrid → Resend (✅ COMPLETED)  
\*\*Rollback Risk:\*\* 🟢 Low  
\*\*Rollback Impact:\*\* Minimal

\#\#\# When to Rollback

Rollback if:  
\- Emails not sending at all  
\- Bounce rate \> 10%  
\- Delivery time \> 5 minutes  
\- Resend service outage

Do NOT rollback if:  
\- Minor template issues (fix template instead)  
\- Isolated delivery failures  
\- Temporary delays \< 5 minutes

\#\#\# Rollback Procedure

\`\`\`bash  
\# 1\. SSH to production server  
ssh root@72.60.28.175

\# 2\. Navigate to project  
cd /root/websites/taxgeniuspro

\# 3\. Backup current state  
git log \-1 \> /tmp/rollback-email-from-commit.txt  
npm run db:backup

\# 4\. Revert email service code  
git checkout HEAD\~1 \-- src/lib/services/email.service.ts  
git checkout HEAD\~1 \-- emails/

\# 5\. Update environment variables  
nano .env.local  
\# Comment out Resend:  
\# RESEND\_API\_KEY="re\_xxxxx"  
\# RESEND\_FROM\_EMAIL="noreply@taxgeniuspro.tax"

\# Uncomment SendGrid:  
SENDGRID\_API\_KEY="SG.xxxxxxxxxxxxx"

\# 6\. Reinstall SendGrid package (if removed)  
npm install @sendgrid/mail

\# 7\. Rebuild application  
npm run build

\# 8\. Restart application  
pm2 restart taxgeniuspro

\# 9\. Monitor logs  
pm2 logs taxgeniuspro \--lines 100 | grep \-i email

\# 10\. Test email sending  
\# Trigger test email via application  
\# Verify delivery in SendGrid dashboard  
\`\`\`

\#\#\# Verification Steps

\`\`\`bash  
\# 1\. Check application is running  
pm2 status taxgeniuspro  
\# Should show: online

\# 2\. Test email endpoint  
curl \-X POST https://taxgeniuspro.tax/api/test-email \\  
  \-H "Content-Type: application/json" \\  
  \-d '{"to":"test@example.com"}'

\# 3\. Verify in SendGrid  
\# Login to SendGrid dashboard  
\# Check Activity Feed for test email

\# 4\. Monitor error rate  
pm2 logs taxgeniuspro \--lines 500 | grep \-i error | wc \-l  
\# Should be low  
\`\`\`

\#\#\# Rollback Impact

\- \*\*Downtime:\*\* \~2 minutes during restart  
\- \*\*User Impact:\*\* None (users won't notice)  
\- \*\*Data Loss:\*\* None (emails queued or can be resent)  
\- \*\*Recovery Time:\*\* 5-10 minutes

\#\#\# Post-Rollback Actions

1\. \*\*Investigate root cause\*\*  
   \- Check Resend dashboard for errors  
   \- Review application logs  
   \- Contact Resend support if needed

2\. \*\*Document issue\*\*  
   \- Create incident report  
   \- Note symptoms and resolution  
   \- Update runbook

3\. \*\*Plan fix\*\*  
   \- Schedule retry with fixes  
   \- Test thoroughly before re-attempting  
   \- Communicate timeline to team

\---

\#\# Storage Migration Rollback

\#\#\# Overview

\*\*Migration:\*\* AWS S3/R2 → MinIO (⏳ PENDING)  
\*\*Rollback Risk:\*\* 🟡 Medium  
\*\*Rollback Impact:\*\* Moderate

\#\#\# When to Rollback

Rollback if:  
\- File uploads fail consistently (\>80%)  
\- File downloads timeout consistently  
\- Data corruption detected  
\- MinIO service crashes repeatedly  
\- Severe performance degradation (\>30s uploads)

Do NOT rollback if:  
\- Isolated upload failures (\<20%)  
\- Slow uploads but succeeding  
\- MinIO restart resolves issue  
\- Only affecting new uploads (old files still accessible)

\#\#\# Rollback Procedure

\`\`\`bash  
\# 1\. SSH to production  
ssh root@72.60.28.175  
cd /root/websites/taxgeniuspro

\# 2\. Backup current state  
git log \-1 \> /tmp/rollback-storage-from-commit.txt  
docker logs minio \> /tmp/minio-logs-before-rollback.txt

\# 3\. Revert storage service code  
git checkout HEAD\~1 \-- src/lib/storage.ts  
git checkout HEAD\~1 \-- src/lib/s3.ts

\# 4\. Update environment variables  
nano .env.local

\# Comment out MinIO:  
\# MINIO\_ENDPOINT="https://storage.taxgeniuspro.tax"  
\# MINIO\_ACCESS\_KEY="admin"  
\# MINIO\_SECRET\_KEY="xxxxx"

\# Uncomment R2/S3:  
R2\_ENDPOINT="https://xxxxx.r2.cloudflarestorage.com"  
R2\_ACCESS\_KEY="xxxxxxxxxxxxx"  
R2\_SECRET\_KEY="xxxxxxxxxxxxx"  
R2\_BUCKET="tax-documents"

\# 5\. Rebuild application  
npm run build

\# 6\. Restart application  
pm2 restart taxgeniuspro

\# 7\. Monitor logs  
pm2 logs taxgeniuspro \--lines 100 | grep \-i storage

\# 8\. Test file operations  
\# Upload test file  
\# Download test file  
\# Verify both work  
\`\`\`

\#\#\# Data Considerations

\*\*Files in MinIO:\*\*  
\- Files remain in MinIO (not deleted)  
\- Can be migrated back to R2 if needed  
\- Keep MinIO running for potential recovery

\*\*Files in R2:\*\*  
\- Old files still accessible  
\- New uploads during MinIO period may be missing  
\- May need to sync back to R2

\*\*Hybrid Approach:\*\*  
\`\`\`typescript  
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
\`\`\`

\#\#\# Verification Steps

\`\`\`bash  
\# 1\. Test file upload to R2  
curl \-X POST https://taxgeniuspro.tax/api/upload \\  
  \-H "Authorization: Bearer TOKEN" \\  
  \-F "file=@test.pdf"  
\# Should succeed

\# 2\. Test file download from R2  
curl https://taxgeniuspro.tax/api/files/test.pdf \\  
  \-H "Authorization: Bearer TOKEN" \\  
  \-o downloaded.pdf  
\# Should succeed

\# 3\. Verify old files accessible  
\# Login to application  
\# Navigate to documents  
\# Verify files load

\# 4\. Check error rate  
pm2 logs taxgeniuspro \--lines 500 | grep \-i "storage error" | wc \-l  
\# Should be 0 or very low  
\`\`\`

\#\#\# Rollback Impact

\- \*\*Downtime:\*\* \~5 minutes during restart  
\- \*\*User Impact:\*\* Brief file access interruption  
\- \*\*Data Loss:\*\* Files uploaded to MinIO during migration period may be inaccessible  
\- \*\*Recovery Time:\*\* 10-15 minutes

\#\#\# Post-Rollback Actions

1\. \*\*Assess data gap\*\*  
   \- Identify files only in MinIO  
   \- Migrate back to R2 if needed  
   \- Notify affected users

2\. \*\*Investigate root cause\*\*  
   \- Check MinIO logs: \`docker logs minio\`  
   \- Check Nginx logs: \`tail \-100 /var/log/nginx/error.log\`  
   \- Check disk space: \`df \-h\`

3\. \*\*Plan retry\*\*  
   \- Fix identified issues  
   \- Test thoroughly  
   \- Schedule new migration window

\---

\#\# Auth Migration Rollback

\#\#\# Overview

\*\*Migration:\*\* Lucia → Clerk (⏳ PENDING)  
\*\*Rollback Risk:\*\* 🔴 High  
\*\*Rollback Impact:\*\* Severe

\#\#\# When to Rollback

Rollback if:  
\- \*\*Critical:\*\* Users cannot log in at all (\>80% failure rate)  
\- \*\*Critical:\*\* Mass account lockouts  
\- \*\*Critical:\*\* Session data corrupted  
\- \*\*Critical:\*\* Data breach or security vulnerability  
\- \*\*High:\*\* User data loss detected  
\- \*\*High:\*\* Webhook failures causing database inconsistencies

Do NOT rollback if:  
\- Isolated login issues (\<10% users)  
\- OAuth temporarily unavailable (magic link still works)  
\- Clerk service degradation (but functional)  
\- Minor UI issues with auth pages

\#\#\# ⚠️ ROLLBACK WARNING

\*\*Auth rollback is HIGH RISK because:\*\*  
\- Users created during Clerk period lose access  
\- Session data must be migrated back  
\- Database changes may be hard to reverse  
\- Clerk users need manual migration back to Lucia

\*\*Before rolling back:\*\*  
1\. Confirm issue is truly critical  
2\. Attempt hotfix first  
3\. Get stakeholder approval  
4\. Notify all users  
5\. Backup database

\#\#\# Rollback Procedure

\`\`\`bash  
\# ⚠️ CRITICAL: Backup database first\!  
ssh root@72.60.28.175  
cd /root/websites/taxgeniuspro

\# 1\. BACKUP DATABASE  
npm run db:backup  
\# Or manually:  
pg\_dump taxgeniuspro \> /tmp/db-backup-$(date \+%Y%m%d-%H%M%S).sql

\# 2\. Save current state  
git log \-1 \> /tmp/rollback-auth-from-commit.txt

\# 3\. Export Clerk users (for later migration back to Lucia)  
npm run export-clerk-users \> /tmp/clerk-users-$(date \+%Y%m%d).json

\# 4\. Revert code changes  
git checkout HEAD\~5 \-- src/middleware.ts  
git checkout HEAD\~5 \-- src/app/layout.tsx  
git checkout HEAD\~5 \-- src/app/auth/  
git checkout HEAD\~5 \-- src/lib/auth.ts  
git checkout HEAD\~5 \-- src/app/api/webhooks/clerk/

\# 5\. Remove Clerk package  
npm uninstall @clerk/nextjs

\# 6\. Reinstall Lucia  
npm install lucia @lucia-auth/adapter-prisma arctic

\# 7\. Update environment variables  
nano .env.local

\# Comment out Clerk:  
\# NEXT\_PUBLIC\_CLERK\_PUBLISHABLE\_KEY="pk\_test\_xxxxx"  
\# CLERK\_SECRET\_KEY="sk\_test\_xxxxx"  
\# CLERK\_WEBHOOK\_SECRET="whsec\_xxxxx"

\# Uncomment Lucia:  
LUCIA\_SECRET="xxxxxxxxxxxxx"

\# 8\. Restore Lucia database schema (if changed)  
npx prisma migrate deploy

\# 9\. Rebuild application  
npm run build

\# 10\. Restart application  
pm2 restart taxgeniuspro

\# 11\. CRITICAL: Monitor logs closely  
pm2 logs taxgeniuspro \--lines 200

\# 12\. Test Lucia authentication  
\# Try logging in with pre-migration account  
\`\`\`

\#\#\# Data Migration Considerations

\*\*Users created during Clerk period:\*\*

These users need manual intervention:

\`\`\`typescript  
// scripts/migrate-clerk-users-back.ts  
import { prisma } from '@/lib/db';  
import { hash } from '@node-rs/argon2';

async function migrateClerkUsersBack() {  
  // Get users created during Clerk period  
  const clerkUsers \= await prisma.user.findMany({  
    where: {  
      clerkUserId: { not: null },  
      luciaUserId: null, // Didn't exist in Lucia  
    },  
  });

  console.log(\`Found ${clerkUsers.length} Clerk-only users to migrate\`);

  for (const user of clerkUsers) {  
    // Generate temporary password  
    const tempPassword \= crypto.randomUUID();  
    const hashedPassword \= await hash(tempPassword, {  
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

    console.log(\`✅ Migrated ${user.email} back to Lucia\`);  
  }  
}

migrateClerkUsersBack().catch(console.error);  
\`\`\`

\#\#\# Verification Steps

\`\`\`bash  
\# 1\. Test login with existing Lucia account  
curl \-X POST https://taxgeniuspro.tax/api/auth/login \\  
  \-H "Content-Type: application/json" \\  
  \-d '{"email":"existing@example.com","password":"password123"}'  
\# Should return session cookie

\# 2\. Verify session persists  
curl https://taxgeniuspro.tax/api/auth/me \\  
  \-H "Cookie: auth\_session=xxxxx"  
\# Should return user data

\# 3\. Test signup  
curl \-X POST https://taxgeniuspro.tax/api/auth/signup \\  
  \-H "Content-Type: application/json" \\  
  \-d '{"email":"test@example.com","password":"password123"}'  
\# Should create account

\# 4\. Check error rate  
pm2 logs taxgeniuspro \--lines 1000 | grep \-i "auth error" | wc \-l  
\# Should be 0 or very low

\# 5\. Monitor user reports  
\# Check support channels  
\# Verify login success rate  
\`\`\`

\#\#\# Rollback Impact

\- \*\*Downtime:\*\* 10-15 minutes  
\- \*\*User Impact:\*\* HIGH  
  \- All users must re-authenticate  
  \- Clerk-only users lose access temporarily  
  \- Sessions invalidated  
\- \*\*Data Loss:\*\* Potential  
  \- Users created during Clerk period need migration  
  \- Session data lost  
\- \*\*Recovery Time:\*\* 30-60 minutes \+ user migration time

\#\#\# Communication Plan

\*\*Immediate notification:\*\*  
\`\`\`  
Subject: \[URGENT\] Authentication System Maintenance

We're performing emergency maintenance on our authentication system.

Impact:  
\- You'll need to log in again  
\- If you signed up in the last \[X\] days, please check your email for password reset

Expected resolution: \[TIME\]

We apologize for the inconvenience.  
\`\`\`

\*\*Follow-up (Clerk-only users):\*\*  
\`\`\`  
Subject: Action Required: Reset Your Password

We've updated our authentication system. Please reset your password:

1\. Go to: https://taxgeniuspro.tax/reset-password  
2\. Enter your email  
3\. Check email for reset link  
4\. Set new password

If you have issues, contact support.  
\`\`\`

\#\#\# Post-Rollback Actions

1\. \*\*Migrate Clerk-only users\*\*  
   \- Run migration script  
   \- Send password reset emails  
   \- Monitor completion rate  
   \- Provide support

2\. \*\*Root cause analysis\*\*  
   \- Document what went wrong  
   \- Identify preventable causes  
   \- Update migration plan  
   \- Add safeguards

3\. \*\*Plan retry\*\*  
   \- Fix identified issues  
   \- Extended testing period  
   \- Gradual rollout (10% → 50% → 100%)  
   \- Better monitoring

4\. \*\*Communicate lessons learned\*\*  
   \- Share post-mortem  
   \- Update documentation  
   \- Train support team

\---

\#\# Rollback Testing

\#\#\# Test Rollback Procedures

\*\*DO NOT test rollbacks in production\!\*\*

Use staging or local environment:

\`\`\`bash  
\# 1\. Clone production environment  
npm run setup:staging

\# 2\. Apply migration  
npm run migrate:staging

\# 3\. Test rollback procedure  
npm run rollback:staging

\# 4\. Verify rollback worked  
npm run test:rollback

\# 5\. Document any issues  
\`\`\`

\#\#\# Rollback Drills

Schedule regular rollback drills:

\- \*\*Monthly:\*\* Practice email rollback  
\- \*\*Quarterly:\*\* Practice storage rollback  
\- \*\*Before auth migration:\*\* Full auth rollback drill

\*\*Drill checklist:\*\*  
\- \[ \] Backup procedures work  
\- \[ \] Rollback commands correct  
\- \[ \] Verification steps complete  
\- \[ \] Team knows procedures  
\- \[ \] Documentation up to date

\---

\#\# Post-Rollback Actions

\#\#\# Immediate (Within 1 Hour)

1\. \*\*Verify system stability\*\*  
   \- Monitor error rates  
   \- Check user reports  
   \- Verify all features work

2\. \*\*Communicate status\*\*  
   \- Update status page  
   \- Notify stakeholders  
   \- Email affected users

3\. \*\*Begin investigation\*\*  
   \- Collect logs  
   \- Identify root cause  
   \- Document timeline

\#\#\# Short-term (Within 24 Hours)

1\. \*\*Detailed analysis\*\*  
   \- Review all logs  
   \- Reproduce issue in staging  
   \- Identify fix

2\. \*\*User support\*\*  
   \- Respond to support tickets  
   \- Provide workarounds  
   \- Compensate if needed (credits, etc.)

3\. \*\*Update monitoring\*\*  
   \- Add alerts for similar issues  
   \- Improve dashboards  
   \- Set up better logging

\#\#\# Long-term (Within 1 Week)

1\. \*\*Post-mortem\*\*  
   \- What happened?  
   \- Why did it happen?  
   \- How to prevent?  
   \- Action items

2\. \*\*Update procedures\*\*  
   \- Fix migration guide  
   \- Update rollback procedures  
   \- Improve testing  
   \- Add safeguards

3\. \*\*Plan retry\*\*  
   \- Schedule new attempt  
   \- Implement fixes  
   \- Extra testing  
   \- Gradual rollout

\---

\#\# Rollback Checklist Template

Use this checklist for any rollback:

\`\`\`markdown  
\# Rollback Checklist

\*\*Migration:\*\* \[Email/Storage/Auth\]  
\*\*Date:\*\* YYYY-MM-DD HH:MM  
\*\*Issue:\*\* \[Description\]  
\*\*Severity:\*\* \[Critical/High/Medium/Low\]  
\*\*Decision Maker:\*\* \[Name\]

\#\# Pre-Rollback  
\- \[ \] Severity confirmed (Critical or High)  
\- \[ \] Fix-forward attempted and failed  
\- \[ \] Stakeholders notified  
\- \[ \] Database backed up  
\- \[ \] Rollback procedure reviewed  
\- \[ \] Team on standby

\#\# Rollback Execution  
\- \[ \] Code reverted  
\- \[ \] Environment variables updated  
\- \[ \] Dependencies restored  
\- \[ \] Application rebuilt  
\- \[ \] Application restarted  
\- \[ \] Logs monitored

\#\# Verification  
\- \[ \] System online  
\- \[ \] Core features work  
\- \[ \] Error rate acceptable  
\- \[ \] Users can access system  
\- \[ \] Data integrity confirmed

\#\# Communication  
\- \[ \] Users notified  
\- \[ \] Status page updated  
\- \[ \] Support team briefed  
\- \[ \] Stakeholders updated

\#\# Post-Rollback  
\- \[ \] Root cause identified  
\- \[ \] Incident report created  
\- \[ \] Fix planned  
\- \[ \] Retry scheduled  
\- \[ \] Lessons documented  
\`\`\`

\---

\#\# Emergency Contacts

\#\#\# Internal Team

\`\`\`  
Development Lead: \[Name\]  
Email: \[email\]  
Phone: \[phone\]

DevOps Lead: \[Name\]  
Email: \[email\]  
Phone: \[phone\]

Support Lead: \[Name\]  
Email: \[email\]  
Phone: \[phone\]  
\`\`\`

\#\#\# External Vendors

\`\`\`  
Resend Support:  
Email: support@resend.com  
Dashboard: https://resend.com/support

Clerk Support:  
Email: support@clerk.com  
Dashboard: https://dashboard.clerk.com/support

VPS Provider:  
Email: \[support email\]  
Phone: \[support phone\]  
\`\`\`

\---

\#\# References

\#\#\# Related Documents  
\- \[Migration Overview\](./README.md)  
\- \[Resend Email Migration\](./01-resend-email.md)  
\- \[MinIO Storage Migration\](./02-minio-storage.md)  
\- \[Clerk Auth Migration\](./03-clerk-auth.md)  
\- \[Testing & Validation\](./testing-validation.md)

\#\#\# External Resources  
\- \[Incident Response Best Practices\](https://www.atlassian.com/incident-management/incident-response)  
\- \[Database Backup Strategies\](https://www.postgresql.org/docs/current/backup.html)  
\- \[PM2 Process Management\](https://pm2.keymetrics.io/docs/usage/quick-start/)

\---

\*\*Document Status:\*\* ✅ Active  
\*\*Last Updated:\*\* October 9, 2025  
\*\*Maintained By:\*\* DevOps Team

\*\*⚠️ CRITICAL: Keep this document updated and test rollback procedures regularly\!\*\*

**Update Todos**

* ~~Create README.md with migration overview and progress table~~  
* ~~Create 01-resend-email.md with completed migration details~~  
* ~~Create 02-minio-storage.md with storage migration guide~~  
* ~~Create 03-clerk-auth.md with authentication migration guide~~  
* ~~Create testing-validation.md with testing strategies~~  
* ~~Create rollback-procedures.md with emergency procedures~~  
* Move original migration-guide.md to docs/archive/

**Bash**⎿Move original migration guide to archive

IN

mv /root/websites/taxgeniuspro/docs/migration-guide.md /root/websites/taxgeniuspro/docs/archive/migration-guide.md

OUT

\=========================================  
⚠️  VPS PORT MANAGEMENT RULES ⚠️  
\=========================================  
❌ PORT 3000 IS FORBIDDEN FOR WEBSITES

✅ ACTIVE SERVICES:  
   Port 3001: stepperslife.com  
   Port 3002: gangrunprinting.com  
   Port 3003: uvcoatedclubflyer.com  
   Port 3005: taxgeniuspro.tax  
   Port 3006: chatwoot.agistaffers.com  
   Port 5678: n8n.agistaffers.com  
   Port 8080: webui.agistaffers.com

🔒 RESERVED PORTS (COMING SOON):  
   Port 3004: events.stepperslife.com  
   Port 3007: magazine.stepperslife.com  
   Port 3008: shop.stepperslife.com  
   Port 3009: classes.stepperslife.com  
   Port 3010: restaurants.stepperslife.com  
\=========================================

Full rules: cat /root/PORT\_MANAGEMENT\_KEY.md

**Bash**⎿List created migration files and archived file

IN

ls \-lah /root/websites/taxgeniuspro/docs/migrations/ && echo "---" && ls \-lah /root/websites/taxgeniuspro/docs/archive/

OUT

\=========================================  
⚠️  VPS PORT MANAGEMENT RULES ⚠️  
\=========================================  
❌ PORT 3000 IS FORBIDDEN FOR WEBSITES

✅ ACTIVE SERVICES:  
   Port 3001: stepperslife.com  
   Port 3002: gangrunprinting.com  
   Port 3003: uvcoatedclubflyer.com  
   Port 3005: taxgeniuspro.tax  
   Port 3006: chatwoot.agistaffers.com  
   Port 5678: n8n.agistaffers.com  
   Port 8080: webui.agistaffers.com

🔒 RESERVED PORTS (COMING SOON):  
   Port 3004: events.stepperslife.com  
   Port 3007: magazine.stepperslife.com  
   Port 3008: shop.stepperslife.com  
   Port 3009: classes.stepperslife.com  
   Port 3010: restaurants.stepperslife.com  
\=========================================  
Full rules: cat /root/PORT\_MANAGEMENT\_KEY.md

total 116K  
drwxr-xr-x 2 root root 4.0K Oct  9 15:24 .  
drwxr-xr-x 7 root root 4.0K Oct  9 15:25 ..  
\-rw-r--r-- 1 root root  11K Oct  9 15:17 01-resend-email.md  
\-rw-r--r-- 1 root root  20K Oct  9 15:19 02-minio-storage.md  
\-rw-r--r-- 1 root root  27K Oct  9 15:21 03-clerk-auth.md  
\-rw-r--r-- 1 root root 4.9K Oct  9 15:16 README.md  
\-rw-r--r-- 1 root root  18K Oct  9 15:24 rollback-procedures.md  
\-rw-r--r-- 1 root root  17K Oct  9 15:23 testing-validation.md  
\---  
total 200K  
drwxr-xr-x 2 root root 4.0K Oct  9 15:25 .  
drwxr-xr-x 7 root root 4.0K Oct  9 15:25 ..  
\-rw-r--r-- 1 root root 2.0K Oct  9 15:01 ARCHITECTURE\_ARCHIVE\_README.md  
\-rw-r--r-- 1 root root 1.4K Oct  9 15:14 README.md  
\-rw-r--r-- 1 root root 2.0K Sep 13 16:05 Tax Genius Platform \- Final Technology Stack.md  
\-rw-r--r-- 1 root root 6.4K Sep 13 15:33 architecture-supabase-based.md  
\-rw-r--r-- 1 root root  21K Sep 14 09:27 architecture-v2.md  
\-rw-r--r-- 1 root root  29K Oct  9 14:19 architecture-v3-FINAL.md  
\-rw-r--r-- 1 root root  781 Sep 14 10:27 front-end-spec.md  
\-rw-r--r-- 1 root root  24K Oct  9 14:24 migration-guide.md  
\-rw-r--r-- 1 root root  48K Oct  9 14:17 mvp-requirements.md  
\-rw-r--r-- 1 root root  18K Sep 14 09:24 prd-v2.md

\-rw-r--r-- 1 root root  17K Sep 14 09:26 ux-spec-v2.md

**Bash**⎿Count lines and show total size

IN

cd /root/websites/taxgeniuspro/docs/migrations && wc \-l \*.md && echo "---" && du \-sh /root/websites/taxgeniuspro/docs/migrations/

OUT

\=========================================  
⚠️  VPS PORT MANAGEMENT RULES ⚠️  
\=========================================  
❌ PORT 3000 IS FORBIDDEN FOR WEBSITES

✅ ACTIVE SERVICES:  
   Port 3001: stepperslife.com  
   Port 3002: gangrunprinting.com  
   Port 3003: uvcoatedclubflyer.com  
   Port 3005: taxgeniuspro.tax  
   Port 3006: chatwoot.agistaffers.com  
   Port 5678: n8n.agistaffers.com  
   Port 8080: webui.agistaffers.com

🔒 RESERVED PORTS (COMING SOON):  
   Port 3004: events.stepperslife.com  
   Port 3007: magazine.stepperslife.com  
   Port 3008: shop.stepperslife.com  
   Port 3009: classes.stepperslife.com  
   Port 3010: restaurants.stepperslife.com  
\=========================================  
Full rules: cat /root/PORT\_MANAGEMENT\_KEY.md

  520 01-resend-email.md  
  928 02-minio-storage.md  
 1200 03-clerk-auth.md  
  190 README.md  
  806 rollback-procedures.md  
  813 testing-validation.md  
 4457 total  
\---

112K	/root/websites/taxgeniuspro/docs/migrations/

**Update Todos**

* ~~Create README.md with migration overview and progress table~~  
* ~~Create 01-resend-email.md with completed migration details~~  
* ~~Create 02-minio-storage.md with storage migration guide~~  
* ~~Create 03-clerk-auth.md with authentication migration guide~~  
* ~~Create testing-validation.md with testing strategies~~  
* ~~Create rollback-procedures.md with emergency procedures~~  
* ~~Move original migration-guide.md to docs/archive/~~

Excellent\! Now let me shard the tech-stack document:  
**Task:**Shard tech stack document

IN

{  
  "subagent\_type": "general-purpose",  
  "description": "Shard tech stack document",  
  "prompt": "Shard the tech-stack-v3.md document into focused files.\\n\\nSource file: /root/websites/taxgeniuspro/docs/tech-stack-v3.md (638 lines)\\n\\nCreate these files in /root/websites/taxgeniuspro/docs/tech-stack/:\\n\\n1. \*\*README.md\*\* \- Overview, decision framework, and index of all tech stack docs\\n\\n2. \*\*frontend.md\*\* \- All frontend technologies:\\n   \- Next.js 15 \+ React 19\\n   \- Tailwind CSS 4\\n   \- shadcn/ui \+ Radix UI\\n   \- React Hook Form \+ Zod\\n   \- TanStack Query\\n   \- Framer Motion\\n   \- PWA configuration\\n\\n3. \*\*backend.md\*\* \- Backend stack:\\n   \- Node.js \+ TypeScript\\n   \- PostgreSQL \+ Prisma\\n   \- Redis\\n   \- Socket.io\\n   \- Bull queue\\n\\n4. \*\*infrastructure.md\*\* \- DevOps & Infrastructure:\\n   \- VPS hosting details (72.60.28.175:3005)\\n   \- PM2 process manager\\n   \- Nginx configuration\\n   \- SSL/Let's Encrypt\\n   \- CI/CD with GitHub Actions\\n   \- Monitoring & logging\\n\\n5. \*\*services.md\*\* \- External services:\\n   \- Clerk.com (auth)\\n   \- Resend (email) \- mark as ✅ ACTIVE\\n   \- MinIO (storage)\\n   \- Square (payments)\\n   \- Gemini/Claude (AI)\\n\\n6. \*\*costs.md\*\* \- Cost breakdown and analysis:\\n   \- Development costs\\n   \- Monthly operating costs (\~$100-150)\\n   \- Cost comparison vs alternatives\\n   \- Scaling cost projections\\n\\nRequirements:\\n- Add status indicators (✅ Active, 🔄 Migrating, ⏳ Planned)\\n- Include version numbers\\n- Add \\"Why We Chose This\\" rationale for key decisions\\n- Cross-reference architecture and migration docs\\n- Move original to archive/\\n\\nReturn summary with file details."

}

**Read** tech-stack-v3.md  
**Bash**⎿Create tech-stack directory and archive directory

IN

mkdir \-p /root/websites/taxgeniuspro/docs/tech-stack /root/websites/taxgeniuspro/docs/archive

**Write** README.md⎿226 lines  
\# Tax Genius Platform \- Technology Stack Documentation

\*\*Version:\*\* 3.0  
\*\*Date:\*\* October 9, 2025  
\*\*Status:\*\* Active \- Single Source of Truth

\---

\#\# Overview

This directory contains comprehensive documentation of all technologies used in the Tax Genius platform. The documentation has been organized into focused topic areas for better maintainability and clarity.

\#\# Tech Stack Philosophy

\- \*\*Modern & Stable:\*\* Use latest stable versions of proven technologies  
\- \*\*Type-Safe:\*\* TypeScript throughout for reliability  
\- \*\*Self-Hosted First:\*\* Minimize external dependencies where practical  
\- \*\*Developer Experience:\*\* Prioritize DX without sacrificing performance  
\- \*\*Cost-Effective:\*\* Balance managed services with self-hosting

\---

\#\# Documentation Index

\#\#\# Core Technology Documents

1\. \*\*\[frontend.md\](./frontend.md)\*\* \- Frontend Technologies  
   \- Next.js 15 \+ React 19  
   \- Tailwind CSS 4 & UI components  
   \- State management (React Query, React Hook Form, Zod)  
   \- Routing & navigation  
   \- PWA configuration

2\. \*\*\[backend.md\](./backend.md)\*\* \- Backend Technologies  
   \- Node.js \+ TypeScript runtime  
   \- PostgreSQL database \+ Prisma ORM  
   \- Redis caching & sessions  
   \- Authentication & authorization  
   \- Background jobs (Bull queue)  
   \- Real-time communication (Socket.io)

3\. \*\*\[infrastructure.md\](./infrastructure.md)\*\* \- DevOps & Infrastructure  
   \- VPS hosting (72.60.28.175:3005)  
   \- PM2 process management  
   \- Nginx reverse proxy  
   \- SSL/Let's Encrypt  
   \- CI/CD with GitHub Actions  
   \- Monitoring & logging

4\. \*\*\[services.md\](./services.md)\*\* \- Third-Party Services  
   \- Clerk.com (authentication)  
   \- Resend (email delivery)  
   \- MinIO (object storage)  
   \- Square (payment processing)  
   \- AI services (Gemini/Claude)

5\. \*\*\[costs.md\](./costs.md)\*\* \- Cost Analysis  
   \- Development costs  
   \- Monthly operating costs (\~$100-150)  
   \- Cost comparison vs alternatives  
   \- Scaling cost projections

\---

\#\# Decision Framework

\#\#\# When to Choose Self-Hosted vs Managed Service

\*\*Choose Self-Hosted When:\*\*  
\- Data sovereignty is critical (e.g., tax documents)  
\- High usage would make managed services expensive  
\- You have the operational capacity  
\- No egress fees matter (e.g., file storage)

\*\*Choose Managed Service When:\*\*  
\- Security/compliance is complex (e.g., authentication)  
\- Specialized expertise required (e.g., email deliverability)  
\- Time-to-market is critical  
\- Operational burden outweighs cost

\#\#\# Technology Selection Criteria

1\. \*\*Must-Haves:\*\*  
   \- TypeScript support  
   \- Active community & maintenance  
   \- Production-ready documentation  
   \- Clear migration path

2\. \*\*Nice-to-Haves:\*\*  
   \- Excellent developer experience  
   \- Built-in type safety  
   \- Modern API design  
   \- Good integration ecosystem

3\. \*\*Red Flags:\*\*  
   \- Deprecated or unmaintained  
   \- Poor TypeScript support  
   \- Complex setup/configuration  
   \- Vendor lock-in without clear value

\---

\#\# Quick Reference

\#\#\# Core Stack at a Glance

| Layer | Technology | Version | Status |  
|-------|-----------|---------|--------|  
| \*\*Framework\*\* | Next.js | 15.5.3+ | ✅ Active |  
| \*\*UI Library\*\* | React | 19.1.0+ | ✅ Active |  
| \*\*Runtime\*\* | Node.js | 20 LTS | ✅ Active |  
| \*\*Language\*\* | TypeScript | 5+ | ✅ Active |  
| \*\*Database\*\* | PostgreSQL | 15+ | ✅ Active |  
| \*\*ORM\*\* | Prisma | 6.16.1+ | ✅ Active |  
| \*\*Cache\*\* | Redis | 7.2+ | ✅ Active |  
| \*\*Auth\*\* | Clerk | Latest | 🔄 Migrating |  
| \*\*Email\*\* | Resend | 6.0.3 | ✅ Active |  
| \*\*Storage\*\* | MinIO | Latest | 🔄 Setting up |  
| \*\*Payments\*\* | Square | 43.0.2 | ✅ Active |

\#\#\# Status Legend

\- ✅ \*\*Active\*\* \- Currently in production use  
\- 🔄 \*\*Migrating\*\* \- In process of implementing/migrating  
\- ⏳ \*\*Planned\*\* \- Scheduled for future implementation  
\- 📋 \*\*To Implement\*\* \- Approved but not yet started  
\- ⚠️ \*\*Deprecated\*\* \- Being phased out

\---

\#\# Migration Status Overview

\#\#\# Current Migrations

1\. \*\*Authentication:\*\* Lucia → Clerk (Week 3-4)  
2\. \*\*Email:\*\* SendGrid → Resend (Package installed, ready to activate)  
3\. \*\*Storage:\*\* Cloudflare R2 → MinIO (Planning phase)

See \[Migration Guide\](../migration-guide.md) for detailed migration instructions.

\---

\#\# Performance Targets

| Metric | Target |  
|--------|--------|  
| Time to First Byte | \< 200ms |  
| First Contentful Paint | \< 1.5s |  
| Largest Contentful Paint | \< 2.5s |  
| Cumulative Layout Shift | \< 0.1 |  
| Time to Interactive | \< 3.5s |

\---

\#\# Browser Support

| Browser | Minimum Version |  
|---------|----------------|  
| Chrome | Last 2 versions |  
| Firefox | Last 2 versions |  
| Safari | Last 2 versions |  
| Edge | Last 2 versions |  
| Mobile Safari | iOS 14+ |  
| Chrome Android | Last 2 versions |

\---

\#\# Development Workflow

\#\#\# Quick Start

\`\`\`bash  
\# Install dependencies  
npm install

\# Setup environment  
cp .env.example .env.local  
\# Edit .env.local with your values

\# Run migrations  
npx prisma migrate dev

\# Start dev server  
npm run dev

\# Open browser at http://localhost:3005  
\`\`\`

\#\#\# Production Deployment

\`\`\`bash  
\# Build application  
npm run build

\# Start with PM2  
pm2 start ecosystem.config.js

\# View logs  
pm2 logs taxgeniuspro  
\`\`\`

\---

\#\# Related Documentation

\- \[Architecture v3 FINAL\](../architecture-v3-FINAL.md) \- Complete system architecture  
\- \[Migration Guide\](../migration-guide.md) \- Step-by-step migration instructions  
\- \[MVP Requirements\](../prd/mvp-requirements.md) \- Product specifications

\---

\#\# Version History

| Version | Date | Changes |  
|---------|------|---------|  
| 1.0 | 2024-12 | Initial stack (Lucia, SendGrid, R2) |  
| 2.0 | 2025-01 | Updated to Next.js 15 |  
| 3.0 | 2025-10 | Migration to Clerk, Resend, MinIO; Documentation sharded |

\---

\*\*Document Status:\*\* ✅ Active  
\*\*Last Updated:\*\* October 9, 2025  
\*\*Next Review:\*\* November 9, 2025  
\*\*Maintained By:\*\* Development Team

**Write** frontend.md⎿458 lines  
\# Frontend Technologies

\*\*Version:\*\* 3.0  
\*\*Last Updated:\*\* October 9, 2025

\---

\#\# Overview

The Tax Genius frontend is built with Next.js 15 and React 19, leveraging modern patterns like Server Components and the App Router for optimal performance and developer experience.

\---

\#\# Core Framework

\#\#\# Next.js 15 \+ React 19

| Technology | Version | Status | Purpose |  
|------------|---------|--------|---------|  
| \*\*Next.js\*\* | 15.5.3+ | ✅ Active | Full-stack React framework with App Router |  
| \*\*React\*\* | 19.1.0+ | ✅ Active | UI library with concurrent features |  
| \*\*TypeScript\*\* | 5+ | ✅ Active | Type safety throughout the application |

\#\#\# Why We Chose This

\*\*Next.js 15 over Vite/React:\*\*  
\- ✅ Built-in API routes eliminate need for separate backend  
\- ✅ Server Components reduce client bundle size significantly  
\- ✅ Excellent SEO with dynamic metadata and automatic sitemaps  
\- ✅ Incremental Static Regeneration perfect for landing pages  
\- ✅ Production-ready with minimal configuration  
\- ✅ Better suited for SaaS applications than SPA frameworks

\*\*React 19 Benefits:\*\*  
\- Concurrent rendering for better performance  
\- Improved server component support  
\- Better TypeScript integration  
\- Stable concurrent features

\---

\#\# Styling & UI Components

\#\#\# Styling Stack

| Technology | Version | Status | Purpose |  
|------------|---------|--------|---------|  
| \*\*Tailwind CSS\*\* | 4.1.13 | ✅ Active | Utility-first CSS framework |  
| \*\*shadcn/ui\*\* | Latest | ✅ Active | Accessible, customizable components |  
| \*\*Radix UI\*\* | Latest | ✅ Active | Unstyled accessible primitives |  
| \*\*Lucide React\*\* | 0.544.0+ | ✅ Active | Beautiful, consistent icon system |  
| \*\*Framer Motion\*\* | 12.23.12+ | ✅ Active | Smooth animations and transitions |

\#\#\# Why We Chose This

\*\*Tailwind CSS 4:\*\*  
\- Utility-first approach speeds development  
\- Excellent developer experience with IntelliSense  
\- Smaller bundle sizes with JIT compiler  
\- Easy to maintain consistent design system

\*\*shadcn/ui \+ Radix UI:\*\*  
\- Copy/paste components (no NPM bloat)  
\- Full customization control  
\- Built-in accessibility (ARIA, keyboard navigation)  
\- Type-safe component props  
\- Easy to extend and modify

\#\#\# Component Architecture

\`\`\`  
components/  
├── ui/           \# shadcn/ui styled components  
│   ├── button.tsx  
│   ├── card.tsx  
│   ├── dialog.tsx  
│   └── ...  
├── features/     \# Feature-specific components  
│   ├── dashboard/  
│   ├── documents/  
│   └── payments/  
├── layout/       \# Layout components  
│   ├── Header.tsx  
│   ├── Footer.tsx  
│   ├── Sidebar.tsx  
│   └── Navigation.tsx  
└── shared/       \# Shared utility components  
    ├── LoadingSpinner.tsx  
    ├── ErrorBoundary.tsx  
    └── ...  
\`\`\`

\---

\#\# State Management

\#\#\# State Management Stack

| Technology | Version | Status | Purpose |  
|------------|---------|--------|---------|  
| \*\*@tanstack/react-query\*\* | 5.87.4+ | ✅ Active | Server state management & caching |  
| \*\*React Context\*\* | Built-in | ✅ Active | Global client state (minimal) |  
| \*\*React Hook Form\*\* | 7.62.0+ | ✅ Active | Form state management |  
| \*\*Zod\*\* | 4.1.8+ | ✅ Active | Schema validation & type inference |

\#\#\# State Management Strategy

\*\*1. Server State (React Query)\*\*  
\- All API data fetching and caching  
\- Automatic background refetching  
\- Optimistic updates  
\- Request deduplication

\`\`\`typescript  
// Example: Fetching user data  
const { data: user, isLoading } \= useQuery({  
  queryKey: \['user', userId\],  
  queryFn: () \=\> fetchUser(userId),  
  staleTime: 5 \* 60 \* 1000, // 5 minutes  
});  
\`\`\`

\*\*2. Form State (React Hook Form \+ Zod)\*\*  
\- Type-safe form validation  
\- Minimal re-renders  
\- Server-side validation integration

\`\`\`typescript  
// Example: Tax form validation  
const formSchema \= z.object({  
  ssn: z.string().regex(/^\\d{3}-\\d{2}-\\d{4}$/),  
  income: z.number().positive(),  
  filingStatus: z.enum(\['single', 'married', 'hoh'\]),  
});

const form \= useForm\<z.infer\<typeof formSchema\>\>({  
  resolver: zodResolver(formSchema),  
});  
\`\`\`

\*\*3. Global UI State (React Context)\*\*  
\- Theme preferences  
\- User preferences  
\- UI state (sidebar open/closed)  
\- Minimal global state to avoid prop drilling

\*\*4. URL State (Next.js Routing)\*\*  
\- Search parameters  
\- Filter state  
\- Pagination  
\- Modal state

\#\#\# Why We Chose This

\*\*React Query over Redux:\*\*  
\- Purpose-built for server state  
\- Eliminates boilerplate  
\- Built-in loading/error states  
\- Automatic cache management  
\- Better TypeScript support

\*\*React Hook Form over Formik:\*\*  
\- Better performance (fewer re-renders)  
\- Smaller bundle size  
\- Excellent TypeScript support  
\- Native HTML validation integration  
\- Works seamlessly with Zod

\---

\#\# Routing & Navigation

\#\#\# Routing Stack

| Technology | Version | Status | Purpose |  
|------------|---------|--------|---------|  
| \*\*Next.js App Router\*\* | Built-in | ✅ Active | File-based routing with layouts |  
| \*\*next/navigation\*\* | Built-in | ✅ Active | Programmatic navigation hooks |

\#\#\# Routing Structure

\`\`\`  
app/  
├── (marketing)/          \# Public pages (no auth layout)  
│   ├── page.tsx         \# Home page  
│   ├── about/  
│   ├── pricing/  
│   └── contact/  
├── auth/                 \# Authentication pages  
│   ├── sign-in/  
│   ├── sign-up/  
│   └── callback/  
├── dashboard/            \# Protected dashboards  
│   ├── client/          \# Client dashboard  
│   │   ├── page.tsx  
│   │   ├── documents/  
│   │   ├── appointments/  
│   │   └── payments/  
│   ├── preparer/        \# Preparer dashboard  
│   │   ├── page.tsx  
│   │   ├── clients/  
│   │   ├── documents/  
│   │   └── schedule/  
│   └── referrer/        \# Referrer dashboard  
│       ├── page.tsx  
│       ├── referrals/  
│       └── earnings/  
├── locations/\[city\]/     \# Dynamic landing pages  
│   └── page.tsx  
├── admin/                \# Admin tools  
│   ├── users/  
│   ├── analytics/  
│   └── settings/  
└── api/                  \# API routes  
    ├── auth/  
    ├── documents/  
    └── payments/  
\`\`\`

\#\#\# Route Protection

\`\`\`typescript  
// middleware.ts \- Route protection  
export default authMiddleware({  
  publicRoutes: \['/', '/locations/(.\*)', '/auth/(.\*)'\],  
  ignoredRoutes: \['/api/webhook'\],  
});  
\`\`\`

\---

\#\# Progressive Web App (PWA)

\#\#\# PWA Configuration

| Feature | Status | Technology |  
|---------|--------|-----------|  
| \*\*Service Worker\*\* | ✅ Active | next-pwa |  
| \*\*Web App Manifest\*\* | ✅ Active | manifest.json |  
| \*\*Push Notifications\*\* | ✅ Active | web-push@3.6.7 |  
| \*\*Offline Support\*\* | ✅ Active | Service Worker caching |  
| \*\*Install Prompt\*\* | ✅ Active | Native browser API |

\#\#\# PWA Features

\*\*1. Offline Functionality\*\*  
\- Cache static assets  
\- Cache API responses  
\- Offline fallback pages  
\- Background sync for forms

\*\*2. Push Notifications\*\*  
\- Tax deadline reminders  
\- Document status updates  
\- Appointment notifications  
\- Payment confirmations

\*\*3. Install Experience\*\*  
\- Custom install prompt  
\- iOS Add to Home Screen  
\- Android install banner  
\- Desktop PWA support

\#\#\# PWA Configuration

\`\`\`javascript  
// next.config.js  
const withPWA \= require('next-pwa')({  
  dest: 'public',  
  register: true,  
  skipWaiting: true,  
  disable: process.env.NODE\_ENV \=== 'development',  
});  
\`\`\`

\---

\#\# Development Utilities

\#\#\# Utility Libraries

| Package | Version | Purpose |  
|---------|---------|---------|  
| \*\*date-fns\*\* | 4.1.0+ | Date manipulation & formatting |  
| \*\*clsx\*\* | 2.1.1+ | Conditional class names |  
| \*\*class-variance-authority\*\* | 0.7.1+ | Component variant management |  
| \*\*tailwind-merge\*\* | 3.3.1+ | Merge Tailwind classes safely |

\#\#\# Usage Examples

\`\`\`typescript  
// clsx \+ tailwind-merge (via cn utility)  
import { cn } from '@/lib/utils';

\<Button  
  className={cn(  
    'rounded-lg',  
    isPrimary && 'bg-blue-600',  
    isDisabled && 'opacity-50'  
  )}  
/\>

// date-fns  
import { format, addDays } from 'date-fns';

const deadline \= addDays(new Date(), 30);  
const formatted \= format(deadline, 'MMMM dd, yyyy');  
\`\`\`

\---

\#\# Performance Optimization

\#\#\# Optimization Strategies

\*\*1. Server Components (Default)\*\*  
\- Render components on server  
\- Reduce client bundle size  
\- Direct database access  
\- No JavaScript shipped for static content

\*\*2. Code Splitting\*\*  
\- Automatic route-based splitting  
\- Dynamic imports for heavy components  
\- Lazy loading for modals and dialogs

\`\`\`typescript  
// Dynamic import example  
const HeavyChart \= dynamic(() \=\> import('@/components/HeavyChart'), {  
  loading: () \=\> \<ChartSkeleton /\>,  
  ssr: false,  
});  
\`\`\`

\*\*3. Image Optimization\*\*  
\- Next.js Image component  
\- Automatic WebP conversion  
\- Responsive images  
\- Lazy loading

\`\`\`typescript  
import Image from 'next/image';

\<Image  
  src="/profile.jpg"  
  alt="Profile"  
  width={200}  
  height={200}  
  priority={false}  
/\>  
\`\`\`

\*\*4. Font Optimization\*\*  
\- next/font for automatic font optimization  
\- Self-hosted fonts  
\- Reduced layout shift

\`\`\`typescript  
import { Inter } from 'next/font/inter';

const inter \= Inter({ subsets: \['latin'\] });  
\`\`\`

\---

\#\# Testing Strategy

\#\#\# Frontend Testing Stack

| Tool | Version | Purpose |  
|------|---------|---------|  
| \*\*Jest\*\* | 30.1.3+ | Unit testing framework |  
| \*\*@testing-library/react\*\* | 16.3.0+ | Component testing |  
| \*\*@testing-library/jest-dom\*\* | 6.8.0+ | DOM assertions |  
| \*\*Playwright\*\* | 1.55.0+ | E2E testing |

\#\#\# Testing Approach

\*\*1. Component Tests\*\*  
\`\`\`typescript  
import { render, screen } from '@testing-library/react';  
import { Button } from '@/components/ui/button';

test('renders button with correct text', () \=\> {  
  render(\<Button\>Click me\</Button\>);  
  expect(screen.getByRole('button')).toHaveTextContent('Click me');  
});  
\`\`\`

\*\*2. Integration Tests\*\*  
\- Test user flows  
\- API route testing  
\- Form submission tests

\*\*3. E2E Tests (Playwright)\*\*  
\- Critical user journeys  
\- Cross-browser testing  
\- Visual regression tests

\---

\#\# Code Quality

\#\#\# Quality Tools

| Tool | Version | Purpose |  
|------|---------|---------|  
| \*\*ESLint\*\* | 9+ | Code linting |  
| \*\*Prettier\*\* | Latest | Code formatting |  
| \*\*TypeScript\*\* | 5+ | Type checking |

\#\#\# ESLint Configuration

\`\`\`json  
{  
  "extends": \["next/core-web-vitals", "prettier"\],  
  "rules": {  
    "@typescript-eslint/no-unused-vars": "error",  
    "@typescript-eslint/no-explicit-any": "warn",  
    "react-hooks/rules-of-hooks": "error",  
    "react-hooks/exhaustive-deps": "warn"  
  }  
}  
\`\`\`

\---

\#\# Browser Support

| Browser | Minimum Version | PWA Support |  
|---------|----------------|-------------|  
| Chrome | Last 2 versions | ✅ Full |  
| Firefox | Last 2 versions | ✅ Full |  
| Safari | Last 2 versions | ✅ Full |  
| Edge | Last 2 versions | ✅ Full |  
| Mobile Safari | iOS 14+ | ✅ Full |  
| Chrome Android | Last 2 versions | ✅ Full |

\#\#\# Progressive Enhancement  
\- Core functionality works without JavaScript  
\- Enhanced experience with JavaScript enabled  
\- PWA features for modern browsers  
\- Graceful degradation for older browsers

\---

\#\# Related Documentation

\- \[Backend Technologies\](./backend.md)  
\- \[Infrastructure\](./infrastructure.md)  
\- \[Architecture v3 FINAL\](../architecture-v3-FINAL.md)

\---

\*\*Document Status:\*\* ✅ Active  
\*\*Last Updated:\*\* October 9, 2025  
\*\*Maintained By:\*\* Development Team

**Write** backend.md⎿557 lines  
\# Backend Technologies

\*\*Version:\*\* 3.0  
\*\*Last Updated:\*\* October 9, 2025

\---

\#\# Overview

The Tax Genius backend is built on Node.js with TypeScript, using PostgreSQL for data persistence, Redis for caching, and modern tools for authentication, storage, and background processing.

\---

\#\# Runtime & Language

\#\#\# Core Runtime

| Technology | Version | Status | Purpose |  
|------------|---------|--------|---------|  
| \*\*Node.js\*\* | 20 LTS | ✅ Active | JavaScript runtime |  
| \*\*TypeScript\*\* | 5+ | ✅ Active | Type-safe language |  
| \*\*Next.js API Routes\*\* | 15.5.3+ | ✅ Active | Backend API endpoints |

\#\#\# Why We Chose This

\*\*Node.js 20 LTS:\*\*  
\- Long-term support until April 2026  
\- Stable and widely adopted  
\- Excellent package ecosystem  
\- Native TypeScript support  
\- Performance improvements over v18

\*\*TypeScript:\*\*  
\- Catch errors at compile time  
\- Better IDE support and autocomplete  
\- Self-documenting code  
\- Easier refactoring  
\- Industry standard for modern Node.js

\---

\#\# Database & ORM

\#\#\# Database Stack

| Technology | Version | Status | Purpose |  
|------------|---------|--------|---------|  
| \*\*PostgreSQL\*\* | 15+ | ✅ Active | Primary relational database |  
| \*\*Prisma\*\* | 6.16.1+ | ✅ Active | Type-safe ORM & migrations |  
| \*\*Redis\*\* | 7.2+ | ✅ Active | Caching, sessions, queues |  
| \*\*ioredis\*\* | 5.7.0+ | ✅ Active | Redis client library |

\#\#\# Why We Chose This

\*\*PostgreSQL over MySQL/MongoDB:\*\*  
\- ✅ ACID compliance for financial data  
\- ✅ Superior data integrity  
\- ✅ Advanced features (JSON, full-text search)  
\- ✅ Better for complex queries  
\- ✅ Excellent backup/recovery tools

\*\*Prisma over TypeORM/Sequelize:\*\*  
\- ✅ Best-in-class TypeScript support  
\- ✅ Type-safe database queries  
\- ✅ Automatic migration generation  
\- ✅ Excellent developer experience  
\- ✅ Built-in connection pooling  
\- ✅ Zero-cost type safety

\*\*Redis:\*\*  
\- ✅ Sub-millisecond response times  
\- ✅ Perfect for session storage  
\- ✅ Bull queue backend  
\- ✅ Pub/sub for real-time features

\#\#\# Database Features

\*\*Prisma Configuration:\*\*  
\`\`\`typescript  
// prisma/schema.prisma  
generator client {  
  provider \= "prisma-client-js"  
}

datasource db {  
  provider \= "postgresql"  
  url      \= env("DATABASE\_URL")  
}

// Connection pooling  
const prisma \= new PrismaClient({  
  datasources: {  
    db: {  
      url: process.env.DATABASE\_URL,  
    },  
  },  
  log: \['query', 'error', 'warn'\],  
});  
\`\`\`

\*\*Key Database Features:\*\*  
\- ✅ Prisma Migrate for version control  
\- ✅ Automatic type generation  
\- ✅ Connection pooling (10-20 connections)  
\- ✅ Query optimization with indexes  
\- ✅ Soft deletes for data retention

\---

\#\# Authentication & Authorization

\#\#\# Authentication Stack

| Technology | Version | Status | Purpose |  
|------------|---------|--------|---------|  
| \*\*Clerk.com\*\* | Latest | 🔄 Migrating | Managed authentication service |  
| \*\*Lucia\*\* | 3.2.2 | ⚠️ Deprecated | Current auth (being replaced) |  
| \*\*node:crypto\*\* | Built-in | ✅ Active | PII encryption at rest |  
| \*\*scrypt\*\* | Built-in | ✅ Active | Password hashing |

\#\#\# Why We Chose This

\*\*Clerk over Lucia/Supabase Auth:\*\*  
\- ✅ Managed service reduces maintenance burden  
\- ✅ Built-in user management UI  
\- ✅ Better suited for SaaS/multi-tenancy  
\- ✅ Excellent developer experience  
\- ✅ Comprehensive webhook system  
\- ✅ Built-in session management  
\- ✅ OAuth providers included  
\- ✅ Scales automatically

\*\*Security Features:\*\*  
\- JWT-based sessions  
\- Automatic session refresh  
\- Device tracking  
\- Multi-factor authentication ready  
\- Rate limiting built-in

\#\#\# Migration Timeline

| Phase | Status | Timeline |  
|-------|--------|----------|  
| Install Clerk SDK | 📋 Planned | Week 3 |  
| Implement auth pages | 📋 Planned | Week 3 |  
| Set up webhooks | 📋 Planned | Week 3-4 |  
| Migrate existing users | 📋 Planned | Week 4 |  
| Update middleware | 📋 Planned | Week 4 |  
| Remove Lucia | 📋 Planned | Week 5 |

\#\#\# PII Encryption

\*\*Data Encryption Strategy:\*\*  
\`\`\`typescript  
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

// Encrypt sensitive data (SSN, bank accounts)  
function encryptPII(data: string): string {  
  const iv \= randomBytes(16);  
  const cipher \= createCipheriv('aes-256-gcm', ENCRYPTION\_KEY, iv);  
  // ... encryption logic  
}

// Fields encrypted:  
// \- Social Security Numbers  
// \- Bank account numbers  
// \- Tax ID numbers  
// \- Any PII in documents  
\`\`\`

\---

\#\# Storage

\#\#\# Storage Stack

| Technology | Version | Status | Purpose |  
|------------|---------|--------|---------|  
| \*\*MinIO\*\* | Latest | 🔄 Setting up | S3-compatible object storage |  
| \*\*@aws-sdk/client-s3\*\* | 3.888.0+ | ✅ Active | S3 client (MinIO compatible) |  
| \*\*@aws-sdk/s3-request-presigner\*\* | 3.888.0+ | ✅ Active | Presigned upload/download URLs |  
| \*\*Cloudflare R2\*\* | N/A | ⚠️ Deprecated | Being replaced by MinIO |

\#\#\# Why We Chose This

\*\*MinIO over Cloudflare R2:\*\*  
\- ✅ Self-hosted for data sovereignty  
\- ✅ No egress fees (R2 charges for downloads)  
\- ✅ S3-compatible API (easy migration)  
\- ✅ Better for tax document storage (compliance)  
\- ✅ Cost-effective for high usage  
\- ✅ No vendor lock-in

\*\*Storage Architecture:\*\*  
\`\`\`typescript  
// S3 client configuration for MinIO  
const s3Client \= new S3Client({  
  endpoint: process.env.MINIO\_ENDPOINT,  
  region: 'us-east-1', // MinIO default  
  credentials: {  
    accessKeyId: process.env.MINIO\_ACCESS\_KEY,  
    secretAccessKey: process.env.MINIO\_SECRET\_KEY,  
  },  
  forcePathStyle: true, // Required for MinIO  
});  
\`\`\`

\#\#\# Storage Buckets

| Bucket | Purpose | Retention | Encryption |  
|--------|---------|-----------|------------|  
| \`tax-documents\` | Client tax documents | 7 years | ✅ AES-256 |  
| \`profile-images\` | User profile photos | Indefinite | ❌ Public |  
| \`marketing-assets\` | Marketing materials | Indefinite | ❌ Public |  
| \`backups\` | Database backups | 30 days | ✅ AES-256 |

\#\#\# Presigned URLs

\`\`\`typescript  
// Generate presigned upload URL  
const uploadUrl \= await getSignedUrl(s3Client, new PutObjectCommand({  
  Bucket: 'tax-documents',  
  Key: \`${userId}/${documentId}.pdf\`,  
  ContentType: 'application/pdf',  
}), { expiresIn: 3600 }); // 1 hour

// Generate presigned download URL  
const downloadUrl \= await getSignedUrl(s3Client, new GetObjectCommand({  
  Bucket: 'tax-documents',  
  Key: \`${userId}/${documentId}.pdf\`,  
}), { expiresIn: 900 }); // 15 minutes  
\`\`\`

\---

\#\# Background Jobs

\#\#\# Job Queue Stack

| Technology | Version | Status | Purpose |  
|------------|---------|--------|---------|  
| \*\*Bull\*\* | 4.16.5+ | ✅ Active | Job queue management |  
| \*\*@bull-board/express\*\* | 6.12.7+ | ✅ Active | Queue monitoring UI |  
| \*\*Redis\*\* | 7.2+ | ✅ Active | Queue storage backend |

\#\#\# Job Types

\*\*1. Email Jobs\*\*  
\`\`\`typescript  
// Add email to queue  
await emailQueue.add('send-welcome-email', {  
  userId,  
  email,  
  name,  
}, {  
  attempts: 3,  
  backoff: {  
    type: 'exponential',  
    delay: 2000,  
  },  
});  
\`\`\`

\*\*Job Categories:\*\*  
\- Email sending (async delivery)  
\- Document processing (PDF generation, OCR)  
\- Analytics calculations (daily aggregations)  
\- Subscription billing (recurring charges)  
\- Tax deadline reminders (scheduled)

\*\*2. Queue Configuration\*\*  
\`\`\`typescript  
const emailQueue \= new Queue('email', {  
  redis: {  
    host: process.env.REDIS\_HOST,  
    port: 6379,  
  },  
  defaultJobOptions: {  
    removeOnComplete: 100, // Keep last 100  
    removeOnFail: 500,     // Keep last 500 failures  
  },  
});  
\`\`\`

\*\*3. Bull Board (Monitoring)\*\*  
\- View queue status  
\- Monitor job progress  
\- Retry failed jobs  
\- View job logs  
\- Accessible at \`/admin/queues\`

\---

\#\# Real-time Communication

\#\#\# Real-time Stack

| Technology | Version | Status | Purpose |  
|------------|---------|--------|---------|  
| \*\*Socket.io\*\* | 4.8.1 | ✅ Active | WebSocket communication |  
| \*\*web-push\*\* | 3.6.7 | ✅ Active | PWA push notifications |

\#\#\# Socket.io Features

\*\*Real-time Events:\*\*  
\- Document status updates  
\- Live chat support  
\- Notification delivery  
\- Dashboard updates  
\- Appointment reminders

\*\*Implementation:\*\*  
\`\`\`typescript  
// Server-side  
io.on('connection', (socket) \=\> {  
  socket.on('join-room', (userId) \=\> {  
    socket.join(\`user-${userId}\`);  
  });  
});

// Emit to specific user  
io.to(\`user-${userId}\`).emit('document-updated', {  
  documentId,  
  status: 'processed',  
});

// Client-side  
const socket \= io();  
socket.on('document-updated', (data) \=\> {  
  // Update UI  
});  
\`\`\`

\#\#\# Push Notifications

\*\*Web Push Setup:\*\*  
\`\`\`typescript  
import webpush from 'web-push';

webpush.setVapidDetails(  
  'mailto:support@taxgeniuspro.tax',  
  process.env.VAPID\_PUBLIC\_KEY,  
  process.env.VAPID\_PRIVATE\_KEY  
);

// Send notification  
await webpush.sendNotification(subscription, JSON.stringify({  
  title: 'Document Ready',  
  body: 'Your tax return is ready for review',  
  icon: '/icons/document.png',  
  badge: '/icons/badge.png',  
}));  
\`\`\`

\---

\#\# API Architecture

\#\#\# API Route Structure

\`\`\`  
app/api/  
├── auth/  
│   ├── sign-in/route.ts  
│   ├── sign-up/route.ts  
│   └── callback/route.ts  
├── documents/  
│   ├── route.ts              \# GET, POST  
│   ├── \[id\]/route.ts         \# GET, PATCH, DELETE  
│   └── \[id\]/upload/route.ts  \# POST  
├── payments/  
│   ├── route.ts  
│   ├── checkout/route.ts  
│   └── webhook/route.ts  
├── users/  
│   ├── route.ts  
│   └── \[id\]/route.ts  
└── webhooks/  
    ├── clerk/route.ts  
    └── square/route.ts  
\`\`\`

\#\#\# API Design Patterns

\*\*1. Type-Safe Routes\*\*  
\`\`\`typescript  
// app/api/documents/route.ts  
export async function GET(request: Request) {  
  const { searchParams } \= new URL(request.url);  
  const userId \= searchParams.get('userId');

  const documents \= await prisma.document.findMany({  
    where: { userId },  
  });

  return Response.json(documents);  
}  
\`\`\`

\*\*2. Error Handling\*\*  
\`\`\`typescript  
import { NextResponse } from 'next/server';

try {  
  // ... operation  
} catch (error) {  
  console.error('Error:', error);  
  return NextResponse.json(  
    { error: 'Internal server error' },  
    { status: 500 }  
  );  
}  
\`\`\`

\*\*3. Rate Limiting\*\*  
\`\`\`typescript  
// middleware.ts  
const rateLimit \= new Map();

export function middleware(request: Request) {  
  const ip \= request.headers.get('x-forwarded-for');  
  const limit \= rateLimit.get(ip) || 0;

  if (limit \> 100\) {  
    return NextResponse.json(  
      { error: 'Too many requests' },  
      { status: 429 }  
    );  
  }

  rateLimit.set(ip, limit \+ 1);  
}  
\`\`\`

\---

\#\# Security

\#\#\# Security Stack

| Feature | Technology | Status |  
|---------|-----------|--------|  
| \*\*Authentication\*\* | Clerk | 🔄 Migrating |  
| \*\*Session Management\*\* | JWT (via Clerk) | 🔄 Migrating |  
| \*\*PII Encryption\*\* | node:crypto (AES-256) | ✅ Active |  
| \*\*Password Hashing\*\* | scrypt | ✅ Active |  
| \*\*SQL Injection Prevention\*\* | Prisma (parameterized) | ✅ Active |  
| \*\*XSS Prevention\*\* | React (auto-escaping) | ✅ Active |  
| \*\*CSRF Protection\*\* | Next.js built-in | ✅ Active |

\#\#\# Security Best Practices

\*\*1. Environment Variables\*\*  
\`\`\`bash  
\# Never commit these  
DATABASE\_URL="postgresql://..."  
ENCRYPTION\_KEY="..."  
CLERK\_SECRET\_KEY="..."  
\`\`\`

\*\*2. Input Validation\*\*  
\`\`\`typescript  
import { z } from 'zod';

const userSchema \= z.object({  
  email: z.string().email(),  
  ssn: z.string().regex(/^\\d{3}-\\d{2}-\\d{4}$/),  
});

// Validate before processing  
const validated \= userSchema.parse(data);  
\`\`\`

\*\*3. Role-Based Access Control\*\*  
\`\`\`typescript  
function requireRole(role: 'client' | 'preparer' | 'admin') {  
  return async (request: Request) \=\> {  
    const user \= await getCurrentUser();  
    if (user.role \!== role) {  
      return NextResponse.json(  
        { error: 'Forbidden' },  
        { status: 403 }  
      );  
    }  
  };  
}  
\`\`\`

\---

\#\# Performance Optimization

\#\#\# Optimization Strategies

\*\*1. Database Query Optimization\*\*  
\`\`\`typescript  
// Use select to limit fields  
const users \= await prisma.user.findMany({  
  select: {  
    id: true,  
    name: true,  
    email: true,  
    // Don't fetch encrypted SSN unless needed  
  },  
});

// Use indexes  
@@index(\[userId, createdAt\])  
\`\`\`

\*\*2. Redis Caching\*\*  
\`\`\`typescript  
// Cache frequent queries  
const cacheKey \= \`user:${userId}\`;  
const cached \= await redis.get(cacheKey);

if (cached) {  
  return JSON.parse(cached);  
}

const user \= await prisma.user.findUnique({ where: { id: userId } });  
await redis.setex(cacheKey, 3600, JSON.stringify(user));  
\`\`\`

\*\*3. Connection Pooling\*\*  
\`\`\`typescript  
// Prisma connection pool  
const prisma \= new PrismaClient({  
  datasources: {  
    db: {  
      url: process.env.DATABASE\_URL,  
    },  
  },  
  // Pool configuration  
  \_\_internal: {  
    engine: {  
      connection\_limit: 20,  
    },  
  },  
});  
\`\`\`

\---

\#\# Related Documentation

\- \[Frontend Technologies\](./frontend.md)  
\- \[Infrastructure\](./infrastructure.md)  
\- \[External Services\](./services.md)  
\- \[Architecture v3 FINAL\](../architecture-v3-FINAL.md)

\---

\*\*Document Status:\*\* ✅ Active  
\*\*Last Updated:\*\* October 9, 2025

\*\*Maintained By:\*\* Development Team

