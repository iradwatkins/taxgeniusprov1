'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Eye } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { RoleSwitcher } from '@/components/admin/RoleSwitcher';
import { UserRole } from '@/lib/permissions';

interface DashboardHeaderProps {
  actualRole?: UserRole;
  effectiveRole?: UserRole;
  isViewingAsOtherRole?: boolean;
}

export function DashboardHeader({
  actualRole,
  effectiveRole,
  isViewingAsOtherRole = false,
}: DashboardHeaderProps) {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  // ALWAYS trust server props if provided (prevents flickering from stale Clerk cache)
  // Only fall back to client-side user data if server didn't provide props
  const role = effectiveRole ?? (user?.publicMetadata?.role as UserRole | undefined);
  const realRole = actualRole ?? (user?.publicMetadata?.role as UserRole | undefined);

  // If we have server props, don't let client data override them during hydration
  const displayRole = effectiveRole !== undefined ? effectiveRole : role;
  const displayRealRole = actualRole !== undefined ? actualRole : realRole;

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'admin':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'lead':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'tax_preparer':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'affiliate':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'client':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const formatRole = (role?: string) => {
    if (!role) return 'User';
    return role
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background z-10">
      {/* Sidebar Toggle */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Logo/Brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <span className="text-white font-bold text-sm">TG</span>
        </div>
        <span className="text-lg font-semibold hidden md:block">Tax Genius</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Role Switcher - Only for admins */}
          {(displayRealRole === 'super_admin' || displayRealRole === 'admin') && (
            <RoleSwitcher
              actualRole={displayRealRole}
              effectiveRole={displayRole || 'client'}
              isViewingAsOtherRole={isViewingAsOtherRole}
            />
          )}

          {/* Dark Mode Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
          </Button>

          {/* User Profile Section */}
          <div className="flex items-center gap-3 pl-2 border-l">
            {/* User Info - Hidden on small screens */}
            <div className="hidden lg:flex flex-col items-end">
              <p className="text-sm font-medium leading-none">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0]}
              </p>
              <Badge
                variant="secondary"
                className={`mt-1 text-xs flex items-center gap-1 ${getRoleBadgeColor(displayRole)}`}
              >
                {isViewingAsOtherRole && <Eye className="h-3 w-3" />}
                {formatRole(displayRole)}
              </Badge>
            </div>

            {/* Clerk User Button with custom appearance */}
            <UserButton
              afterSignOutUrl="/auth/login"
              appearance={{
                elements: {
                  avatarBox: 'h-10 w-10',
                  userButtonPopoverCard: 'shadow-lg',
                },
              }}
            />
          </div>
        </div>
    </header>
  );
}
