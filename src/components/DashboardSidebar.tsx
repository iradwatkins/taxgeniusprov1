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
  GraduationCap,
  MessageSquare,
} from 'lucide-react'
import { UserRole, UserPermissions, Permission } from '@/lib/permissions'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
  permission: Permission
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
  // Dashboard - always first
  { label: 'Dashboard', href: '/dashboard', icon: Home, permission: 'dashboard' },

  // Admin features
  { label: 'User Management', href: '/admin/users', icon: Users, permission: 'users' },
  { label: 'Payouts', href: '/admin/payouts', icon: DollarSign, permission: 'payouts' },
  { label: 'Content Generator', href: '/admin/content-generator', icon: Sparkles, permission: 'contentGenerator' },
  { label: 'Database', href: '/admin/database', icon: Database, permission: 'database' },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, permission: 'analytics' },

  // Tax Preparer features
  { label: 'Client List', href: '/dashboard/tax-preparer/clients', icon: Users, permission: 'clients' },
  { label: 'Documents', href: '/dashboard/tax-preparer/documents', icon: FileText, permission: 'documents' },
  { label: 'Store', href: '/store', icon: Package, permission: 'store' },
  { label: 'Academy', href: '/app/academy', icon: GraduationCap, permission: 'academy' },

  // Affiliate features
  { label: 'Leads', href: '/dashboard/affiliate/leads', icon: Users, permission: 'leads' },
  { label: 'Marketing Materials', href: '/dashboard/affiliate/marketing', icon: Briefcase, permission: 'marketing' },

  // Referrer features
  { label: 'Referrals', href: '/dashboard/referrer/referrals', icon: Users, permission: 'referrals' },
  { label: 'Contest', href: '/dashboard/referrer/contest', icon: Trophy, permission: 'contest' },
  { label: 'Marketing Tools', href: '/dashboard/referrer/marketing', icon: QrCode, permission: 'marketing' },

  // Client features
  { label: 'Upload Documents', href: '/upload-documents', icon: Upload, permission: 'uploadDocuments' },
  { label: 'My Returns', href: '/dashboard/client/returns', icon: FileText, permission: 'returns' },
  { label: 'Messages', href: '/dashboard/client/messages', icon: MessageSquare, permission: 'messages' },

  // Common features (always last)
  { label: 'Earnings', href: '/dashboard/earnings', icon: DollarSign, permission: 'earnings' },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, permission: 'settings' },
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

  // Generate navigation items dynamically based on user's permissions
  const navItems = ALL_NAV_ITEMS
    .filter((item) => permissions[item.permission] === true)
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
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
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
          })}
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
