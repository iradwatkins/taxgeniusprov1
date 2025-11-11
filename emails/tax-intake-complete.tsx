import * as React from 'react';
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

interface TaxIntakeCompleteProps {
  preparerName: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  dashboardUrl: string;
  // Personal Information
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  countryCode: string;
  // Address
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  // Tax Filing Details
  filingStatus: string;
  employmentType: string;
  occupation: string;
  claimedAsDependent: string;
  // Education
  inCollege: string;
  // Dependents
  hasDependents: string;
  numberOfDependents?: number;
  dependentsUnder24StudentOrDisabled?: string;
  dependentsInCollege?: string;
  childCareProvider?: string;
  // Property
  hasMortgage: string;
  // Tax Credits
  deniedEitc: string;
  // IRS Information
  hasIrsPin: string;
  irsPin?: string;
  // Refund Preferences
  wantsRefundAdvance: string;
  // Identification
  driversLicense: string;
  licenseExpiration: string;
  licenseFileUrl?: string;
  // Attribution
  source: string;
  referrerUsername?: string;
  referrerType?: string;
  attributionMethod?: string;
}

export function TaxIntakeComplete(props: TaxIntakeCompleteProps) {
  const {
    preparerName,
    leadName,
    leadEmail,
    leadPhone,
    dashboardUrl,
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    ssn,
    countryCode,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    filingStatus,
    employmentType,
    occupation,
    claimedAsDependent,
    inCollege,
    hasDependents,
    numberOfDependents,
    dependentsUnder24StudentOrDisabled,
    dependentsInCollege,
    childCareProvider,
    hasMortgage,
    deniedEitc,
    hasIrsPin,
    irsPin,
    wantsRefundAdvance,
    driversLicense,
    licenseExpiration,
    source,
    referrerUsername,
  } = props;

  const filingStatusLabels: Record<string, string> = {
    single: 'Single',
    married_filing_separately: 'Married Filing Separately',
    married_filing_jointly: 'Married Filing Jointly',
    head_of_household: 'Head of Household',
    qualifying_widow: 'Qualifying Widow(er)',
  };

  const employmentLabels: Record<string, string> = {
    w2: 'W-2',
    '1099': '1099',
    both: 'W-2 & 1099',
  };

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Complete Tax Intake Received</Heading>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hi {preparerName},</Text>
            <Text style={subtext}>Client ready for tax preparation</Text>

            {/* Contact Info */}
            <Section style={primaryBox}>
              <Text style={boxLabel}>CLIENT INFORMATION</Text>
              <Hr style={hr} />
              <Text style={detail}>
                <strong>Name:</strong> {firstName} {middleName ? `${middleName} ` : ''}{lastName}
              </Text>
              <Text style={detail}>
                <strong>Email:</strong> <a href={`mailto:${leadEmail}`} style={link}>{leadEmail}</a>
              </Text>
              <Text style={detail}>
                <strong>Phone:</strong> <a href={`tel:${leadPhone}`} style={link}>{countryCode} {leadPhone}</a>
              </Text>
              <Text style={detail}>
                <strong>DOB:</strong> {dateOfBirth}
              </Text>
              <Text style={detail}>
                <strong>SSN:</strong> {ssn}
              </Text>
            </Section>

            {/* Address */}
            <Section style={secondaryBox}>
              <Text style={boxLabel}>ADDRESS</Text>
              <Hr style={hr} />
              <Text style={detail}>{addressLine1}</Text>
              {addressLine2 && <Text style={detail}>{addressLine2}</Text>}
              <Text style={detail}>{city}, {state} {zipCode}</Text>
            </Section>

            {/* Tax Filing */}
            <Section style={primaryBox}>
              <Text style={boxLabel}>TAX FILING</Text>
              <Hr style={hr} />
              <Text style={detail}>
                <strong>Filing Status:</strong> {filingStatusLabels[filingStatus] || filingStatus}
              </Text>
              <Text style={detail}>
                <strong>Employment:</strong> {employmentLabels[employmentType] || employmentType}
              </Text>
              <Text style={detail}>
                <strong>Occupation:</strong> {occupation}
              </Text>
              <Text style={detail}>
                <strong>Claimed as Dependent:</strong> {claimedAsDependent === 'yes' ? 'Yes' : 'No'}
              </Text>
              <Text style={detail}>
                <strong>Currently in College:</strong> {inCollege === 'yes' ? 'Yes' : 'No'}
              </Text>
            </Section>

            {/* Dependents */}
            {hasDependents === 'yes' && (
              <Section style={secondaryBox}>
                <Text style={boxLabel}>DEPENDENTS</Text>
                <Hr style={hr} />
                <Text style={detail}>
                  <strong>Number:</strong> {numberOfDependents || 0}
                </Text>
                {dependentsUnder24StudentOrDisabled && (
                  <Text style={detail}>
                    <strong>Under 24 / Student / Disabled:</strong> {dependentsUnder24StudentOrDisabled === 'yes' ? 'Yes' : 'No'}
                  </Text>
                )}
                {dependentsInCollege && (
                  <Text style={detail}>
                    <strong>In College:</strong> {dependentsInCollege === 'yes' ? 'Yes' : 'No'}
                  </Text>
                )}
                {childCareProvider && (
                  <Text style={detail}>
                    <strong>Child Care Provider:</strong> {childCareProvider === 'yes' ? 'Yes' : 'No'}
                  </Text>
                )}
              </Section>
            )}

            {/* Property & Credits */}
            <Section style={primaryBox}>
              <Text style={boxLabel}>PROPERTY & CREDITS</Text>
              <Hr style={hr} />
              <Text style={detail}>
                <strong>Has Mortgage:</strong> {hasMortgage === 'yes' ? 'Yes' : 'No'}
              </Text>
              <Text style={detail}>
                <strong>Previously Denied EITC:</strong> {deniedEitc === 'yes' ? 'Yes' : 'No'}
              </Text>
            </Section>

            {/* IRS & Refund */}
            <Section style={secondaryBox}>
              <Text style={boxLabel}>IRS & REFUND</Text>
              <Hr style={hr} />
              <Text style={detail}>
                <strong>Has IRS PIN:</strong> {hasIrsPin === 'yes' ? `Yes (${irsPin})` : hasIrsPin === 'yes_locate' ? 'Yes (Need to Locate)' : 'No'}
              </Text>
              <Text style={detail}>
                <strong>Wants Refund Advance:</strong> {wantsRefundAdvance === 'yes' ? 'Yes' : 'No'}
              </Text>
            </Section>

            {/* ID */}
            <Section style={primaryBox}>
              <Text style={boxLabel}>IDENTIFICATION</Text>
              <Hr style={hr} />
              <Text style={detail}>
                <strong>Driver's License:</strong> {driversLicense}
              </Text>
              <Text style={detail}>
                <strong>Expiration:</strong> {licenseExpiration}
              </Text>
            </Section>

            {/* Attribution */}
            {referrerUsername && (
              <Section style={metaBox}>
                <Text style={metaText}>
                  <strong>Source:</strong> {source} | <strong>Referrer:</strong> {referrerUsername}
                </Text>
              </Section>
            )}

            {/* Action Buttons */}
            <Section style={actionBox}>
              <Button style={btnPrimary} href={dashboardUrl}>
                View Dashboard
              </Button>
              <Button style={btnSecondary} href={`mailto:${leadEmail}`}>
                Email Client
              </Button>
              <Button style={btnTertiary} href={`tel:${leadPhone}`}>
                Call Client
              </Button>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f2f7ff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '650px',
  border: '1px solid #e1eaef',
};

const header = {
  backgroundColor: '#408851',
  padding: '30px 25px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0',
};

const content = {
  padding: '30px 25px',
};

const greeting = {
  color: '#30394b',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
};

const subtext = {
  color: '#72767a',
  fontSize: '14px',
  margin: '5px 0 25px 0',
};

const primaryBox = {
  backgroundColor: '#f7f8f8',
  padding: '18px',
  marginBottom: '12px',
  borderLeft: '3px solid #408851',
};

const secondaryBox = {
  backgroundColor: '#f7f8f8',
  padding: '18px',
  marginBottom: '12px',
  borderLeft: '3px solid #f9d938',
};

const metaBox = {
  backgroundColor: '#f2f7ff',
  padding: '12px 18px',
  marginBottom: '20px',
  borderLeft: '3px solid #30394b',
};

const boxLabel = {
  color: '#30394b',
  fontSize: '12px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  letterSpacing: '1px',
};

const hr = {
  borderColor: '#e1eaef',
  margin: '8px 0',
};

const detail = {
  color: '#30394b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
};

const metaText = {
  color: '#72767a',
  fontSize: '12px',
  margin: '0',
};

const link = {
  color: '#408851',
  textDecoration: 'underline',
};

const actionBox = {
  textAlign: 'center' as const,
  marginTop: '25px',
};

const btnPrimary = {
  backgroundColor: '#408851',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 28px',
  margin: '5px',
  border: '2px solid #408851',
};

const btnSecondary = {
  backgroundColor: '#f9d938',
  color: '#30394b',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 28px',
  margin: '5px',
  border: '2px solid #30394b',
};

const btnTertiary = {
  backgroundColor: '#30394b',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 28px',
  margin: '5px',
  border: '2px solid #30394b',
};

export default TaxIntakeComplete;
