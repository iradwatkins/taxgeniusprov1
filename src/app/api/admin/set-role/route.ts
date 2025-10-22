import { NextRequest, NextResponse } from 'next/server';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import { logger } from '@/lib/logger';

/**
 * API endpoint to set admin role for a user
 * RESTRICTED TO SUPER_ADMIN ONLY
 * POST /api/admin/set-role
 * Body: { email: string, role: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const currentUserData = await currentUser();

    if (!currentUserData) {
      return NextResponse.json({ error: 'Unauthorized - You must be logged in' }, { status: 401 });
    }

    // Authorization check - only admin can change roles
    const currentUserRole = currentUserData.publicMetadata?.role as string;
    if (currentUserRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Only super admins can change user roles' },
        { status: 403 }
      );
    }

    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    const validRoles = ['admin', 'admin', 'lead', 'client', 'tax_preparer', 'affiliate'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    logger.info(`🔍 Looking for user with email: ${email}`);

    const clerk = await clerkClient();

    // Get user by email
    const users = await clerk.users.getUserList({
      emailAddress: [email],
    });

    if (users.data.length === 0) {
      return NextResponse.json({ error: `No user found with email: ${email}` }, { status: 404 });
    }

    const user = users.data[0];
    logger.info(`✅ Found user: ${user.firstName} ${user.lastName} (${user.id})`);

    // Check current role
    const currentRole = user.publicMetadata?.role;
    logger.info(`📋 Current role: ${currentRole || 'none'}`);

    // Update role
    await clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role,
      },
    });

    logger.info(`✅ Successfully set ${role} role for ${email}`);

    return NextResponse.json({
      success: true,
      message: `Successfully set ${role} role for ${email}. User must sign out and sign back in for changes to take effect.`,
      user: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
        previousRole: currentRole,
        newRole: role,
      },
      instructions: [
        'Role has been updated in the database',
        'User must completely sign out (not just close browser)',
        'Sign back in to get a fresh session with the new role',
        'Or use an incognito/private window to test immediately',
      ],
    });
  } catch (error) {
    logger.error('❌ Error setting role:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
