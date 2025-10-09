# User Stories

**Version**: 1.0 | **Part**: 2 of 6
**Timeline**: 12 Weeks | **Budget**: $175,000
**Target Launch**: January 15, 2025

[← Previous: Overview](./01-overview-goals.md) | [↑ Index](./README.md) | [Next: Technical Specs →](./03-technical-specs.md)

---

## 3. USER STORIES

### 3.1 Epic 1: Preparer Onboarding
**Goal**: Get preparers from signup to first lead in < 24 hours

#### US-101: Account Creation
**As a** tax preparer
**I want to** create an account quickly
**So that** I can start building my business

**Acceptance Criteria**:
- Email/password/OAuth registration via Clerk.com
- PTIN verification required
- Email confirmation flow
- Complete in < 5 minutes
- Mobile-friendly process

**Technical Implementation**:
```typescript
// Clerk webhook sync to PostgreSQL
POST /api/webhooks/clerk
- Sync user data to PostgreSQL
- Create preparer profile
- Send welcome email via Resend
```

---

#### US-102: Profile Setup

**As a** tax preparer
**I want to** add my professional information
**So that** clients can learn about my expertise

**Acceptance Criteria**:
- Name, photo, bio (500 chars)
- Credentials (CPA, EA, etc.)
- Years of experience
- Service areas (zip codes)
- Contact information
- Pricing structure

**Database Schema**:
```sql
CREATE TABLE preparers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  photo_url TEXT,
  bio TEXT,
  credentials JSONB,
  years_experience INTEGER,
  service_areas TEXT[],
  phone VARCHAR(20),
  pricing JSONB,
  subscription_status VARCHAR(50) DEFAULT 'trial',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_preparers_clerk_id ON preparers(clerk_user_id);
CREATE INDEX idx_preparers_email ON preparers(email);
```

---

#### US-103: Website Generation

**As a** tax preparer
**I want to** get a professional website instantly
**So that** I can start marketing immediately

**Acceptance Criteria**:
- Auto-generated from profile
- Unique URL (taxgenius.com/pro/[slug])
- 3 template choices (Professional, Modern, Classic)
- Live in < 60 seconds
- SSL certificate included

**Technical Implementation**:
```typescript
// Next.js Dynamic Route
// app/pro/[slug]/page.tsx

export async function generateStaticParams() {
  const preparers = await db.preparer.findMany({
    select: { slug: true }
  });

  return preparers.map((preparer) => ({
    slug: preparer.slug,
  }));
}

export default async function PreparerPage({
  params
}: {
  params: { slug: string }
}) {
  const preparer = await getPreparerBySlug(params.slug);
  const template = preparer.template || 'professional';

  return <PreparerWebsite preparer={preparer} template={template} />;
}
```

---

### 3.2 Epic 2: Lead Generation

**Goal**: Capture and qualify leads from multiple sources

#### US-201: Intake Form

**As a** potential client
**I want to** submit my tax needs
**So that** I can get help from a preparer

**Acceptance Criteria**:
- Name, email, phone required
- Tax situation questions
- Urgency selector
- Document checklist
- Anti-spam validation (reCAPTCHA v3)

**Form Fields**:
```typescript
interface LeadFormData {
  // Required
  name: string;
  email: string;
  phone: string;
  zip_code: string;

  // Tax Situation
  employment_type: 'W2' | '1099' | 'Both' | 'Business' | 'Unemployed';
  has_dependents: boolean;
  dependent_count?: number;
  owns_home: boolean;
  has_investments: boolean;

  // Urgency
  urgency: 'urgent' | 'this_week' | 'this_month' | 'no_rush';

  // Optional
  estimated_income?: number;
  referral_code?: string;
  notes?: string;
}
```

---

#### US-202: Lead Routing

**As a** system
**I want to** route leads to correct preparer
**So that** clients get quick responses

**Acceptance Criteria**:
- Auto-assign based on URL or zip code
- Lead scoring (0-100 algorithm)
- Email notification to preparer (Resend)
- PWA push notification
- Confirmation email to client

**Lead Scoring Algorithm**:
```typescript
function calculateLeadScore(lead: Lead): number {
  let score = 50; // Base score

  // Urgency bonus
  if (lead.urgency === 'urgent') score += 25;
  else if (lead.urgency === 'this_week') score += 15;
  else if (lead.urgency === 'this_month') score += 5;

  // Completeness bonus
  if (lead.estimated_income) score += 10;
  if (lead.has_dependents) score += 5;
  if (lead.owns_home) score += 5;
  if (lead.has_investments) score += 5;

  // Phone provided bonus
  if (lead.phone) score += 10;

  return Math.min(score, 100);
}
```

**Database Schema**:
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparer_id UUID REFERENCES preparers(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  zip_code VARCHAR(10),
  employment_type VARCHAR(50),
  has_dependents BOOLEAN DEFAULT false,
  dependent_count INTEGER,
  owns_home BOOLEAN DEFAULT false,
  has_investments BOOLEAN DEFAULT false,
  urgency VARCHAR(20) DEFAULT 'no_rush',
  estimated_income DECIMAL(10,2),
  referral_code VARCHAR(50),
  notes TEXT,
  score INTEGER DEFAULT 50,
  status VARCHAR(20) DEFAULT 'new',
  source VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  contacted_at TIMESTAMP,
  converted_at TIMESTAMP
);

CREATE INDEX idx_leads_preparer ON leads(preparer_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
```

---

#### US-203: Refund Calculator

**As a** potential client
**I want to** estimate my refund
**So that** I can decide to proceed

**Acceptance Criteria**:
- Basic W-2 information
- Standard deduction only
- Child tax credit
- Results in < 5 seconds
- Lead capture after calculation

**Calculator Logic**:
```typescript
interface RefundCalculatorInput {
  filing_status: 'single' | 'married_joint' | 'married_separate' | 'head_of_household';
  income: number;
  federal_withheld: number;
  dependents: number;
  student_loan_interest?: number;
}

function calculateEstimatedRefund(input: RefundCalculatorInput): number {
  // 2024 Tax Brackets (simplified for MVP)
  const standardDeductions = {
    single: 14600,
    married_joint: 29200,
    married_separate: 14600,
    head_of_household: 21900,
  };

  const taxableIncome = Math.max(
    0,
    input.income - standardDeductions[input.filing_status] - (input.student_loan_interest || 0)
  );

  // Simplified tax calculation (single bracket for MVP)
  let tax = 0;
  if (taxableIncome > 0) {
    if (taxableIncome <= 11600) {
      tax = taxableIncome * 0.10;
    } else if (taxableIncome <= 47150) {
      tax = 1160 + (taxableIncome - 11600) * 0.12;
    } else if (taxableIncome <= 100525) {
      tax = 5426 + (taxableIncome - 47150) * 0.22;
    } else {
      tax = 17168.50 + (taxableIncome - 100525) * 0.24;
    }
  }

  // Child Tax Credit
  const childTaxCredit = Math.min(input.dependents * 2000, input.dependents * 2000);

  // Calculate refund
  const totalTax = Math.max(0, tax - childTaxCredit);
  const refund = input.federal_withheld - totalTax;

  return Math.round(refund);
}
```

---

### 3.3 Epic 3: Client Management

**Goal**: Manage client relationships efficiently

#### US-301: Client Database

**As a** preparer
**I want to** store client information
**So that** I can manage relationships

**Acceptance Criteria**:
- Add/edit/delete clients
- Search and filter
- Import from CSV
- Export capabilities
- 500 client limit for Starter plan
- Unlimited for Professional plan

**Database Schema**:
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparer_id UUID REFERENCES preparers(id) NOT NULL,
  lead_id UUID REFERENCES leads(id),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  ssn_encrypted TEXT,
  date_of_birth DATE,
  filing_status VARCHAR(50),
  dependents JSONB,
  pipeline_stage VARCHAR(50) DEFAULT 'new',
  tags TEXT[],
  notes TEXT,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_preparer ON clients(preparer_id);
CREATE INDEX idx_clients_stage ON clients(pipeline_stage);
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_tags ON clients USING GIN(tags);
```

---

#### US-302: Pipeline Management

**As a** preparer
**I want to** track client status
**So that** I know where each client stands

**Acceptance Criteria**:
- 5 stages: New → Contacted → Documents → Preparing → Complete
- Drag-drop interface (kanban)
- Status timestamps
- Basic filtering
- Bulk actions

**Pipeline Stages**:
```typescript
enum PipelineStage {
  NEW = 'new',
  CONTACTED = 'contacted',
  DOCUMENTS = 'documents',
  PREPARING = 'preparing',
  COMPLETE = 'complete'
}

interface PipelineCard {
  client_id: string;
  name: string;
  email: string;
  stage: PipelineStage;
  days_in_stage: number;
  priority: 'low' | 'medium' | 'high';
  last_activity: Date;
}
```

**UI Component**:
```tsx
// components/Pipeline.tsx
import { DndContext, DragOverlay } from '@dnd-kit/core';

export function Pipeline({ clients, onStageChange }) {
  const stages = ['new', 'contacted', 'documents', 'preparing', 'complete'];

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        {stages.map(stage => (
          <PipelineColumn
            key={stage}
            stage={stage}
            clients={clients.filter(c => c.pipeline_stage === stage)}
          />
        ))}
      </div>
    </DndContext>
  );
}
```

See [UI/UX Design](./04-ui-ux-design.md#52-key-screens) for pipeline wireframe.

---

#### US-303: Document Collection

**As a** preparer
**I want to** collect client documents
**So that** I can prepare their taxes

**Acceptance Criteria**:
- Secure upload portal (MinIO)
- File types: PDF, JPG, PNG, HEIC
- 10MB file limit per file
- 100MB total per client
- Download all as ZIP
- Virus scanning (ClamAV)

**MinIO Integration**:
```typescript
// lib/minio.ts
import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT!),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export async function generatePresignedUploadUrl(
  preparerId: string,
  clientId: string,
  fileName: string
): Promise<string> {
  const bucketName = 'tax-documents';
  const objectName = `${preparerId}/${clientId}/${Date.now()}-${fileName}`;

  // Generate presigned URL (expires in 10 minutes)
  const url = await minioClient.presignedPutObject(
    bucketName,
    objectName,
    10 * 60
  );

  return url;
}

export async function getDocumentDownloadUrl(
  objectName: string
): Promise<string> {
  const bucketName = 'tax-documents';

  // Generate presigned URL for download (expires in 1 hour)
  const url = await minioClient.presignedGetObject(
    bucketName,
    objectName,
    60 * 60
  );

  return url;
}
```

**Database Schema**:
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) NOT NULL,
  preparer_id UUID REFERENCES preparers(id) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  minio_object_key TEXT NOT NULL,
  document_type VARCHAR(50),
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100),
  virus_scan_status VARCHAR(20) DEFAULT 'pending',
  virus_scan_result TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed BOOLEAN DEFAULT false,
  reviewed_at TIMESTAMP
);

CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_documents_preparer ON documents(preparer_id);
CREATE INDEX idx_documents_type ON documents(document_type);
```

See [Technical Specifications](./03-technical-specs.md) for MinIO architecture details.

---

### 3.4 Epic 4: Communication

**Goal**: Enable professional client communication

#### US-401: Email Integration

**As a** preparer
**I want to** email clients professionally
**So that** I maintain consistent communication

**Acceptance Criteria**:
- Send from platform (Resend)
- Professional templates (5) with React Email
- Track open/click
- Reply detection
- Unsubscribe handling

**Email Templates**:
```tsx
// emails/WelcomeEmail.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  clientName: string;
  preparerName: string;
  dashboardUrl: string;
}

export function WelcomeEmail({
  clientName,
  preparerName,
  dashboardUrl
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {preparerName}'s Tax Services</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            Welcome, {clientName}!
          </Heading>

          <Text style={text}>
            Thank you for choosing {preparerName} for your tax preparation needs.
          </Text>

          <Button style={button} href={dashboardUrl}>
            View Your Dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

**Resend Integration**:
```typescript
// lib/email.ts
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(
  client: { name: string; email: string },
  preparer: { name: string; email: string }
) {
  const { data, error } = await resend.emails.send({
    from: `${preparer.name} <${preparer.email}@mail.taxgenius.com>`,
    to: client.email,
    subject: `Welcome to ${preparer.name}'s Tax Services`,
    react: WelcomeEmail({
      clientName: client.name,
      preparerName: preparer.name,
      dashboardUrl: `${process.env.APP_URL}/client/dashboard`,
    }),
  });

  if (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send email');
  }

  // Track email in database
  await db.emailLog.create({
    data: {
      email_id: data.id,
      recipient: client.email,
      template: 'welcome',
      status: 'sent',
    },
  });

  return data;
}
```

---

#### US-402: PWA Push Notifications

**As a** preparer
**I want to** receive instant notifications
**So that** I can respond to leads quickly

**Acceptance Criteria**:
- Browser push notifications (free, no SMS costs)
- New lead notifications
- Document upload alerts
- Appointment reminders
- Works when browser closed
- Action buttons (View, Dismiss)

**PWA Push Setup**:
```typescript
// lib/push-notifications.ts

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function subscribeToPushNotifications(userId: string) {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  // Save subscription to backend
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, subscription }),
  });

  return subscription;
}
```

**Backend Push Sender**:
```typescript
// lib/send-push.ts
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:support@taxgenius.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPushNotification(
  subscription: PushSubscription,
  payload: {
    title: string;
    body: string;
    icon?: string;
    data?: any;
  }
) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}
```

---

#### US-403: Appointment Booking

**As a** client
**I want to** book appointments online
**So that** I can meet with my preparer

**Acceptance Criteria**:
- Calendar availability management
- 30/60 min slots
- Confirmation emails (Resend)
- Reminder system (24h + 1h before)
- Rescheduling allowed
- Timezone conversion

**Database Schema**:
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparer_id UUID REFERENCES preparers(id) NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL,
  timezone VARCHAR(50) NOT NULL,
  type VARCHAR(50) DEFAULT 'consultation',
  status VARCHAR(20) DEFAULT 'scheduled',
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT
);

CREATE INDEX idx_appointments_preparer ON appointments(preparer_id);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at);
```

---

### 3.5 Epic 5: Analytics & Billing

**Goal**: Track performance and manage subscriptions

#### US-501: Basic Analytics

**As a** preparer
**I want to** see my business metrics
**So that** I can track growth

**Acceptance Criteria**:
- Lead count by source
- Conversion rate
- Revenue tracking
- Client count by stage
- Monthly/weekly views

**Analytics Schema**:
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparer_id UUID REFERENCES preparers(id),
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_preparer ON analytics_events(preparer_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
```

**Analytics Dashboard Component**:
```tsx
// components/AnalyticsDashboard.tsx

export function AnalyticsDashboard({ preparerId }: { preparerId: string }) {
  const { data } = useQuery({
    queryKey: ['analytics', preparerId],
    queryFn: () => fetch(`/api/analytics/${preparerId}`).then(r => r.json()),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="New Leads"
        value={data.leads.total}
        change={data.leads.change}
        icon={<UsersIcon />}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${data.conversion.rate}%`}
        change={data.conversion.change}
        icon={<TrendingUpIcon />}
      />
      <MetricCard
        title="Revenue"
        value={`$${data.revenue.total}`}
        change={data.revenue.change}
        icon={<DollarSignIcon />}
      />
      <MetricCard
        title="Active Clients"
        value={data.clients.active}
        change={data.clients.change}
        icon={<BriefcaseIcon />}
      />
    </div>
  );
}
```

---

#### US-502: Subscription Management

**As a** preparer
**I want to** manage my subscription
**So that** I can control costs

**Acceptance Criteria**:
- Square Subscriptions API integration
- Plan selection (Starter/Professional)
- Payment method update
- Invoice history
- Cancel anytime

**Square Integration**:
```typescript
// lib/square.ts
import { Client, Environment } from 'square';

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: process.env.NODE_ENV === 'production'
    ? Environment.Production
    : Environment.Sandbox,
});

export async function createSubscription(
  customerId: string,
  planId: string
) {
  const { result } = await squareClient.subscriptionsApi.createSubscription({
    locationId: process.env.SQUARE_LOCATION_ID!,
    customerId,
    planVariationId: planId,
  });

  return result.subscription;
}

export async function updateSubscription(
  subscriptionId: string,
  newPlanId: string
) {
  const { result } = await squareClient.subscriptionsApi.updateSubscription(
    subscriptionId,
    {
      subscription: {
        planVariationId: newPlanId,
      },
    }
  );

  return result.subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  const { result } = await squareClient.subscriptionsApi.cancelSubscription(
    subscriptionId
  );

  return result.subscription;
}
```

**Database Schema**:
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  preparer_id UUID REFERENCES preparers(id) NOT NULL,
  square_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  square_customer_id VARCHAR(255) NOT NULL,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_preparer ON subscriptions(preparer_id);
CREATE INDEX idx_subscriptions_square_id ON subscriptions(square_subscription_id);
```

---

## Summary

### Total User Stories: 15
- **Epic 1**: 3 stories (Onboarding)
- **Epic 2**: 3 stories (Lead Generation)
- **Epic 3**: 3 stories (Client Management)
- **Epic 4**: 3 stories (Communication)
- **Epic 5**: 2 stories (Analytics & Billing)

### Implementation Order
1. US-101, US-102, US-103 (Week 5-6)
2. US-201, US-202 (Week 6-7)
3. US-301, US-302 (Week 7-8)
4. US-303, US-401 (Week 9-10)
5. US-402, US-403 (Week 10-11)
6. US-501, US-502 (Week 11-12)

See [Development Plan](./05-development-testing.md#61-sprint-plan-2-week-sprints) for detailed sprint assignments.

---

[← Previous: Overview](./01-overview-goals.md) | [↑ Index](./README.md) | [Next: Technical Specs →](./03-technical-specs.md)

**Document Status**: ✅ Ready for Implementation
**Last Updated**: 2025-10-09
