/**
 * EMERGENCY API: Set iradwatkins@gmail.com as admin
 *
 * This endpoint bypasses normal checks and directly sets admin role
 * Only works for iradwatkins@gmail.com
 *
 * Visit: https://taxgeniuspro.tax/api/admin/emergency-set-super-admin
 */

import { currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    logger.info('🚨 EMERGENCY: Setting admin role...');

    // Get current user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated. Please log in first.' },
        { status: 401 }
      );
    }

    // Check email
    const email = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (email !== 'iradwatkins@gmail.com') {
      return NextResponse.json(
        { error: 'Access denied. This endpoint is only for iradwatkins@gmail.com' },
        { status: 403 }
      );
    }

    logger.info(`✅ Email verified: ${email}`);

    // Update Clerk metadata
    logger.info('📝 Updating Clerk metadata...');
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: 'admin',
      },
    });
    logger.info('✅ Clerk metadata updated to admin');

    // Update or create profile in database
    logger.info('📝 Updating database profile...');
    try {
      const profile = await prisma.profile.findUnique({
        where: { clerkUserId: user.id },
      });

      if (!profile) {
        await prisma.profile.create({
          data: {
            clerkUserId: user.id,
            role: 'SUPER_ADMIN',
            email: email,
            firstName: user.firstName || 'Irad',
            lastName: user.lastName || 'Watkins',
          },
        });
        logger.info('✅ Profile created in database with SUPER_ADMIN role');
      } else {
        await prisma.profile.update({
          where: { id: profile.id },
          data: { role: 'SUPER_ADMIN' },
        });
        logger.info('✅ Profile updated to SUPER_ADMIN role');
      }
    } catch (dbError) {
      logger.error('⚠️  Database update failed (non-critical):', dbError);
    }

    logger.info('🎉 SUCCESS! iradwatkins@gmail.com is now admin');

    return NextResponse.json({
      success: true,
      message: 'Role set to admin successfully!',
      instructions: 'Please sign out completely and sign back in to see the changes.',
      user: {
        id: user.id,
        email: email,
        role: 'admin',
      },
    });
  } catch (error) {
    logger.error('❌ Error setting admin role:', error);
    return NextResponse.json(
      {
        error: 'Failed to set admin role',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
