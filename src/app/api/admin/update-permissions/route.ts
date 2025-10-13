import { NextRequest, NextResponse } from 'next/server';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import { UserRole, UserPermissions } from '@/lib/permissions';

export async function POST(request: NextRequest) {
  try {
    // Check if the current user is a super admin
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const isSuperAdmin = user.publicMetadata?.role === 'super_admin';

    if (!isSuperAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only super admins can manage permissions' },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json();
    const { userId, role, permissions } = body as {
      userId: string;
      role: UserRole;
      permissions: Partial<UserPermissions>;
    };

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and role' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ['super_admin', 'admin', 'tax_preparer', 'affiliate', 'referrer', 'client'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    // Prevent super admin from demoting themselves
    if (userId === user.id && role !== 'super_admin') {
      return NextResponse.json(
        { error: 'You cannot change your own role from super admin' },
        { status: 400 }
      );
    }

    // Update role and permissions in Clerk
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
        permissions: permissions,
      }
    });

    // Get updated user info for response
    const targetUser = await client.users.getUser(userId);

    return NextResponse.json({
      success: true,
      user: {
        id: targetUser.id,
        email: targetUser.emailAddresses[0]?.emailAddress,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        role: targetUser.publicMetadata?.role,
        permissions: targetUser.publicMetadata?.permissions,
      }
    });
  } catch (error) {
    console.error('Error updating user permissions:', error);
    return NextResponse.json(
      { error: 'Failed to update permissions' },
      { status: 500 }
    );
  }
}
