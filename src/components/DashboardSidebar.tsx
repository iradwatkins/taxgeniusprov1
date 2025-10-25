'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Home,
  FileText,
  Upload,
  Users,
  DollarSign,
  Settings,
  ShieldCheck,
  BarChart3,
  Package,
  Briefcase,
  UserCheck,
  Trophy,
  QrCode,
  Database,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  MessageSquare,
  Mail,
  Calendar,
  BookOpen,
  FolderOpen,
  TrendingUp,
  Share2,
  Bell,
  Megaphone,
  Globe,
  Link2,
  CreditCard,
} from 'lucide-react';
import { UserRole, UserPermissions } from '@/lib/permissions';
import { logger } from '@/lib/logger';
import {
  ALL_NAV_ITEMS,
  ROLE_DASHBOARD_ROUTES,
  SECTION_ROLE_RESTRICTIONS,
  type NavItem,
} from '@/lib/navigation-items';

interface DashboardSidebarProps {
  role: UserRole;
  permissions: Partial<UserPermissions>;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}

export function DashboardSidebar({
  role,
  permissions,
  isCollapsed: controlledCollapsed,
  onCollapsedChange,
  className,
}: DashboardSidebarProps) {
  // Load collapsed state from localStorage on mount
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved === 'true';
    }
    return false;
  });

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    '⚙️ System Controls': true, // Keep System Controls collapsed by default
    // Ensure client dashboard section is NOT collapsed
    '📱 My Dashboard': false,
  });
  const pathname = usePathname();

  // Use controlled state if provided, otherwise use internal state
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleCollapsedChange = (collapsed: boolean) => {
    if (onCollapsedChange) {
      onCollapsedChange(collapsed);
    } else {
      setInternalCollapsed(collapsed);
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebar-collapsed', String(collapsed));
      }
    }
  };

  // Generate navigation items dynamically based on user's permissions AND role
  const navItems = ALL_NAV_ITEMS.filter((item) => {
    // Check permission first
    if (permissions[item.permission] !== true) return false;

    // If item has role restrictions, check if user's role is included
    if (item.roles && item.roles.length > 0) {
      return item.roles.includes(role);
    }

    // No role restrictions, show to all users with permission
    return true;
  }).map((item) => {
    // Dashboard Home is special - update href based on role (but only for the generic /dashboard route)
    if (item.permission === 'dashboard' && item.href === '/dashboard') {
      return { ...item, href: ROLE_DASHBOARD_ROUTES[role] };
    }

    // Earnings is special - update href based on role
    if (item.permission === 'earnings') {
      const earningsRoutes: Record<UserRole, string> = {
        super_admin: '/admin/earnings',
        admin: '/admin/earnings',
        lead: '/dashboard/lead/earnings',
        tax_preparer: '/dashboard/tax-preparer/earnings',
        affiliate: '/dashboard/affiliate/earnings',
        client: '/dashboard/client/earnings',
      };
      return { ...item, href: earningsRoutes[role] };
    }

    // Settings is special - update href based on role
    if (item.permission === 'settings') {
      const settingsRoutes: Record<UserRole, string> = {
        super_admin: '/admin/settings',
        admin: '/admin/settings',
        lead: '/dashboard/lead/settings',
        tax_preparer: '/dashboard/tax-preparer/settings',
        affiliate: '/dashboard/affiliate/settings',
        client: '/dashboard/client/settings',
      };
      return { ...item, href: settingsRoutes[role] };
    }

    // Return item as-is for all other cases
    return item;
  });

  // Group items by section for admin users
  const groupedItems = navItems.reduce(
    (acc, item) => {
      const section = item.section || 'Other';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(item);
      return acc;
    },
    {} as Record<string, typeof navItems>
  );

  // Helper function to check if a section should be visible for this role
  const isSectionVisibleForRole = (sectionName: string): boolean => {
    const allowedRoles = SECTION_ROLE_RESTRICTIONS[sectionName];
    // If no restriction defined, section is visible to all
    if (!allowedRoles) return true;
    // Check if current role is in the allowed list
    return allowedRoles.includes(role);
  };

  // Debug: Log the role and grouped items
  logger.info('Dashboard Sidebar Debug:', {
    role,
    isAdminOrSuperAdmin: role === 'admin' || role === 'super_admin',
    totalNavItems: navItems.length,
    sections: Object.keys(groupedItems),
    itemsPerSection: Object.entries(groupedItems).map(([section, items]) => ({
      section,
      count: items.length,
      items: items.map((i) => ({ label: i.label, href: i.href })),
    })),
    permissions,
  });

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'relative flex flex-col border-r bg-background transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64',
          className
        )}
      >
        {/* Collapse Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border bg-background shadow-md"
          onClick={() => handleCollapsedChange(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-2">
            {role === 'admin' || role === 'super_admin' ? (
              // Render with sections for admin users - ordered sections
              // Define section order for consistent display
              <div className="space-y-4">
                {[
                  '📊 Overview',
                  '👥 Clients',
                  '📋 CRM',
                  '💰 Financials',
                  '📊 Analytics',
                  '📢 Marketing',
                  '🎓 Learning',
                  '💼 Business',
                  '🔗 Quick Share Tools',
                  '⚙️ System Controls',
                  '⚙️ Settings',
                ].map((sectionName, sectionIndex) => {
                  const items = groupedItems[sectionName];
                  if (!items || items.length === 0) return null;

                  // Check if this section should be visible for the current role
                  if (!isSectionVisibleForRole(sectionName)) return null;

                  const isSectionCollapsed = collapsedSections[sectionName] ?? false;

                  return (
                    <div key={sectionName} className="space-y-1">
                      {/* Section header with collapsible button */}
                      {!isCollapsed && (
                        <button
                          onClick={() =>
                            setCollapsedSections((prev) => ({
                              ...prev,
                              [sectionName]: !prev[sectionName],
                            }))
                          }
                          className={cn(
                            'w-full flex items-center justify-between mb-2 px-3 py-2 rounded-md border transition-all group cursor-pointer',
                            'hover:bg-accent/50 hover:border-primary/50',
                            sectionIndex === 0
                              ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20'
                              : 'bg-muted/30 border-border/50'
                          )}
                        >
                          <h3 className="text-xs font-bold tracking-wide text-foreground/90">
                            {sectionName}
                          </h3>
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 transition-transform duration-200 group-hover:text-primary',
                              isSectionCollapsed && '-rotate-90'
                            )}
                          />
                        </button>
                      )}

                      {/* Section Items - only show if not collapsed */}
                      {(!isSectionCollapsed || isCollapsed) && (
                        <div className="space-y-0.5">
                          {items.map((item) => {
                            const isActive =
                              pathname === item.href || pathname.startsWith(`${item.href}/`);
                            const Icon = item.icon;

                            const navItem = (
                              <Link key={item.href} href={item.href}>
                                <div
                                  className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    !isCollapsed && !isSectionCollapsed && 'ml-2',
                                    isCollapsed && 'justify-center',
                                    'hover:bg-accent hover:text-accent-foreground',
                                    isActive && 'bg-accent text-accent-foreground',
                                    !isActive && 'text-muted-foreground'
                                  )}
                                >
                                  <Icon className="h-5 w-5 flex-shrink-0" />
                                  {!isCollapsed && (
                                    <>
                                      <span className="flex-1">{item.label}</span>
                                      {item.badge && (
                                        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                          {item.badge}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </Link>
                            );

                            return isCollapsed ? (
                              <Tooltip key={item.href}>
                                <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>{item.label}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              navItem
                            );
                          })}
                        </div>
                      )}

                      {/* Add separator between sections (except last) */}
                      {sectionIndex < 6 && !isCollapsed && (
                        <div className="mt-2 border-b border-border/30" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              // Render with sections for non-admin users (tax_preparer, affiliate, client, lead, etc.)
              <div className="space-y-4">
                {[
                  '📱 My Dashboard', // Client/Lead only section
                  '🎯 Affiliate Dashboard', // Affiliate only section
                  '📊 Overview',
                  '👥 Clients',
                  '📋 CRM',
                  '📊 Analytics', // Fixed: was '📈 Analytics'
                  '🎓 Learning',
                  '💼 Business',
                  '⚙️ Settings',
                ].map((sectionName, sectionIndex) => {
                  const items = groupedItems[sectionName];
                  if (!items || items.length === 0) return null;

                  // Check if this section should be visible for the current role
                  if (!isSectionVisibleForRole(sectionName)) return null;

                  const isSectionCollapsed = collapsedSections[sectionName] ?? false;

                  return (
                    <div key={sectionName} className="space-y-1">
                      {/* Section header with collapsible button */}
                      {!isCollapsed && (
                        <button
                          onClick={() =>
                            setCollapsedSections((prev) => ({
                              ...prev,
                              [sectionName]: !prev[sectionName],
                            }))
                          }
                          className={cn(
                            'w-full flex items-center justify-between mb-2 px-3 py-2 rounded-md border transition-all group cursor-pointer',
                            'hover:bg-accent/50 hover:border-primary/50',
                            sectionIndex === 0
                              ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20'
                              : 'bg-muted/30 border-border/50'
                          )}
                        >
                          <h3 className="text-xs font-bold tracking-wide text-foreground/90">
                            {sectionName}
                          </h3>
                          <ChevronDown
                            className={cn(
                              'h-4 w-4 transition-transform duration-200 group-hover:text-primary',
                              isSectionCollapsed && '-rotate-90'
                            )}
                          />
                        </button>
                      )}

                      {/* Section Items - only show if not collapsed */}
                      {(!isSectionCollapsed || isCollapsed) && (
                        <div className="space-y-0.5">
                          {items.map((item) => {
                            const isActive =
                              pathname === item.href || pathname.startsWith(`${item.href}/`);
                            const Icon = item.icon;

                            const navItem = (
                              <Link key={item.href} href={item.href}>
                                <div
                                  className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    !isCollapsed && !isSectionCollapsed && 'ml-2',
                                    isCollapsed && 'justify-center',
                                    'hover:bg-accent hover:text-accent-foreground',
                                    isActive && 'bg-accent text-accent-foreground',
                                    !isActive && 'text-muted-foreground'
                                  )}
                                >
                                  <Icon className="h-5 w-5 flex-shrink-0" />
                                  {!isCollapsed && (
                                    <>
                                      <span className="flex-1">{item.label}</span>
                                      {item.badge && (
                                        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                          {item.badge}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </Link>
                            );

                            return isCollapsed ? (
                              <Tooltip key={item.href}>
                                <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>{item.label}</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              navItem
                            );
                          })}
                        </div>
                      )}

                      {/* Add separator between sections (except last) */}
                      {sectionIndex < 6 && !isCollapsed && (
                        <div className="mt-2 border-b border-border/30" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </nav>
        </ScrollArea>

        {/* Footer with Role Badge */}
        {!isCollapsed && (
          <div className="border-t p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span className="capitalize">{role.replace('_', ' ')} Account</span>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
