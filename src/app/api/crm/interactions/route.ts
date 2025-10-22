/**
 * POST /api/crm/interactions
 *
 * Log a new interaction (call, email, meeting, note) with a contact
 *
 * Row-level security:
 * - tax_preparer: can only log interactions with their assigned contacts
 * - admin/admin: can log interactions with any contact
 */

import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const createInteractionSchema = z.object({
  contactId: z.string(),
  type: z.enum(['EMAIL', 'PHONE_CALL', 'MEETING', 'NOTE', 'OTHER']),
  direction: z.enum(['INBOUND', 'OUTBOUND']).optional().default('OUTBOUND'),
  subject: z.string().optional(),
  body: z.string().optional(),
  duration: z.number().int().positive().optional(), // minutes
  scheduledFor: z.string().datetime().optional(), // for future meetings
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = user.publicMetadata?.role as string;

    // Parse and validate request
    const body = await req.json();
    const data = createInteractionSchema.parse(body);

    // Get contact to verify access
    const contact = await prisma.cRMContact.findUnique({
      where: { id: data.contactId },
      select: { id: true, assignedPreparerId: true },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // ROW-LEVEL SECURITY: Tax preparers can only log interactions with their assigned contacts
    if (role === 'tax_preparer') {
      const profile = await prisma.profile.findUnique({
        where: { clerkUserId: user.id },
        select: { id: true },
      });

      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }

      if (contact.assignedPreparerId !== profile.id) {
        logger.warn('Tax preparer attempted to log interaction with unassigned contact', {
          preparerId: profile.id,
          contactId: data.contactId,
          assignedTo: contact.assignedPreparerId,
        });
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Create interaction
    const interaction = await prisma.cRMInteraction.create({
      data: {
        contactId: data.contactId,
        clerkUserId: user.id,
        type: data.type,
        direction: data.direction,
        subject: data.subject,
        body: data.body,
        duration: data.duration,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
        createdAt: new Date(),
      },
    });

    // Update contact's last contact date
    await prisma.cRMContact.update({
      where: { id: data.contactId },
      data: { lastContactDate: new Date() },
    });

    logger.info('Interaction logged', {
      interactionId: interaction.id,
      contactId: data.contactId,
      type: data.type,
      loggedBy: user.id,
      role,
    });

    return NextResponse.json({
      success: true,
      interaction,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    logger.error('Error logging interaction:', error);
    return NextResponse.json(
      { error: 'Failed to log interaction' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/crm/interactions?contactId=xxx
 *
 * Get all interactions for a contact
 */
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get('contactId');

    if (!contactId) {
      return NextResponse.json({ error: 'contactId required' }, { status: 400 });
    }

    const role = user.publicMetadata?.role as string;

    // Get contact to verify access
    const contact = await prisma.cRMContact.findUnique({
      where: { id: contactId },
      select: { id: true, assignedPreparerId: true },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // ROW-LEVEL SECURITY
    if (role === 'tax_preparer') {
      const profile = await prisma.profile.findUnique({
        where: { clerkUserId: user.id },
        select: { id: true },
      });

      if (!profile || contact.assignedPreparerId !== profile.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Fetch interactions
    const interactions = await prisma.cRMInteraction.findMany({
      where: { contactId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ interactions });
  } catch (error) {
    logger.error('Error fetching interactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    );
  }
}
