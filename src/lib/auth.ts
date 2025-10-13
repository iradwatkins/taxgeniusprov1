import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * User role types for Tax Genius platform
 */
export type UserRole = 'super_admin' | 'admin' | 'client' | 'tax_preparer' | 'referrer' | 'affiliate';

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
 * Check if current user is a super admin
 * @returns True if user is super_admin
 */
export async function isSuperAdmin(): Promise<boolean> {
  return hasRole('super_admin');
}

/**
 * Check if current user is an admin (includes super_admin)
 * @returns True if user is admin or super_admin
 */
export async function isAdmin(): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === 'admin' || userRole === 'super_admin';
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
    super_admin: '/dashboard/admin',
    admin: '/dashboard/admin',
    client: '/dashboard/client',
    tax_preparer: '/dashboard/tax-preparer',
    referrer: '/dashboard/referrer',
    affiliate: '/dashboard/affiliate',
  };

  return dashboardUrls[role];
}

/**
 * Check if user has access to the store
 * Tax preparers, affiliates, admins, and super admins can access the store
 * @returns True if user has store access
 */
export async function hasStoreAccess(): Promise<boolean> {
  const userRole = await getUserRole();
  return userRole === 'tax_preparer' || userRole === 'affiliate' || userRole === 'admin' || userRole === 'super_admin';
}

/**
 * Require one of multiple roles - throws if user doesn't have any of the specified roles
 * @param allowedRoles - Array of allowed roles
 * @returns Authenticated user with role
 */
export async function requireOneOfRoles(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  const userRole = user.publicMetadata?.role as UserRole;

  if (!allowedRoles.includes(userRole)) {
    throw new Error('Insufficient permissions');
  }

  return { user, role: userRole, profile: { id: user.id } };
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
