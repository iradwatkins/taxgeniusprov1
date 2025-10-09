# Tax Genius Platform - API Design Patterns

**Version:** 3.0 FINAL
**Date:** October 9, 2025
**Status:** Active - Single Source of Truth
**Part:** 3 of 11

[↑ Back to Architecture Index](./README.md)

---

## 9. API Design Patterns

### 9.1 API Route Structure

```
/api/
├── auth/
│   └── webhook/              # Clerk webhook handler
├── webhooks/
│   ├── square/               # Square payment webhooks
│   └── resend/               # Email event webhooks
├── referrals/
│   ├── track/                # Track referral clicks
│   └── vanity/               # Vanity slug management
├── payments/
│   ├── process/              # Process payments
│   └── subscription/         # Subscription management
├── documents/
│   ├── upload/               # Generate upload URLs
│   └── download/             # Generate download URLs
├── ai/
│   └── generate-content/     # AI content generation
└── admin/
    ├── analytics/            # Admin analytics
    └── users/                # User management
```

### 9.2 API Response Format

```typescript
// Standard API response
type APIResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

// Example usage
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## API Endpoint Details

### Authentication Webhook

```typescript
// src/app/api/auth/webhook/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  const body = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);
  const evt = wh.verify(body, {
    'svix-id': svix_id,
    'svix-timestamp': svix_timestamp,
    'svix-signature': svix_signature,
  });

  const { id, email_addresses, first_name, last_name } = evt.data;

  if (evt.type === 'user.created') {
    await prisma.user.create({
      data: {
        clerkUserId: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        role: 'CLIENT', // Default role
      },
    });
  }

  return new Response('Webhook processed', { status: 200 });
}
```

### Referral Tracking

```typescript
// src/app/api/referrals/track/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { referralCode } = await request.json();

    const referral = await prisma.referral.create({
      data: {
        referralCode,
        referrerId: await getReferrerIdByCode(referralCode),
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, data: referral });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### Document Upload

```typescript
// src/app/api/documents/upload/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateUploadUrl } from '@/lib/storage';

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { filename, contentType } = await request.json();

    const key = `${userId}/${Date.now()}-${filename}`;
    const uploadUrl = await generateUploadUrl(key);

    return NextResponse.json({
      success: true,
      data: { uploadUrl, key },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### Payment Processing

```typescript
// src/app/api/payments/process/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { processPayment } from '@/lib/services/payment.service';

export async function POST(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { amount, sourceId } = await request.json();

    const payment = await processPayment({
      userId,
      amount,
      sourceId,
    });

    return NextResponse.json({ success: true, data: payment });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## Server Actions

### Form Submission Pattern

```typescript
// src/app/actions/client-onboarding.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function submitClientQuestionnaire(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const client = await prisma.client.findUnique({
      where: { userId },
    });

    await prisma.questionnaire.create({
      data: {
        clientId: client.id,
        filingStatus: formData.get('filingStatus'),
        dependents: parseInt(formData.get('dependents')),
        hasW2: formData.get('hasW2') === 'true',
        // ... more fields
      },
    });

    revalidatePath('/dashboard/client');

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

---

## Error Handling

### Standardized Error Responses

```typescript
// src/lib/api-errors.ts
export class APIError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// Usage in route handlers
try {
  // ... logic
} catch (error) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## Rate Limiting

### Middleware Implementation

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { redis } from '@/lib/redis';

const RATE_LIMIT = 100; // requests per minute
const RATE_LIMIT_WINDOW = 60; // seconds

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? '127.0.0.1';
    const key = `rate_limit:${ip}`;

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW);
    }

    if (current > RATE_LIMIT) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded', code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}
```

---

## Related Documentation

- [Database Schema](./02-database-schema.md) - Data models and relationships
- [Authentication Flow](./05-authentication-clerk.md) - Clerk integration
- [Storage Architecture](./04-storage-minio.md) - Document upload/download
- [Security Architecture](./07-security.md) - API security measures

---

**Navigation:**
[← Previous: Database Schema](./02-database-schema.md) | [Next: Storage Architecture →](./04-storage-minio.md)

---

**Document Version:** 3.0 FINAL
**Last Updated:** October 9, 2025
**Next Review:** November 9, 2025
**Maintained By:** Development Team
