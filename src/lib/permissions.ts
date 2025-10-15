/**
 * Permission System
 *
 * Manages granular access control for different user roles.
 * Permissions are stored in Clerk publicMetadata.permissions
 */

export type Permission =
  | 'dashboard'
  | 'users'
  | 'payouts'
  | 'contentGenerator'
  | 'database'
  | 'analytics'
  | 'adminManagement'
  | 'clients'
  | 'documents'
  | 'store'
  | 'academy'
  | 'earnings'
  | 'settings'
  | 'marketing'
  | 'uploadDocuments'
  | 'contest'
  | 'trackingCode'
  // New permissions for admin navigation
  | 'clientsStatus'
  | 'referralsStatus'
  | 'emails'
  | 'calendar'
  | 'addressBook'
  | 'clientFileCenter'
  | 'googleAnalytics'
  | 'referralsAnalytics'
  | 'learningCenter'
  | 'marketingHub'
  | 'quickShareLinks'
  | 'alerts';

// Section permissions - control entire sections
export type SectionPermission =
  | 'section_general'
  | 'section_client_management'
  | 'section_communications'
  | 'section_analytics'
  | 'section_growth_marketing'
  | 'section_content_learning'
  | 'section_marketing_materials'
  | 'section_financial'
  | 'section_system_admin';

// Map sections to their display names
export const SECTION_NAMES: Record<SectionPermission, string> = {
  'section_general': '🔔 General',
  'section_client_management': '👥 Client Management',
  'section_communications': '📧 Communications',
  'section_analytics': '📊 Analytics & Reporting',
  'section_growth_marketing': '🚀 Growth & Marketing',
  'section_content_learning': '🎓 Content & Learning',
  'section_marketing_materials': '📢 Marketing Materials',
  'section_financial': '💰 Financial',
  'section_system_admin': '⚙️ System Administration',
};

// Map sections to their permissions
export const SECTION_PERMISSIONS: Record<SectionPermission, Permission[]> = {
  'section_general': ['dashboard', 'alerts'],
  'section_client_management': ['clientsStatus', 'clients', 'clientFileCenter', 'documents', 'uploadDocuments'],
  'section_communications': ['emails', 'calendar', 'addressBook'],
  'section_analytics': ['analytics', 'googleAnalytics', 'referralsAnalytics'],
  'section_growth_marketing': ['referralsStatus', 'contest', 'quickShareLinks'],
  'section_content_learning': ['learningCenter', 'academy', 'contentGenerator'],
  'section_marketing_materials': ['marketingHub', 'marketing'],
  'section_financial': ['payouts', 'earnings', 'store'],
  'section_system_admin': ['users', 'adminManagement', 'database', 'settings'],
};

export type UserPermissions = Record<Permission, boolean>;

export type UserRole = 'super_admin' | 'admin' | 'tax_preparer' | 'affiliate' | 'referrer' | 'client';

/**
 * Default permissions for each role
 * These are the baseline permissions that can be customized by super_admin
 */
export const DEFAULT_PERMISSIONS: Record<UserRole, Partial<UserPermissions>> = {
  super_admin: {
    // Super admin has ALL permissions
    dashboard: true,
    users: true,
    payouts: true,
    contentGenerator: true,
    database: true,
    analytics: true,
    adminManagement: true,
    clients: true,
    documents: true,
    store: true,
    academy: true,
    earnings: true,
    settings: true,
    marketing: true,
    uploadDocuments: true,
    contest: true,
    // New admin navigation permissions
    clientsStatus: true,
    referralsStatus: true,
    emails: true,
    calendar: true,
    addressBook: true,
    clientFileCenter: true,
    googleAnalytics: true,
    referralsAnalytics: true,
    learningCenter: true,
    marketingHub: true,
    quickShareLinks: true,
    alerts: true,
  },
  admin: {
    // Admin has limited features by default, super_admin can grant more
    dashboard: true,
    alerts: false, // Phone alerts restricted by default
    users: true,
    payouts: true,
    contentGenerator: true,
    analytics: true,
    adminManagement: false, // Cannot manage permissions (super_admin only)
    database: false, // No database access by default
    settings: true,
    // Client Management - some restricted
    clientsStatus: true,
    clients: true,
    clientFileCenter: false, // Restricted - contains sensitive client files
    documents: false, // Restricted - sensitive documents
    uploadDocuments: false,
    // Communications - available
    emails: true,
    calendar: true,
    addressBook: true,
    // Analytics - some restricted
    googleAnalytics: false, // Restricted - requires API access
    referralsAnalytics: true,
    // Growth & Marketing - available
    referralsStatus: true,
    contest: false,
    quickShareLinks: true,
    // Content & Learning - available
    learningCenter: true,
    academy: true,
    // Marketing Materials - available
    marketingHub: true,
    marketing: true,
    // Financial - some restricted
    payouts: true,
    earnings: true,
    store: true,
  },
  tax_preparer: {
    // Tax preparers see client-focused features
    dashboard: true,
    clients: true,
    documents: true,
    store: true,
    academy: true,
    earnings: true,
    settings: true,
    analytics: true, // Can view their own lead analytics
    trackingCode: true, // Can manage their tracking code
    quickShareLinks: true, // Can create short links for marketing
  },
  affiliate: {
    // Affiliates see minimal features
    dashboard: true,
    earnings: true,
    store: true,
    marketing: true,
    settings: true,
    analytics: true, // Can view their own affiliate analytics
    trackingCode: true, // Can manage their tracking code
    quickShareLinks: true, // Can create short links for marketing
  },
  referrer: {
    // Referrers see referral-focused features
    dashboard: true,
    earnings: true,
    contest: true,
    marketing: true,
    settings: true,
    analytics: true, // Can view their own referral analytics
    trackingCode: true, // Can manage their tracking code
    quickShareLinks: true, // Can create short links for marketing
  },
  client: {
    // Clients only see their own data
    dashboard: true,
    uploadDocuments: true,
    settings: true,
  },
};

/**
 * Permission labels for UI display
 */
export const PERMISSION_LABELS: Record<Permission, string> = {
  dashboard: 'Dashboard',
  alerts: 'Phone Alerts & Notifications',
  users: 'User Management',
  payouts: 'Payouts',
  contentGenerator: 'Content Generator',
  database: 'Database',
  analytics: 'Analytics',
  adminManagement: 'Admin Management',
  clients: 'Client List',
  documents: 'Documents',
  store: 'Store',
  academy: 'Academy',
  earnings: 'Earnings',
  settings: 'Settings',
  marketing: 'Marketing Tools',
  uploadDocuments: 'Upload Documents',
  contest: 'Contest',
  trackingCode: 'Tracking Code',
  // New admin navigation permissions
  clientsStatus: 'Clients Status',
  referralsStatus: 'Referrals Status',
  emails: 'Emails',
  calendar: 'Calendar',
  addressBook: 'Address Book',
  clientFileCenter: 'Client File Centers',
  googleAnalytics: 'Google Analytics',
  referralsAnalytics: 'Referrals Analytics',
  learningCenter: 'Learning Center',
  marketingHub: 'Marketing Hub',
  quickShareLinks: 'Quick Share Links',
};

/**
 * Get permissions for a user based on their role and custom permissions
 */
export function getUserPermissions(
  role: UserRole,
  customPermissions?: Partial<UserPermissions>
): Partial<UserPermissions> {
  const defaultPerms = DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS.client;

  // If custom permissions are provided, merge with defaults
  if (customPermissions) {
    return { ...defaultPerms, ...customPermissions };
  }

  return defaultPerms;
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  userPermissions: Partial<UserPermissions>,
  permission: Permission
): boolean {
  return userPermissions[permission] === true;
}

/**
 * Get available permissions to edit for a specific role
 * Super admin can edit all, but lower roles have restrictions
 */
export function getEditablePermissions(role: UserRole): Permission[] {
  switch (role) {
    case 'super_admin':
      return Object.keys(DEFAULT_PERMISSIONS.super_admin) as Permission[];

    case 'admin':
      // Admins can be granted these permissions
      return [
        'dashboard',
        'users',
        'payouts',
        'contentGenerator',
        'analytics',
        'adminManagement',
        'database',
        'settings',
        // New admin permissions
        'clientsStatus',
        'referralsStatus',
        'emails',
        'calendar',
        'addressBook',
        'clientFileCenter',
        'googleAnalytics',
        'referralsAnalytics',
        'learningCenter',
        'marketingHub',
        'quickShareLinks',
      ];

    case 'tax_preparer':
      // Tax preparers have these fixed features
      return [
        'dashboard',
        'clients',
        'documents',
        'store',
        'academy',
        'earnings',
        'settings',
        'analytics',
        'trackingCode',
        'quickShareLinks',
      ];

    case 'affiliate':
      return [
        'dashboard',
        'earnings',
        'store',
        'marketing',
        'settings',
        'analytics',
        'trackingCode',
        'quickShareLinks',
      ];

    case 'referrer':
      return [
        'dashboard',
        'earnings',
        'contest',
        'marketing',
        'settings',
        'analytics',
        'trackingCode',
        'quickShareLinks',
      ];

    case 'client':
      return [
        'dashboard',
        'uploadDocuments',
        'settings',
      ];

    default:
      return [];
  }
}

/**
 * Map permissions to navigation routes
 */
export const PERMISSION_TO_ROUTE: Record<Permission, string> = {
  dashboard: '/dashboard',
  users: '/admin/users',
  payouts: '/admin/payouts',
  contentGenerator: '/admin/content-generator',
  database: '/admin/database',
  analytics: '/admin/analytics',
  adminManagement: '/admin/permissions',
  clients: '/dashboard/tax-preparer/clients',
  documents: '/dashboard/tax-preparer/documents',
  store: '/store',
  academy: '/app/academy',
  earnings: '/dashboard/*/earnings',
  settings: '/dashboard/*/settings',
  marketing: '/dashboard/*/marketing',
  uploadDocuments: '/upload-documents',
  contest: '/dashboard/referrer/contest',
  trackingCode: '/dashboard/*/tracking',
  alerts: '/admin/alerts',
  // New admin navigation routes
  clientsStatus: '/admin/clients-status',
  referralsStatus: '/admin/referrals-status',
  emails: '/admin/emails',
  calendar: '/admin/calendar',
  addressBook: '/admin/address-book',
  clientFileCenter: '/admin/file-center',
  googleAnalytics: '/admin/analytics/google',
  referralsAnalytics: '/admin/analytics/referrals',
  learningCenter: '/admin/learning-center',
  marketingHub: '/admin/marketing-hub',
  quickShareLinks: '/admin/quick-share',
};
