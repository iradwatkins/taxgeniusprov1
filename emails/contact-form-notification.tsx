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

interface ContactFormNotificationProps {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  submittedAt: Date;
}

export function ContactFormNotification({
  name,
  email,
  phone,
  service,
  message,
  submittedAt,
}: ContactFormNotificationProps) {
  const serviceLabels: Record<string, string> = {
    individual: 'Individual Tax Return',
    business: 'Business Tax Return',
    'real-estate': 'Real Estate Professional',
    'audit-defense': 'Audit Defense',
    'tax-planning': 'Tax Planning',
  };

  const serviceEmoji: Record<string, string> = {
    individual: '👤',
    business: '🏢',
    'real-estate': '🏘️',
    'audit-defense': '🛡️',
    'tax-planning': '📊',
  };

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>📬 New Contact Form Submission</Heading>
          </Section>

          <Section style={content}>
            <Section style={urgentBanner}>
              <Text style={urgentText}>
                ⏰ New inquiry received - Respond within 2 hours for best conversion
              </Text>
            </Section>

            <Heading style={h2}>{name}</Heading>

            <Section style={highlightBox}>
              <Text style={sectionTitle}>📞 Contact Information</Text>
              <Hr style={hr} />
              <Text style={detailText}>
                <strong>Name:</strong> {name}
              </Text>
              <Text style={detailText}>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${email}`} style={link}>
                  {email}
                </a>
              </Text>
              {phone && (
                <Text style={detailText}>
                  <strong>Phone:</strong>{' '}
                  <a href={`tel:${phone}`} style={link}>
                    {phone}
                  </a>
                </Text>
              )}
            </Section>

            <Section style={serviceBox}>
              <Text style={serviceBadge}>
                {serviceEmoji[service] || '📋'} {serviceLabels[service] || service}
              </Text>
            </Section>

            <Section style={messageBox}>
              <Text style={sectionTitle}>💬 Message</Text>
              <Hr style={hr} />
              <Text style={messageText}>&quot;{message}&quot;</Text>
            </Section>

            <Section style={metaBox}>
              <Text style={metaText}>
                <strong>Submitted:</strong>{' '}
                {submittedAt.toLocaleString('en-US', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                  timeZone: 'America/New_York',
                })}
              </Text>
              <Text style={metaText}>
                <strong>Source:</strong> TaxGeniusPro Contact Page
              </Text>
            </Section>

            <Section style={actionBox}>
              <Text style={actionTitle}>⚡ Recommended Actions</Text>
              <ul style={actionList}>
                <li style={actionItem}>
                  <strong>Respond within 2 hours</strong> for highest conversion rate
                </li>
                <li style={actionItem}>
                  Call {phone || 'the prospect'} if provided for immediate connection
                </li>
                <li style={actionItem}>
                  Send personalized email addressing their {serviceLabels[service] || 'inquiry'}
                </li>
                <li style={actionItem}>Create CRM record if not exists</li>
                <li style={actionItem}>Schedule follow-up if no response within 24 hours</li>
              </ul>
            </Section>

            <Section style={buttonContainer}>
              <Button style={buttonPrimary} href={`mailto:${email}`}>
                Reply via Email
              </Button>
              {phone && (
                <Button style={buttonSecondary} href={`tel:${phone}`}>
                  Call Now
                </Button>
              )}
            </Section>

            <Section style={quickReply}>
              <Text style={quickReplyTitle}>📧 Quick Reply Template</Text>
              <Text style={quickReplyText}>
                Hi {name.split(' ')[0]},
                <br />
                <br />
                Thank you for contacting TaxGeniusPro! I received your inquiry about{' '}
                {serviceLabels[service]?.toLowerCase() || service}.
                <br />
                <br />
                I&apos;d love to discuss how we can help. Are you available for a quick call{' '}
                {phone ? `at ${phone}` : 'this week'}?
                <br />
                <br />
                Alternatively, you can schedule a consultation at your convenience:{' '}
                https://taxgeniuspro.tax/book-appointment
                <br />
                <br />
                Looking forward to helping you!
                <br />
                <br />
                Best regards,
                <br />
                TaxGeniusPro Team
              </Text>
            </Section>
          </Section>

          <Section style={footerSection}>
            <Text style={copyright}>© 2025 TaxGeniusPro</Text>
            <Text style={copyright}>
              This notification was sent to taxgenius.tax@gmail.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '650px',
};

const header = {
  background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
  padding: '25px',
  borderRadius: '10px 10px 0 0',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
};

const content = {
  padding: '30px',
  border: '1px solid #e0e0e0',
  borderTop: 'none',
  borderRadius: '0 0 10px 10px',
};

const h2 = {
  color: '#6d28d9',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  marginTop: '0',
};

const urgentBanner = {
  backgroundColor: '#fef3c7',
  padding: '12px 15px',
  borderRadius: '6px',
  borderLeft: '4px solid #f59e0b',
  marginBottom: '20px',
};

const urgentText = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
};

const highlightBox = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  marginBottom: '15px',
};

const sectionTitle = {
  color: '#6d28d9',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
};

const detailText = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '6px 0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '10px 0',
};

const link = {
  color: '#7c3aed',
  textDecoration: 'underline',
};

const serviceBox = {
  textAlign: 'center' as const,
  padding: '15px',
  marginBottom: '20px',
};

const serviceBadge = {
  display: 'inline-block',
  backgroundColor: '#ede9fe',
  color: '#6d28d9',
  fontSize: '18px',
  fontWeight: '600',
  padding: '12px 24px',
  borderRadius: '8px',
  border: '2px solid #c4b5fd',
};

const messageBox = {
  backgroundColor: '#faf5ff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e9d5ff',
  marginBottom: '15px',
};

const messageText = {
  color: '#581c87',
  fontSize: '15px',
  lineHeight: '24px',
  fontStyle: 'italic',
  margin: '10px 0',
};

const metaBox = {
  backgroundColor: '#f8fafc',
  padding: '12px 15px',
  borderRadius: '6px',
  marginBottom: '20px',
};

const metaText = {
  color: '#64748b',
  fontSize: '13px',
  margin: '5px 0',
};

const actionBox = {
  backgroundColor: '#eff6ff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #bfdbfe',
  marginTop: '20px',
  marginBottom: '20px',
};

const actionTitle = {
  color: '#1e40af',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const actionList = {
  color: '#1e3a8a',
  fontSize: '14px',
  paddingLeft: '20px',
  margin: '10px 0',
};

const actionItem = {
  marginBottom: '10px',
  lineHeight: '22px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  marginTop: '20px',
  marginBottom: '20px',
};

const buttonPrimary = {
  backgroundColor: '#7c3aed',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 28px',
  margin: '0 8px',
};

const buttonSecondary = {
  backgroundColor: '#059669',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 28px',
  margin: '0 8px',
};

const quickReply = {
  backgroundColor: '#f0fdf4',
  padding: '15px',
  borderRadius: '6px',
  marginTop: '20px',
};

const quickReplyTitle = {
  color: '#065f46',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
};

const quickReplyText = {
  color: '#047857',
  fontSize: '13px',
  lineHeight: '20px',
  fontFamily: 'monospace',
  margin: '10px 0',
  backgroundColor: '#ffffff',
  padding: '12px',
  borderRadius: '4px',
  border: '1px solid #d1fae5',
};

const footerSection = {
  textAlign: 'center' as const,
  marginTop: '20px',
  padding: '20px',
  borderTop: '1px solid #e5e7eb',
};

const copyright = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '5px 0',
};

export default ContactFormNotification;
