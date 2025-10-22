/**
 * Shared Navigation Items
 *
 * Single source of truth for dashboard navigation across mobile and desktop.
 * Used by both DashboardSidebar and MobileSidebar components.
 */

import {
  Home,
  FileText,
  Users,
  DollarSign,
  Settings,
  BarChart3,
  CreditCard,
  Share2,
  Calendar,
  Mail,
  FolderOpen,
  Megaphone,
  Link2,
  Database,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  Trophy,
  QrCode,
  Package,
  BookOpen,
} from 'lucide-react';
import { UserRole, Permission } from '@/lib/permissions';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  permission: Permission;
  section?: string;
  roles?: UserRole[];
}

/**
 * All possible navigation items with their permission requirements
 * Organized by section for better maintainability
 */
export const ALL_NAV_ITEMS: NavItem[] = [
  // 📱 Client Section (for clients and leads only)
  {
    label: 'Overview',
    href: '/dashboard/client',
    icon: Home,
    permission: 'dashboard',
    section: '📱 My Dashboard',
    roles: ['client', 'lead'],
  },
  {
    label: 'Documents',
    href: '/dashboard/client/documents',
    icon: FileText,
    permission: 'dashboard',
    section: '📱 My Dashboard',
    roles: ['client', 'lead'],
  },
  {
    label: 'Payments',
    href: '/dashboard/client/payments',
    icon: CreditCard,
    permission: 'dashboard',
    section: '📱 My Dashboard',
    roles: ['client', 'lead'],
  },
  {
    label: 'My Referrals',
    href: '/dashboard/client/referrals',
    icon: Share2,
    permission: 'dashboard',
    section: '📱 My Dashboard',
    roles: ['client', 'lead'],
  },

  // 🎯 Affiliate Section (for affiliates only)
  {
    label: 'Overview',
    href: '/dashboard/affiliate',
    icon: Home,
    permission: 'dashboard',
    section: '🎯 Affiliate Dashboard',
    roles: ['affiliate'],
  },
  {
    label: 'Links & QR',
    href: '/dashboard/affiliate/tracking',
    icon: QrCode,
    permission: 'trackingCode',
    section: '🎯 Affiliate Dashboard',
    roles: ['affiliate'],
  },
  {
    label: 'My Leads',
    href: '/dashboard/affiliate/leads',
    icon: Users,
    permission: 'dashboard',
    section: '🎯 Affiliate Dashboard',
    roles: ['affiliate'],
  },
  {
    label: 'Marketing',
    href: '/dashboard/affiliate/marketing',
    icon: Megaphone,
    permission: 'marketing',
    section: '🎯 Affiliate Dashboard',
    roles: ['affiliate'],
  },
  {
    label: 'Analytics',
    href: '/dashboard/affiliate/analytics',
    icon: BarChart3,
    permission: 'analytics',
    section: '🎯 Affiliate Dashboard',
    roles: ['affiliate'],
  },
  {
    label: 'Store',
    href: '/store',
    icon: Package,
    permission: 'store',
    section: '🎯 Affiliate Dashboard',
    roles: ['affiliate'],
  },

  // 👥 Clients Section (for tax preparers and admins)
  {
    label: 'My Clients',
    href: '/dashboard/tax-preparer/clients',
    icon: Users,
    permission: 'clientsStatus',
    section: '👥 Clients',
    roles: ['tax_preparer'],
  },
  {
    label: 'Clients Status',
    href: '/admin/clients-status',
    icon: UserCheck,
    permission: 'clientsStatus',
    section: '👥 Clients',
    roles: ['admin'],
  },
  {
    label: 'Referrals Status',
    href: '/admin/referrals-status',
    icon: Users,
    permission: 'referralsStatus',
    section: '👥 Clients',
    roles: ['admin'],
  },

  // 📋 CRM Section
  {
    label: 'Calendar & Appointments',
    href: '/admin/calendar',
    icon: Calendar,
    permission: 'calendar',
    section: '📋 CRM',
  },
  {
    label: 'CRM Contacts',
    href: '/admin/address-book',
    icon: BookOpen,
    permission: 'addressBook',
    section: '📋 CRM',
  },
  {
    label: 'Client File Center',
    href: '/admin/file-center',
    icon: FolderOpen,
    permission: 'clientFileCenter',
    section: '📋 CRM',
  },
  {
    label: 'Emails',
    href: '/admin/emails',
    icon: Mail,
    permission: 'emails',
    section: '📋 CRM',
  },

  // 💰 Financials Section (admin only)
  {
    label: 'Earnings',
    href: '/admin/earnings',
    icon: DollarSign,
    permission: 'earnings',
    section: '💰 Financials',
    roles: ['admin'],
  },
  {
    label: 'Payouts',
    href: '/admin/payouts',
    icon: DollarSign,
    permission: 'payouts',
    section: '💰 Financials',
    roles: ['admin'],
  },

  // 📊 Analytics Section
  {
    label: 'Analytics Overview',
    href: '/admin/analytics',
    icon: BarChart3,
    permission: 'analytics',
    section: '📊 Analytics',
    roles: ['admin'],
  },
  {
    label: 'Tax Genius Analytics',
    href: '/admin/analytics/tax-genius',
    icon: Sparkles,
    permission: 'analytics',
    section: '📊 Analytics',
    roles: ['admin'],
  },
  {
    label: 'Tax Preparers Analytics',
    href: '/admin/analytics/preparers',
    icon: Users,
    permission: 'analytics',
    section: '📊 Analytics',
    roles: ['admin'],
  },
  {
    label: 'Affiliates Analytics',
    href: '/admin/analytics/affiliates',
    icon: Trophy,
    permission: 'analytics',
    section: '📊 Analytics',
    roles: ['admin'],
  },
  {
    label: 'Clients Analytics',
    href: '/admin/analytics/clients',
    icon: TrendingUp,
    permission: 'analytics',
    section: '📊 Analytics',
    roles: ['admin'],
  },

  // 📢 Marketing Section
  {
    label: 'Marketing Hub',
    href: '/admin/marketing-hub',
    icon: Megaphone,
    permission: 'marketingHub',
    section: '📢 Marketing',
    roles: ['admin'],
  },
  {
    label: 'Tracking Codes',
    href: '/admin/tracking-codes',
    icon: QrCode,
    permission: 'marketingHub',
    section: '📢 Marketing',
    roles: ['admin'],
  },
  {
    label: 'Content Generator',
    href: '/admin/content-generator',
    icon: Sparkles,
    permission: 'contentGenerator',
    section: '📢 Marketing',
    roles: ['admin'],
  },

  // 🎓 Learning Section
  {
    label: 'Learning Center',
    href: '/admin/learning-center',
    icon: GraduationCap,
    permission: 'learningCenter',
    section: '🎓 Learning',
    roles: ['admin'],
  },
  {
    label: 'Academy',
    href: '/app/academy',
    icon: GraduationCap,
    permission: 'academy',
    section: '🎓 Learning',
  },

  // 💼 Business Section (for tax preparers and affiliates)
  {
    label: 'My Earnings',
    href: '/dashboard/tax-preparer/earnings',
    icon: DollarSign,
    permission: 'earnings',
    section: '💼 Business',
    roles: ['tax_preparer'],
  },
  {
    label: 'My Analytics',
    href: '/dashboard/tax-preparer/analytics',
    icon: BarChart3,
    permission: 'analytics',
    section: '💼 Business',
    roles: ['tax_preparer'],
  },
  {
    label: 'My Tracking Code',
    href: '/dashboard/tax-preparer/tracking',
    icon: QrCode,
    permission: 'trackingCode',
    section: '💼 Business',
    roles: ['tax_preparer'],
  },
  {
    label: 'Academy',
    href: '/app/academy',
    icon: GraduationCap,
    permission: 'academy',
    section: '💼 Business',
    roles: ['tax_preparer', 'affiliate'],
  },
  {
    label: 'Store',
    href: '/store',
    icon: Package,
    permission: 'store',
    section: '💼 Business',
    roles: ['tax_preparer', 'affiliate'],
  },
  {
    label: 'My Earnings',
    href: '/dashboard/affiliate/earnings',
    icon: DollarSign,
    permission: 'earnings',
    section: '💼 Business',
    roles: ['affiliate'],
  },

  // 🔗 Quick Share Tools Section
  {
    label: 'Quick Share Links',
    href: '/admin/quick-share',
    icon: Link2,
    permission: 'quickShareLinks',
    section: '🔗 Quick Share Tools',
    roles: ['admin'],
  },

  // ⚙️ System Controls Section
  {
    label: 'User Management',
    href: '/admin/users',
    icon: Users,
    permission: 'users',
    section: '⚙️ System Controls',
  },
  {
    label: 'Permissions',
    href: '/admin/permissions',
    icon: ShieldCheck,
    permission: 'users',
    section: '⚙️ System Controls',
    roles: ['admin'],
  },
  {
    label: 'Database',
    href: '/admin/database',
    icon: Database,
    permission: 'database',
    section: '⚙️ System Controls',
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    permission: 'settings',
    section: '⚙️ System Controls',
  },
];

/**
 * Dashboard routes by role (for redirecting generic /dashboard to role-specific dashboard)
 */
export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  admin: '/dashboard/admin',
  lead: '/dashboard/lead',
  tax_preparer: '/dashboard/tax-preparer',
  affiliate: '/dashboard/affiliate',
  client: '/dashboard/client',
};
