import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * POST /api/admin/update-revenue-split
 *
 * Updates a tax preparer's revenue split percentage (20/80, 30/70, or 40/60)
 * Admin-only endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const adminProfile = await prisma.profile.findUnique({
      where: { clerkUserId: user.id },
      select: { role: true },
    });

    if (!adminProfile || adminProfile.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can update revenue splits' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { userId, revenueSplitPercentage } = body;

    if (!userId || !revenueSplitPercentage) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and revenueSplitPercentage' },
        { status: 400 }
      );
    }

    // Validate split percentage (must be 20, 30, or 40)
    const validSplits = [20, 30, 40];
    if (!validSplits.includes(revenueSplitPercentage)) {
      return NextResponse.json(
        { error: 'Invalid split percentage. Must be 20, 30, or 40' },
        { status: 400 }
      );
    }

    // Get the target user's profile
    const targetProfile = await prisma.profile.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        role: true,
        firstName: true,
        lastName: true,
        revenueSplitPercentage: true,
      },
    });

    if (!targetProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only allow updating tax preparers
    if (targetProfile.role !== 'TAX_PREPARER') {
      return NextResponse.json(
        { error: 'Revenue splits can only be set for tax preparers' },
        { status: 400 }
      );
    }

    // Update the revenue split
    const updatedProfile = await prisma.profile.update({
      where: { clerkUserId: userId },
      data: {
        revenueSplitPercentage,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        revenueSplitPercentage: true,
      },
    });

    logger.info('Revenue split updated', {
      targetUserId: userId,
      targetUserName: `${updatedProfile.firstName} ${updatedProfile.lastName}`,
      oldSplit: targetProfile.revenueSplitPercentage,
      newSplit: revenueSplitPercentage,
      updatedBy: user.id,
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: updatedProfile.id,
        revenueSplitPercentage: updatedProfile.revenueSplitPercentage,
        preparerPercentage: 100 - (updatedProfile.revenueSplitPercentage || 30),
      },
    });
  } catch (error) {
    logger.error('Error updating revenue split:', error);
    return NextResponse.json(
      { error: 'Failed to update revenue split. Please try again.' },
      { status: 500 }
    );
  }
}
