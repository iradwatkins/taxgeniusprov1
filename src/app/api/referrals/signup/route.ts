import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { customAlphabet } from 'nanoid';
import { logger } from '@/lib/logger'

// Generate unique referral codes
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

// POST /api/referrals/signup - Sign up for referral program
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingReferrer = await prisma.referrerApplication.findUnique({
      where: { email },
    });

    if (existingReferrer) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      );
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

    // Create referrer application
    const application = await prisma.referrerApplication.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        referralCode,
        status: 'ACTIVE',
      },
    });

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
    return NextResponse.json(
      { error: 'Failed to create referral signup' },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: 'Failed to fetch referrer' },
      { status: 500 }
    );
  }
}
