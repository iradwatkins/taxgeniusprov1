import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { DashboardLayoutClient } from '@/components/DashboardLayoutClient';
import { getUserPermissions, UserRole, UserPermissions } from '@/lib/permissions';
import { getEffectiveRole } from '@/lib/utils/role-switcher';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  // Get real authenticated user from Clerk
  const user = await currentUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login');
  }

  // Get real role from user's public metadata
  const actualRole = (user.publicMetadata?.role as UserRole) || 'client';

  // Check if user has access to store (only admins and tax preparers)
  const canAccessStore = actualRole === 'tax_preparer' || actualRole === 'admin' || actualRole === 'super_admin';

  if (!canAccessStore) {
    redirect('/forbidden');
  }

  // Get effective role (checks if admin is viewing as another role)
  const roleInfo = await getEffectiveRole(actualRole, user.id);
  const effectiveRole = roleInfo.effectiveRole;
  const isViewingAsOtherRole = roleInfo.isViewingAsOtherRole;
  const viewingRoleName = roleInfo.viewingRoleName;

  // Get user permissions based on effective role
  const customPermissions = user.publicMetadata?.permissions as
    | Partial<UserPermissions>
    | undefined;
  const permissions = getUserPermissions(effectiveRole, customPermissions);

  return (
    <DashboardLayoutClient
      actualRole={actualRole}
      effectiveRole={effectiveRole}
      isViewingAsOtherRole={isViewingAsOtherRole}
      viewingRoleName={viewingRoleName}
      permissions={permissions}
    >
      {children}
    </DashboardLayoutClient>
  );
}
