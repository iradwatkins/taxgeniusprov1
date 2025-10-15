'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
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
} from 'lucide-react'
import { UserRole, UserPermissions, Permission } from '@/lib/permissions'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
  permission: Permission
  section?: string // Add section for grouping
  roles?: UserRole[] // Restrict to specific roles
}

interface DashboardSidebarProps {
  role: UserRole
  permissions: Partial<UserPermissions>
  isCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  className?: string
}

// All possible navigation items with their permission requirements
const ALL_NAV_ITEMS: NavItem[] = [
  // 🧩 Admin Side Navigation Section
  { label: 'Dashboard (Overview)', href: '/dashboard', icon: Home, permission: 'dashboard', section: '🧩 Admin Side Navigation' },

  // 👥 Management Section
  { label: 'Clients Status', href: '/admin/clients-status', icon: UserCheck, permission: 'clientsStatus', section: '👥 Management' },
  { label: 'Referrals Status', href: '/admin/referrals-status', icon: Users, permission: 'referralsStatus', section: '👥 Management' },
  { label: 'Emails', href: '/admin/emails', icon: Mail, permission: 'emails', section: '👥 Management' },
  { label: 'Calendar / Appointments', href: '/admin/calendar', icon: Calendar, permission: 'calendar', section: '👥 Management' },
  { label: 'Address Book', href: '/admin/address-book', icon: BookOpen, permission: 'addressBook', section: '👥 Management' },
  { label: 'Client File Centers', href: '/admin/file-center', icon: FolderOpen, permission: 'clientFileCenter', section: '👥 Management' },
  { label: 'Payouts', href: '/admin/payouts', icon: DollarSign, permission: 'payouts', section: '👥 Management' },

  // 📊 Analytics Section (Admin only)
  { label: 'Analytics Overview', href: '/admin/analytics', icon: BarChart3, permission: 'analytics', section: '📊 Analytics', roles: ['admin', 'super_admin'] },
  { label: 'Tax Genius Analytics', href: '/admin/analytics/tax-genius', icon: Sparkles, permission: 'analytics', section: '📊 Analytics', roles: ['admin', 'super_admin'] },
  { label: 'Tax Preparers Analytics', href: '/admin/analytics/preparers', icon: Users, permission: 'analytics', section: '📊 Analytics', roles: ['admin', 'super_admin'] },
  { label: 'Affiliates Analytics', href: '/admin/analytics/affiliates', icon: Trophy, permission: 'analytics', section: '📊 Analytics', roles: ['admin', 'super_admin'] },
  { label: 'Clients Analytics', href: '/admin/analytics/clients', icon: TrendingUp, permission: 'analytics', section: '📊 Analytics', roles: ['admin', 'super_admin'] },

  // Role-specific Analytics (for non-admin users)
  { label: 'My Analytics', href: '/dashboard/tax-preparer/analytics', icon: BarChart3, permission: 'analytics', section: '📊 My Analytics', roles: ['tax_preparer'] },
  { label: 'My Analytics', href: '/dashboard/affiliate/analytics', icon: BarChart3, permission: 'analytics', section: '📊 My Analytics', roles: ['affiliate'] },
  { label: 'My Analytics', href: '/dashboard/referrer/analytics', icon: BarChart3, permission: 'analytics', section: '📊 My Analytics', roles: ['referrer'] },

  // Tracking Code (for users with marketing features)
  { label: 'My Tracking Code', href: '/dashboard/tax-preparer/tracking', icon: QrCode, permission: 'trackingCode', section: '📢 Marketing', roles: ['tax_preparer'] },
  { label: 'My Tracking Code', href: '/dashboard/affiliate/tracking', icon: QrCode, permission: 'trackingCode', section: '📢 Marketing', roles: ['affiliate'] },
  { label: 'My Tracking Code', href: '/dashboard/referrer/tracking', icon: QrCode, permission: 'trackingCode', section: '📢 Marketing', roles: ['referrer'] },

  // 🎓 Learning Center Section
  { label: 'Learning Center', href: '/admin/learning-center', icon: GraduationCap, permission: 'learningCenter', section: '🎓 Learning Center' },
  { label: 'Academy', href: '/app/academy', icon: GraduationCap, permission: 'academy', section: '🎓 Learning Center' },

  // 📢 Marketing Section
  { label: 'Marketing Hub', href: '/admin/marketing-hub', icon: Megaphone, permission: 'marketingHub', section: '📢 Marketing' },
  { label: 'Tracking Codes', href: '/admin/tracking-codes', icon: QrCode, permission: 'marketingHub', section: '📢 Marketing', roles: ['admin', 'super_admin'] },
  { label: 'Marketing Materials', href: '/dashboard/affiliate/marketing', icon: Briefcase, permission: 'marketing', section: '📢 Marketing' },
  { label: 'Content Generator', href: '/admin/content-generator', icon: Sparkles, permission: 'contentGenerator', section: '📢 Marketing' },
  { label: 'Contest', href: '/dashboard/referrer/contest', icon: Trophy, permission: 'contest', section: '📢 Marketing' },
  { label: 'Marketing Tools', href: '/dashboard/referrer/marketing', icon: QrCode, permission: 'marketing', section: '📢 Marketing' },
  { label: 'Store', href: '/store', icon: Package, permission: 'store', section: '📢 Marketing' },

  // ⚙️ System Controls Section
  { label: 'User Management', href: '/admin/users', icon: Users, permission: 'users', section: '⚙️ System Controls' },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, permission: 'settings', section: '⚙️ System Controls' },
  { label: 'Database', href: '/admin/database', icon: Database, permission: 'database', section: '⚙️ System Controls' },

  // 🔗 Quick Share Tools Section
  { label: 'Quick Share Links', href: '/admin/quick-share', icon: Link2, permission: 'quickShareLinks', section: '🔗 Quick Share Tools' },
  { label: 'Tax Prep Referral Link', href: '/admin/quick-share#referral', icon: Share2, permission: 'quickShareLinks', section: '🔗 Quick Share Tools' },
  { label: 'Tax Prep Share Link', href: '/admin/quick-share#share', icon: Share2, permission: 'quickShareLinks', section: '🔗 Quick Share Tools' },
]

// Dashboard routes by role (for redirecting to correct dashboard)
const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  super_admin: '/dashboard/admin',
  admin: '/dashboard/admin',
  tax_preparer: '/dashboard/tax-preparer',
  affiliate: '/dashboard/affiliate',
  referrer: '/dashboard/referrer',
  client: '/dashboard/client',
}

export function DashboardSidebar({
  role,
  permissions,
  isCollapsed: controlledCollapsed,
  onCollapsedChange,
  className,
}: DashboardSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    '⚙️ System Controls': true, // Keep System Controls collapsed by default
  })
  const pathname = usePathname()

  // Use controlled state if provided, otherwise use internal state
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed

  const handleCollapsedChange = (collapsed: boolean) => {
    if (onCollapsedChange) {
      onCollapsedChange(collapsed)
    } else {
      setInternalCollapsed(collapsed)
    }
  }

  // Generate navigation items dynamically based on user's permissions AND role
  const navItems = ALL_NAV_ITEMS
    .filter((item) => {
      // Check permission first
      if (permissions[item.permission] !== true) return false

      // If item has role restrictions, check if user's role is included
      if (item.roles && item.roles.length > 0) {
        return item.roles.includes(role)
      }

      // No role restrictions, show to all users with permission
      return true
    })
    .map((item) => {
      // Dashboard is special - update href based on role
      if (item.permission === 'dashboard') {
        return { ...item, href: ROLE_DASHBOARD_ROUTES[role] }
      }

      // Earnings is special - update href based on role
      if (item.permission === 'earnings') {
        const earningsRoutes: Record<UserRole, string> = {
          super_admin: '/admin/earnings',
          admin: '/admin/earnings',
          tax_preparer: '/dashboard/tax-preparer/earnings',
          affiliate: '/dashboard/affiliate/earnings',
          referrer: '/dashboard/referrer/earnings',
          client: '/dashboard/client/earnings',
        }
        return { ...item, href: earningsRoutes[role] }
      }

      // Settings is special - update href based on role
      if (item.permission === 'settings') {
        const settingsRoutes: Record<UserRole, string> = {
          super_admin: '/admin/settings',
          admin: '/admin/settings',
          tax_preparer: '/dashboard/tax-preparer/settings',
          affiliate: '/dashboard/affiliate/settings',
          referrer: '/dashboard/referrer/settings',
          client: '/dashboard/client/settings',
        }
        return { ...item, href: settingsRoutes[role] }
      }

      // Return item as-is for all other cases
      return item
    })

  // Group items by section for admin users
  const groupedItems = navItems.reduce((acc, item) => {
    const section = item.section || 'Other'
    if (!acc[section]) {
      acc[section] = []
    }
    acc[section].push(item)
    return acc
  }, {} as Record<string, typeof navItems>)

  // Debug: Log the role and grouped items
  console.log('Dashboard Sidebar Debug:', {
    role,
    isAdminOrSuperAdmin: role === 'admin' || role === 'super_admin',
    totalNavItems: navItems.length,
    sections: Object.keys(groupedItems),
    itemsPerSection: Object.entries(groupedItems).map(([section, items]) => ({
      section,
      count: items.length
    }))
  })

  return (
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
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Sidebar Content */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-2">
          {(role === 'admin' || role === 'super_admin') ? (
            // Render with sections for admin users - ordered sections
            // Define section order for consistent display
            <div className="space-y-4">
              {['🧩 Admin Side Navigation', '👥 Management', '📊 Analytics', '🎓 Learning Center',
               '📢 Marketing', '⚙️ System Controls', '🔗 Quick Share Tools'].map((sectionName, sectionIndex) => {
                const items = groupedItems[sectionName];
                if (!items || items.length === 0) return null;

                const isSectionCollapsed = collapsedSections[sectionName] ?? false;

                return (
                  <div key={sectionName} className="space-y-1">
                    {/* Section header with collapsible button */}
                    {!isCollapsed && (
                      <button
                        onClick={() => setCollapsedSections(prev => ({
                          ...prev,
                          [sectionName]: !prev[sectionName]
                        }))}
                        className={cn(
                          "w-full flex items-center justify-between mb-2 px-3 py-2 rounded-md border transition-colors hover:bg-accent/50",
                          sectionIndex === 0 ? "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20" : "bg-muted/30 border-border/50"
                        )}
                      >
                        <h3 className="text-xs font-bold tracking-wide text-foreground/90">
                          {sectionName}
                        </h3>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isSectionCollapsed && "-rotate-90"
                          )}
                        />
                      </button>
                    )}

                    {/* Section Items - only show if not collapsed */}
                    {(!isSectionCollapsed || isCollapsed) && (
                      <div className="space-y-0.5">
                        {items.map((item) => {
                          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                          const Icon = item.icon

                          return (
                            <Link key={item.href} href={item.href}>
                              <div
                                className={cn(
                                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                  !isCollapsed && !isSectionCollapsed && "ml-2",
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
                          )
                        })}
                      </div>
                    )}

                    {/* Add separator between sections (except last) */}
                    {sectionIndex < 6 && !isCollapsed && (
                      <div className="mt-2 border-b border-border/30" />
                    )}
                  </div>
                )
              })}</div>
          ) : (
            // Render flat list for non-admin users
            navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
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
              )
            })
          )}
        </nav>
      </ScrollArea>

      {/* Footer with Role Badge */}
      {!isCollapsed && (
        <div className="border-t p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span className="capitalize">
              {role.replace('_', ' ')} Account
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
