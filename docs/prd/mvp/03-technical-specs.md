# Technical Specifications

**Version**: 1.0 | **Part**: 3 of 6
**Timeline**: 12 Weeks | **Budget**: $175,000
**Target Launch**: January 15, 2025

[← Previous: User Stories](./02-user-stories.md) | [↑ Index](./README.md) | [Next: UI/UX Design →](./04-ui-ux-design.md)

---

## 4. TECHNICAL SPECIFICATIONS

### 4.1 Technology Stack

```yaml
Frontend:
  framework: Next.js 14 (App Router)
  language: TypeScript
  styling: Tailwind CSS
  ui_components: shadcn/ui
  state: React Context (no Redux for MVP)
  forms: React Hook Form + Zod

Backend:
  runtime: Node.js 20 LTS
  framework: Express.js (for webhooks)
  database: PostgreSQL 15
  orm: Prisma
  cache: Redis 7.2

Infrastructure:
  hosting: Self-hosted VPS
  orchestration: Docker + Coolify
  storage: MinIO (S3-compatible)
  cdn: Cloudflare (DNS only)
  ssl: Let's Encrypt

Integrations:
  auth: Clerk.com
  payments: Square + Cash App SDK
  email: Resend
  analytics: Google Analytics 4
```

### Why These Technologies?

#### Next.js 14 with App Router
- **Server Components**: Reduce client-side JavaScript
- **Built-in API Routes**: No separate backend needed
- **SEO Optimization**: Critical for preparer websites
- **Fast Refresh**: Improved developer experience
- **TypeScript First**: Type safety throughout

#### Self-Hosted Infrastructure
- **Cost Control**: Predictable $100/month vs. $500+ cloud
- **Data Sovereignty**: Important for tax data compliance
- **Customization**: Full control over environment
- **Margins**: Higher profit margins vs. managed services

#### Clerk.com Authentication
- **No Password Management**: Security handled by experts
- **OAuth Support**: Google, Microsoft login
- **Session Management**: Automatic token refresh
- **Webhooks**: User sync to PostgreSQL
- **Cost**: Free up to 5,000 MAU

#### Square Payments
- **Lower Fees**: 2.6% + 10¢ vs. Stripe 2.9% + 30¢
- **Cash App Integration**: Popular with tax clients
- **Subscription API**: Built-in recurring billing
- **PCI Compliance**: Handled by Square
- **Support**: Better for small business

#### MinIO Storage
- **S3-Compatible**: Can migrate to AWS if needed
- **Self-Hosted**: Control data location
- **Cost**: $50/month for 1TB vs. $200+ AWS S3
- **Performance**: Local storage faster than cloud
- **Compliance**: Data never leaves your infrastructure

---

### 4.2 Architecture Decisions

#### Simple Self-Hosted Architecture

```
Internet
   ↓
Cloudflare (DNS + CDN)
   ↓
Your VPS Server
   ↓
Coolify (PaaS)
   ↓
Nginx (Reverse Proxy + SSL)
   ↓
┌────────────┬────────────┬────────────┐
│  Next.js   │ Express.js │   MinIO    │
│  Frontend  │   API      │  Storage   │
└────────────┴────────────┴────────────┘
       │            │
   ┌───┴────────────┴───┐
   │                    │
PostgreSQL           Redis
(Database)          (Cache)
```

#### Architecture Benefits

1. **Simplicity**: Single VPS, easy to understand
2. **Cost**: ~$200/month total infrastructure
3. **Performance**: Everything colocated
4. **Reliability**: Coolify handles deployments
5. **Scalability**: Can migrate to multi-server later

#### Database Schema (Core Tables Only)

```sql
-- Core tables for MVP
CREATE TABLE preparers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  photo_url TEXT,
  bio TEXT,
  credentials JSONB,
  service_areas TEXT[],
  pricing JSONB,
  template VARCHAR(50) DEFAULT 'professional',
  subscription_status VARCHAR(50) DEFAULT 'trial',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparer_id UUID REFERENCES preparers(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  zip_code VARCHAR(10),
  employment_type VARCHAR(50),
  urgency VARCHAR(20),
  score INTEGER DEFAULT 50,
  status VARCHAR(20) DEFAULT 'new',
  source VARCHAR(50),
  referral_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  contacted_at TIMESTAMP,
  converted_at TIMESTAMP
);

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparer_id UUID REFERENCES preparers(id) NOT NULL,
  lead_id UUID REFERENCES leads(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  pipeline_stage VARCHAR(50) DEFAULT 'new',
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) NOT NULL,
  preparer_id UUID REFERENCES preparers(id) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  minio_object_key TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  document_type VARCHAR(50),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparer_id UUID REFERENCES preparers(id) NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparer_id UUID REFERENCES preparers(id) NOT NULL,
  square_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Essential Indexes
CREATE INDEX idx_preparers_slug ON preparers(slug);
CREATE INDEX idx_leads_preparer ON leads(preparer_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_clients_preparer ON clients(preparer_id);
CREATE INDEX idx_clients_stage ON clients(pipeline_stage);
CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_appointments_preparer ON appointments(preparer_id);
```

See complete schema in [User Stories](./02-user-stories.md) for field details.

---

### 4.3 Security Requirements

#### Authentication & Authorization
- **No Password Storage**: Clerk.com handles all authentication
- **JWT Verification**: Every API call validates Clerk JWT
- **Role-Based Access**: Preparers can only access their data
- **Session Management**: 30-day sessions with auto-refresh

#### Data Protection
- **SSL/TLS**: All connections encrypted via Let's Encrypt
- **Database Encryption**: PostgreSQL TDE for data at rest
- **File Encryption**: MinIO server-side encryption
- **SSN Encryption**: AES-256 encryption for sensitive fields
- **Backup Encryption**: All backups encrypted

#### API Security
- **Rate Limiting**: 100 requests/minute per IP
- **CORS Policy**: Strict origin whitelist
- **SQL Injection**: Prisma parameterized queries only
- **XSS Protection**: React auto-escaping + CSP headers
- **CSRF Protection**: Token-based protection on mutations

#### File Upload Security
- **Virus Scanning**: ClamAV on all uploads
- **File Type Validation**: Whitelist (PDF, JPG, PNG, HEIC only)
- **File Size Limits**: 10MB per file, 100MB per client
- **Presigned URLs**: 10-minute expiry on upload, 1-hour on download
- **Path Traversal Prevention**: UUID-based file paths only

#### Compliance
- **GDPR Ready**: Data export and deletion endpoints
- **SOC 2 Preparation**: Audit logging for all data access
- **Tax Data Handling**: IRS Publication 1075 guidelines
- **PCI Compliance**: Square handles all payment data

#### Security Monitoring
- **Failed Login Tracking**: Alert after 5 failures
- **Suspicious Activity Detection**: ML-based anomaly detection (post-MVP)
- **Access Logs**: 90-day retention
- **Error Tracking**: Sentry for production errors
- **Uptime Monitoring**: UptimeRobot (5-minute checks)

#### Security Checklist (Pre-Launch)
- [ ] Security audit completed
- [ ] Penetration testing passed
- [ ] OWASP Top 10 mitigated
- [ ] Dependency vulnerabilities scanned
- [ ] Environment variables secured
- [ ] Backup restore tested
- [ ] Incident response plan documented
- [ ] Security headers configured

---

### 4.4 Integration Specifications

#### Clerk.com (Authentication)

**Setup**:
```typescript
// app/providers.tsx
import { ClerkProvider } from '@clerk/nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: { colorPrimary: '#2563eb' }
      }}
    >
      {children}
    </ClerkProvider>
  );
}
```

**Webhook Handler**:
```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id!,
      'svix-timestamp': svix_timestamp!,
      'svix-signature': svix_signature!,
    });
  } catch (err) {
    return new Response('Webhook verification failed', { status: 400 });
  }

  const { id, email_addresses, first_name, last_name } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    await db.preparer.create({
      data: {
        clerk_user_id: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        slug: generateSlug(`${first_name}-${last_name}`),
      },
    });
  }

  return new Response('Webhook processed', { status: 200 });
}
```

---

#### Square (Payments)

**Subscription Creation**:
```typescript
// lib/square.ts
import { Client, Environment } from 'square';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: Environment.Production,
});

export async function createCustomer(email: string, name: string) {
  const { result } = await client.customersApi.createCustomer({
    emailAddress: email,
    givenName: name.split(' ')[0],
    familyName: name.split(' ')[1] || '',
  });
  return result.customer;
}

export async function createSubscription(
  customerId: string,
  planVariationId: string
) {
  const { result } = await client.subscriptionsApi.createSubscription({
    locationId: process.env.SQUARE_LOCATION_ID!,
    customerId,
    planVariationId,
  });
  return result.subscription;
}
```

**Webhook Handler**:
```typescript
// app/api/webhooks/square/route.ts
import { validateSquareWebhook } from '@/lib/square-webhook';

export async function POST(req: Request) {
  const signature = req.headers.get('x-square-hmacsha256-signature');
  const body = await req.text();

  if (!validateSquareWebhook(body, signature)) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.type === 'subscription.updated') {
    const subscription = event.data.object.subscription;

    await db.subscription.update({
      where: { square_subscription_id: subscription.id },
      data: {
        status: subscription.status,
        current_period_start: new Date(subscription.charged_through_date),
      },
    });
  }

  return new Response('OK', { status: 200 });
}
```

---

#### Resend (Email)

**Configuration**:
```typescript
// lib/resend.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = {
  noreply: 'Tax Genius <noreply@taxgenius.com>',
  support: 'Tax Genius Support <support@taxgenius.com>',
};
```

**Send Email**:
```typescript
// lib/email-service.ts
import { resend, EMAIL_FROM } from './resend';
import { LeadNotificationEmail } from '@/emails/LeadNotification';

export async function sendLeadNotification(
  preparer: { name: string; email: string },
  lead: { name: string; email: string; score: number }
) {
  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM.noreply,
    to: preparer.email,
    subject: `New Lead: ${lead.name} (Score: ${lead.score})`,
    react: LeadNotificationEmail({ preparer, lead }),
    tags: [
      { name: 'category', value: 'lead-notification' },
    ],
  });

  if (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email send failed');
  }

  return data;
}
```

---

#### MinIO (Object Storage)

**Setup**:
```typescript
// lib/minio.ts
import { Client } from 'minio';

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

const BUCKET_NAME = 'tax-documents';

// Ensure bucket exists
export async function initBucket() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');

    // Set lifecycle policy (delete after 7 years - IRS requirement)
    await minioClient.setBucketLifecycle(BUCKET_NAME, {
      Rule: [{
        ID: 'delete-after-7-years',
        Status: 'Enabled',
        Expiration: { Days: 2555 }, // 7 years
      }],
    });
  }
}
```

**Upload Endpoint**:
```typescript
// app/api/documents/upload-url/route.ts
import { auth } from '@clerk/nextjs';
import { minioClient } from '@/lib/minio';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const { clientId, fileName, fileSize } = await req.json();

  // Validate file size
  if (fileSize > 10 * 1024 * 1024) {
    return new Response('File too large (max 10MB)', { status: 400 });
  }

  // Validate file type
  const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.heic'];
  if (!allowedTypes.some(ext => fileName.toLowerCase().endsWith(ext))) {
    return new Response('Invalid file type', { status: 400 });
  }

  const preparer = await db.preparer.findUnique({ where: { clerk_user_id: userId } });
  const objectKey = `${preparer.id}/${clientId}/${Date.now()}-${fileName}`;

  // Generate presigned URL (10 minute expiry)
  const uploadUrl = await minioClient.presignedPutObject(
    'tax-documents',
    objectKey,
    10 * 60
  );

  return Response.json({ uploadUrl, objectKey });
}
```

---

### 4.5 Performance Requirements

#### Page Load Targets
- **Homepage**: < 1.5 seconds (LCP)
- **Dashboard**: < 2.0 seconds (LCP)
- **Preparer Website**: < 1.0 seconds (LCP)
- **API Responses**: < 500ms (p95)

#### Optimization Strategies
- **Image Optimization**: Next.js Image component + WebP
- **Code Splitting**: Dynamic imports for heavy components
- **Database Queries**: Prisma select only needed fields
- **Redis Caching**: Cache preparer websites (1 hour TTL)
- **CDN**: Cloudflare caching for static assets

#### Monitoring
- **Core Web Vitals**: Google Analytics 4
- **API Latency**: Custom middleware logging
- **Database Performance**: PostgreSQL slow query log
- **Uptime**: UptimeRobot (5-minute checks)

---

### 4.6 Environment Variables

```bash
# .env.local (Development)
# .env.production (Production)

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/taxgenius
REDIS_URL=redis://localhost:6379

# Authentication (Clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# Payments (Square)
SQUARE_ACCESS_TOKEN=sq0atp-xxxxx
SQUARE_LOCATION_ID=xxxxx
SQUARE_WEBHOOK_SIGNATURE_KEY=xxxxx
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sq0idp-xxxxx

# Email (Resend)
RESEND_API_KEY=re_xxxxx
RESEND_WEBHOOK_SECRET=whsec_xxxxx

# Storage (MinIO)
MINIO_ENDPOINT=minio.yourdomain.com
MINIO_PORT=9000
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=xxxxx
MINIO_SECRET_KEY=xxxxx

# PWA Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxxxx
VAPID_PRIVATE_KEY=xxxxx

# App Config
NEXT_PUBLIC_APP_URL=https://app.taxgenius.com
NODE_ENV=production
```

---

### 4.7 Deployment Strategy

#### Coolify Deployment
1. **Git Push**: Push to main branch triggers deployment
2. **Build**: Coolify runs `npm run build`
3. **Database Migration**: Prisma migrations run automatically
4. **Health Check**: Coolify verifies app responds on port 3005
5. **Zero-Downtime**: New container starts before old stops
6. **Rollback**: One-click rollback to previous deployment

#### Database Migrations
```bash
# Development
npx prisma migrate dev --name add_appointments

# Production
npx prisma migrate deploy
```

#### Backup Strategy
- **Database**: Daily automated backups (30-day retention)
- **MinIO**: Daily snapshots (90-day retention)
- **Backup Testing**: Monthly restore verification

---

## Related Documentation

- [User Stories](./02-user-stories.md) - Database schema details for each feature
- [Development Plan](./05-development-testing.md#6-development-plan) - Sprint-by-sprint implementation
- Architecture Diagrams - See `/root/websites/taxgeniuspro/docs/architecture/`

---

[← Previous: User Stories](./02-user-stories.md) | [↑ Index](./README.md) | [Next: UI/UX Design →](./04-ui-ux-design.md)

**Document Status**: ✅ Technical Review Complete
**Last Updated**: 2025-10-09
