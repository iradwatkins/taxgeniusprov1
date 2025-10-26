/**
 * Tracking Code API
 *
 * GET: Get current user's tracking code data
 * PATCH: Customize tracking code (one-time only)
 */

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import {
  getUserTrackingCode,
  customizeTrackingCode,
  validateCustomTrackingCode,
  isTrackingCodeAvailable,
  assignTrackingCodeToUser,
} from '@/lib/services/tracking-code.service';

/**
 * GET: Get user's current tracking code
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get or create profile using upsert to avoid race conditions
    const profile = await prisma.profile.upsert({
      where: { clerkUserId: userId },
      update: {}, // No updates if exists
      create: {
        clerkUserId: userId,
        role: 'LEAD', // Default role, user will select proper role later
      },
      select: { id: true, role: true },
    });

    logger.info(`Profile resolved: ${profile.id}`);

    // Get tracking code data
    let trackingData = await getUserTrackingCode(profile.id);

    // If user doesn't have a tracking code, auto-generate one
    if (!trackingData) {
      logger.info(`Auto-generating tracking code for user ${profile.id}`);
      trackingData = await assignTrackingCodeToUser(
        profile.id,
        process.env.NEXT_PUBLIC_APP_URL || 'https://taxgeniuspro.tax'
      );
    }

    return NextResponse.json({
      success: true,
      data: trackingData,
    });
  } catch (error) {
    logger.error('Error getting tracking code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH: Customize tracking code (one-time only)
 */
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get request body
    const body = await req.json();
    const { customCode } = body;

    if (!customCode || typeof customCode !== 'string') {
      return NextResponse.json(
        { error: 'Custom code is required and must be a string' },
        { status: 400 }
      );
    }

    // Get or create profile using upsert to avoid race conditions
    const profile = await prisma.profile.upsert({
      where: { clerkUserId: userId },
      update: {}, // No updates if exists
      create: {
        clerkUserId: userId,
        role: 'LEAD', // Default role, user will select proper role later
      },
      select: { id: true, role: true },
    });

    logger.info(`Profile resolved: ${profile.id}`);

    // Customize tracking code
    const result = await customizeTrackingCode(
      profile.id,
      customCode.trim(),
      process.env.NEXT_PUBLIC_APP_URL || 'https://taxgeniuspro.tax'
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Tracking code customized successfully',
    });
  } catch (error) {
    logger.error('Error customizing tracking code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
