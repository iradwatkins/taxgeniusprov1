import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * GET /api/appointments - List appointments
 * Query params:
 * - status: filter by status
 * - from: start date filter
 * - to: end date filter
 *
 * Row-level security:
 * - tax_preparer: only see appointments assigned to them (via preparerId)
 * - admin/admin: see all appointments
 */
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const where: {
      status?: string;
      scheduledFor?: { gte?: Date; lte?: Date };
      preparerId?: string;
    } = {};

    // ROW-LEVEL SECURITY: Tax preparers only see their assigned appointments
    const role = user.publicMetadata?.role as string;
    if (role === 'tax_preparer') {
      // Get the preparer's profile ID
      const profile = await prisma.profile.findUnique({
        where: { clerkUserId: user.id },
        select: { id: true },
      });

      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }

      // Filter to only appointments assigned to this preparer
      where.preparerId = profile.id;
      logger.info('Tax preparer viewing their appointments', {
        preparerId: profile.id,
        userId: user.id,
      });
    }
    // Admins and admins see all appointments (no filter)

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by date range
    if (from || to) {
      where.scheduledFor = {};
      if (from) {
        where.scheduledFor.gte = new Date(from);
      }
      if (to) {
        where.scheduledFor.lte = new Date(to);
      }
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: {
        scheduledFor: 'asc',
      },
    });

    logger.info('Fetched appointments', {
      count: appointments.length,
      role,
      filtered: role === 'tax_preparer',
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    logger.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments - Create appointment
 */
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      type,
      status,
      scheduledFor,
      duration,
      location,
      meetingLink,
      subject,
      clientNotes,
      preparerId,
    } = body;

    // Validate required fields
    if (!clientName || !clientEmail || !clientPhone || !type || !status || !scheduledFor) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find or create CRM contact
    const nameParts = clientName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    let crmContact = await prisma.cRMContact.findUnique({
      where: { email: clientEmail.toLowerCase() },
    });

    if (!crmContact) {
      crmContact = await prisma.cRMContact.create({
        data: {
          contactType: 'LEAD',
          firstName,
          lastName,
          email: clientEmail.toLowerCase(),
          phone: clientPhone,
          source: 'manual_appointment',
          status: 'NEW',
          lastContactDate: new Date(),
        },
      });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        clientId: crmContact.id,
        clientName,
        clientEmail: clientEmail.toLowerCase(),
        clientPhone,
        preparerId: preparerId || 'unassigned',
        type,
        status,
        scheduledFor: new Date(scheduledFor),
        duration,
        timezone: 'America/New_York',
        location,
        meetingLink,
        subject: subject || `${type.replace('_', ' ')} - ${clientName}`,
        clientNotes,
      },
    });

    logger.info('Created appointment (manual)', {
      appointmentId: appointment.id,
      clientEmail,
      createdBy: user.id,
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    logger.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
