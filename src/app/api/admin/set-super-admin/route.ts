import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger'

const prisma = new PrismaClient();

/**
 * API endpoint to set a user as SUPER_ADMIN
 * Restricted to iradwatkins@gmail.com only
 */
export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;

    // Only allow iradwatkins@gmail.com to use this endpoint
    if (userEmail !== 'iradwatkins@gmail.com') {
      return NextResponse.json(
        { error: 'Forbidden: Only iradwatkins@gmail.com can use this endpoint' },
        { status: 403 }
      );
    }

    logger.info(`🔐 Setting ${userEmail} as SUPER_ADMIN...`);

    // Update Clerk metadata
    await (await clerkClient()).users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: 'super_admin'
      }
    });

    logger.info('✅ Clerk metadata updated');

    // Update or create Profile in database
    const profile = await prisma.profile.findUnique({
      where: { clerkUserId: user.id }
    });

    if (!profile) {
      logger.info('Creating new profile...');
      await prisma.profile.create({
        data: {
          clerkUserId: user.id,
          role: 'SUPER_ADMIN',
          firstName: user.firstName || 'Irad',
          lastName: user.lastName || 'Watkins'
        }
      });
    } else {
      logger.info(`Updating profile from ${profile.role} to SUPER_ADMIN...`);
      await prisma.profile.update({
        where: { id: profile.id },
        data: { role: 'SUPER_ADMIN' }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully set ${userEmail} as SUPER_ADMIN`,
      userId: user.id,
      role: 'super_admin'
    });

  } catch (error) {
    logger.error('Error setting super admin:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
