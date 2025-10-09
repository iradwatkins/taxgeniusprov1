markdown  
\# MVP Specification Document  
\# Tax Genius Preparer Platform

**\*\*Version\*\***: 1.0    
**\*\*Timeline\*\***: 12 Weeks (3 Months)    
**\*\*Budget\*\***: $175,000    
**\*\*Target Launch\*\***: January 15, 2025  

\---

\#\# Table of Contents

1\. \[MVP Overview\](\#1-mvp-overview)  
2\. \[MVP Scope\](\#2-mvp-scope)  
3\. \[User Stories\](\#3-user-stories)  
4\. \[Technical Specifications\](\#4-technical-specifications)  
5\. \[UI/UX Specifications\](\#5-uiux-specifications)  
6\. \[Development Plan\](\#6-development-plan)  
7\. \[Testing Plan\](\#7-testing-plan)  
8\. \[Launch Plan\](\#8-launch-plan)  
9\. \[Post-MVP Roadmap\](\#9-post-mvp-roadmap)  
10\. \[Risks & Mitigation\](\#10-risks--mitigation)  
11\. \[Success Metrics\](\#11-success-metrics)  
12\. \[Budget Breakdown\](\#12-budget-breakdown)

\---

\#\# 1\. MVP OVERVIEW

\#\#\# 1.1 MVP Definition  
The Minimum Viable Product delivers core functionality that enables tax preparers to establish professional online presence, capture leads, and manage clients \- validating our core value proposition with minimal investment.

\#\#\# 1.2 MVP Goals  
\- **\*\*Validate Market Fit\*\***: Prove preparers will pay for integrated platform  
\- **\*\*Generate Revenue\*\***: Achieve $50K MRR within 90 days  
\- **\*\*Gather Feedback\*\***: Learn from 100 early adopters  
\- **\*\*Technical Foundation\*\***: Build scalable core architecture  
\- **\*\*Quick to Market\*\***: Launch before tax season peak

\#\#\# 1.3 Success Criteria  
\- 100 paying preparers by March 31, 2025  
\- 2,500 qualified leads generated  
\- 60% preparer activation rate  
\- 4.0+ user satisfaction score  
\- $50K MRR achieved

\#\#\# 1.4 Core Value Proposition  
"Get a professional website and start receiving tax clients in 60 seconds"

\---

\#\# 2\. MVP SCOPE

\#\#\# 2.1 IN SCOPE ✅

\#\#\#\# Core Features (MUST HAVE)  
1\. **\*\*Preparer Website\*\*** \- Template-based professional site  
2\. **\*\*Lead Capture\*\*** \- Intake forms with routing  
3\. **\*\*Client Management\*\*** \- Basic CRM functionality  
4\. **\*\*Communication\*\*** \- Email/PWA push notifications  
5\. **\*\*Analytics\*\*** \- Basic performance metrics

\#\#\#\# Critical Capabilities  
\- User authentication & security (Clerk.com)  
\- Payment processing (Square)  
\- Mobile-responsive design  
\- SEO optimization  
\- Document upload (MinIO)  
\- Appointment booking

\#\#\# 2.2 OUT OF SCOPE ❌

\#\#\#\# Deferred to Post-MVP  
\- Marketing content library  
\- Physical marketing store  
\- Advanced analytics  
\- Native mobile app (iOS/Android)  
\- Team management  
\- API access  
\- White-label options  
\- AI features  
\- Automation workflows  
\- Video consultations  
\- SMS notifications (using PWA push instead)

\---

\#\# 3\. USER STORIES

\#\#\# 3.1 Epic 1: Preparer Onboarding  
**\*\*Goal\*\***: Get preparers from signup to first lead in \< 24 hours

\#\#\#\# US-101: Account Creation  
**\*\*As a\*\*** tax preparer    
**\*\*I want to\*\*** create an account quickly    
**\*\*So that\*\*** I can start building my business  

**\*\*Acceptance Criteria\*\***:  
\- Email/password/OAuth registration via Clerk.com  
\- PTIN verification required  
\- Email confirmation flow  
\- Complete in \< 5 minutes  
\- Mobile-friendly process

**\*\*Technical Implementation\*\***:  
\`\`\`typescript  
// Clerk webhook sync to PostgreSQL  
POST /api/webhooks/clerk  
\- Sync user data to PostgreSQL  
\- Create preparer profile

\- Send welcome email via Resend

---

#### **US-102: Profile Setup**

**As a** tax preparer  
 **I want to** add my professional information  
 **So that** clients can learn about my expertise

**Acceptance Criteria**:

* Name, photo, bio (500 chars)  
* Credentials (CPA, EA, etc.)  
* Years of experience  
* Service areas (zip codes)  
* Contact information  
* Pricing structure

**Database Schema**:

sql  
CREATE TABLE preparers (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  clerk\_user\_id VARCHAR(255) UNIQUE NOT NULL,  
  email VARCHAR(255) UNIQUE NOT NULL,  
  name VARCHAR(255) NOT NULL,  
  photo\_url TEXT,  
  bio TEXT,  
  credentials JSONB,  
  years\_experience INTEGER,  
  service\_areas TEXT\[\],  
  phone VARCHAR(20),  
  pricing JSONB,  
  subscription\_status VARCHAR(50) DEFAULT 'trial',  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
  updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

CREATE INDEX idx\_preparers\_clerk\_id ON preparers(clerk\_user\_id);

CREATE INDEX idx\_preparers\_email ON preparers(email);

---

#### **US-103: Website Generation**

**As a** tax preparer  
 **I want to** get a professional website instantly  
 **So that** I can start marketing immediately

**Acceptance Criteria**:

* Auto-generated from profile  
* Unique URL (taxgenius.com/pro/\[slug\])  
* 3 template choices (Professional, Modern, Classic)  
* Live in \< 60 seconds  
* SSL certificate included

**Technical Implementation**:

typescript  
*// Next.js Dynamic Route*  
*// app/pro/\[slug\]/page.tsx*

export async function generateStaticParams() {  
  const preparers \= await db.preparer.findMany({  
    select: { slug: true }  
  });  
    
  return preparers.map((preparer) \=\> ({  
    slug: preparer.slug,  
  }));  
}

export default async function PreparerPage({   
  params   
}: {   
  params: { slug: string }   
}) {  
  const preparer \= await getPreparerBySlug(params.slug);  
  const template \= preparer.template || 'professional';  
    
  return \<PreparerWebsite preparer\={preparer} template\={template} /\>;

}

---

### **3.2 Epic 2: Lead Generation**

**Goal**: Capture and qualify leads from multiple sources

#### **US-201: Intake Form**

**As a** potential client  
 **I want to** submit my tax needs  
 **So that** I can get help from a preparer

**Acceptance Criteria**:

* Name, email, phone required  
* Tax situation questions  
* Urgency selector  
* Document checklist  
* Anti-spam validation (reCAPTCHA v3)

**Form Fields**:

typescript  
interface LeadFormData {  
  *// Required*  
  name: string;  
  email: string;  
  phone: string;  
  zip\_code: string;  
    
  *// Tax Situation*  
  employment\_type: 'W2' | '1099' | 'Both' | 'Business' | 'Unemployed';  
  has\_dependents: boolean;  
  dependent\_count?: number;  
  owns\_home: boolean;  
  has\_investments: boolean;  
    
  *// Urgency*  
  urgency: 'urgent' | 'this\_week' | 'this\_month' | 'no\_rush';  
    
  *// Optional*  
  estimated\_income?: number;  
  referral\_code?: string;  
  notes?: string;

}

---

#### **US-202: Lead Routing**

**As a** system  
 **I want to** route leads to correct preparer  
 **So that** clients get quick responses

**Acceptance Criteria**:

* Auto-assign based on URL or zip code  
* Lead scoring (0-100 algorithm)  
* Email notification to preparer (Resend)  
* PWA push notification  
* Confirmation email to client

**Lead Scoring Algorithm**:

typescript  
function calculateLeadScore(lead: Lead): number {  
  let score \= 50; *// Base score*  
    
  *// Urgency bonus*  
  if (lead.urgency \=== 'urgent') score \+= 25;  
  else if (lead.urgency \=== 'this\_week') score \+= 15;  
  else if (lead.urgency \=== 'this\_month') score \+= 5;  
    
  *// Completeness bonus*  
  if (lead.estimated\_income) score \+= 10;  
  if (lead.has\_dependents) score \+= 5;  
  if (lead.owns\_home) score \+= 5;  
  if (lead.has\_investments) score \+= 5;  
    
  *// Phone provided bonus*  
  if (lead.phone) score \+= 10;  
    
  return Math.min(score, 100);

}

**Database Schema**:

sql  
CREATE TABLE leads (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  preparer\_id UUID REFERENCES preparers(id) NOT NULL,  
  name VARCHAR(255) NOT NULL,  
  email VARCHAR(255) NOT NULL,  
  phone VARCHAR(20),  
  zip\_code VARCHAR(10),  
  employment\_type VARCHAR(50),  
  has\_dependents BOOLEAN DEFAULT false,  
  dependent\_count INTEGER,  
  owns\_home BOOLEAN DEFAULT false,  
  has\_investments BOOLEAN DEFAULT false,  
  urgency VARCHAR(20) DEFAULT 'no\_rush',  
  estimated\_income DECIMAL(10,2),  
  referral\_code VARCHAR(50),  
  notes TEXT,  
  score INTEGER DEFAULT 50,  
  status VARCHAR(20) DEFAULT 'new',  
  source VARCHAR(50),  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
  contacted\_at TIMESTAMP,  
  converted\_at TIMESTAMP  
);

CREATE INDEX idx\_leads\_preparer ON leads(preparer\_id);  
CREATE INDEX idx\_leads\_status ON leads(status);  
CREATE INDEX idx\_leads\_score ON leads(score DESC);

CREATE INDEX idx\_leads\_created ON leads(created\_at DESC);

---

#### **US-203: Refund Calculator**

**As a** potential client  
 **I want to** estimate my refund  
 **So that** I can decide to proceed

**Acceptance Criteria**:

* Basic W-2 information  
* Standard deduction only  
* Child tax credit  
* Results in \< 5 seconds  
* Lead capture after calculation

**Calculator Logic**:

typescript  
interface RefundCalculatorInput {  
  filing\_status: 'single' | 'married\_joint' | 'married\_separate' | 'head\_of\_household';  
  income: number;  
  federal\_withheld: number;  
  dependents: number;  
  student\_loan\_interest?: number;  
}

function calculateEstimatedRefund(input: RefundCalculatorInput): number {  
  *// 2024 Tax Brackets (simplified for MVP)*  
  const standardDeductions \= {  
    single: 14600,  
    married\_joint: 29200,  
    married\_separate: 14600,  
    head\_of\_household: 21900,  
  };  
    
  const taxableIncome \= Math.max(  
    0,   
    input.income \- standardDeductions\[input.filing\_status\] \- (input.student\_loan\_interest || 0)  
  );  
    
  *// Simplified tax calculation (single bracket for MVP)*  
  let tax \= 0;  
  if (taxableIncome \> 0) {  
    if (taxableIncome \<= 11600) {  
      tax \= taxableIncome \* 0.10;  
    } else if (taxableIncome \<= 47150) {  
      tax \= 1160 \+ (taxableIncome \- 11600) \* 0.12;  
    } else if (taxableIncome \<= 100525) {  
      tax \= 5426 \+ (taxableIncome \- 47150) \* 0.22;  
    } else {  
      tax \= 17168.50 \+ (taxableIncome \- 100525) \* 0.24;  
    }  
  }  
    
  *// Child Tax Credit*  
  const childTaxCredit \= Math.min(input.dependents \* 2000, input.dependents \* 2000);  
    
  *// Calculate refund*  
  const totalTax \= Math.max(0, tax \- childTaxCredit);  
  const refund \= input.federal\_withheld \- totalTax;  
    
  return Math.round(refund);

}

### **3.3 Epic 3: Client Management**

**Goal**: Manage client relationships efficiently

#### **US-301: Client Database**

**As a** preparer  
 **I want to** store client information  
 **So that** I can manage relationships

**Acceptance Criteria**:

* Add/edit/delete clients  
* Search and filter  
* Import from CSV  
* Export capabilities  
* 500 client limit for Starter plan  
* Unlimited for Professional plan

**Database Schema**:

sql  
CREATE TABLE clients (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  preparer\_id UUID REFERENCES preparers(id) NOT NULL,  
  lead\_id UUID REFERENCES leads(id),  
  name VARCHAR(255) NOT NULL,  
  email VARCHAR(255) NOT NULL,  
  phone VARCHAR(20),  
  address TEXT,  
  ssn\_encrypted TEXT,  
  date\_of\_birth DATE,  
  filing\_status VARCHAR(50),  
  dependents JSONB,  
  pipeline\_stage VARCHAR(50) DEFAULT 'new',  
  tags TEXT\[\],  
  notes TEXT,  
  total\_revenue DECIMAL(10,2) DEFAULT 0,  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
  updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

CREATE INDEX idx\_clients\_preparer ON clients(preparer\_id);  
CREATE INDEX idx\_clients\_stage ON clients(pipeline\_stage);  
CREATE INDEX idx\_clients\_name ON clients(name);  
CREATE INDEX idx\_clients\_email ON clients(email);

CREATE INDEX idx\_clients\_tags ON clients USING GIN(tags);

---

#### **US-302: Pipeline Management**

**As a** preparer  
 **I want to** track client status  
 **So that** I know where each client stands

**Acceptance Criteria**:

* 5 stages: New → Contacted → Documents → Preparing → Complete  
* Drag-drop interface (kanban)  
* Status timestamps  
* Basic filtering  
* Bulk actions

**Pipeline Stages**:

typescript  
enum PipelineStage {  
  NEW \= 'new',  
  CONTACTED \= 'contacted',  
  DOCUMENTS \= 'documents',  
  PREPARING \= 'preparing',  
  COMPLETE \= 'complete'  
}

interface PipelineCard {  
  client\_id: string;  
  name: string;  
  email: string;  
  stage: PipelineStage;  
  days\_in\_stage: number;  
  priority: 'low' | 'medium' | 'high';  
  last\_activity: Date;

}

**UI Component**:

tsx  
*// components/Pipeline.tsx*  
import { DndContext, DragOverlay } from '@dnd-kit/core';

export function Pipeline({ clients, onStageChange }) {  
  const stages \= \['new', 'contacted', 'documents', 'preparing', 'complete'\];  
    
  return (  
    \<DndContext onDragEnd\={handleDragEnd}\>  
      \<div className\="flex gap-4 overflow-x-auto"\>  
        {stages.map(stage \=\> (  
          \<PipelineColumn  
            key\={stage}  
            stage\={stage}  
            clients\={clients.filter(c \=\> c.pipeline\_stage \=== stage)}  
          /\>  
        ))}  
      \</div\>  
    \</DndContext\>  
  );

}

---

#### **US-303: Document Collection**

**As a** preparer  
 **I want to** collect client documents  
 **So that** I can prepare their taxes

**Acceptance Criteria**:

* Secure upload portal (MinIO)  
* File types: PDF, JPG, PNG, HEIC  
* 10MB file limit per file  
* 100MB total per client  
* Download all as ZIP  
* Virus scanning (ClamAV)

**MinIO Integration**:

typescript  
*// lib/minio.ts*  
import { Client } from 'minio';

const minioClient \= new Client({  
  endPoint: process.env.MINIO\_ENDPOINT\!,  
  port: parseInt(process.env.MINIO\_PORT\!),  
  useSSL: process.env.MINIO\_USE\_SSL \=== 'true',  
  accessKey: process.env.MINIO\_ACCESS\_KEY\!,  
  secretKey: process.env.MINIO\_SECRET\_KEY\!,  
});

export async function generatePresignedUploadUrl(  
  preparerId: string,  
  clientId: string,  
  fileName: string  
): Promise\<string\> {  
  const bucketName \= 'tax-documents';  
  const objectName \= \`${preparerId}/${clientId}/${Date.now()}\-${fileName}\`;  
    
  *// Generate presigned URL (expires in 10 minutes)*  
  const url \= await minioClient.presignedPutObject(  
    bucketName,  
    objectName,  
    10 \* 60  
  );  
    
  return url;  
}

export async function getDocumentDownloadUrl(  
  objectName: string  
): Promise\<string\> {  
  const bucketName \= 'tax-documents';  
    
  *// Generate presigned URL for download (expires in 1 hour)*  
  const url \= await minioClient.presignedGetObject(  
    bucketName,  
    objectName,  
    60 \* 60  
  );  
    
  return url;

}

**Database Schema**:

sql  
CREATE TABLE documents (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  client\_id UUID REFERENCES clients(id) NOT NULL,  
  preparer\_id UUID REFERENCES preparers(id) NOT NULL,  
  filename VARCHAR(255) NOT NULL,  
  original\_filename VARCHAR(255) NOT NULL,  
  minio\_object\_key TEXT NOT NULL,  
  document\_type VARCHAR(50),  
  file\_size INTEGER NOT NULL,  
  mime\_type VARCHAR(100),  
  virus\_scan\_status VARCHAR(20) DEFAULT 'pending',  
  virus\_scan\_result TEXT,  
  uploaded\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
  reviewed BOOLEAN DEFAULT false,  
  reviewed\_at TIMESTAMP  
);

CREATE INDEX idx\_documents\_client ON documents(client\_id);  
CREATE INDEX idx\_documents\_preparer ON documents(preparer\_id);

CREATE INDEX idx\_documents\_type ON documents(document\_type);

---

### **3.4 Epic 4: Communication**

**Goal**: Enable professional client communication

#### **US-401: Email Integration**

**As a** preparer  
 **I want to** email clients professionally  
 **So that** I maintain consistent communication

**Acceptance Criteria**:

* Send from platform (Resend)  
* Professional templates (5) with React Email  
* Track open/click  
* Reply detection  
* Unsubscribe handling

**Email Templates**:

tsx  
*// emails/WelcomeEmail.tsx*  
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
    \<Html\>  
      \<Head /\>  
      \<Preview\>Welcome to {preparerName}'s Tax Services\</Preview\>  
      \<Body style\={main}\>  
        \<Container style\={container}\>  
          \<Heading style\={h1}\>  
            Welcome, {clientName}\!  
          \</Heading\>  
            
          \<Text style\={text}\>  
            Thank you for choosing {preparerName} for your tax preparation needs.  
          \</Text\>

          \<Button style\={button} href\={dashboardUrl}\>  
            View Your Dashboard  
          \</Button\>  
        \</Container\>  
      \</Body\>  
    \</Html\>  
  );

}

**Resend Integration**:

typescript  
*// lib/email.ts*  
import { Resend } from 'resend';  
import { WelcomeEmail } from '@/emails/WelcomeEmail';

const resend \= new Resend(process.env.RESEND\_API\_KEY);

export async function sendWelcomeEmail(  
  client: { name: string; email: string },  
  preparer: { name: string; email: string }  
) {  
  const { data, error } \= await resend.emails.send({  
    from: \`${preparer.name} \<${preparer.email}@mail.taxgenius.com\>\`,  
    to: client.email,  
    subject: \`Welcome to ${preparer.name}'s Tax Services\`,  
    react: WelcomeEmail({  
      clientName: client.name,  
      preparerName: preparer.name,  
      dashboardUrl: \`${process.env.APP\_URL}/client/dashboard\`,  
    }),  
  });

  if (error) {  
    console.error('Email send error:', error);  
    throw new Error('Failed to send email');  
  }

  *// Track email in database*  
  await db.emailLog.create({  
    data: {  
      email\_id: data.id,  
      recipient: client.email,  
      template: 'welcome',  
      status: 'sent',  
    },  
  });

  return data;

}

---

#### **US-402: PWA Push Notifications**

**As a** preparer  
 **I want to** receive instant notifications  
 **So that** I can respond to leads quickly

**Acceptance Criteria**:

* Browser push notifications (free, no SMS costs)  
* New lead notifications  
* Document upload alerts  
* Appointment reminders  
* Works when browser closed  
* Action buttons (View, Dismiss)

**PWA Push Setup**:

typescript  
*// lib/push-notifications.ts*

export async function requestNotificationPermission(): Promise\<boolean\> {  
  if (\!('Notification' in window)) {  
    console.log('This browser does not support notifications');  
    return false;  
  }

  const permission \= await Notification.requestPermission();  
  return permission \=== 'granted';  
}

export async function subscribeToPushNotifications(userId: string) {  
  const registration \= await navigator.serviceWorker.ready;  
    
  const subscription \= await registration.pushManager.subscribe({  
    userVisibleOnly: true,  
    applicationServerKey: process.env.NEXT\_PUBLIC\_VAPID\_PUBLIC\_KEY,  
  });

  *// Save subscription to backend*  
  await fetch('/api/push/subscribe', {  
    method: 'POST',  
    headers: { 'Content-Type': 'application/json' },  
    body: JSON.stringify({ userId, subscription }),  
  });

  return subscription;

}

**Backend Push Sender**:

typescript  
*// lib/send-push.ts*  
import webpush from 'web-push';

webpush.setVapidDetails(  
  'mailto:support@taxgenius.com',  
  process.env.VAPID\_PUBLIC\_KEY\!,  
  process.env.VAPID\_PRIVATE\_KEY\!  
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

---

#### **US-403: Appointment Booking**

**As a** client  
 **I want to** book appointments online  
 **So that** I can meet with my preparer

**Acceptance Criteria**:

* Calendar availability management  
* 30/60 min slots  
* Confirmation emails (Resend)  
* Reminder system (24h \+ 1h before)  
* Rescheduling allowed  
* Timezone conversion

**Database Schema**:

sql  
CREATE TABLE appointments (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  preparer\_id UUID REFERENCES preparers(id) NOT NULL,  
  client\_id UUID REFERENCES clients(id) NOT NULL,  
  scheduled\_at TIMESTAMP NOT NULL,  
  duration\_minutes INTEGER NOT NULL,  
  timezone VARCHAR(50) NOT NULL,  
  type VARCHAR(50) DEFAULT 'consultation',  
  status VARCHAR(20) DEFAULT 'scheduled',  
  meeting\_link TEXT,  
  notes TEXT,  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
  cancelled\_at TIMESTAMP,  
  cancellation\_reason TEXT  
);

CREATE INDEX idx\_appointments\_preparer ON appointments(preparer\_id);  
CREATE INDEX idx\_appointments\_client ON appointments(client\_id);

CREATE INDEX idx\_appointments\_scheduled ON appointments(scheduled\_at);

---

### **3.5 Epic 5: Analytics & Billing**

**Goal**: Track performance and manage subscriptions

#### **US-501: Basic Analytics**

**As a** preparer  
 **I want to** see my business metrics  
 **So that** I can track growth

**Acceptance Criteria**:

* Lead count by source  
* Conversion rate  
* Revenue tracking  
* Client count by stage  
* Monthly/weekly views

**Analytics Schema**:

sql  
CREATE TABLE analytics\_events (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  preparer\_id UUID REFERENCES preparers(id),  
  event\_type VARCHAR(50) NOT NULL,  
  event\_data JSONB,  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

CREATE INDEX idx\_analytics\_preparer ON analytics\_events(preparer\_id);  
CREATE INDEX idx\_analytics\_type ON analytics\_events(event\_type);

CREATE INDEX idx\_analytics\_created ON analytics\_events(created\_at);

**Analytics Dashboard Component**:

tsx  
*// components/AnalyticsDashboard.tsx*

export function AnalyticsDashboard({ preparerId }: { preparerId: string }) {  
  const { data } \= useQuery({  
    queryKey: \['analytics', preparerId\],  
    queryFn: () \=\> fetch(\`/api/analytics/${preparerId}\`).then(r \=\> r.json()),  
  });

  return (  
    \<div className\="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"\>  
      \<MetricCard  
        title\="New Leads"  
        value\={data.leads.total}  
        change\={data.leads.change}  
        icon\={\<UsersIcon /\>}  
      /\>  
      \<MetricCard  
        title\="Conversion Rate"  
        value\={\`${data.conversion.rate}%\`}  
        change\={data.conversion.change}  
        icon\={\<TrendingUpIcon /\>}  
      /\>  
      \<MetricCard  
        title\="Revenue"  
        value\={\`$${data.revenue.total}\`}  
        change\={data.revenue.change}  
        icon\={\<DollarSignIcon /\>}  
      /\>  
      \<MetricCard  
        title\="Active Clients"  
        value\={data.clients.active}  
        change\={data.clients.change}  
        icon\={\<BriefcaseIcon /\>}  
      /\>  
    \</div\>  
  );

}

---

#### **US-502: Subscription Management**

**As a** preparer  
 **I want to** manage my subscription  
 **So that** I can control costs

**Acceptance Criteria**:

* Square Subscriptions API integration  
* Plan selection (Starter/Professional)  
* Payment method update  
* Invoice history  
* Cancel anytime

**Square Integration**:

typescript  
*// lib/square.ts*  
import { Client, Environment } from 'square';

const squareClient \= new Client({  
  accessToken: process.env.SQUARE\_ACCESS\_TOKEN\!,  
  environment: process.env.NODE\_ENV \=== 'production'   
    ? Environment.Production   
    : Environment.Sandbox,  
});

export async function createSubscription(  
  customerId: string,  
  planId: string  
) {  
  const { result } \= await squareClient.subscriptionsApi.createSubscription({  
    locationId: process.env.SQUARE\_LOCATION\_ID\!,  
    customerId,  
    planVariationId: planId,  
  });

  return result.subscription;  
}

export async function updateSubscription(  
  subscriptionId: string,  
  newPlanId: string  
) {  
  const { result } \= await squareClient.subscriptionsApi.updateSubscription(  
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
  const { result } \= await squareClient.subscriptionsApi.cancelSubscription(  
    subscriptionId  
  );

  return result.subscription;

}

**Database Schema**:

sql  
CREATE TABLE subscriptions (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  preparer\_id UUID REFERENCES preparers(id) NOT NULL,  
  square\_subscription\_id VARCHAR(255) UNIQUE NOT NULL,  
  square\_customer\_id VARCHAR(255) NOT NULL,  
  plan VARCHAR(50) NOT NULL,  
  status VARCHAR(50) NOT NULL,  
  current\_period\_start TIMESTAMP,  
  current\_period\_end TIMESTAMP,  
  cancel\_at\_period\_end BOOLEAN DEFAULT false,  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
  updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

CREATE INDEX idx\_subscriptions\_preparer ON subscriptions(preparer\_id);

CREATE INDEX idx\_subscriptions\_square\_id ON subscriptions(square\_subscription\_id);

---

## **4\. TECHNICAL SPECIFICATIONS**

### **4.1 Technology Stack**

yaml  
Frontend:  
  framework: Next.js 14 (App Router)  
  language: TypeScript  
  styling: Tailwind CSS  
  ui\_components: shadcn/ui  
  state: React Context (no Redux for MVP)  
  forms: React Hook Form \+ Zod

Backend:  
  runtime: Node.js 20 LTS  
  framework: Express.js (for webhooks)  
  database: PostgreSQL 15  
  orm: Prisma  
  cache: Redis 7.2  
    
Infrastructure:  
  hosting: Self-hosted VPS  
  orchestration: Docker \+ Coolify  
  storage: MinIO (S3-compatible)  
  cdn: Cloudflare (DNS only)  
  ssl: Let's Encrypt  
    
Integrations:  
  auth: Clerk.com  
  payments: Square \+ Cash App SDK  
  email: Resend

  analytics: Google Analytics 4

### **4.2 Architecture Decisions**

#### **Simple Self-Hosted Architecture**

Internet  
   ↓  
Cloudflare (DNS \+ CDN)  
   ↓  
Your VPS Server  
   ↓  
Coolify (PaaS)  
   ↓  
Nginx (Reverse Proxy \+ SSL)  
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

#### **Database Schema (Core Tables Only)**

sql  
*\-- Core tables for MVP*  
CREATE TABLE preparers (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  clerk\_user\_id VARCHAR(255) UNIQUE NOT NULL,  
  email VARCHAR(255) UNIQUE NOT NULL,  
  name VARCHAR(255) NOT NULL,  
  slug VARCHAR(255) UNIQUE NOT NULL,  
  phone VARCHAR(20),  
  photo\_url TEXT,  
  bio TEXT,  
  credentials JSONB,  
  service\_areas TEXT\[\],  
  pricing JSONB,  
  template VARCHAR(50) DEFAULT 'professional',  
  subscription\_status VARCHAR(50) DEFAULT 'trial',  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
  updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

CREATE TABLE leads (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  preparer\_id UUID REFERENCES preparers(id) NOT NULL,  
  name VARCHAR(255) NOT NULL,  
  email VARCHAR(255) NOT NULL,  
  phone VARCHAR(20),  
  zip\_code VARCHAR(10),  
  employment\_type VARCHAR(50),  
  urgency VARCHAR(20),  
  score INTEGER DEFAULT 50,  
  status VARCHAR(20) DEFAULT 'new',  
  source VARCHAR(50),  
  referral\_code VARCHAR(50),  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
  contacted\_at TIMESTAMP,  
  converted\_at TIMESTAMP  
);

CREATE TABLE clients (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  preparer\_id UUID REFERENCES preparers(id) NOT NULL,  
  lead\_id UUID REFERENCES leads(id),  
  name VARCHAR(255) NOT NULL,  
  email VARCHAR(255) NOT NULL,  
  phone VARCHAR(20),  
  pipeline\_stage VARCHAR(50) DEFAULT 'new',  
  tags TEXT\[\],  
  notes TEXT,  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,  
  updated\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

CREATE TABLE documents (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  client\_id UUID REFERENCES clients(id) NOT NULL,  
  preparer\_id UUID REFERENCES preparers(id) NOT NULL,  
  filename VARCHAR(255) NOT NULL,  
  minio\_object\_key TEXT NOT NULL,  
  file\_size INTEGER NOT NULL,  
  document\_type VARCHAR(50),  
  uploaded\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

CREATE TABLE appointments (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  preparer\_id UUID REFERENCES preparers(id) NOT NULL,  
  client\_id UUID REFERENCES clients(id) NOT NULL,  
  scheduled\_at TIMESTAMP NOT NULL,  
  duration\_minutes INTEGER NOT NULL,  
  status VARCHAR(20) DEFAULT 'scheduled',  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

CREATE TABLE subscriptions (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  preparer\_id UUID REFERENCES preparers(id) NOT NULL,  
  square\_subscription\_id VARCHAR(255) UNIQUE NOT NULL,  
  plan VARCHAR(50) NOT NULL,  
  status VARCHAR(50) NOT NULL,  
  created\_at TIMESTAMP DEFAULT CURRENT\_TIMESTAMP  
);

*\-- Essential Indexes*  
CREATE INDEX idx\_preparers\_slug ON preparers(slug);  
CREATE INDEX idx\_leads\_preparer ON leads(preparer\_id);  
CREATE INDEX idx\_leads\_status ON leads(status);  
CREATE INDEX idx\_clients\_preparer ON clients(preparer\_id);  
CREATE INDEX idx\_clients\_stage ON clients(pipeline\_stage);  
CREATE INDEX idx\_documents\_client ON documents(client\_id);

CREATE INDEX idx\_appointments\_preparer ON appointments(preparer\_id);

### **4.3 Security Requirements**

* SSL for all connections (Let's Encrypt via Coolify)  
* Authentication via Clerk.com (no password handling)  
* JWT token verification on every API call  
* File upload virus scanning (ClamAV)  
* Rate limiting (100 req/min per IP)  
* CORS properly configured  
* MinIO presigned URLs with 10-min expiry  
* SQL injection prevention (Prisma parameterized queries)  
* XSS protection (React auto-escaping \+ CSP headers)

---

## **5\. UI/UX SPECIFICATIONS**

### **5.1 Design Principles**

* **Simple**: No training required  
* **Fast**: Every action \< 3 clicks  
* **Mobile-First**: 60% mobile usage expected  
* **Professional**: Build trust immediately  
* **Accessible**: WCAG 2.1 AA minimum

### **5.2 Key Screens**

#### **Dashboard (Preparer View)**

┌────────────────────────────────────┐  
│  Welcome, \[Name\]\!                  │  
│                                     │  
│  New Leads        Active Clients   │  
│  \[  12  \]         \[  47  \]        │  
│                                     │  
│  This Week's Revenue               │  
│  $3,450                            │  
│                                     │  
│  Quick Actions:                    │  
│  \[+ Add Client\] \[View Website\]     │  
│  \[Send Email\]   \[View Analytics\]   │

└────────────────────────────────────┘

#### **Website Builder**

┌────────────────────────────────────┐  
│  Choose Your Template              │  
│                                     │  
│  \[Professional\] \[Modern\] \[Classic\] │  
│                                     │  
│  Customize:                        │  
│  \- Business Name: \[\_\_\_\_\_\_\_\_\_\_\_\]    │  
│  \- Tagline: \[\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\]      │  
│  \- Primary Color: \[■\]              │  
│                                     │  
│  Preview:                          │  
│  \[────────────────\]                │  
│  │                │                │  
│  │  Your Preview  │                │  
│  │                │                │  
│  \[────────────────\]                │  
│                                     │  
│  \[Save & Publish\]                  │

└────────────────────────────────────┘

#### **Pipeline View (Kanban)**

┌───────┬───────┬───────┬───────┬───────┐  
│  New  │Contact│ Docs  │Prepare│Complete│  
│  (5)  │  (8)  │ (12)  │  (3)  │  (47) │  
├───────┼───────┼───────┼───────┼───────┤  
│┌─────┐│┌─────┐│┌─────┐│┌─────┐│┌─────┐│  
││John ││││Maria││││Tom  ││││Lisa ││││Past││  
││Doe  ││││Smith││││Brown││││Jones││││    ││  
│└─────┘│└─────┘│└─────┘│└─────┘│└─────┘│  
│       │       │       │       │       │  
│┌─────┐│┌─────┐│┌─────┐│       │       │  
││Jane ││││Bob  ││││Amy  ││       │       │  
││Smith││││Wilson││││Lee ││       │       │  
│└─────┘│└─────┘│└─────┘│       │       │

└───────┴───────┴───────┴───────┴───────┘

### **5.3 Mobile Experience**

* Responsive breakpoints: 320px, 768px, 1024px  
* Touch-optimized buttons (44px minimum)  
* Swipe gestures for pipeline navigation  
* Camera integration for document upload  
* Click-to-call functionality  
* PWA installable on iOS/Android

### **5.4 Color Scheme**

css  
:root {  
  \--primary: \#2563eb; */\* Blue \*/*  
  \--secondary: \#f59e0b; */\* Amber \*/*  
  \--success: \#10b981; */\* Green \*/*  
  \--danger: \#ef4444; */\* Red \*/*  
  \--warning: \#f59e0b; */\* Amber \*/*  
  \--background: \#ffffff;  
  \--foreground: \#1f2937;  
  \--muted: \#f3f4f6;  
  \--border: \#e5e7eb;

}

---

## **6\. DEVELOPMENT PLAN**

### **6.1 Sprint Plan (2-Week Sprints)**

#### **Sprint 1-2: Foundation (Weeks 1-4)**

* VPS setup with Coolify  
* PostgreSQL \+ Redis \+ MinIO setup  
* Next.js project initialization  
* Clerk.com authentication integration  
* Basic UI components (shadcn/ui)  
* Database schema implementation (Prisma)  
* CI/CD pipeline (GitHub Actions)

#### **Sprint 3-4: Core Features (Weeks 5-8)**

* Preparer onboarding flow  
* Profile management  
* Website generation (3 templates)  
* Lead capture forms  
* Lead routing logic  
* Basic CRM (client list)  
* MinIO file upload integration

#### **Sprint 5-6: Integration & Polish (Weeks 9-12)**

* Square Subscriptions integration  
* Resend email integration  
* PWA push notifications  
* Appointment booking system  
* Analytics dashboard  
* Pipeline kanban board  
* Document management UI  
* Bug fixes and testing  
* Performance optimization  
* Security audit

### **6.2 Team Structure**

Product Manager (1)  
├── Frontend Developer (2)  
├── Backend Developer (2)  
├── UI/UX Designer (1)  
├── QA Tester (1)  
└── DevOps Engineer (0.5)

Total: 7.5 FTE

### **6.3 Development Standards**

* Code reviews required for all PRs  
* 80% test coverage minimum  
* TypeScript strict mode enabled  
* ESLint \+ Prettier configuration  
* Documentation for all APIs  
* Daily standups (15 min)  
* Weekly demos to stakeholders

### **6.4 Git Workflow**

main (production)  
  ├── staging (pre-production)  
  │   ├── develop (integration)  
  │   │   ├── feature/onboarding  
  │   │   ├── feature/crm  
  │   │   └── feature/payments

  │   └── hotfix/critical-bug

---

## **7\. TESTING PLAN**

### **7.1 Testing Strategy**

* **Unit Tests**: 80% coverage (Jest \+ React Testing Library)  
* **Integration Tests**: API endpoints (Supertest)  
* **E2E Tests**: Critical user flows (Playwright)  
* **Performance Tests**: Load testing (K6)  
* **Security Tests**: OWASP Top 10 (Manual \+ OWASP ZAP)

### **7.2 Test Scenarios (Critical Path)**

1. **Complete Preparer Onboarding**  
   * Sign up with email  
   * Verify email  
   * Complete profile  
   * Generate website  
   * Website is live  
2. **Lead Submission & Routing**  
   * Client submits form  
   * Lead assigned to preparer  
   * Preparer receives email  
   * Preparer receives push notification  
   * Lead appears in dashboard  
3. **Document Upload & Download**  
   * Client uploads document to MinIO  
   * Virus scan completes  
   * Preparer sees document  
   * Preparer downloads document  
   * Download URL expires correctly  
4. **Subscription Management**  
   * Preparer selects plan  
   * Square payment processes  
   * Subscription activates  
   * Features unlock  
   * Invoice generated  
5. **Client Pipeline**  
   * Convert lead to client  
   * Move through pipeline stages  
   * Send automated emails  
   * Schedule appointment  
   * Mark complete

### **7.3 Acceptance Testing**

* 10 beta preparers (friendly users)  
* 2-week beta period (Dec 16-29)  
* Daily feedback sessions  
* Bug tracking in GitHub Issues  
* Launch criteria: \<5 critical bugs, \<20 major bugs

## **8\. LAUNCH PLAN**

### **8.1 Soft Launch (Week 11: Jan 2-8, 2025\)**

* 10 beta users (friendly preparers)  
* Limited geographic area (Atlanta, GA)  
* Full feature access  
* Daily monitoring and support  
* Rapid iteration based on feedback

### **8.2 Public Launch (Week 13: Jan 15, 2025\)**

* ProductHunt launch  
* Social media campaign (LinkedIn, Facebook, Instagram)  
* Email to waitlist (500+ signups)  
* PR outreach to tax industry publications  
* Referral program activated

### **8.3 Launch Day Checklist**

Day Before:  
\- \[ \] Final deployment to production  
\- \[ \] Database backups verified  
\- \[ \] SSL certificates confirmed  
\- \[ \] All integrations tested (Square, Clerk, Resend, MinIO)  
\- \[ \] Monitoring alerts configured  
\- \[ \] Support team briefed  
\- \[ \] Emergency contacts list finalized

Launch Day (Jan 15):  
06:00 \- Final system check  
07:00 \- Go live  
08:00 \- Marketing campaigns activate  
09:00 \- Monitor dashboard for issues  
10:00 \- First client check-in  
12:00 \- Team sync meeting  
14:00 \- Performance review  
17:00 \- End of day report

Post-Launch:  
\- \[ \] 24/7 on-call rotation (first week)  
\- \[ \] Daily metrics review  
\- \[ \] User feedback collection

\- \[ \] Bug triage and fixes

### **8.4 Launch Metrics (Week 1 Targets)**

* Day 1: 50 signups  
* Day 3: 100 signups  
* Week 1: 200 total signups  
* Week 1: 50 websites created  
* Week 1: 100 leads generated  
* Week 1: 95% uptime  
* Week 1: \<2% error rate

---

## **9\. POST-MVP ROADMAP**

### **9.1 Month 4-6 Additions**

1. **Marketing Content Library**  
   * 20 social media posts per week  
   * 10 email templates per month  
   * Blog articles  
   * Video scripts  
2. **Advanced Analytics**  
   * Revenue forecasting  
   * Client lifetime value  
   * Lead source ROI  
   * Comparative benchmarks  
3. **Automation Workflows**  
   * Welcome sequences  
   * Document reminders  
   * Review requests  
   * Birthday greetings  
4. **Team Management**  
   * Multi-preparer accounts  
   * Lead distribution  
   * Performance tracking  
   * Commission splitting  
5. **Mobile App** (React Native)  
   * iOS and Android apps  
   * Push notifications  
   * Document scanning  
   * On-the-go client management

### **9.2 Month 7-12 Expansion**

1. **Marketing Materials Store**  
   * Business cards ($39.99/250)  
   * Flyers ($49.99/100)  
   * Yard signs ($29.99 each)  
   * T-shirts/polos ($19.99-44.99)  
2. **White-Label Options**  
   * Custom branding  
   * Custom domain  
   * Remove Tax Genius branding  
   * Franchise-ready  
3. **API Platform**  
   * Public REST API  
   * Webhooks  
   * Third-party integrations  
   * Developer portal  
4. **AI Assistants**  
   * Chatbot for clients  
   * Document OCR  
   * Auto-categorization  
   * Smart scheduling  
5. **International Markets**  
   * Canadian tax preparers  
   * UK tax preparers  
   * Multi-currency support  
   * Localization

### **9.3 Feature Prioritization Matrix**

        High Impact  
             ↑  
    \[Marketing\] \[Analytics\]  
    \[Library  \] \[Dashboard \]  
      
    \[Mobile   \] \[API      \]  
    \[App      \] \[Platform \]  
             ↑  
         Low Impact

    ← Low Effort → High Effort

---

## **10\. RISKS & MITIGATION**

### **10.1 Technical Risks**

| Risk | Probability | Impact | Mitigation |
| ----- | ----- | ----- | ----- |
| MinIO storage failure | Low | High | Daily backups, S3 migration plan ready |
| Clerk.com outage | Low | Critical | Status page monitoring, fallback plan |
| Square API downtime | Low | High | Payment queue, manual processing backup |
| Database performance | Medium | Medium | Query optimization, Redis caching |
| VPS downtime | Low | High | Automated backups, quick restore procedure |

### **10.2 Business Risks**

| Risk | Probability | Impact | Mitigation |
| ----- | ----- | ----- | ----- |
| Low adoption | Medium | High | Free trial, money-back guarantee, referral program |
| Price resistance | Medium | Medium | Value-based pricing, ROI calculator |
| Seasonality | High | Medium | Annual contracts, off-season discounts |
| Competition | High | Medium | Rapid innovation, superior UX, lower price |
| Preparer quality | Medium | Medium | Vetting process, training, performance monitoring |

### **10.3 Go/No-Go Criteria**

**GO if**:

* ✅ All P0 features working  
* ✅ \<10 critical bugs  
* ✅ Payment processing 100% functional  
* ✅ 10+ beta users satisfied (NPS \>40)  
* ✅ Performance targets met (page load \<2s)  
* ✅ Security audit passed  
* ✅ 99% uptime in staging for 1 week

**NO-GO if**:

* ❌ Security vulnerabilities discovered  
* ❌ \>20% payment failure rate  
* ❌ Page load \>5 seconds  
* ❌ Data loss incidents  
* ❌ Legal/compliance concerns unresolved  
* ❌ Negative feedback from \>50% of beta users

---

## **11\. SUCCESS METRICS**

### **11.1 Week 1 Targets**

* 200 signups  
* 50 websites created  
* 100 leads generated  
* 20 paying customers  
* 95% uptime  
* \<2% error rate  
* \<1 hour lead response time (avg)

### **11.2 Month 1 Targets**

* 500 total signups  
* 100 paying customers  
* 1,000 leads generated  
* $10K MRR ($15K total revenue)  
* 4.0+ user satisfaction score  
* \<5% monthly churn rate

### **11.3 Month 3 Targets (Success Criteria)**

* 1,000 total signups  
* 200 paying customers  
* 5,000 leads generated  
* $20K MRR ($50K total revenue)  
* 60% activation rate (signup → active user)  
* 4.5+ user satisfaction score  
* 25% lead-to-client conversion rate

### **11.4 Monitoring Dashboard**

typescript  
*// Key metrics to track daily*  
interface DailyMetrics {  
  *// Growth*  
  new\_signups: number;  
  new\_paying\_customers: number;  
  churned\_customers: number;  
    
  *// Engagement*  
  active\_users: number;  
  websites\_created: number;  
  leads\_generated: number;  
  leads\_converted: number;  
    
  *// Revenue*  
  mrr: number;  
  new\_mrr: number;  
  churned\_mrr: number;  
    
  *// Performance*  
  avg\_page\_load\_time: number;  
  api\_error\_rate: number;  
  uptime\_percentage: number;  
    
  *// Support*  
  support\_tickets\_opened: number;  
  support\_tickets\_resolved: number;  
  avg\_resolution\_time: number;

}

---

## **12\. BUDGET BREAKDOWN**

### **12.1 Development Costs (12 weeks)**

Personnel (70%):         $122,500  
\- Frontend Devs (2):      $40,000  
\- Backend Devs (2):       $40,000  
\- Designer (1):           $20,000  
\- PM (1):                 $12,500  
\- QA (1):                 $10,000

Infrastructure (15%):     $26,250  
\- VPS Hosting (3 months):  $1,500  
\- MinIO Storage:            $500  
\- Development tools:       $2,000  
\- Testing/QA tools:        $2,000  
\- Security audit:          $5,000  
\- DevOps setup:           $15,250

Marketing (10%):          $17,500  
\- Beta user incentives:    $5,000  
\- Launch campaign:        $10,000  
\- Content creation:        $2,500

Buffer (5%):              $8,750

TOTAL:                   $175,000

### **12.2 Monthly Operating Costs (Post-Launch)**

Infrastructure:           $2,000  
\- VPS (16GB RAM, 8 CPU):   $100  
\- MinIO storage (1TB):     $50  
\- Bandwidth:               $50  
\- Backups:                 $30  
\- Monitoring:              $20

Third-party services:     $1,500  
\- Clerk.com (1000 MAU):    $25  
\- Resend (50k emails):     $20  
\- Square fees (avg):      $500  
\- Domain \+ SSL:            $10  
\- Analytics:              $945

Support:                  $3,000  
\- Customer support (PT):  $2,000  
\- Bug fixes/maintenance:  $1,000

Marketing:                $2,000  
\- Paid ads:              $1,500  
\- Content creation:        $500

TOTAL:                    $8,500/month

### **12.3 Break-Even Analysis**

Development cost:         $175,000  
Monthly operating costs:    $8,500  
Average revenue per user:    $100  
Monthly revenue needed:     $8,500 (85 customers)  
Break-even customers:         250 (includes dev cost)  
Timeline:                 Month 4-5

Calculation:  
$175,000 / ($100 \- $8.50 operating cost per user) \= 1,913 customer-months  
1,913 / 85 customers per month \= \~22 months to full break-even

But with growth: \~4-5 months to operational break-even

---

## **APPENDIX**

### **A. Competitive MVP Comparison**

| Feature | Tax Genius | TaxDome | Canopy |
| ----- | ----- | ----- | ----- |
| Setup time | 60 seconds | 2 hours | 1 hour |
| Price | $49-149 | $200+ | $150+ |
| Website included | Yes | No | No |
| Lead generation | Yes | Limited | No |
| Learning curve | 30 min | 2 days | 1 day |
| Self-hosted option | Yes | No | No |
| Data sovereignty | Yes | No | No |

### **B. Technology Alternatives Considered**

* **WordPress**: Too complex for users, security concerns  
* **Wix/Squarespace**: Not tax-specific, can't extend functionality  
* **Custom CMS**: Too expensive and slow to build  
* **No-code tools**: Limited customization, vendor lock-in  
* **AWS S3**: Chose MinIO for data sovereignty and cost control  
* **Stripe**: Chose Square for better small business support \+ Cash App

### **C. Key Assumptions**

1. Preparers will pay for convenience and lead generation  
2. Tax season (Jan-Apr) drives urgency and signups  
3. Professional appearance significantly matters to clients  
4. Lead generation is the primary pain point for preparers  
5. Simple beats feature-rich for tax preparer market  
6. Self-hosted model appeals to privacy-conscious preparers  
7. 60% of traffic will be mobile  
8. Average preparer handles 100-200 returns/year  
9. 25% lead-to-client conversion rate is achievable  
10. Referral program will drive organic growth

### **D. Environment Variables**

bash  
*\# .env.local*

*\# Database*  
DATABASE\_URL=postgresql://user:pass@localhost:5432/taxgenius  
REDIS\_URL=redis://localhost:6379

*\# Authentication (Clerk.com)*  
NEXT\_PUBLIC\_CLERK\_PUBLISHABLE\_KEY=pk\_test\_xxxxx  
CLERK\_SECRET\_KEY=sk\_test\_xxxxx  
CLERK\_WEBHOOK\_SECRET=whsec\_xxxxx

*\# Payments (Square)*  
SQUARE\_ACCESS\_TOKEN=sq0atp-xxxxx  
SQUARE\_LOCATION\_ID=xxxxx  
SQUARE\_WEBHOOK\_SIGNATURE\_KEY=xxxxx  
NEXT\_PUBLIC\_SQUARE\_APPLICATION\_ID=sq0idp-xxxxx

*\# Email (Resend)*  
RESEND\_API\_KEY=re\_xxxxx  
RESEND\_WEBHOOK\_SECRET=whsec\_xxxxx

*\# Storage (MinIO)*  
MINIO\_ENDPOINT=minio.yourdomain.com  
MINIO\_PORT=9000  
MINIO\_USE\_SSL=true  
MINIO\_ACCESS\_KEY=xxxxx  
MINIO\_SECRET\_KEY=xxxxx

*\# PWA Push Notifications*  
NEXT\_PUBLIC\_VAPID\_PUBLIC\_KEY=xxxxx  
VAPID\_PRIVATE\_KEY=xxxxx

*\# App Config*  
NEXT\_PUBLIC\_APP\_URL=https://app.taxgenius.com

NODE\_ENV=production

---

## **Document Control**

**Author**: Product Team  
 **Review Date**: December 15, 2024  
 **Launch Date**: January 15, 2025  
 **Status**: Ready for Development

**Next Review**: January 1, 2025 (Pre-launch checkpoint)

**Approved By**:

* Product Manager  
* Engineering Lead  
* CTO  
* CEO

