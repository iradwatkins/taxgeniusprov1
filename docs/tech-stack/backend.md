# Backend Technologies

**Parent:** [Tech Stack](./README.md)
**Last Updated:** October 9, 2025

## Database & ORM

| Technology | Version | Status | Purpose |
|------------|---------|--------|---------|
| **PostgreSQL** | 15+ | ✅ Active | Primary relational database |
| **Prisma** | 6.16.1+ | ✅ Active | Type-safe ORM, migrations |
| **Redis** | 7.2+ | ✅ Active | Caching, sessions, queues |
| **ioredis** | 5.7.0+ | ✅ Active | Redis client library |

## Database Configuration

### Prisma Setup

**Schema Location:** `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified Boolean   @default(false)
  role          UserRole  @default(CLIENT)

  // Encrypted PII
  ssnEncrypted  String?   @db.Text

  // Relations
  profile       Profile?
  documents     Document[]
  referrals     Referral[] @relation("ReferredBy")

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
  @@index([role])
}

model Profile {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  firstName String
  lastName  String
  phone     String?

  // Address
  street    String?
  city      String?
  state     String?
  zip       String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Document {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  type        DocType
  fileName    String
  fileSize    Int
  fileUrl     String   @db.Text

  status      DocStatus @default(PENDING)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([status])
}

model Referral {
  id          String   @id @default(cuid())
  referrerId  String
  referrer    User     @relation("ReferredBy", fields: [referrerId], references: [id])

  clientEmail String
  status      ReferralStatus @default(PENDING)
  commission  Decimal  @default(0) @db.Decimal(10, 2)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([referrerId])
  @@index([status])
}

enum UserRole {
  CLIENT
  PREPARER
  REFERRER
  ADMIN
}

enum DocType {
  W2
  FORM_1099
  TAX_RETURN
  ID
  OTHER
}

enum DocStatus {
  PENDING
  PROCESSING
  COMPLETED
  REJECTED
}

enum ReferralStatus {
  PENDING
  CONVERTED
  PAID
}
```

### Prisma Client Initialization

```typescript
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Migration Commands

```bash
# Create a new migration
npx prisma migrate dev --name add_user_table

# Apply migrations in production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## Redis Configuration

### Redis Client Setup

```typescript
// lib/db/redis.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

export { redis };
```

### Redis Usage Patterns

**1. Caching**
```typescript
// lib/services/cache.service.ts
import { redis } from '@/lib/db/redis';

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  }

  static async del(key: string): Promise<void> {
    await redis.del(key);
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

// Usage
const user = await CacheService.get<User>(`user:${userId}`);
if (!user) {
  const freshUser = await prisma.user.findUnique({ where: { id: userId } });
  await CacheService.set(`user:${userId}`, freshUser, 3600);
}
```

**2. Session Management**
```typescript
// lib/services/session.service.ts
import { redis } from '@/lib/db/redis';

export class SessionService {
  static async create(userId: string, data: any): Promise<string> {
    const sessionId = crypto.randomUUID();
    await redis.setex(
      `session:${sessionId}`,
      60 * 60 * 24 * 7, // 7 days
      JSON.stringify({ userId, ...data })
    );
    return sessionId;
  }

  static async get(sessionId: string): Promise<any | null> {
    const data = await redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }

  static async destroy(sessionId: string): Promise<void> {
    await redis.del(`session:${sessionId}`);
  }
}
```

**3. Rate Limiting**
```typescript
// lib/services/rate-limit.service.ts
import { redis } from '@/lib/db/redis';

export class RateLimitService {
  static async check(
    key: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, window);
    }

    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
    };
  }
}

// Usage in API route
const { allowed, remaining } = await RateLimitService.check(
  `api:${userId}`,
  100, // 100 requests
  60   // per 60 seconds
);

if (!allowed) {
  return NextResponse.json(
    { error: 'Rate limit exceeded' },
    { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
  );
}
```

## Background Jobs with Bull

### Bull Queue Setup

```typescript
// lib/queues/email.queue.ts
import Queue from 'bull';
import { redis } from '@/lib/db/redis';

export const emailQueue = new Queue('email', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// Job processor
emailQueue.process(async (job) => {
  const { to, subject, html } = job.data;

  // Send email using Resend
  await sendEmail({ to, subject, html });

  return { sent: true };
});

// Error handling
emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
```

### Queue Usage

```typescript
// lib/services/email.service.ts
import { emailQueue } from '@/lib/queues/email.queue';

export class EmailService {
  static async sendWelcomeEmail(email: string, name: string) {
    await emailQueue.add({
      to: email,
      subject: 'Welcome to Tax Genius',
      html: `<h1>Welcome ${name}!</h1>`,
    });
  }

  static async sendPasswordReset(email: string, token: string) {
    await emailQueue.add(
      {
        to: email,
        subject: 'Reset your password',
        html: `<a href="https://taxgeniuspro.tax/auth/reset?token=${token}">Reset</a>`,
      },
      {
        priority: 1, // High priority
      }
    );
  }
}
```

### Bull Board (Queue Monitoring)

```typescript
// app/api/admin/queues/route.ts
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { emailQueue } from '@/lib/queues/email.queue';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/api/admin/queues');

createBullBoard({
  queues: [new BullAdapter(emailQueue)],
  serverAdapter,
});

export const GET = serverAdapter.getRouter();
```

## API Routes

### RESTful API Pattern

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['CLIENT', 'PREPARER', 'REFERRER']),
});

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    const users = await prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        email: true,
        role: true,
        profile: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = userSchema.parse(body);

    const user = await prisma.user.create({
      data: validated,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

### Dynamic API Routes

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/users/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}

// PATCH /api/users/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const user = await prisma.user.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json({ user });
}

// DELETE /api/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.user.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
```

## Security Best Practices

### 1. PII Encryption

```typescript
// lib/utils/encryption.ts
import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedHex] = encrypted.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Usage
const ssnEncrypted = encrypt('123-45-6789');
await prisma.user.update({
  where: { id: userId },
  data: { ssnEncrypted },
});
```

### 2. Input Validation

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/),
});

// Validate before processing
const validated = userSchema.parse(data);
```

### 3. Role-Based Access Control

```typescript
function requireRole(role: 'client' | 'preparer' | 'admin') {
  return async (request: Request) => {
    const user = await getCurrentUser();
    if (user.role !== role) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
  };
}
```

## Performance Optimization

### Optimization Strategies

**1. Database Query Optimization**
```typescript
// Use select to limit fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // Don't fetch encrypted SSN unless needed
  },
});

// Use indexes
@@index([userId, createdAt])
```

**2. Redis Caching**
```typescript
// Cache frequent queries
const cacheKey = `user:${userId}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const user = await prisma.user.findUnique({ where: { id: userId } });
await redis.setex(cacheKey, 3600, JSON.stringify(user));
```

**3. Connection Pooling**
```typescript
// Prisma connection pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Pool configuration
  __internal: {
    engine: {
      connection_limit: 20,
    },
  },
});
```

## Related Documentation

- [Frontend Technologies](./frontend.md)
- [Infrastructure](./infrastructure.md)
- [External Services](./services.md)
- [Authentication](./authentication.md)

---

**Document Status:** ✅ Active
**Last Updated:** October 9, 2025

**Maintained By:** Development Team
