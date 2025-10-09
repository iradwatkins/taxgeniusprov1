# Tax Genius Platform - Security Architecture

**Version:** 3.0 FINAL
**Date:** October 9, 2025
**Status:** Active - Single Source of Truth
**Part:** 7 of 11

[↑ Back to Architecture Index](./README.md)

---

## 10. Security Architecture

### 10.1 Security Layers

```
Security Measures:
├── Network Layer
│   ├── SSL/TLS (Let's Encrypt)
│   ├── Nginx rate limiting
│   └── Cloudflare (optional CDN)
│
├── Application Layer
│   ├── Clerk authentication
│   ├── JWT token verification
│   ├── CSRF protection (Next.js built-in)
│   └── XSS protection (React auto-escaping)
│
├── Data Layer
│   ├── Prisma parameterized queries (SQL injection protection)
│   ├── node:crypto encryption for PII
│   ├── MinIO presigned URLs (time-limited)
│   └── Redis session encryption
│
└── Access Control
    ├── Role-based access control (RBAC)
    ├── Organization-level isolation
    └── Feature gating by subscription plan
```

### 10.2 PII Encryption

```typescript
// src/lib/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

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

export function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = createDecipheriv(ALGORITHM, KEY, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

---

## Access Control Implementation

### Role-Based Access Control (RBAC)

```typescript
// src/lib/rbac.ts
import { UserRole } from '@prisma/client';

export const Permissions = {
  // Client permissions
  CLIENT_VIEW_OWN_DOCUMENTS: 'client:view_own_documents',
  CLIENT_UPLOAD_DOCUMENTS: 'client:upload_documents',
  CLIENT_VIEW_OWN_PROFILE: 'client:view_own_profile',

  // Preparer permissions
  PREPARER_VIEW_CLIENTS: 'preparer:view_clients',
  PREPARER_VIEW_DOCUMENTS: 'preparer:view_documents',
  PREPARER_MANAGE_CLIENTS: 'preparer:manage_clients',
  PREPARER_UPLOAD_DOCUMENTS: 'preparer:upload_documents',

  // Referrer permissions
  REFERRER_VIEW_REFERRALS: 'referrer:view_referrals',
  REFERRER_VIEW_EARNINGS: 'referrer:view_earnings',
  REFERRER_MANAGE_LINKS: 'referrer:manage_links',

  // Admin permissions
  ADMIN_VIEW_ALL: 'admin:view_all',
  ADMIN_MANAGE_USERS: 'admin:manage_users',
  ADMIN_MANAGE_CONTENT: 'admin:manage_content',
  ADMIN_VIEW_ANALYTICS: 'admin:view_analytics',
} as const;

const rolePermissions: Record<UserRole, string[]> = {
  CLIENT: [
    Permissions.CLIENT_VIEW_OWN_DOCUMENTS,
    Permissions.CLIENT_UPLOAD_DOCUMENTS,
    Permissions.CLIENT_VIEW_OWN_PROFILE,
  ],
  PREPARER: [
    Permissions.PREPARER_VIEW_CLIENTS,
    Permissions.PREPARER_VIEW_DOCUMENTS,
    Permissions.PREPARER_MANAGE_CLIENTS,
    Permissions.PREPARER_UPLOAD_DOCUMENTS,
  ],
  REFERRER: [
    Permissions.REFERRER_VIEW_REFERRALS,
    Permissions.REFERRER_VIEW_EARNINGS,
    Permissions.REFERRER_MANAGE_LINKS,
  ],
  ADMIN: [
    ...Object.values(Permissions), // Admins have all permissions
  ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function requirePermission(role: UserRole, permission: string): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
}
```

### Organization-Level Isolation

```typescript
// src/lib/organization-guard.ts
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function verifyOrganizationAccess(organizationId: string): Promise<boolean> {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      preparer: true,
      client: true,
    },
  });

  if (!user) {
    return false;
  }

  // Check if user belongs to the organization
  const belongsToOrg =
    user.preparer?.organizationId === organizationId ||
    user.client?.organizationId === organizationId;

  return belongsToOrg;
}

export async function requireOrganizationAccess(organizationId: string): Promise<void> {
  const hasAccess = await verifyOrganizationAccess(organizationId);

  if (!hasAccess) {
    throw new Error('Organization access denied');
  }
}
```

---

## Data Protection

### Sensitive Data Handling

```typescript
// src/lib/sensitive-data.ts
import { encrypt, decrypt } from './encryption';

export interface SensitiveClientData {
  ssn?: string;
  ein?: string;
  bankAccount?: string;
}

export function encryptSensitiveData(data: SensitiveClientData): SensitiveClientData {
  const encrypted: SensitiveClientData = {};

  if (data.ssn) {
    encrypted.ssn = encrypt(data.ssn);
  }

  if (data.ein) {
    encrypted.ein = encrypt(data.ein);
  }

  if (data.bankAccount) {
    encrypted.bankAccount = encrypt(data.bankAccount);
  }

  return encrypted;
}

export function decryptSensitiveData(data: SensitiveClientData): SensitiveClientData {
  const decrypted: SensitiveClientData = {};

  if (data.ssn) {
    decrypted.ssn = decrypt(data.ssn);
  }

  if (data.ein) {
    decrypted.ein = decrypt(data.ein);
  }

  if (data.bankAccount) {
    decrypted.bankAccount = decrypt(data.bankAccount);
  }

  return decrypted;
}

// Mask SSN for display (e.g., ***-**-1234)
export function maskSSN(ssn: string): string {
  return `***-**-${ssn.slice(-4)}`;
}
```

---

## Input Validation & Sanitization

### Zod Schema Validation

```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const ClientOnboardingSchema = z.object({
  filingStatus: z.enum(['single', 'married', 'head_of_household']),
  dependents: z.number().int().min(0).max(20),
  hasW2: z.boolean(),
  has1099: z.boolean(),
  hasBusinessIncome: z.boolean(),
  estimatedIncome: z.number().positive().optional(),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'Invalid SSN format'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Invalid phone number'),
});

export const DocumentUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().regex(/^[a-z]+\/[a-z0-9\-\+\.]+$/i),
  fileSize: z.number().positive().max(10 * 1024 * 1024), // 10MB max
});

export const ReferralCodeSchema = z.object({
  code: z.string().regex(/^[A-Z0-9]{6,10}$/, 'Invalid referral code'),
});

// Validate and sanitize user input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
```

---

## API Security

### Rate Limiting

```typescript
// src/lib/rate-limit.ts
import { redis } from '@/lib/redis';

interface RateLimitOptions {
  maxRequests: number;
  windowSeconds: number;
}

export async function rateLimit(
  identifier: string,
  options: RateLimitOptions = { maxRequests: 100, windowSeconds: 60 }
): Promise<{ success: boolean; remaining: number }> {
  const key = `rate_limit:${identifier}`;
  const { maxRequests, windowSeconds } = options;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }

  const remaining = Math.max(0, maxRequests - current);

  return {
    success: current <= maxRequests,
    remaining,
  };
}

// Apply rate limiting to API routes
export async function withRateLimit(
  request: Request,
  handler: () => Promise<Response>,
  options?: RateLimitOptions
): Promise<Response> {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success, remaining } = await rateLimit(ip, options);

  const response = success
    ? await handler()
    : new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
      });

  response.headers.set('X-RateLimit-Remaining', remaining.toString());

  return response;
}
```

### CORS Configuration

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();

    response.headers.set('Access-Control-Allow-Origin', 'https://taxgeniuspro.tax');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
  }

  return NextResponse.next();
}
```

---

## Security Headers

### HTTP Security Headers

```typescript
// next.config.mjs
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

---

## Audit Logging

### Security Event Logging

```typescript
// src/lib/audit-log.ts
import { prisma } from '@/lib/db';

export enum AuditEventType {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  DOCUMENT_DOWNLOADED = 'DOCUMENT_DOWNLOADED',
  DOCUMENT_DELETED = 'DOCUMENT_DELETED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SENSITIVE_DATA_ACCESSED = 'SENSITIVE_DATA_ACCESSED',
}

export async function logAuditEvent(
  eventType: AuditEventType,
  userId: string,
  metadata?: Record<string, any>
) {
  await prisma.auditLog.create({
    data: {
      eventType,
      userId,
      metadata,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    },
  });
}

// Usage example
await logAuditEvent(AuditEventType.DOCUMENT_DOWNLOADED, userId, {
  documentId: doc.id,
  ipAddress: request.headers.get('x-forwarded-for'),
  userAgent: request.headers.get('user-agent'),
});
```

---

## Security Checklist

### Production Security Requirements

- ✅ Enable HTTPS with valid SSL certificate
- ✅ Configure security headers (HSTS, CSP, etc.)
- ✅ Implement rate limiting on all API endpoints
- ✅ Encrypt sensitive data (SSN, EIN, bank accounts)
- ✅ Use parameterized queries (Prisma ORM)
- ✅ Validate and sanitize all user input
- ✅ Implement RBAC for all protected resources
- ✅ Enable MFA for admin accounts
- ✅ Rotate encryption keys regularly
- ✅ Monitor failed login attempts
- ✅ Implement audit logging for sensitive operations
- ✅ Regular security audits and penetration testing
- ✅ Keep dependencies updated
- ✅ Configure CORS appropriately
- ✅ Use secure session management

---

## Incident Response

### Security Incident Procedure

1. **Detect:** Monitor logs and alerts for suspicious activity
2. **Contain:** Isolate affected systems
3. **Investigate:** Analyze logs and determine scope
4. **Remediate:** Fix vulnerabilities and restore service
5. **Document:** Record incident details and lessons learned
6. **Notify:** Inform affected users if required

---

## Related Documentation

- [Authentication Flow](./05-authentication-clerk.md) - Authentication security
- [Database Schema](./02-database-schema.md) - Data model security
- [API Design Patterns](./03-api-design.md) - API security
- [Storage Architecture](./04-storage-minio.md) - File security
- [Deployment Architecture](./08-deployment.md) - Infrastructure security

---

**Navigation:**
[← Previous: Email Architecture](./06-email-resend.md) | [Next: Deployment Architecture →](./08-deployment.md)

---

**Document Version:** 3.0 FINAL
**Last Updated:** October 9, 2025
**Next Review:** November 9, 2025
**Maintained By:** Development Team
