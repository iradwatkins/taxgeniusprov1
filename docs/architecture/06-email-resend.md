# Tax Genius Platform - Email Architecture (Resend)

**Version:** 3.0 FINAL
**Date:** October 9, 2025
**Status:** Active - Single Source of Truth
**Part:** 6 of 11

[↑ Back to Architecture Index](./README.md)

---

## 8. Email Architecture (Resend)

### 8.1 Email Service

```typescript
// src/lib/services/email.service.ts
import { Resend } from 'resend';
import { render } from '@react-email/components';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(
  to: string,
  data: { name: string; dashboardUrl: string }
) {
  const { data: result, error } = await resend.emails.send({
    from: 'Tax Genius <noreply@taxgeniuspro.tax>',
    to,
    subject: 'Welcome to Tax Genius!',
    react: WelcomeEmail(data),
  });

  if (error) {
    throw new Error(`Email send failed: ${error.message}`);
  }

  return result;
}
```

### 8.2 Email Templates (React Email)

```tsx
// emails/WelcomeEmail.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from '@react-email/components';

export function WelcomeEmail({ name, dashboardUrl }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome, {name}!</Heading>
          <Text style={text}>
            Thank you for joining Tax Genius. Get started by accessing your dashboard.
          </Text>
          <Button href={dashboardUrl} style={button}>
            Go to Dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## Email Service Implementation

### Complete Email Service

```typescript
// src/lib/services/email.service.ts
import { Resend } from 'resend';
import {
  WelcomeEmail,
  DocumentUploadedEmail,
  ReferralConvertedEmail,
  PaymentConfirmationEmail,
} from '@/emails';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Tax Genius <noreply@taxgeniuspro.tax>';
const REPLY_TO = 'support@taxgeniuspro.tax';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions) {
  const { to, subject, react, replyTo = REPLY_TO } = options;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      react,
      replyTo,
    });

    if (error) {
      console.error('Email send error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.info('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
}

// Welcome email for new users
export async function sendWelcomeEmail(
  to: string,
  data: { name: string; role: string; dashboardUrl: string }
) {
  return sendEmail({
    to,
    subject: 'Welcome to Tax Genius!',
    react: WelcomeEmail(data),
  });
}

// Document uploaded notification
export async function sendDocumentUploadedEmail(
  to: string,
  data: { clientName: string; documentName: string; viewUrl: string }
) {
  return sendEmail({
    to,
    subject: 'New Document Uploaded',
    react: DocumentUploadedEmail(data),
  });
}

// Referral converted notification
export async function sendReferralConvertedEmail(
  to: string,
  data: { referrerName: string; clientName: string; commission: number }
) {
  return sendEmail({
    to,
    subject: 'Congratulations! Your referral converted',
    react: ReferralConvertedEmail(data),
  });
}

// Payment confirmation
export async function sendPaymentConfirmationEmail(
  to: string,
  data: { amount: number; receiptUrl: string; date: string }
) {
  return sendEmail({
    to,
    subject: 'Payment Confirmation',
    react: PaymentConfirmationEmail(data),
  });
}

// Password reset email
export async function sendPasswordResetEmail(
  to: string,
  data: { name: string; resetUrl: string }
) {
  return sendEmail({
    to,
    subject: 'Reset Your Password',
    react: PasswordResetEmail(data),
  });
}
```

---

## Email Templates

### Welcome Email Template

```tsx
// emails/WelcomeEmail.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
  Hr,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  role: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ name, role, dashboardUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Tax Genius, {name}!</Heading>

          <Text style={text}>
            Thank you for joining Tax Genius as a {role}. We're excited to have you on board!
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardUrl}>
              Go to Your Dashboard
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            If you have any questions, feel free to reach out to our support team.
          </Text>

          <Text style={footer}>
            Best regards,<br />
            The Tax Genius Team
          </Text>
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
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'left' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '24px',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};
```

### Document Uploaded Email Template

```tsx
// emails/DocumentUploadedEmail.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
} from '@react-email/components';

interface DocumentUploadedEmailProps {
  clientName: string;
  documentName: string;
  viewUrl: string;
}

export function DocumentUploadedEmail({
  clientName,
  documentName,
  viewUrl,
}: DocumentUploadedEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Document Uploaded</Heading>

          <Text style={text}>
            {clientName} has uploaded a new document: <strong>{documentName}</strong>
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={viewUrl}>
              View Document
            </Button>
          </Section>

          <Text style={footer}>
            You can access this document anytime from your dashboard.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles omitted for brevity (same as WelcomeEmail)
```

---

## Webhook Integration

### Resend Webhook Handler

```typescript
// src/app/api/webhooks/resend/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('svix-signature');
  const timestamp = headers().get('svix-timestamp');
  const webhookId = headers().get('svix-id');

  // Verify webhook signature
  const isValid = verifyWebhookSignature(body, signature, timestamp, webhookId);

  if (!isValid) {
    return NextResponse.json(
      { success: false, error: 'Invalid signature' },
      { status: 401 }
    );
  }

  const event = JSON.parse(body);

  // Handle different event types
  switch (event.type) {
    case 'email.delivered':
      await handleEmailDelivered(event.data);
      break;

    case 'email.bounced':
      await handleEmailBounced(event.data);
      break;

    case 'email.opened':
      await handleEmailOpened(event.data);
      break;

    case 'email.clicked':
      await handleEmailClicked(event.data);
      break;

    default:
      console.log('Unhandled webhook event:', event.type);
  }

  return NextResponse.json({ success: true });
}

function verifyWebhookSignature(
  body: string,
  signature: string,
  timestamp: string,
  webhookId: string
): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET!;
  const signedContent = `${webhookId}.${timestamp}.${body}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedContent)
    .digest('base64');

  return signature === expectedSignature;
}

async function handleEmailDelivered(data: any) {
  console.log('Email delivered:', data);
  // Update database, analytics, etc.
}

async function handleEmailBounced(data: any) {
  console.error('Email bounced:', data);
  // Mark email as invalid, notify admin, etc.
}

async function handleEmailOpened(data: any) {
  console.log('Email opened:', data);
  // Track engagement metrics
}

async function handleEmailClicked(data: any) {
  console.log('Email clicked:', data);
  // Track link clicks
}
```

---

## Email Queue (Optional)

### Background Email Processing

```typescript
// src/lib/queues/email.queue.ts
import Bull from 'bull';
import { sendEmail } from '@/lib/services/email.service';

const emailQueue = new Bull('email', process.env.REDIS_URL!);

emailQueue.process(async (job) => {
  const { to, subject, react } = job.data;

  try {
    await sendEmail({ to, subject, react });
    return { success: true };
  } catch (error) {
    throw error; // Will trigger retry
  }
});

export async function queueEmail(data: any) {
  return emailQueue.add(data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
}
```

---

## Email Testing

### Development Email Preview

```typescript
// src/app/api/emails/preview/route.tsx
import { NextResponse } from 'next/server';
import { render } from '@react-email/components';
import { WelcomeEmail } from '@/emails';

export async function GET() {
  const html = render(
    WelcomeEmail({
      name: 'John Doe',
      role: 'Client',
      dashboardUrl: 'https://taxgeniuspro.tax/dashboard',
    })
  );

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
```

---

## Best Practices

### Email Delivery Tips

1. **Verify Domain:** Configure SPF, DKIM, and DMARC records
2. **Use Transactional Emails:** Avoid marketing content in transactional emails
3. **Handle Bounces:** Monitor bounce rates and remove invalid emails
4. **Rate Limiting:** Don't send too many emails too quickly
5. **Personalization:** Use recipient names and relevant data
6. **Mobile-Friendly:** Ensure emails render well on mobile devices
7. **Plain Text Fallback:** Always provide plain text version
8. **Unsubscribe Link:** Include for non-critical emails

---

## Related Documentation

- [Authentication Flow](./05-authentication-clerk.md) - User lifecycle events
- [API Design Patterns](./03-api-design.md) - Email API endpoints
- [Monitoring & Observability](./11-monitoring.md) - Email delivery tracking
- [Deployment Architecture](./08-deployment.md) - Environment configuration

---

**Navigation:**
[← Previous: Authentication Flow](./05-authentication-clerk.md) | [Next: Security Architecture →](./07-security.md)

---

**Document Version:** 3.0 FINAL
**Last Updated:** October 9, 2025
**Next Review:** November 9, 2025
**Maintained By:** Development Team
