import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { getUserPermissions, UserRole, UserPermissions } from '@/lib/permissions';

export default async function CRMLayout({ children }: { children: React.ReactNode }) {
  // Get real authenticated user from Clerk
  const user = await currentUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login');
  }

  // Get real role from user's public metadata
  const role = user.publicMetadata?.role as string | undefined;

  // Redirect users without CRM access (allow admin, super_admin, tax_preparer)
  if (role !== 'admin' && role !== 'super_admin' && role !== 'tax_preparer') {
    redirect('/forbidden');
  }

  // Cast role to proper type for sidebar
  const sidebarRole = role as UserRole;

  // Get user permissions (custom or default based on role)
  const customPermissions = user.publicMetadata?.permissions as
    | Partial<UserPermissions>
    | undefined;
  const permissions = getUserPermissions(sidebarRole, customPermissions);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - uses real user data from Clerk */}
      <DashboardHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - uses real role-based navigation with permissions */}
        <DashboardSidebar role={sidebarRole} permissions={permissions} className="hidden md:flex" />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/10">{children}</main>
      </div>
    </div>
  );
}
