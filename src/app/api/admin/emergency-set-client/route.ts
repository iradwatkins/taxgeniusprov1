/**
 * EMERGENCY API: Set current logged-in user as client
 *
 * This endpoint sets the current user's role to client in both Clerk and database
 *
 * Visit while logged in: https://taxgeniuspro.tax/api/admin/emergency-set-client
 */

import { currentUser } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    logger.info('🚨 EMERGENCY: Setting client role...');

    // Get current user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated. Please log in first.' },
        { status: 401 }
      );
    }

    const email = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress;

    logger.info(`✅ User authenticated: ${email}, ID: ${user.id}`);

    // Update Clerk metadata
    logger.info('📝 Updating Clerk metadata...');
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: 'client',
      },
    });
    logger.info('✅ Clerk metadata updated to client');

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
            role: 'CLIENT',
            firstName: user.firstName || 'Tax',
            lastName: user.lastName || 'Genius',
          },
        });
        logger.info('✅ Profile created in database with CLIENT role');
      } else {
        await prisma.profile.update({
          where: { id: profile.id },
          data: { role: 'CLIENT' },
        });
        logger.info('✅ Profile updated to CLIENT role');
      }
    } catch (dbError) {
      logger.error('⚠️  Database update failed:', dbError);
      throw dbError;
    }

    logger.info('🎉 SUCCESS! User is now a client');

    return NextResponse.json({
      success: true,
      message: 'Role set to client successfully!',
      instructions: 'Please refresh the page to see the client dashboard.',
      user: {
        id: user.id,
        email: email,
        role: 'client',
      },
    });
  } catch (error) {
    logger.error('❌ Error setting client role:', error);
    return NextResponse.json(
      {
        error: 'Failed to set client role',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
