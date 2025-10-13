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
  | 'leads'
  | 'marketing'
  | 'uploadDocuments'
  | 'returns'
  | 'messages'
  | 'referrals'
  | 'contest';

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
    leads: true,
    marketing: true,
    uploadDocuments: true,
    returns: true,
    messages: true,
    referrals: true,
    contest: true,
  },
  admin: {
    // Admin has most features, but can be customized
    dashboard: true,
    users: true,
    payouts: true,
    contentGenerator: true,
    analytics: true,
    adminManagement: false, // Cannot manage other admins by default
    database: false, // No database access by default
    settings: true,
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
  },
  affiliate: {
    // Affiliates see minimal features
    dashboard: true,
    leads: true,
    earnings: true,
    store: true,
    marketing: true,
    settings: true,
  },
  referrer: {
    // Referrers see referral-focused features
    dashboard: true,
    referrals: true,
    earnings: true,
    contest: true,
    marketing: true,
    settings: true,
  },
  client: {
    // Clients only see their own data
    dashboard: true,
    uploadDocuments: true,
    returns: true,
    messages: true,
    settings: true,
  },
};

/**
 * Permission labels for UI display
 */
export const PERMISSION_LABELS: Record<Permission, string> = {
  dashboard: 'Dashboard',
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
  leads: 'Leads',
  marketing: 'Marketing Tools',
  uploadDocuments: 'Upload Documents',
  returns: 'My Returns',
  messages: 'Messages',
  referrals: 'Referrals',
  contest: 'Contest',
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
      ];

    case 'affiliate':
      return [
        'dashboard',
        'leads',
        'earnings',
        'store',
        'marketing',
        'settings',
      ];

    case 'referrer':
      return [
        'dashboard',
        'referrals',
        'earnings',
        'contest',
        'marketing',
        'settings',
      ];

    case 'client':
      return [
        'dashboard',
        'uploadDocuments',
        'returns',
        'messages',
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
  leads: '/dashboard/affiliate/leads',
  marketing: '/dashboard/*/marketing',
  uploadDocuments: '/upload-documents',
  returns: '/dashboard/client/returns',
  messages: '/dashboard/client/messages',
  referrals: '/dashboard/referrer/referrals',
  contest: '/dashboard/referrer/contest',
};
