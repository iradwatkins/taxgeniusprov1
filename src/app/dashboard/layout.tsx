import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { DashboardHeader } from '@/components/DashboardHeader'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { ViewingAsBar } from '@/components/admin/ViewingAsBar'
import { getUserPermissions, UserRole, UserPermissions } from '@/lib/permissions'
import { getEffectiveRole } from '@/lib/utils/role-switcher'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get real authenticated user from Clerk
  const user = await currentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login')
  }

  // Get real role from user's public metadata
  const actualRole = (user.publicMetadata?.role as UserRole) || 'client'

  // Get effective role (checks if admin is viewing as another role)
  const roleInfo = await getEffectiveRole(actualRole, user.id)
  const effectiveRole = roleInfo.effectiveRole
  const isViewingAsOtherRole = roleInfo.isViewingAsOtherRole
  const viewingRoleName = roleInfo.viewingRoleName

  // Get user permissions based on effective role
  const customPermissions = user.publicMetadata?.permissions as Partial<UserPermissions> | undefined
  const permissions = getUserPermissions(effectiveRole, customPermissions)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - uses real user data from Clerk */}
      <DashboardHeader
        actualRole={actualRole}
        effectiveRole={effectiveRole}
        isViewingAsOtherRole={isViewingAsOtherRole}
      />

      {/* Viewing As Bar - shows when admin is viewing as another role */}
      {isViewingAsOtherRole && (
        <ViewingAsBar
          actualRole={actualRole}
          effectiveRole={effectiveRole}
          viewingRoleName={viewingRoleName}
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - uses effective role-based navigation with permissions */}
        <DashboardSidebar
          role={effectiveRole}
          permissions={permissions}
          className="hidden md:flex"
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  )
}
