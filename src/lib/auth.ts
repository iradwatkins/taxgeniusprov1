import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * User role types for Tax Genius platform
 */
export type UserRole = 'client' | 'preparer' | 'referrer' | 'admin';

/**
 * Get the current user's role from Clerk metadata
 * @returns User role or null if not authenticated
 */
export async function getUserRole(): Promise<UserRole | null> {
  const user = await currentUser();
  if (!user) return null;

  return (user.publicMetadata?.role as UserRole) || null;
}

/**
 * Check if current user has a specific role
 * @param role - Role to check
 * @returns True if user has the role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === role;
}

/**
 * Check if current user is an admin
 * @returns True if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

/**
 * Get the authenticated session from Clerk
 * @returns Auth session or null if not authenticated
 */
export async function getSession() {
  return auth();
}

/**
 * Get the authenticated user from Clerk
 * @returns User object or null if not authenticated
 */
export async function getAuthenticatedUser() {
  return currentUser();
}

/**
 * Require authentication - throws if not authenticated
 * @returns Authenticated user
 */
export async function requireAuth() {
  const user = await currentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Require specific role - throws if user doesn't have the role
 * @param requiredRole - Required role
 * @returns Authenticated user with role
 */
export async function requireRole(requiredRole: UserRole) {
  const user = await requireAuth();
  const userRole = user.publicMetadata?.role as UserRole;

  if (userRole !== requiredRole) {
    throw new Error('Insufficient permissions');
  }

  return { user, role: userRole };
}

/**
 * Get the dashboard URL based on user role
 * @param role - User role
 * @returns Dashboard URL for the role
 */
export function getDashboardUrl(role: UserRole): string {
  const dashboardUrls: Record<UserRole, string> = {
    client: '/dashboard/client',
    preparer: '/dashboard/preparer',
    referrer: '/dashboard/referrer',
    admin: '/dashboard/admin',
  };

  return dashboardUrls[role];
}

/**
 * Update user role in Clerk metadata
 * This should be called server-side only
 * @param userId - Clerk user ID
 * @param role - Role to assign
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  const { clerkClient } = await import('@clerk/nextjs/server');

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
    },
  });
}
