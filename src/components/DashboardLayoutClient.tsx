'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { MobileSidebar } from '@/components/MobileSidebar';
import { ViewingAsBar } from '@/components/admin/ViewingAsBar';
import { TaxAssistantWidget } from '@/components/tax-assistant/TaxAssistantWidget';
import { UserRole, UserPermissions } from '@/lib/permissions';

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  actualRole: UserRole;
  effectiveRole: UserRole;
  isViewingAsOtherRole: boolean;
  viewingRoleName?: string;
  permissions: Partial<UserPermissions>;
}

export function DashboardLayoutClient({
  children,
  actualRole,
  effectiveRole,
  isViewingAsOtherRole,
  viewingRoleName,
  permissions,
}: DashboardLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - uses real user data from Clerk */}
      <DashboardHeader
        actualRole={actualRole}
        effectiveRole={effectiveRole}
        isViewingAsOtherRole={isViewingAsOtherRole}
        onMenuClick={() => setMobileMenuOpen(true)}
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
        {/* Desktop Sidebar - uses effective role-based navigation with permissions */}
        <DashboardSidebar
          role={effectiveRole}
          permissions={permissions}
          className="hidden md:flex"
        />

        {/* Mobile Sidebar */}
        <MobileSidebar
          role={effectiveRole}
          permissions={permissions}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-muted/10">{children}</main>
      </div>

      {/* Tax Assistant Widget - Available for all logged-in users */}
      <TaxAssistantWidget />
    </div>
  );
}
