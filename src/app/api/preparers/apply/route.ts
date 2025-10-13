import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !languages || smsConsent !== 'yes') {
      return NextResponse.json(
        { error: 'Missing required fields or SMS consent not provided' },
        { status: 400 }
      );
    }

    // Check if application already exists for this email
    const existingApplication = await prisma.preparerApplication.findUnique({
      where: { email },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      );
    }

    // Create preparer application
    const application = await prisma.preparerApplication.create({
      data: {
        firstName,
        middleName: middleName || null,
        lastName,
        email,
        phone,
        languages,
        smsConsent: smsConsent === 'yes',
        status: 'PENDING',
      },
    });

    // TODO: Send confirmation email
    // TODO: Send SMS notification

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting preparer application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
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
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}
