# Authentication & Authorization

**Parent:** [Tech Stack](./README.md)
**Last Updated:** October 9, 2025

---

## Overview

The Tax Genius platform is migrating from a custom Lucia-based authentication system to Clerk.com for improved security, user management, and developer experience.

---

## Current Stack

### Lucia (Being Replaced)

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **Lucia** | 3.2.2 | ⚠️ Deprecated | Current auth (being replaced) |
| **node:crypto** | Built-in | ✅ Active | PII encryption |
| **scrypt** | Built-in | ✅ Active | Password hashing |

**Current Implementation:**
- Custom session management
- Database-backed user authentication
- Manual user management

**Issues with Lucia:**
- Manual user management UI needed
- More maintenance overhead
- Limited built-in features
- Single developer maintainer (now deprecated)

---

## Migration to Clerk

### Clerk.com

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **Clerk.com** | Latest | 🔄 Migrating | Authentication & user management |

**Package Installation:**
```bash
npm install @clerk/nextjs
```

**Key Features:**
- ✅ Email/password authentication
- ✅ Magic link authentication
- ✅ OAuth providers (Google, GitHub, etc.)
- ✅ Built-in user management dashboard
- ✅ Multi-factor authentication (MFA)
- ✅ Session management
- ✅ Comprehensive webhook system
- ✅ User profile management
- ✅ Role-based access control

**Pricing:**
- **Plan:** Pro ($25/mo for 1000 MAU)
- **Free Tier:** 10,000 MAU (suitable for MVP)
- **Enterprise:** Custom pricing for larger deployments

---

## Migration Timeline

### Week 3-4: Clerk Implementation
- Install @clerk/nextjs package
- Configure Clerk in Next.js application
- Set up authentication pages (sign-in, sign-up)
- Configure middleware for protected routes
- Implement role-based access control

### Week 4-5: User Migration
- Export existing users from Lucia database
- Create migration script
- Import users to Clerk
- Preserve user metadata and roles
- Test authentication flows

### Week 5: Deprecate Lucia
- Remove Lucia dependencies
- Clean up database schema
- Update all authentication references
- Final testing and validation

```bash
# Packages to remove after migration
npm uninstall lucia @lucia-auth/adapter-prisma arctic
```

---

## PII Encryption

### Node.js Crypto Module

For sensitive personally identifiable information (PII) that needs to be stored in the database:

**Implementation:**
```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedData: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

**Use Cases:**
- Social Security Numbers (SSN)
- Tax Identification Numbers (TIN)
- Banking information
- Other sensitive tax-related data

**Environment Variables:**
```env
# Generate a 256-bit key (64 hex characters)
ENCRYPTION_KEY=your_64_character_hex_key_here
```

**Key Generation:**
```bash
# Generate secure encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Authentication Flow

### Sign-In Process

```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg"
          }
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
```

### Protected Routes

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### Role-Based Access Control

```typescript
// lib/auth-utils.ts
import { auth } from '@clerk/nextjs/server';

export type UserRole = 'client' | 'preparer' | 'referrer' | 'admin';

export async function requireRole(role: UserRole) {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const userRole = sessionClaims?.metadata?.role as UserRole;

  if (userRole !== role && userRole !== 'admin') {
    throw new Error('Forbidden');
  }

  return { userId, role: userRole };
}
```

---

## Session Management

### Clerk Session Handling

Clerk automatically handles:
- Session creation and storage
- Session token rotation
- Session expiration
- Multi-device session management
- Session revocation

**Configuration:**
```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

## Webhooks

### Clerk Webhook Events

Configure webhooks to sync user data with your database:

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error', { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    await prisma.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
      },
    });
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;

    await prisma.user.update({
      where: { clerkId: id },
      data: {
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
      },
    });
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    await prisma.user.delete({
      where: { clerkId: id },
    });
  }

  return new Response('', { status: 200 });
}
```

---

## Security Technologies

### Application Security

| Technology | Purpose | Status |
|------------|---------|--------|
| **Clerk** | Authentication | 📋 To implement |
| **JWT** | Session tokens | ✅ Via Clerk |
| **node:crypto** | PII encryption | ✅ Active |
| **Helmet.js** | HTTP headers | 📋 To add |
| **CSRF tokens** | Next.js built-in | ✅ Active |

### Security Best Practices

1. **Password Security:**
   - Clerk handles password hashing (bcrypt)
   - Minimum password requirements enforced
   - Password breach detection

2. **Session Security:**
   - HTTP-only cookies
   - Secure flag in production
   - SameSite cookie attribute
   - Automatic session rotation

3. **PII Protection:**
   - Encrypt sensitive data at rest
   - Use AES-256-GCM for encryption
   - Store encryption keys securely (environment variables)
   - Never log decrypted PII

4. **Rate Limiting:**
   - Clerk built-in rate limiting
   - Additional Nginx rate limiting
   - API route protection

---

## Migration Checklist

- [ ] Install @clerk/nextjs package
- [ ] Create Clerk application in dashboard
- [ ] Configure environment variables
- [ ] Implement authentication pages
- [ ] Set up middleware for protected routes
- [ ] Configure role-based access control
- [ ] Create webhook endpoint
- [ ] Export existing users from Lucia
- [ ] Create user migration script
- [ ] Test authentication flows
- [ ] Migrate users to Clerk
- [ ] Update all authentication references
- [ ] Remove Lucia dependencies
- [ ] Clean up database schema
- [ ] Update documentation

---

## Related Documentation

- [Tech Stack Overview](./README.md)
- [Infrastructure Setup](./infrastructure.md)
- [Development Workflow](./development.md)
- [Migration Guide](../migration-guide.md)

---

**Document Status:** ✅ Active
