import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * RESTRICTED ENDPOINT: Set current user's role
 * SUPER_ADMIN ONLY
 *
 * This endpoint is restricted to super_admin for testing purposes only.
 */
export async function POST(request: Request) {
  try {
    // Get current authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get current user to check role
    const clerk = await clerkClient();
    const currentUserData = await clerk.users.getUser(userId);
    const currentRole = currentUserData.publicMetadata?.role as string;

    // Only super_admin can use this endpoint
    if (currentRole !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden - Only super admins can use this endpoint' },
        { status: 403 }
      );
    }

    // Get the role to set from request body
    const body = await request.json();
    const role = body.role || 'admin'; // Default to admin

    // Validate role
    const validRoles = ['super_admin', 'admin', 'lead', 'client', 'tax_preparer', 'affiliate'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          error:
            'Invalid role. Must be: super_admin, admin, lead, client, tax_preparer, or affiliate',
        },
        { status: 400 }
      );
    }

    // Update user metadata using Clerk API (reuse clerk instance from above)
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Role set to '${role}' for user ${userId}`,
      userId: userId,
      role: role,
      note: 'You may need to log out and log back in for changes to take effect.',
    });
  } catch (error) {
    logger.error('Error setting user role:', error);
    return NextResponse.json(
      {
        error: 'Failed to update user role',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Check current user's role
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user from Clerk
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    const currentRole = user.publicMetadata?.role || 'none';

    return NextResponse.json({
      userId: userId,
      email: user.emailAddresses[0]?.emailAddress,
      currentRole: currentRole,
      publicMetadata: user.publicMetadata,
    });
  } catch (error) {
    logger.error('Error getting user role:', error);
    return NextResponse.json({ error: 'Failed to get user role' }, { status: 500 });
  }
}
