# Third-Party Services

**Parent:** [Tech Stack](./README.md)
**Last Updated:** October 9, 2025

---

## Overview

The Tax Genius platform integrates with several third-party services for authentication, email, payments, and AI-powered content generation.

---

## Authentication Service

### Clerk.com

**Status:** 🔄 Implementing

| Feature | Details |
|---------|---------|
| **Plan** | Pro ($25/mo for 1000 MAU) |
| **Free Tier** | 10,000 MAU |
| **Features** | Email/password, magic link, OAuth, MFA, webhooks |
| **Package** | `@clerk/nextjs` |

**Features:**
- ✅ Email/password authentication
- ✅ Magic link (passwordless) login
- ✅ OAuth providers (Google, GitHub, Microsoft)
- ✅ Multi-factor authentication (MFA)
- ✅ Built-in user management dashboard
- ✅ Session management
- ✅ Webhooks for user events
- ✅ Role-based access control
- ✅ User profile management

**Installation:**
```bash
npm install @clerk/nextjs
```

**Configuration:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

**Documentation:** [Authentication](./authentication.md)

---

## Email Service

### Resend

**Status:** ✅ Package installed, activating

| Feature | Details |
|---------|---------|
| **Plan** | Free tier (3000 emails/mo), Pro ($20/mo for 50k) |
| **Features** | React Email templates, webhooks, analytics |
| **Package** | `resend@6.0.3` |
| **Templates** | `@react-email/components@0.5.3` |

**Key Features:**
- ✅ Modern API design
- ✅ React-based email templates
- ✅ High deliverability rates
- ✅ Real-time webhooks
- ✅ Email analytics and tracking
- ✅ Custom domains
- ✅ DKIM, SPF, DMARC support

**Installation:**
```bash
npm install resend @react-email/components
```

**Configuration:**
```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@taxgeniuspro.tax
```

**Basic Usage:**
```typescript
// lib/email/client.ts
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
```

**Sending Email:**
```typescript
// lib/email/send.ts
import { resend } from './client';
import { WelcomeEmail } from '@/emails/welcome';

export async function sendWelcomeEmail(to: string, name: string) {
  const { data, error } = await resend.emails.send({
    from: 'Tax Genius <noreply@taxgeniuspro.tax>',
    to,
    subject: 'Welcome to Tax Genius',
    react: WelcomeEmail({ name }),
  });

  if (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }

  return data;
}
```

**React Email Template:**
```typescript
// emails/welcome.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Tax Genius!</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Thank you for joining Tax Genius. We're excited to help you
            with your tax preparation needs.
          </Text>
          <Button
            href="https://taxgeniuspro.tax/dashboard"
            style={button}
          >
            Get Started
          </Button>
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
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px',
};
```

**Webhook Handling:**
```typescript
// app/api/webhooks/resend/route.ts
export async function POST(req: Request) {
  const payload = await req.json();

  const { type, data } = payload;

  switch (type) {
    case 'email.sent':
      console.log('Email sent:', data);
      break;
    case 'email.delivered':
      console.log('Email delivered:', data);
      break;
    case 'email.bounced':
      console.error('Email bounced:', data);
      break;
    case 'email.complained':
      console.error('Spam complaint:', data);
      break;
  }

  return Response.json({ success: true });
}
```

**Email Types:**
- Welcome emails
- Password reset
- Email verification
- Document upload notifications
- Appointment reminders
- Referral notifications
- Monthly statements

---

## Payment Service

### Square

**Status:** ✅ Active

| Feature | Details |
|---------|---------|
| **Package** | `square@43.0.2` |
| **Fees** | 2.9% + 30¢ per transaction |
| **Features** | Payment processing, subscriptions, webhooks |

**Key Features:**
- ✅ Credit/debit card processing
- ✅ ACH bank transfers
- ✅ Subscription management
- ✅ Invoice generation
- ✅ Webhook events
- ✅ PCI compliance (Level 1)
- ✅ Fraud detection
- ✅ Refund management

**Installation:**
```bash
npm install square
```

**Configuration:**
```env
SQUARE_ACCESS_TOKEN=sq0atp-...
SQUARE_ENVIRONMENT=production  # or sandbox
SQUARE_APPLICATION_ID=sq0idp-...
SQUARE_LOCATION_ID=L...
```

**Client Setup:**
```typescript
// lib/square/client.ts
import { Client, Environment } from 'square';

export const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN!,
  environment: process.env.SQUARE_ENVIRONMENT === 'production'
    ? Environment.Production
    : Environment.Sandbox,
});
```

**Payment Processing:**
```typescript
// lib/square/payments.ts
import { squareClient } from './client';
import { randomUUID } from 'node:crypto';

export async function processPayment(
  amount: number,
  sourceId: string,
  customerId?: string
) {
  const { result } = await squareClient.paymentsApi.createPayment({
    sourceId,
    idempotencyKey: randomUUID(),
    amountMoney: {
      amount: BigInt(amount * 100), // Convert dollars to cents
      currency: 'USD',
    },
    customerId,
    locationId: process.env.SQUARE_LOCATION_ID,
  });

  return result.payment;
}
```

**Subscription Management:**
```typescript
// lib/square/subscriptions.ts
import { squareClient } from './client';

export async function createSubscription(
  customerId: string,
  planId: string,
  cardId: string
) {
  const { result } = await squareClient.subscriptionsApi.createSubscription({
    locationId: process.env.SQUARE_LOCATION_ID!,
    planId,
    customerId,
    cardId,
  });

  return result.subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  const { result } = await squareClient.subscriptionsApi.cancelSubscription(
    subscriptionId
  );

  return result.subscription;
}
```

**Webhook Handling:**
```typescript
// app/api/webhooks/square/route.ts
import { squareClient } from '@/lib/square/client';

export async function POST(req: Request) {
  const signature = req.headers.get('x-square-signature');
  const body = await req.text();

  // Verify webhook signature
  const isValid = squareClient.webhooksHelper.isValidWebhookEventSignature(
    body,
    signature!,
    process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!,
    req.url
  );

  if (!isValid) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  switch (event.type) {
    case 'payment.updated':
      // Handle payment update
      break;
    case 'subscription.updated':
      // Handle subscription update
      break;
    case 'invoice.payment_made':
      // Handle invoice payment
      break;
  }

  return Response.json({ success: true });
}
```

---

## Real-time Communication

### Socket.io

**Status:** ✅ Active

| Feature | Details |
|---------|---------|
| **Package** | `socket.io@4.8.1` |
| **Purpose** | Live notifications, real-time updates |
| **Transport** | WebSocket, HTTP long-polling |

**Key Features:**
- ✅ Real-time bidirectional communication
- ✅ Automatic reconnection
- ✅ Room-based messaging
- ✅ Event broadcasting
- ✅ Namespace support

**Server Setup:**
```typescript
// lib/socket/server.ts
import { Server } from 'socket.io';
import { createServer } from 'http';

export function initSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}
```

**Client Setup:**
```typescript
// lib/socket/client.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      autoConnect: true,
      reconnection: true,
    });
  }
  return socket;
}
```

**Usage Example:**
```typescript
// components/notifications.tsx
'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket/client';

export function NotificationListener() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  return (
    <div>
      {notifications.map((notif) => (
        <div key={notif.id}>{notif.message}</div>
      ))}
    </div>
  );
}
```

### Web Push

**Status:** ✅ Active

| Feature | Details |
|---------|---------|
| **Package** | `web-push@3.6.7` |
| **Purpose** | PWA push notifications |

**Setup:**
```typescript
// lib/push/setup.ts
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:admin@taxgeniuspro.tax',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export { webpush };
```

**Send Notification:**
```typescript
// lib/push/send.ts
import { webpush } from './setup';

export async function sendPushNotification(
  subscription: any,
  payload: any
) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
  } catch (error) {
    console.error('Push notification error:', error);
  }
}
```

---

## AI Services

### Google Gemini API

**Status:** 📋 To implement

| Feature | Details |
|---------|---------|
| **Plan** | Pay-as-you-go |
| **Pricing** | ~$0.01 per 1000 tokens |
| **Purpose** | Landing page content generation |

**Installation:**
```bash
npm install @google/generative-ai
```

**Configuration:**
```env
GOOGLE_GEMINI_API_KEY=AIzaSy...
```

**Basic Usage:**
```typescript
// lib/ai/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function generateContent(prompt: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}
```

**Landing Page Generation:**
```typescript
// lib/ai/landing-page.ts
import { generateContent } from './gemini';

export async function generateLandingPageContent(city: string, state: string) {
  const prompt = `
    Generate SEO-optimized content for a tax preparation service landing page for ${city}, ${state}.

    Include:
    1. Hero headline (60 characters max)
    2. Hero subheadline (120 characters max)
    3. Meta description (155 characters max)
    4. 3 key benefits (50 characters each)
    5. Call-to-action text (30 characters)

    Format as JSON.
  `;

  const content = await generateContent(prompt);
  return JSON.parse(content);
}
```

### Alternative: Claude API (Anthropic)

**Status:** 📋 Optional

| Feature | Details |
|---------|---------|
| **Plan** | Pay-as-you-go |
| **Purpose** | Backup LLM provider |

**Installation:**
```bash
npm install @anthropic-ai/sdk
```

---

## Service Cost Analysis

### Monthly Costs

| Service | Plan | Monthly Cost | Notes |
|---------|------|--------------|-------|
| **Clerk** | Pro (1000 MAU) | $25 | Free tier: 10k MAU |
| **Resend** | Pro (50k emails) | $20 | Free tier: 3k emails |
| **Square** | Pay-per-transaction | Variable | 2.9% + 30¢ per transaction |
| **Socket.io** | Self-hosted | $0 | Included in VPS |
| **Web Push** | Self-hosted | $0 | No cost |
| **Google Gemini** | Pay-per-use | $2-4 | For 200 landing pages |
| **Total** | | **~$47-50** | Plus transaction fees |

### Cost Optimization

1. **Email:**
   - Use free tier (3k emails/mo) during MVP
   - Upgrade to Pro when needed

2. **Authentication:**
   - Use free tier (10k MAU) during MVP
   - Upgrade when approaching limit

3. **AI Content:**
   - Generate all landing pages upfront ($4-8 one-time)
   - Minimal ongoing costs for updates

---

## Related Documentation

- [Tech Stack Overview](./README.md)
- [Authentication Setup](./authentication.md)
- [Infrastructure](./infrastructure.md)
- [Development Workflow](./development.md)

---

**Document Status:** ✅ Active
