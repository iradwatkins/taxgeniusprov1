/**
 * GET /api/crm/contacts/[id]/details
 *
 * Get comprehensive contact details including:
 * - Contact information
 * - All appointments (scheduled, past, cancelled)
 * - All interactions (calls, emails, notes)
 * - Documents (if they have a profile)
 * - Tax returns (if they have a profile)
 *
 * Row-level security:
 * - tax_preparer: only contacts assigned to them
 * - admin/admin: all contacts
 */

import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: contactId } = params;
    const role = user.publicMetadata?.role as string;

    // Get preparer profile ID if tax_preparer
    let preparerId: string | undefined;
    if (role === 'tax_preparer') {
      const profile = await prisma.profile.findUnique({
        where: { clerkUserId: user.id },
        select: { id: true },
      });
      preparerId = profile?.id;
    }

    // Fetch contact with security check
    const contact = await prisma.cRMContact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // ROW-LEVEL SECURITY: Tax preparers can only see their assigned contacts
    if (role === 'tax_preparer' && contact.assignedPreparerId !== preparerId) {
      logger.warn('Tax preparer attempted to access unassigned contact', {
        preparerId,
        contactId,
        assignedTo: contact.assignedPreparerId,
      });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all related data in parallel
    const [appointments, interactions, profile, documents, taxReturns] = await Promise.all([
      // Appointments for this contact
      prisma.appointment.findMany({
        where: { clientId: contactId },
        orderBy: { scheduledFor: 'desc' },
        take: 50,
      }),

      // Interactions for this contact
      prisma.cRMInteraction.findMany({
        where: { contactId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),

      // Profile (if contact has been converted to client)
      contact.clerkUserId
        ? prisma.profile.findUnique({
            where: { clerkUserId: contact.clerkUserId },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              createdAt: true,
            },
          })
        : null,

      // Documents (if they have a profile)
      contact.clerkUserId
        ? prisma.profile
            .findUnique({
              where: { clerkUserId: contact.clerkUserId },
              select: { id: true },
            })
            .then((p) =>
              p
                ? prisma.document.findMany({
                    where: { profileId: p.id },
                    orderBy: { createdAt: 'desc' },
                    take: 50,
                    select: {
                      id: true,
                      type: true,
                      fileName: true,
                      fileSize: true,
                      taxYear: true,
                      status: true,
                      createdAt: true,
                    },
                  })
                : []
            )
        : [],

      // Tax Returns (if they have a profile)
      contact.clerkUserId
        ? prisma.profile
            .findUnique({
              where: { clerkUserId: contact.clerkUserId },
              select: { id: true },
            })
            .then((p) =>
              p
                ? prisma.taxReturn.findMany({
                    where: { profileId: p.id },
                    orderBy: { taxYear: 'desc' },
                    select: {
                      id: true,
                      taxYear: true,
                      status: true,
                      filedDate: true,
                      refundAmount: true,
                      oweAmount: true,
                      createdAt: true,
                    },
                  })
                : []
            )
        : [],
    ]);

    // Get assigned preparer info
    let assignedPreparer = null;
    if (contact.assignedPreparerId) {
      assignedPreparer = await prisma.profile.findUnique({
        where: { id: contact.assignedPreparerId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
    }

    // Calculate stats
    const stats = {
      totalAppointments: appointments.length,
      upcomingAppointments: appointments.filter(
        (a) => a.scheduledFor && new Date(a.scheduledFor) > new Date()
      ).length,
      totalInteractions: interactions.length,
      totalDocuments: documents.length,
      totalReturns: taxReturns.length,
      lastContactDate: interactions[0]?.createdAt || contact.createdAt,
    };

    logger.info('Contact details fetched', {
      contactId,
      role,
      hasProfile: !!profile,
      stats,
    });

    return NextResponse.json({
      contact,
      profile,
      assignedPreparer,
      appointments,
      interactions,
      documents,
      taxReturns,
      stats,
    });
  } catch (error) {
    logger.error('Error fetching contact details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact details' },
      { status: 500 }
    );
  }
}
