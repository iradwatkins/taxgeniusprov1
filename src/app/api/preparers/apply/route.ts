import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { Resend } from 'resend';
import { PreparerApplicationConfirmation } from '../../../../../emails/preparer-application-confirmation';
import { PreparerApplicationNotification } from '../../../../../emails/preparer-application-notification';

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/preparers/apply - Submit tax preparer application
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      languages,
      smsConsent,
      experienceLevel,
      taxSoftware,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !languages || smsConsent !== 'yes') {
      return NextResponse.json(
        { error: 'Missing required fields or SMS consent not provided' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate experience level if provided
    if (experienceLevel) {
      const validLevels = ['NEW', 'INTERMEDIATE', 'SEASONED'];
      if (!validLevels.includes(experienceLevel)) {
        return NextResponse.json(
          { error: `Invalid experience level. Must be one of: ${validLevels.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Check if application already exists for this email
    const existingApplication = await prisma.preparerApplication.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'An application with this email already exists. Please check your email for updates.' },
        { status: 409 }
      );
    }

    // Create preparer application
    const application = await prisma.preparerApplication.create({
      data: {
        firstName,
        middleName: middleName || null,
        lastName,
        email: email.toLowerCase(),
        phone,
        languages,
        smsConsent: smsConsent === 'yes',
        experienceLevel: experienceLevel || null,
        taxSoftware: taxSoftware || [],
        status: 'PENDING',
      },
    });

    logger.info('Preparer application created', {
      applicationId: application.id,
      email: application.email,
      experienceLevel: application.experienceLevel,
    });

    // Send emails
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@taxgeniuspro.tax';

    try {
      if (process.env.NODE_ENV === 'development') {
        logger.info('Preparer application emails (Dev Mode)', {
          applicantEmail: email,
          hiringEmail: 'taxgenius.tax+hire@gmail.com',
          applicationId: application.id,
        });
      } else {
        // 1. Send confirmation email to applicant
        const { data: confirmData, error: confirmError } = await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: 'Application Received - TaxGeniusPro Tax Preparer Position',
          react: PreparerApplicationConfirmation({
            firstName,
            lastName,
            email,
            phone,
            experienceLevel,
            taxSoftware,
          }),
        });

        if (confirmError) {
          logger.error('Failed to send applicant confirmation email', confirmError);
        } else {
          logger.info('Applicant confirmation email sent', { emailId: confirmData?.id });
        }

        // 2. Send notification email to hiring team
        const { data: notifyData, error: notifyError } = await resend.emails.send({
          from: fromEmail,
          to: 'taxgenius.tax+hire@gmail.com',
          subject: `New Tax Preparer Application: ${firstName} ${lastName}`,
          react: PreparerApplicationNotification({
            firstName,
            middleName,
            lastName,
            email,
            phone,
            languages,
            experienceLevel,
            taxSoftware,
            applicationId: application.id,
          }),
        });

        if (notifyError) {
          logger.error('Failed to send hiring team notification email', notifyError);
        } else {
          logger.info('Hiring team notification email sent', { emailId: notifyData?.id });
        }
      }
    } catch (emailError) {
      logger.error('Error sending preparer application emails', emailError);
      // Don't fail the request - application was saved successfully
    }

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: 'Application submitted successfully! Check your email for confirmation.',
    });
  } catch (error) {
    logger.error('Error submitting preparer application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again or call us at +1 404-627-1015.' },
      { status: 500 }
    );
  }
}

// GET /api/preparers/apply - Get application status by email
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    const application = await prisma.preparerApplication.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
        interviewDate: true,
        createdAt: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    logger.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}
