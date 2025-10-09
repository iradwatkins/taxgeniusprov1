# Migration 3: Lucia → Clerk

**Status:** ⏳ PENDING
**Complexity:** 🔴 High
**Duration:** 5-7 days
**Risk:** High (affects all users)

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Clerk Setup](#clerk-setup)
4. [Implementation](#implementation)
5. [User Data Migration](#user-data-migration)
6. [Parallel Auth Support](#parallel-auth-support)
7. [Testing](#testing)
8. [Cutover Strategy](#cutover-strategy)
9. [Deployment](#deployment)
10. [Rollback Procedure](#rollback-procedure)
11. [Post-Migration](#post-migration)

---

## Overview

### Why Clerk?

- **Modern Auth Platform:** Built for Next.js and React
- **Feature-Rich:** Magic links, OAuth, 2FA out of the box
- **Better UX:** Pre-built UI components
- **Security:** Enterprise-grade security, SOC 2 compliant
- **Developer Experience:** Simple API, great documentation
- **Reduced Maintenance:** No auth code to maintain

### What's Changing

**Current State (Lucia):**
- Custom auth implementation
- Manual session management
- Basic email/password auth
- Self-maintained security

**Target State (Clerk):**
- Managed auth service
- Automatic session handling
- Multiple auth methods (email, magic link, OAuth)
- Security managed by Clerk

### Migration Complexity

This is a **HIGH RISK** migration because:
- Affects all existing users
- Requires data migration
- Changes authentication flow
- Cannot be easily reversed
- Requires careful testing

### Recommended Approach

**Parallel Auth Strategy:**
1. Week 1-2: Implement Clerk alongside Lucia
2. Week 3: New signups use Clerk only
3. Week 4: Migrate existing users to Clerk
4. Week 5: Parallel support (both systems active)
5. Week 6: Deprecate Lucia completely

---

## Prerequisites

### Technical Requirements

```bash
# Node.js 18+ required
node --version
# Should be v18.0.0 or higher

# Next.js 14+ required
npm list next
# Should be 14.0.0 or higher

# Verify @clerk/nextjs not installed yet
npm list @clerk/nextjs
# Should show: (empty)
```

### Access Requirements

- Clerk account (free tier available)
- Access to production database
- Ability to send emails to all users
- Backup of production database

### Planning Requirements

- Communication plan for users
- Rollback plan documented
- Testing environment ready
- Support team briefed

---

## Clerk Setup

### Step 1: Create Clerk Account

1. Go to [clerk.com](https://clerk.com)
2. Sign up with email
3. Verify email address
4. Choose plan:
   - **Development:** Free (up to 10,000 MAUs)
   - **Pro:** $25/month (up to 10,000 MAUs)

### Step 2: Create Application

1. Click "Add application"
2. Application name: "Tax Genius"
3. Choose application type: "Next.js"
4. Select authentication methods:
   - ✅ Email + Password
   - ✅ Magic Link (email)
   - ✅ Google OAuth
   - ⬜ Facebook (optional)
   - ⬜ GitHub (optional)

### Step 3: Configure Settings

**Session Settings:**
- Session lifetime: 7 days
- Inactive session lifetime: 1 day
- Multi-session handling: Allow multiple sessions

**User Profile:**
- Required fields: Email, First Name, Last Name
- Custom fields: Role (tax preparer, client, admin)

**Email Settings:**
- From name: "Tax Genius"
- From email: "noreply@taxgeniuspro.tax"
- Use custom domain (requires DNS setup)

### Step 4: Setup OAuth (Google)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Authorized redirect URIs:
   ```
   https://clerk.taxgeniuspro.tax/v1/oauth_callback
   https://accounts.taxgeniuspro.tax/v1/oauth_callback
   ```
4. Copy Client ID and Client Secret
5. Add to Clerk dashboard: Authentication → Social Connections → Google

### Step 5: Get API Keys

1. Go to Clerk Dashboard → API Keys
2. Copy keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx"
   CLERK_SECRET_KEY="sk_test_xxxxx"
   ```
3. Save securely (add to `.env.local` later)

### Step 6: Configure Webhook

1. Go to Clerk Dashboard → Webhooks
2. Add endpoint:
   - URL: `https://taxgeniuspro.tax/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
3. Copy webhook secret:
   ```
   CLERK_WEBHOOK_SECRET="whsec_xxxxx"
   ```

---

## Implementation

### Step 1: Install Clerk Package

```bash
# Install Clerk SDK
npm install @clerk/nextjs

# Verify installation
npm list @clerk/nextjs
# Should show: @clerk/nextjs@5.x.x
```

### Step 2: Add Environment Variables

**File:** `.env.local`

```bash
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxxx"
CLERK_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"

# Clerk URLs (customize auth flow)
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/login"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/signup"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# Keep Lucia for parallel support (remove later)
# LUCIA_SECRET="xxxxx"
```

### Step 3: Update Middleware

**File:** `src/middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes (no auth required)
const isPublicRoute = createRouteMatcher([
  '/',
  '/locations(.*)',
  '/contact',
  '/about',
  '/api/webhooks(.*)',
  '/auth/login(.*)',
  '/auth/signup(.*)',
  '/auth/forgot-password(.*)',
]);

// Clerk middleware
export default clerkMiddleware((auth, request) => {
  // Protect all routes except public ones
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

// Middleware configuration
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

### Step 4: Wrap App with ClerkProvider

**File:** `src/app/layout.tsx`

```typescript
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Tax Genius',
  description: 'Professional tax preparation services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

### Step 5: Create Auth Pages

**File:** `src/app/auth/login/page.tsx`

```typescript
import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <SignIn
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
        />
      </div>
    </div>
  );
}
```

**File:** `src/app/auth/signup/page.tsx`

```typescript
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <SignUp
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
        />
      </div>
    </div>
  );
}
```

### Step 6: Setup Webhook Handler

**File:** `src/app/api/webhooks/clerk/route.ts`

```typescript
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
  }

  // Get headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // Validate headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook signature
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

  // Handle events
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, public_metadata } =
      evt.data;

    // Create user in database
    await prisma.user.create({
      data: {
        clerkUserId: id,
        email: email_addresses[0].email_address,
        firstName: first_name || '',
        lastName: last_name || '',
        name: `${first_name} ${last_name}`.trim(),
        role: (public_metadata?.role as string) || 'CLIENT',
      },
    });

    console.log(`✅ User created: ${email_addresses[0].email_address}`);
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    // Update user in database
    await prisma.user.updateMany({
      where: { clerkUserId: id },
      data: {
        email: email_addresses[0].email_address,
        firstName: first_name || '',
        lastName: last_name || '',
        name: `${first_name} ${last_name}`.trim(),
      },
    });

    console.log(`✅ User updated: ${email_addresses[0].email_address}`);
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    // Soft delete or hard delete user
    await prisma.user.updateMany({
      where: { clerkUserId: id },
      data: { deletedAt: new Date() },
    });

    console.log(`✅ User deleted: ${id}`);
  }

  return new Response('Webhook processed', { status: 200 });
}
```

### Step 7: Update Protected Pages

**File:** `src/app/dashboard/page.tsx`

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

export default async function DashboardPage() {
  const { userId } = auth();

  // Redirect if not authenticated
  if (!userId) {
    redirect('/auth/login');
  }

  // Get Clerk user
  const clerkUser = await currentUser();

  // Get database user
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">
        Welcome, {clerkUser?.firstName}!
      </h1>

      <div className="mt-4">
        <p>Email: {clerkUser?.emailAddresses[0].emailAddress}</p>
        <p>Role: {dbUser?.role}</p>
      </div>
    </div>
  );
}
```

### Step 8: Update API Routes

**File:** `src/app/api/example/route.ts`

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Your API logic here
  return NextResponse.json({ userId, message: 'Success' });
}
```

---

## User Data Migration

### Migration Strategy Options

#### Option A: Hard Cutover (Fast, Risky)

**Timeline:** 1 weekend
**Best for:** Small user base (<100 users)

```typescript
// scripts/migrate-users-hard-cutover.ts
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

async function migrateUsers() {
  console.log('🚀 Starting hard cutover migration...\n');

  const users = await prisma.user.findMany({
    where: { clerkUserId: null },
  });

  console.log(`Found ${users.length} users to migrate\n`);

  for (const user of users) {
    try {
      // Create user in Clerk
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [user.email],
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
        emailAddressId: clerkUser.emailAddresses[0].id,
      });

      console.log(`✅ Migrated: ${user.email}`);
    } catch (error) {
      console.error(`❌ Failed: ${user.email}`, error.message);
    }
  }

  console.log('\n✅ Migration complete!');
}

migrateUsers().catch(console.error);
```

**Pros:**
- Fast migration
- Simple process
- Clean cutover

**Cons:**
- All users forced to reset password
- Risk of failed migrations
- No rollback without full restore

#### Option B: Parallel Auth (Slow, Safe) - RECOMMENDED

**Timeline:** 3-4 weeks
**Best for:** Production systems, >100 users

**Phase 1: Implement Parallel Support**
```typescript
// src/lib/auth-hybrid.ts
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { lucia } from '@/lib/auth-lucia'; // Keep old auth

export async function getUser() {
  // Try Clerk first
  const { userId: clerkUserId } = clerkAuth();
  if (clerkUserId) {
    return { provider: 'clerk', userId: clerkUserId };
  }

  // Fall back to Lucia
  const luciaSession = await lucia.validateSession();
  if (luciaSession) {
    return { provider: 'lucia', userId: luciaSession.userId };
  }

  return null;
}
```

**Phase 2: Prompt Existing Users to Migrate**
```typescript
// src/app/dashboard/page.tsx
export default async function Dashboard() {
  const user = await getUser();

  if (user?.provider === 'lucia') {
    return <MigrationPrompt />;
  }

  // Normal dashboard
  return <DashboardContent />;
}
```

**Phase 3: Gradual Migration**
- Week 1: New users → Clerk only
- Week 2: Prompt existing users
- Week 3: Auto-migrate on next login
- Week 4: Force migration deadline

**Pros:**
- No forced password resets
- Gradual migration
- Easy rollback
- Users migrate on their schedule

**Cons:**
- Longer timeline
- More complex code
- Maintain two auth systems temporarily

### Migration Script (Parallel Approach)

**File:** `scripts/migrate-users-parallel.ts`

```typescript
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

async function migrateUserGradually(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.clerkUserId) {
    return; // Already migrated
  }

  try {
    // Create Clerk user
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [user.email],
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

    console.log(`✅ Migrated: ${user.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to migrate ${user.email}:`, error.message);
    return false;
  }
}

// Migrate on user login
export async function migrateOnLogin(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && !user.clerkUserId) {
    await migrateUserGradually(user.id);
  }
}
```

---

## Parallel Auth Support

### Implementation

**File:** `src/lib/auth-hybrid.ts`

```typescript
import { auth as clerkAuth, currentUser } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth-lucia';

export type AuthProvider = 'clerk' | 'lucia';

export interface AuthUser {
  id: string;
  email: string;
  provider: AuthProvider;
}

/**
 * Get authenticated user from either Clerk or Lucia
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  // Try Clerk first
  const { userId: clerkUserId } = clerkAuth();
  if (clerkUserId) {
    const clerkUser = await currentUser();
    return {
      id: clerkUserId,
      email: clerkUser?.emailAddresses[0].emailAddress || '',
      provider: 'clerk',
    };
  }

  // Fall back to Lucia
  const sessionId = cookies().get('auth_session')?.value;
  if (sessionId) {
    const { user } = await lucia.validateSession(sessionId);
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

/**
 * Require authentication (either provider)
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
```

### Migration Prompt Component

**File:** `src/components/MigrationPrompt.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function MigrationPrompt() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleMigrate() {
    setLoading(true);

    try {
      const res = await fetch('/api/auth/migrate-to-clerk', {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          Security Upgrade Available
        </h2>

        <p className="text-gray-600 mb-6">
          We're upgrading to a more secure authentication system. This will take
          just a moment and you'll need to log in again.
        </p>

        <button
          onClick={handleMigrate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Upgrading...' : 'Upgrade Now'}
        </button>

        <button
          onClick={() => alert('You must upgrade to continue')}
          className="w-full text-gray-500 py-2 mt-2"
        >
          Remind Me Later (Feature disabled until upgrade)
        </button>
      </div>
    </div>
  );
}
```

---

## Testing

### Testing Checklist

**New User Signup:**
- [ ] Can sign up with email/password
- [ ] Can sign up with Google OAuth
- [ ] Email verification works
- [ ] User created in database via webhook
- [ ] Redirects to dashboard after signup

**Existing User Login:**
- [ ] Lucia users can still log in
- [ ] Migration prompt appears for Lucia users
- [ ] Migration completes successfully
- [ ] Can log in with Clerk after migration

**Clerk Features:**
- [ ] Magic link login works
- [ ] Password reset works
- [ ] Profile update works
- [ ] Session persists across refreshes
- [ ] Multi-session support works

**API Protection:**
- [ ] Protected API routes require auth
- [ ] Auth works with both providers
- [ ] Proper error handling for unauthorized

**Role-Based Access:**
- [ ] Client role has correct permissions
- [ ] Preparer role has correct permissions
- [ ] Admin role has correct permissions

### Test Accounts

Create test accounts for each scenario:

```
Test User 1 (New Clerk User):
Email: test-clerk@example.com
Provider: Clerk

Test User 2 (Migrated User):
Email: test-migrated@example.com
Provider: Lucia → Clerk

Test User 3 (Unmigrated User):
Email: test-lucia@example.com
Provider: Lucia (for testing parallel auth)
```

---

## Cutover Strategy

### Timeline

```
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
```

### Communication Plan

**Email 1: Announcement (Week 3)**
```
Subject: Important: Account Security Upgrade

We're upgrading to a more secure authentication system...
No action required now - you'll be prompted on your next login.
```

**Email 2: Reminder (Week 4)**
```
Subject: Please complete your account upgrade

We noticed you haven't upgraded yet...
Takes 30 seconds - click here to upgrade now.
```

**Email 3: Final Notice (Week 5)**
```
Subject: Action Required: Complete upgrade by [DATE]

To continue accessing your account, please complete the upgrade...
After [DATE], you may experience login issues.
```

---

## Deployment

### Pre-Deployment Checklist

- [ ] All code tested in staging
- [ ] Database backup completed
- [ ] Rollback plan documented
- [ ] Support team trained
- [ ] User communication drafted
- [ ] Monitoring setup ready
- [ ] Clerk production keys obtained

### Deployment Steps

```bash
# 1. Database backup
ssh root@72.60.28.175
cd /root/websites/taxgeniuspro
npm run db:backup

# 2. Update environment variables
nano .env.local
# Add Clerk production keys

# 3. Pull latest code
git pull origin main

# 4. Install dependencies
npm install

# 5. Run database migrations (if needed)
npx prisma migrate deploy

# 6. Build application
npm run build

# 7. Restart application
pm2 restart taxgeniuspro

# 8. Monitor logs
pm2 logs taxgeniuspro --lines 100

# 9. Test auth flow
# - Sign up new user
# - Log in existing user
# - Verify migration prompt
```

### Post-Deployment Monitoring

**First Hour:**
- Monitor every 10 minutes
- Check webhook logs in Clerk dashboard
- Verify new signups work
- Test existing user login

**First Day:**
- Hourly monitoring
- Track migration rate
- Monitor error rates
- Review support tickets

**First Week:**
- Daily monitoring
- Migration progress reports
- User feedback review
- Performance metrics

---

## Rollback Procedure

### Emergency Rollback

**When to Rollback:**
- Critical auth failures
- Database corruption
- Mass user lockouts
- Data loss detected

**Rollback Steps:**

```bash
# 1. SSH to production
ssh root@72.60.28.175
cd /root/websites/taxgeniuspro

# 2. Restore database backup
npm run db:restore

# 3. Revert code changes
git checkout <previous-commit-hash>

# 4. Remove Clerk from middleware
# Edit src/middleware.ts manually if needed

# 5. Reinstall Lucia
npm install lucia @lucia-auth/adapter-prisma

# 6. Rebuild
npm run build

# 7. Restart
pm2 restart taxgeniuspro

# 8. Verify Lucia auth works
# Test login with existing account
```

### Rollback Impact

- **Downtime:** 10-15 minutes
- **Data Loss:** Users created during Clerk period need manual migration
- **User Impact:** High - all users need to re-authenticate

### Partial Rollback

If only some features broken:

```typescript
// Disable Clerk temporarily, keep Lucia
// File: src/middleware.ts

// Comment out Clerk middleware
// export default clerkMiddleware(...)

// Re-enable Lucia middleware
export default luciaMiddleware(...);
```

---

## Post-Migration

### Verification (After 2 Weeks)

- [ ] 100% of users migrated
- [ ] No auth-related errors
- [ ] All features working
- [ ] Performance acceptable
- [ ] User satisfaction high

### Cleanup

```bash
# Remove Lucia packages
npm uninstall lucia @lucia-auth/adapter-prisma arctic

# Remove Lucia files
rm -rf src/lib/auth-lucia.ts
rm -rf src/lib/auth-hybrid.ts

# Remove parallel auth code
# Manual cleanup required

# Update Prisma schema
# Remove old auth tables
# Run migration

# Commit changes
git add .
git commit -m "chore: Remove Lucia after successful Clerk migration"
```

### Update Documentation

- [ ] Update architecture docs
- [ ] Update README
- [ ] Update onboarding docs
- [ ] Archive migration docs

---

## Troubleshooting

### User Can't Log In

**Symptom:** "Invalid credentials" error

**Causes:**
1. Not migrated yet (using old password)
2. Migration failed
3. Email not verified in Clerk

**Solution:**
```bash
# Check user status
npx prisma studio
# Find user by email
# Check clerkUserId field

# If null, user not migrated
# Run migration script for specific user

# If has clerkUserId, check Clerk dashboard
# Resend verification email if needed
```

### Webhook Not Firing

**Symptom:** Users created in Clerk but not in database

**Solution:**
```bash
# Test webhook endpoint
curl -X POST https://taxgeniuspro.tax/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -d '{"type": "test"}'

# Check webhook logs in Clerk dashboard
# Verify webhook secret matches .env.local

# Check application logs
pm2 logs taxgeniuspro | grep webhook
```

### Session Expiring Too Fast

**Symptom:** Users logged out after a few minutes

**Solution:**
1. Check Clerk dashboard → Sessions → Lifetime
2. Should be 7 days
3. Update if different
4. Clear browser cookies and retry

### OAuth Not Working

**Symptom:** "OAuth failed" error

**Solution:**
1. Verify OAuth credentials in Clerk
2. Check redirect URIs match exactly
3. Test in incognito mode (clear cookies)
4. Check Google OAuth consent screen is configured

---

## References

### Documentation
- [Clerk Docs](https://clerk.com/docs)
- [Clerk Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Migration Overview](./README.md)

### Related Files
- `src/middleware.ts` - Authentication middleware
- `src/app/layout.tsx` - ClerkProvider wrapper
- `src/app/api/webhooks/clerk/route.ts` - Webhook handler
- `src/lib/auth-hybrid.ts` - Parallel auth logic

### External Resources
- Clerk Dashboard: https://dashboard.clerk.com
- Clerk Status: https://status.clerk.com
- Clerk Support: support@clerk.com

---

**Migration Status:** ⏳ Pending
**Previous Migration:** [MinIO Storage](./02-minio-storage.md)
**Next Document:** [Testing & Validation](./testing-validation.md)
