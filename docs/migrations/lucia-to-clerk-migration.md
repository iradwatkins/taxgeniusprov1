# Lucia to Clerk User Migration Plan

## Overview
This document outlines the complete migration strategy for existing Lucia users to Clerk authentication system.

## Current State Analysis

### Database Schema (Lucia-based)
- **Users Table**: Contains `id`, `email`, `hashedPassword`, `emailVerified`
- **Sessions Table**: Contains Lucia session data (will be deprecated)
- **OAuthAccounts Table**: Contains OAuth provider data
- **MagicLinks Table**: Contains magic link tokens (will be deprecated)
- **Profile Table**: Contains user roles and metadata

### Clerk Integration
- **Clerk User ID**: Will be stored in new `clerkId` field in Profile table
- **Clerk Metadata**: User role stored in `publicMetadata.role`
- **Clerk Sessions**: Managed entirely by Clerk (JWT tokens)

## Migration Strategy

### Phase 1: Schema Update (COMPLETED ✅)
```prisma
model Profile {
  id          String   @id @default(cuid())
  userId      String   @unique  // Legacy Lucia user ID
  clerkId     String?  @unique  // New Clerk user ID
  role        UserRole
  // ... rest of fields
}
```

**Status**: Schema already supports both `userId` (Lucia) and `clerkId` (Clerk)

### Phase 2: User Migration Options

#### Option A: Invite Existing Users (RECOMMENDED)
**Best for**: Small user base (<100 users), or when you want clean data

**Process**:
1. Export existing user emails and roles from database
2. Send personalized invitation emails: "We've upgraded! Create your new account"
3. Users sign up via Clerk with same email
4. On first Clerk login, match email to existing profile and link `clerkId`
5. Preserve all user data (referrals, documents, history)

**Pros**:
- Clean migration
- Users get to set new passwords
- Validates email addresses
- No password hash migration complexity

**Cons**:
- Requires user action
- Temporary loss of access until signup

**Implementation**:
```typescript
// scripts/migrate-users-invite.ts
import { PrismaClient } from '@prisma/client'
import { Resend } from 'resend'

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)

async function sendInvitations() {
  const users = await prisma.user.findMany({
    include: { profile: true }
  })

  for (const user of users) {
    if (!user.profile?.clerkId) { // Only uninvited users
      await resend.emails.send({
        from: 'Tax Genius Pro <noreply@taxgeniuspro.tax>',
        to: user.email,
        subject: 'Action Required: Upgrade Your Tax Genius Pro Account',
        html: `
          <h1>We've Upgraded Tax Genius Pro!</h1>
          <p>We've enhanced our security and authentication system.</p>
          <p>Please create your new account to regain access:</p>
          <a href="https://taxgeniuspro.tax/auth/signup?email=${encodeURIComponent(user.email)}">
            Create New Account
          </a>
          <p>Your role: ${user.profile?.role}</p>
          <p>All your data will be preserved.</p>
        `
      })
    }
  }
}
```

#### Option B: Automatic Migration with Password Reset
**Best for**: Larger user base, minimal disruption needed

**Process**:
1. Use Clerk Admin API to bulk import users
2. Import email, metadata (role), and set `skip_password_checks: true`
3. Force password reset on first login
4. Link Clerk ID to existing profiles

**Pros**:
- No user action required upfront
- Immediate access preservation

**Cons**:
- Requires Clerk Enterprise plan (bulk import API)
- Users must reset password on first login
- More complex implementation

**Implementation**:
```typescript
// scripts/migrate-users-auto.ts
import { clerkClient } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateUsersToClerk() {
  const users = await prisma.user.findMany({
    include: { profile: true }
  })

  for (const user of users) {
    if (user.profile && !user.profile.clerkId) {
      try {
        // Create user in Clerk
        const clerkUser = await clerkClient.users.createUser({
          emailAddress: [user.email],
          publicMetadata: {
            role: user.profile.role.toLowerCase()
          },
          skipPasswordRequirement: true, // Force password reset
          privateMetadata: {
            legacyUserId: user.id,
            migratedAt: new Date().toISOString()
          }
        })

        // Link Clerk ID to profile
        await prisma.profile.update({
          where: { id: user.profile.id },
          data: { clerkId: clerkUser.id }
        })

        console.log(`✅ Migrated: ${user.email}`)
      } catch (error) {
        console.error(`❌ Failed to migrate ${user.email}:`, error)
      }
    }
  }
}
```

### Phase 3: Profile Linking Webhook

Create a Clerk webhook to automatically link new signups to existing profiles:

```typescript
// src/app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  const body = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    return new Response('Webhook verification failed', { status: 400 })
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, public_metadata } = evt.data

    // Check for existing profile by email
    const email = email_addresses[0]?.email_address
    if (!email) return new Response('No email', { status: 400 })

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    })

    if (existingUser?.profile) {
      // Link existing profile to Clerk user
      await prisma.profile.update({
        where: { id: existingUser.profile.id },
        data: {
          clerkId: id,
          // Preserve role from legacy profile, don't override
        }
      })

      console.log(`✅ Linked legacy profile for ${email}`)
    } else {
      // New user - create profile
      const role = (public_metadata?.role as string)?.toUpperCase() || 'CLIENT'

      await prisma.user.create({
        data: {
          id: id, // Use Clerk ID as primary key
          email,
          profile: {
            create: {
              role,
              clerkId: id
            }
          }
        }
      })

      console.log(`✅ Created new profile for ${email}`)
    }
  }

  return new Response('Webhook processed', { status: 200 })
}
```

### Phase 4: Cleanup (After Migration Complete)

Once all users migrated and verified:

1. **Remove Legacy Tables**:
```prisma
// Delete these models from schema.prisma:
// - model Session (Lucia sessions)
// - model MagicLink (Lucia magic links)
// - model OAuthAccount (Clerk handles OAuth)
```

2. **Simplify User Model**:
```prisma
model User {
  id       String   @id @default(cuid())
  email    String   @unique
  clerkId  String?  @unique // Keep for backward compat
  profile  Profile?

  // Remove: hashedPassword, sessions, oauthAccounts, magicLinks
}
```

3. **Run Migration**:
```bash
npx prisma migrate dev --name remove-lucia-tables
```

## Migration Checklist

### Pre-Migration
- [x] Clerk SDK installed and tested
- [x] Clerk middleware protecting routes
- [x] Role selection flow working
- [ ] Decide: Option A (Invite) vs Option B (Auto)
- [ ] Add `clerkId` field to Profile model (already exists)
- [ ] Set up Clerk webhook endpoint
- [ ] Configure Clerk webhook secret in .env

### Migration Execution
- [ ] Export list of existing users (email + role)
- [ ] Test migration script with 2-3 test users
- [ ] Send announcement: "Maintenance window planned"
- [ ] **Option A**: Send invitation emails to all users
- [ ] **Option B**: Run bulk import script
- [ ] Verify all profiles have `clerkId` populated
- [ ] Test login flows for migrated users

### Post-Migration
- [ ] Monitor Clerk dashboard for signup rate
- [ ] Send follow-up reminder emails (Option A)
- [ ] Verify all critical users have migrated
- [ ] Keep legacy User table for 30 days (rollback safety)
- [ ] After 30 days: Clean up legacy tables
- [ ] Update Story 1.1 status to "Fully Complete"

## Rollback Plan

If issues arise:

1. Clerk is additive - old Lucia auth still exists in database
2. Can temporarily re-enable Lucia routes if needed
3. User data preserved in both systems during transition
4. No data loss risk

## Estimated Timeline

- **Option A (Invite)**: 1-2 weeks for full user migration
- **Option B (Auto)**: 1-3 days for technical migration, users reset passwords over time

## Recommendation

**For Tax Genius Pro**: Use **Option A (Invite)** because:
1. Platform is new/early stage (likely <100 users)
2. Ensures email validation
3. Clean security posture
4. Users get familiar with new auth flow
5. No dependency on Clerk Enterprise features

## Testing Instructions

Before production migration:

```bash
# 1. Create test users in Lucia
# 2. Run migration script in staging
# 3. Verify test users can:
#    - Sign up with same email in Clerk
#    - See existing profile data
#    - Access role-specific dashboards
#    - All referrals/documents preserved
```

## Support Documentation

Prepare user-facing docs:
- "How to Upgrade Your Account" guide
- FAQs about the migration
- Video walkthrough of new login process
- Support contact for migration issues

---

**Migration Status**: ✅ PLANNED - Ready to execute when user count justifies it

**Current Approach**: New users use Clerk, legacy users can be migrated when needed
