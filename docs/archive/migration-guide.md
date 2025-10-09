# Tax Genius Platform - Migration Guide

**Version:** 1.0
**Date:** October 9, 2025
**Estimated Timeline:** 4-6 weeks

---

## Table of Contents

1. [Overview](#1-overview)
2. [Migration 1: SendGrid → Resend](#2-migration-1-sendgrid--resend)
3. [Migration 2: AWS S3/R2 → MinIO](#3-migration-2-aws-s3r2--minio)
4. [Migration 3: Lucia → Clerk](#4-migration-3-lucia--clerk)
5. [Testing & Validation](#5-testing--validation)
6. [Rollback Plans](#6-rollback-plans)

---

## 1. Overview

This guide provides step-by-step instructions for migrating Tax Genius from its current tech stack to the v3 architecture defined in [architecture-v3-FINAL.md](./architecture-v3-FINAL.md).

### Migration Priorities

| Priority | Migration | Complexity | Duration | Risk |
|----------|-----------|------------|----------|------|
| 1 | SendGrid → Resend | 🟢 Low | 1-2 days | Low |
| 2 | AWS S3/R2 → MinIO | 🟡 Medium | 2-3 days | Medium |
| 3 | Lucia → Clerk | 🔴 High | 5-7 days | High |

### Timeline

```
Week 1:  SendGrid → Resend (complete)
Week 2:  MinIO setup + S3 migration (complete)
Week 3:  Clerk implementation + testing
Week 4:  User data migration
Week 5:  Parallel auth support (Lucia + Clerk)
Week 6:  Deprecate Lucia, go-live with Clerk
```

---

## 2. Migration 1: SendGrid → Resend

**Status:** ✅ Ready (Resend package already installed)
**Complexity:** 🟢 Low
**Duration:** 4-6 hours
**Risk:** Low (email only, easy rollback)

### 2.1 Prerequisites

```bash
# Verify Resend is installed
npm list resend
# Output: resend@6.0.3

# Verify React Email is installed
npm list @react-email/components
# Output: @react-email/components@0.5.3
```

### 2.2 Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your sending domain: `taxgeniuspro.tax`
3. Create API key
4. Add to `.env.local`:
   ```bash
   RESEND_API_KEY="re_xxxxx"
   RESEND_FROM_EMAIL="noreply@taxgeniuspro.tax"
   ```

### 2.3 Update Email Service

**File:** `src/lib/services/email.service.ts`

```typescript
// BEFORE (SendGrid)
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

// AFTER (Resend)
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

### 2.4 Create React Email Templates

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

### 2.5 Update All Email Sends

**Files to update:**
- `src/lib/services/email.service.ts`
- Any API routes that send emails
- Background jobs that send emails

**Email types to migrate:**
1. Welcome email
2. Password reset
3. Email verification
4. Lead notification (to preparer)
5. Document received confirmation
6. Return filed notification
7. Referral invitation

### 2.6 Testing

```bash
# 1. Test in development
npm run dev

# 2. Trigger a test email
# Use your staging/test environment

# 3. Verify email delivery in Resend dashboard
# Check: https://resend.com/emails

# 4. Test email templates locally
npm run email:dev
```

### 2.7 Deployment

```bash
# 1. Update environment variables on production
# SSH to VPS
ssh root@72.60.28.175

# 2. Add Resend API key to .env
nano /root/websites/taxgeniuspro/.env.local
# Add: RESEND_API_KEY=re_xxxxx

# 3. Rebuild and restart
cd /root/websites/taxgeniuspro
npm run build
pm2 restart taxgeniuspro

# 4. Monitor logs
pm2 logs taxgeniuspro
```

### 2.8 Rollback (if needed)

```bash
# Revert email.service.ts changes
git checkout HEAD -- src/lib/services/email.service.ts

# Rebuild
npm run build
pm2 restart taxgeniuspro
```

### 2.9 Post-Migration Cleanup

```bash
# After 1 week of successful Resend usage
npm uninstall @sendgrid/mail

# Remove SendGrid env vars
nano .env.local
# Remove: SENDGRID_API_KEY
```

---

## 3. Migration 2: AWS S3/R2 → MinIO

**Status:** 📋 To implement
**Complexity:** 🟡 Medium
**Duration:** 2-3 days
**Risk:** Medium (requires data migration)

### 3.1 Install MinIO on VPS

```bash
# SSH to VPS
ssh root@72.60.28.175

# Create MinIO directory
mkdir -p /mnt/minio/data

# Run MinIO with Docker
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -v /mnt/minio/data:/data \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=<SECURE_PASSWORD_HERE>" \
  --restart always \
  minio/minio server /data --console-address ":9001"

# Verify MinIO is running
docker ps | grep minio
curl http://localhost:9000/minio/health/live
```

### 3.2 Configure Nginx Reverse Proxy

**File:** `/etc/nginx/sites-available/taxgeniuspro.tax`

```nginx
# Add MinIO proxy configuration
server {
    listen 443 ssl http2;
    server_name storage.taxgeniuspro.tax;

    ssl_certificate /etc/letsencrypt/live/taxgeniuspro.tax/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taxgeniuspro.tax/privkey.pem;

    # MinIO API
    location / {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # MinIO requires these
        proxy_buffering off;
        client_max_body_size 100M;
    }
}

# MinIO Console
server {
    listen 443 ssl http2;
    server_name minio-console.taxgeniuspro.tax;

    ssl_certificate /etc/letsencrypt/live/taxgeniuspro.tax/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taxgeniuspro.tax/privkey.pem;

    location / {
        proxy_pass http://localhost:9001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

# Get SSL certificate for MinIO subdomains
certbot --nginx -d storage.taxgeniuspro.tax -d minio-console.taxgeniuspro.tax
```

### 3.3 Create MinIO Buckets

```bash
# Install MinIO client
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
mv mc /usr/local/bin/

# Configure MinIO alias
mc alias set local http://localhost:9000 admin <YOUR_PASSWORD>

# Create buckets
mc mb local/tax-documents
mc mb local/profile-images
mc mb local/marketing-assets

# Set bucket policies (public read for profile images)
mc anonymous set download local/profile-images

# Verify buckets
mc ls local
```

### 3.4 Update Application Configuration

**File:** `.env.local`

```bash
# MinIO Configuration
MINIO_ENDPOINT="https://storage.taxgeniuspro.tax"
MINIO_PORT="443"
MINIO_USE_SSL="true"
MINIO_ACCESS_KEY="admin"
MINIO_SECRET_KEY="<YOUR_PASSWORD>"
MINIO_BUCKET_DOCUMENTS="tax-documents"
MINIO_BUCKET_IMAGES="profile-images"
```

### 3.5 Update Storage Service

**File:** `src/lib/storage.ts`

```typescript
// Update endpoint to MinIO
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT!,
  region: 'us-east-1', // MinIO doesn't care, but AWS SDK requires it
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true, // CRITICAL for MinIO!
});

export async function generateUploadUrl(
  bucket: string,
  key: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 600 }); // 10 minutes
}

export async function generateDownloadUrl(
  bucket: string,
  key: string
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
}
```

### 3.6 Migrate Existing Files

**Create migration script:** `scripts/migrate-storage.ts`

```typescript
import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

// Old R2 client
const r2Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT!,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

// New MinIO client
const minioClient = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT!,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY!,
    secretAccessKey: process.env.MINIO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

async function migrateFiles() {
  const buckets = ['tax-documents', 'profile-images'];

  for (const bucket of buckets) {
    console.log(`Migrating bucket: ${bucket}`);

    // List all objects in R2
    const listCommand = new ListObjectsV2Command({ Bucket: bucket });
    const { Contents } = await r2Client.send(listCommand);

    if (!Contents) continue;

    for (const object of Contents) {
      console.log(`Migrating: ${object.Key}`);

      // Download from R2
      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: object.Key!,
      });
      const { Body } = await r2Client.send(getCommand);

      // Upload to MinIO
      const putCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: object.Key!,
        Body: Body as Readable,
      });
      await minioClient.send(putCommand);

      console.log(`✓ Migrated: ${object.Key}`);
    }
  }

  console.log('Migration complete!');
}

migrateFiles().catch(console.error);
```

```bash
# Run migration
npm run tsx scripts/migrate-storage.ts

# Verify files in MinIO
mc ls local/tax-documents --recursive
mc ls local/profile-images --recursive
```

### 3.7 Testing

1. Upload a test file
2. Generate download URL
3. Verify file downloads correctly
4. Check presigned URL expiration
5. Test with large files (>10MB)

### 3.8 Rollback (if needed)

```bash
# Revert storage.ts changes
git checkout HEAD -- src/lib/storage.ts

# Update .env to use R2 again
nano .env.local

# Rebuild
npm run build
pm2 restart taxgeniuspro
```

---

## 4. Migration 3: Lucia → Clerk

**Status:** 📋 To implement
**Complexity:** 🔴 High
**Duration:** 5-7 days
**Risk:** High (affects all users)

### 4.1 Install Clerk

```bash
npm install @clerk/nextjs
```

### 4.2 Setup Clerk Application

1. Sign up at [clerk.com](https://clerk.com)
2. Create new application: "Tax Genius"
3. Configure settings:
   - **Sign-in options:** Email + Password, Magic Link, Google OAuth
   - **User profile fields:** name, email, role (custom)
   - **Session duration:** 7 days
4. Get API keys
5. Setup webhook endpoint

### 4.3 Add Environment Variables

**File:** `.env.local`

```bash
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_xxxxx"
CLERK_SECRET_KEY="sk_live_xxxxx"
CLERK_WEBHOOK_SECRET="whsec_xxxxx"

# Clerk URLs (optional, uses defaults if not set)
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/login"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/signup"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

### 4.4 Add Clerk Middleware

**File:** `src/middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/locations(.*)',
  '/contact',
  '/api/webhooks(.*)',
  '/auth/login(.*)',
  '/auth/signup(.*)',
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

### 4.5 Update Root Layout

**File:** `src/app/layout.tsx`

```typescript
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.Node }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 4.6 Replace Auth Pages

**File:** `src/app/auth/login/page.tsx`

```typescript
import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg',
          },
        }}
      />
    </div>
  );
}
```

**File:** `src/app/auth/signup/page.tsx`

```typescript
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg',
          },
        }}
      />
    </div>
  );
}
```

### 4.7 Setup Clerk Webhook

**File:** `src/app/api/webhooks/clerk/route.ts`

```typescript
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    // Create user in database
    await prisma.user.create({
      data: {
        clerkUserId: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        role: 'CLIENT', // Default role, can be updated later
      },
    });

    console.log(`User created: ${id}`);
  }

  if (eventType === 'user.updated') {
    // Handle user updates
  }

  if (eventType === 'user.deleted') {
    // Handle user deletion
  }

  return new Response('Webhook processed', { status: 200 });
}
```

**Configure webhook in Clerk dashboard:**
- URL: `https://taxgeniuspro.tax/api/webhooks/clerk`
- Events: `user.created`, `user.updated`, `user.deleted`

### 4.8 Update Protected Routes

**Example:** `src/app/dashboard/page.tsx`

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/auth/login');
  }

  const user = await currentUser();

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
    </div>
  );
}
```

### 4.9 User Data Migration Strategy

**Option A: Hard Cutover (Recommended for small user base)**

```typescript
// scripts/migrate-users-to-clerk.ts
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

async function migrateUsers() {
  // Get all users from current database
  const users = await prisma.user.findMany();

  for (const user of users) {
    try {
      // Create user in Clerk
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [user.email],
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' '),
        password: 'TEMP_PASSWORD_' + Math.random(), // Force password reset
      });

      // Update local user record with Clerk ID
      await prisma.user.update({
        where: { id: user.id },
        data: { clerkUserId: clerkUser.id },
      });

      // Send password reset email
      await clerkClient.users.sendPasswordResetEmail({
        userId: clerkUser.id,
        emailAddressId: clerkUser.emailAddresses[0].id,
      });

      console.log(`✓ Migrated: ${user.email}`);
    } catch (error) {
      console.error(`✗ Failed to migrate: ${user.email}`, error);
    }
  }
}

migrateUsers().catch(console.error);
```

**Option B: Parallel Support (Recommended for production)**

1. Week 1: Implement Clerk alongside Lucia
2. Week 2: New signups use Clerk
3. Week 3: Existing users prompted to migrate
4. Week 4: Force migration deadline
5. Week 5: Deprecate Lucia

### 4.10 Testing Checklist

- [ ] User can sign up with email/password
- [ ] User can sign up with Google OAuth
- [ ] User can log in with email/password
- [ ] User can log in with magic link
- [ ] User session persists after page refresh
- [ ] Protected routes redirect to login
- [ ] Webhook creates user in database
- [ ] User profile is accessible
- [ ] Role-based access control works
- [ ] Password reset flow works

### 4.11 Rollback Plan

```bash
# Revert Clerk changes
git checkout HEAD~1 -- src/middleware.ts
git checkout HEAD~1 -- src/app/layout.tsx
git checkout HEAD~1 -- src/app/auth

# Remove Clerk package
npm uninstall @clerk/nextjs

# Rebuild
npm run build
pm2 restart taxgeniuspro

# Verify Lucia auth still works
```

### 4.12 Post-Migration Cleanup

```bash
# After successful migration (1-2 weeks)
npm uninstall lucia @lucia-auth/adapter-prisma arctic

# Remove old auth code
rm -rf src/lib/auth-lucia.ts

# Update Prisma schema to remove old auth tables
npx prisma migrate dev
```

---

## 5. Testing & Validation

### 5.1 Testing Environments

1. **Local Development:** Test on `localhost:3005`
2. **Staging:** Setup staging environment (optional)
3. **Production:** Test with small user group first

### 5.2 Validation Checklist

**Email Migration:**
- [ ] Emails send successfully
- [ ] Templates render correctly
- [ ] Links in emails work
- [ ] Unsubscribe links work
- [ ] Email tracking works (opens, clicks)

**Storage Migration:**
- [ ] File uploads work
- [ ] File downloads work
- [ ] Presigned URLs expire correctly
- [ ] Large files (>10MB) work
- [ ] Old files are accessible
- [ ] New files go to MinIO

**Auth Migration:**
- [ ] New users can sign up
- [ ] Existing users can log in
- [ ] Password resets work
- [ ] Magic links work
- [ ] OAuth (Google) works
- [ ] Sessions persist
- [ ] Logout works
- [ ] Role-based access works

### 5.3 Performance Testing

```bash
# Install Apache Bench
apt install apache2-utils

# Test API endpoint
ab -n 1000 -c 10 https://taxgeniuspro.tax/api/health

# Test file upload (with auth token)
ab -n 100 -c 5 -H "Authorization: Bearer TOKEN" \
  -p upload.json \
  https://taxgeniuspro.tax/api/upload
```

### 5.4 Load Testing

```bash
# Install k6
curl https://github.com/grafana/k6/releases/download/v0.47.0/k6-v0.47.0-linux-amd64.tar.gz -L | tar xvz
mv k6-*/k6 /usr/local/bin/

# Create load test script
# test.js

# Run load test
k6 run test.js
```

---

## 6. Rollback Plans

### 6.1 Email Rollback

```bash
# Revert to SendGrid
git checkout HEAD~1 -- src/lib/services/email.service.ts
npm run build
pm2 restart taxgeniuspro
```

**Impact:** None (users won't notice)
**Data Loss:** None

### 6.2 Storage Rollback

```bash
# Revert to R2
git checkout HEAD~1 -- src/lib/storage.ts

# Update .env
MINIO_ENDPOINT= # Remove
# Restore R2 credentials

npm run build
pm2 restart taxgeniuspro
```

**Impact:** New uploads will go to R2 again
**Data Loss:** None (files still in MinIO)

### 6.3 Auth Rollback

```bash
# Critical! Only if Clerk completely fails

# 1. Restore Lucia
git checkout HEAD~5 -- src/lib/auth.ts
git checkout HEAD~5 -- src/app/auth
git checkout HEAD~5 -- src/middleware.ts

# 2. Reinstall Lucia
npm install lucia @lucia-auth/adapter-prisma

# 3. Rebuild
npm run build
pm2 restart taxgeniuspro
```

**Impact:** High - users with Clerk accounts won't be able to log in
**Data Loss:** None, but requires user re-migration

---

## 7. Deployment Schedule

### Recommended Schedule

**Week 1: Email Migration**
- Monday: Setup Resend account
- Tuesday: Migrate email service
- Wednesday: Deploy to production
- Thursday-Friday: Monitor

**Week 2: Storage Migration**
- Monday: Setup MinIO
- Tuesday: Configure Nginx
- Wednesday: Run migration script
- Thursday: Deploy to production
- Friday: Monitor

**Week 3: Clerk Implementation**
- Monday-Tuesday: Setup Clerk, implement middleware
- Wednesday-Thursday: Testing
- Friday: Deploy (new signups only)

**Week 4: User Migration**
- Monday: Run migration script for existing users
- Tuesday-Thursday: Support users with migration issues
- Friday: Review progress

**Week 5-6: Finalize**
- Parallel auth support (Lucia + Clerk)
- Monitor for issues
- Deprecate Lucia

---

## 8. Support & Troubleshooting

### Common Issues

**Email not sending:**
- Check Resend API key
- Verify domain DNS records
- Check rate limits

**Storage upload fails:**
- Verify MinIO is running (`docker ps`)
- Check presigned URL expiration
- Verify bucket permissions

**Auth fails:**
- Check Clerk webhook is receiving events
- Verify middleware is configured
- Check JWT token in requests

### Getting Help

- Check logs: `pm2 logs taxgeniuspro`
- Clerk dashboard: [dashboard.clerk.com](https://dashboard.clerk.com)
- Resend dashboard: [resend.com/emails](https://resend.com/emails)
- MinIO console: https://minio-console.taxgeniuspro.tax

---

**Document Status:** ✅ Active
**Last Updated:** October 9, 2025
**Maintained By:** Development Team
