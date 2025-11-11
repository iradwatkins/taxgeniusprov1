import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { customAlphabet } from 'nanoid';
import { logger } from '@/lib/logger';

// Generate unique referral codes
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

// POST /api/referrals/signup - Sign up for referral program
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { firstName, lastName, email, phone } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists (skip in development/test mode to allow repeated testing)
    const allowDuplicates =
      process.env.NODE_ENV === 'development' ||
      process.env.ALLOW_DUPLICATE_TEST_LEADS === 'true' ||
      email.endsWith('@example.com'); // Allow test emails

    // Try to find existing application
    let application = await prisma.referrerApplication.findUnique({
      where: { email },
    });

    if (application && !allowDuplicates) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      );
    }

    // If application exists and duplicates are allowed (test mode), return existing record
    if (application && allowDuplicates) {
      logger.info('Returning existing referrer application (test mode)', {
        applicationId: application.id,
        email,
        referralCode: application.referralCode,
      });

      return NextResponse.json({
        success: true,
        applicationId: application.id,
        referralCode: application.referralCode,
        referralLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://taxgeniuspro.tax'}?ref=${application.referralCode}`,
        message: 'Referral signup successful (existing)',
      });
    }

    // Generate unique referral code
    let referralCode = nanoid();
    let codeExists = true;

    // Ensure code is unique
    while (codeExists) {
      const existing = await prisma.referrerApplication.findUnique({
        where: { referralCode },
      });
      if (!existing) {
        codeExists = false;
      } else {
        referralCode = nanoid();
      }
    }

    // Create new referrer application
    application = await prisma.referrerApplication.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        referralCode,
        status: 'ACTIVE',
      },
    });

    logger.info('Referrer application created', {
      applicationId: application.id,
      email: application.email,
      referralCode: application.referralCode,
    });

    // ========================================
    // CRM INTEGRATION: Create CRM contact and interaction
    // ========================================
    const referralLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://taxgeniuspro.tax'}?ref=${referralCode}`;

    try {
      const crmContact = await prisma.cRMContact.upsert({
        where: { email: email.toLowerCase() },
        create: {
          contactType: 'AFFILIATE',
          firstName,
          lastName,
          email: email.toLowerCase(),
          phone,
          stage: 'NEW',
          source: 'referral_program_signup',
          lastContactedAt: new Date(),
        },
        update: {
          firstName,
          lastName,
          phone,
          lastContactedAt: new Date(),
        },
      });

      logger.info('CRM contact created/updated from referral signup', {
        contactId: crmContact.id,
        applicationId: application.id,
        referralCode,
      });

      // Create CRMInteraction to log the referral signup
      await prisma.cRMInteraction.create({
        data: {
          contactId: crmContact.id,
          type: 'NOTE',
          direction: 'INBOUND',
          subject: '🤝 Referral Program Signup',
          body: `**Referral Program Signup**

**Referrer Information:**
- Name: ${firstName} ${lastName}
- Email: ${email}
- Phone: ${phone}
- Status: ACTIVE

**Referral Details:**
- Referral Code: ${referralCode}
- Referral Link: ${referralLink}

**Application ID:** ${application.id}

This person has joined the referral program and can now start earning commissions by referring clients.`,
          occurredAt: new Date(),
        },
      });

      logger.info('CRM interaction created for referral signup', {
        contactId: crmContact.id,
        applicationId: application.id,
      });
    } catch (crmError) {
      // Log error but don't fail the request
      logger.error('Failed to create CRM contact/interaction', {
        error: crmError,
        applicationId: application.id,
        email,
      });
    }

    // TODO: Send welcome email with referral link
    // TODO: Send SMS notification

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      referralCode: application.referralCode,
      referralLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://taxgeniuspro.tax'}?ref=${referralCode}`,
      message: 'Referral signup successful',
    });
  } catch (error) {
    logger.error('Error creating referral signup:', error);
    return NextResponse.json({ error: 'Failed to create referral signup' }, { status: 500 });
  }
}

// GET /api/referrals/signup - Get referrer info by email or code
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const code = searchParams.get('code');

    if (!email && !code) {
      return NextResponse.json({ error: 'Email or code parameter required' }, { status: 400 });
    }

    const application = await prisma.referrerApplication.findFirst({
      where: email ? { email } : { referralCode: code || undefined },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        referralCode: true,
        status: true,
        createdAt: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
    }

    return NextResponse.json({
      application,
      referralLink: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://taxgeniuspro.tax'}?ref=${application.referralCode}`,
    });
  } catch (error) {
    logger.error('Error fetching referrer:', error);
    return NextResponse.json({ error: 'Failed to fetch referrer' }, { status: 500 });
  }
}
