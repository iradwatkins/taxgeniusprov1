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
 *
 * ==================================================================================
 * QUICK REFERENCE: WHAT MAKES EACH ROLE UNIQUE
 * ==================================================================================
 *
 * 🛡️  SUPER ADMIN:    Database, Permissions, Google Analytics, All Client Files, Alerts
 * 👑 ADMIN:          User Management, Payouts, Content Generator, System-wide Analytics
 * 📊 TAX PREPARER:   Client Documents (their clients only), Lead Tracking, Academy
 * 🤝 AFFILIATE:      Marketing Store, Professional Marketing Materials, Conversion Tracking
 * 🎯 REFERRER:       Contests (unique!), Simple Referrals, NO Store Access
 * 👤 CLIENT:         Upload Documents Only (most restricted)
 *
 * KEY DIFFERENTIATORS:
 * - AFFILIATE has 'store' access, REFERRER does not
 * - REFERRER has 'contest' access, AFFILIATE does not
 * - TAX PREPARER sees only THEIR clients (backend filtered), not all system clients
 * - Only SUPER ADMIN can access database, manage permissions, and see all client files
 *
 * ==================================================================================
 * ROLE HIERARCHY:
 *
 * 1. SUPER_ADMIN (Highest Level - Full System Control)
 *    - Has ALL permissions including system-critical features
 *    - Can manage other admin permissions
 *    - Can access database management
 *    - Can view Google Analytics
 *    - Can access sensitive client files
 *    - Has phone alerts enabled
 *    - CANNOT be assigned to regular users (security)
 *
 * 2. ADMIN (Limited Administrative Access)
 *    - Has most admin features but RESTRICTED from critical operations
 *    - CANNOT manage permissions (adminManagement: false)
 *    - CANNOT access database (database: false)
 *    - CANNOT access sensitive client files (clientFileCenter: false)
 *    - CANNOT access Google Analytics (googleAnalytics: false)
 *    - Phone alerts DISABLED by default (alerts: false)
 *    - Can be customized by super_admin to grant additional permissions
 *
 * 3. TAX_PREPARER (Independent Tax Professional)
 *    - Manages THEIR OWN assigned clients only
 *    - Has client documents and file access (scoped to their clients)
 *    - Has tracking code for lead generation
 *    - CANNOT see other preparers' clients or system-wide data
 *
 * 4. AFFILIATE (External Professional Marketer)
 *    - Promotes TaxGeniusPro through professional marketing campaigns
 *    - Has store access for marketing materials
 *    - Sophisticated tracking and analytics
 *    - CANNOT access any client data or admin features
 *
 * 5. REFERRER (Word-of-Mouth Promoter)
 *    - Refers friends and family casually
 *    - Can participate in referral contests (unlike affiliates)
 *    - Simple tracking and basic analytics
 *    - NO store access (not professional marketers)
 *
 * 6. CLIENT (Tax Service Customer)
 *    - Most restricted role
 *    - Can only upload documents and view their own status
 *    - Cannot access any admin or marketing features
 */
export const DEFAULT_PERMISSIONS: Record<UserRole, Partial<UserPermissions>> = {
  super_admin: {
    // Super admin has ALL permissions - Full system control
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
    earnings: false, // Removed from all dashboards
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
    learningCenter: false, // Removed from all dashboards
    marketingHub: true,
    quickShareLinks: false, // Removed from all dashboards
    alerts: true,
  },
  admin: {
    // Admin has limited features by default, super_admin can grant more
    // KEY RESTRICTIONS compared to super_admin:
    // ❌ adminManagement (cannot manage permissions)
    // ❌ database (no database access)
    // ❌ googleAnalytics (no GA integration)
    // ❌ clientFileCenter (no sensitive client files)
    // ❌ alerts (phone alerts disabled)
    dashboard: true,
    alerts: false, // 🔒 SUPER_ADMIN ONLY - Phone alerts restricted by default
    users: true,
    payouts: true,
    contentGenerator: true,
    analytics: true,
    adminManagement: false, // 🔒 SUPER_ADMIN ONLY - Cannot manage permissions
    database: false, // 🔒 SUPER_ADMIN ONLY - No database access by default
    settings: true,
    // Client Management - some restricted
    clientsStatus: true,
    clients: false, // Removed client list access
    clientFileCenter: false, // 🔒 SUPER_ADMIN ONLY - Restricted - contains sensitive client files
    documents: false, // Restricted - sensitive documents
    uploadDocuments: false,
    // Communications - available
    emails: true,
    calendar: true,
    addressBook: true,
    // Analytics - some restricted
    googleAnalytics: false, // 🔒 SUPER_ADMIN ONLY - Restricted - requires API access
    referralsAnalytics: true,
    // Growth & Marketing - available
    referralsStatus: true,
    contest: false,
    quickShareLinks: false, // Removed from all dashboards
    // Content & Learning - available
    learningCenter: false, // Removed from all dashboards
    academy: true,
    // Marketing Materials - available
    marketingHub: true,
    marketing: true,
    // Financial - some restricted
    earnings: false, // Removed from all dashboards
    store: true,
  },
  tax_preparer: {
    // Tax preparers are independent contractors who prepare taxes for THEIR assigned clients
    // They should NOT have access to system-wide management tools
    dashboard: true,
    clients: true, // ✅ Their assigned clients only (filtered in backend by assignedPreparer)
    documents: true, // ✅ Documents for their clients only (filtered in backend)
    clientFileCenter: true, // ✅ Files for their clients only (filtered in backend)
    store: true, // Can purchase marketing materials
    academy: true, // Access training and certification
    settings: true,
    analytics: true, // Can view their own lead analytics
    trackingCode: true, // Can manage their personal tracking code
    // ❌ REMOVED: System-wide management tools (these are for admins only)
    // clientsStatus: false - Removed (admins manage this)
    // referralsStatus: false - Removed (not their responsibility)
    // emails: false - Removed (system-wide email management is admin-only)
    // calendar: false - Removed (system-wide calendar is admin-only)
    // addressBook: false - Removed (system-wide contacts are admin-only)
    earnings: false, // Removed from all dashboards
    quickShareLinks: false, // Removed from all dashboards
  },
  affiliate: {
    // Affiliates are EXTERNAL PROFESSIONAL MARKETERS who promote TaxGeniusPro
    // Focus: Professional marketing campaigns with detailed tracking
    dashboard: true,
    store: true, // ✅ Access to marketing materials store
    marketing: true, // ✅ Professional marketing materials and assets
    settings: true,
    analytics: true, // ✅ Detailed conversion analytics for their campaigns
    trackingCode: true, // ✅ Sophisticated tracking codes for attribution
    earnings: false, // Removed from all dashboards
    quickShareLinks: false, // Removed from all dashboards
  },
  referrer: {
    // Referrers are CASUAL WORD-OF-MOUTH PROMOTERS (friends/family referrals)
    // Focus: Simple referrals with contest participation
    dashboard: true,
    contest: true, // ✅ UNIQUE: Participate in referral contests (affiliate doesn't have this)
    marketing: true, // ✅ Simple sharing tools and referral links
    settings: true,
    analytics: true, // ✅ Basic referral statistics (simpler than affiliate)
    trackingCode: true, // ✅ Simple personal referral link
    earnings: false, // Removed from all dashboards
    quickShareLinks: false, // Removed from all dashboards
    store: false, // ❌ No store access (not professional marketers like affiliates)
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
 * Get effective permissions for a user considering viewing role
 * Used for admin "View As" functionality
 */
export function getEffectivePermissions(
  actualRole: UserRole,
  effectiveRole: UserRole,
  customPermissions?: Partial<UserPermissions>
): Partial<UserPermissions> & { isViewingAsOtherRole: boolean; actualRole: UserRole } {
  // Get permissions for the effective role (what user sees)
  const permissions = getUserPermissions(effectiveRole, customPermissions);

  // Add metadata about viewing state
  return {
    ...permissions,
    isViewingAsOtherRole: actualRole !== effectiveRole,
    actualRole,
  };
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
        'marketingHub',
        // Removed: learningCenter, quickShareLinks, earnings
      ];

    case 'tax_preparer':
      // Tax preparers have these fixed features (scoped to their assigned clients)
      return [
        'dashboard',
        'clients',          // Their assigned clients only (filtered in backend)
        'documents',        // Their clients' documents only (filtered in backend)
        'clientFileCenter', // Their clients' files only (filtered in backend)
        'store',           // Can purchase marketing materials
        'academy',         // Access training
        'settings',
        'analytics',       // Their own performance analytics
        'trackingCode',    // Their personal tracking link
        // REMOVED: clientsStatus, referralsStatus, emails, calendar, addressBook
        // (These are system-wide admin tools, not for individual tax preparers)
      ];

    case 'affiliate':
      // Affiliates are professional external marketers
      return [
        'dashboard',
        'store',        // ✅ Access to marketing materials store
        'marketing',    // Professional marketing assets
        'settings',
        'analytics',    // Detailed conversion tracking
        'trackingCode', // Sophisticated tracking codes
      ];

    case 'referrer':
      // Referrers are casual word-of-mouth promoters
      return [
        'dashboard',
        'contest',      // ✅ UNIQUE: Referral contests (affiliates don't have this)
        'marketing',    // Simple sharing tools
        'settings',
        'analytics',    // Basic referral stats
        'trackingCode', // Simple referral link
        // NO 'store' - not professional marketers like affiliates
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
