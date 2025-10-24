/**
 * Support Ticket Statistics API
 * GET /api/support/tickets/stats - Get ticket statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getTicketStats } from '@/lib/services/support-ticket.service';
import { logger } from '@/lib/logger';

/**
 * GET /api/support/tickets/stats
 * Get ticket statistics for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile with role
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId },
      select: { id: true, role: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Determine role for filtering
    let role: 'client' | 'preparer' | 'admin' = 'client';
    if (profile.role === 'TAX_PREPARER') {
      role = 'preparer';
    } else if (profile.role === 'SUPER_ADMIN' || profile.role === 'ADMIN') {
      role = 'admin';
    }

    // Get statistics
    const stats = await getTicketStats(profile.id, role);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Failed to get ticket stats', { error });

    // Return empty stats instead of error to prevent UI crashes
    return NextResponse.json({
      success: true,
      data: {
        total: 0,
        open: 0,
        inProgress: 0,
        waitingClient: 0,
        waitingPreparer: 0,
        resolved: 0,
        closed: 0,
        byPriority: {
          LOW: 0,
          NORMAL: 0,
          HIGH: 0,
          URGENT: 0,
        },
        averageResponseTime: 0,
        averageResolutionTime: 0,
      },
    });
  }
}
