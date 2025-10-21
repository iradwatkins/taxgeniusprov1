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
  section_general: '🔔 General',
  section_client_management: '👥 Client Management',
  section_communications: '📧 Communications',
  section_analytics: '📊 Analytics & Reporting',
  section_growth_marketing: '🚀 Growth & Marketing',
  section_content_learning: '🎓 Content & Learning',
  section_marketing_materials: '📢 Marketing Materials',
  section_financial: '💰 Financial',
  section_system_admin: '⚙️ System Administration',
};

// Map sections to their permissions
export const SECTION_PERMISSIONS: Record<SectionPermission, Permission[]> = {
  section_general: ['dashboard', 'alerts'],
  section_client_management: [
    'clientsStatus',
    'clients',
    'clientFileCenter',
    'documents',
    'uploadDocuments',
  ],
  section_communications: ['emails', 'calendar', 'addressBook'],
  section_analytics: ['analytics', 'googleAnalytics', 'referralsAnalytics'],
  section_growth_marketing: ['referralsStatus', 'contest', 'quickShareLinks'],
  section_content_learning: ['learningCenter', 'academy', 'contentGenerator'],
  section_marketing_materials: ['marketingHub', 'marketing'],
  section_financial: ['payouts', 'earnings', 'store'],
  section_system_admin: ['users', 'adminManagement', 'database', 'settings'],
};

export type UserPermissions = Record<Permission, boolean>;

export type UserRole = 'super_admin' | 'admin' | 'tax_preparer' | 'affiliate' | 'lead' | 'client';

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
 * 🔶 LEAD:           Pending Approval (no access until role changed by admin)
 * 👤 CLIENT:         Upload Documents, Conditional Referral Access (most restricted)
 *
 * KEY DIFFERENTIATORS:
 * - LEAD has no dashboard access (pending approval page only)
 * - CLIENT can refer and see referral analytics (if they have shortLinkUsername)
 * - AFFILIATE works for Tax Genius but hasn't done taxes (can refer)
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
 *    - Works for Tax Genius but hasn't done taxes yet
 *    - Has store access for marketing materials
 *    - Sophisticated tracking and analytics
 *    - CANNOT access any client data or admin features
 *
 * 5. LEAD (New Signup - Pending Approval)
 *    - Default role for all new signups
 *    - NO dashboard access (shows pending approval page)
 *    - Admin must change role to: CLIENT, AFFILIATE, or TAX_PREPARER
 *    - Tax Preparers can only change: LEAD → CLIENT
 *
 * 6. CLIENT (Tax Service Customer)
 *    - User who has completed tax preparation with Tax Genius
 *    - Can upload documents and view their own status
 *    - Can refer new clients (shows "My Referrals" tab if active)
 *    - Earns commissions on referrals (same as affiliates)
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
    addressBook: true, // ✅ CRM access for managing their contacts (scoped to their assigned contacts)
    calendar: true, // ✅ Calendar for managing client appointments
    store: true, // Can purchase marketing materials
    academy: true, // Access training and certification
    settings: true,
    analytics: true, // Can view their own lead analytics
    trackingCode: true, // Can manage their personal tracking code
    // ❌ REMOVED: System-wide management tools (these are for admins only)
    // clientsStatus: false - Removed (admins manage this)
    // referralsStatus: false - Removed (not their responsibility)
    // emails: false - Removed (system-wide email management is admin-only)
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
  lead: {
    // Leads are NEW SIGNUPS pending admin approval
    // NO access until admin changes role to CLIENT, AFFILIATE, or TAX_PREPARER
    dashboard: false, // Shows pending approval page instead
    settings: false, // No access until approved
  },
  client: {
    // Clients have completed tax preparation and can refer new clients
    dashboard: true,
    uploadDocuments: true,
    settings: true,
    // Referral features (conditional - shown if shortLinkUsername exists)
    analytics: true, // View referral analytics
    trackingCode: true, // Personal referral link
    marketing: true, // Sharing tools
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
        'clients', // Their assigned clients only (filtered in backend)
        'documents', // Their clients' documents only (filtered in backend)
        'clientFileCenter', // Their clients' files only (filtered in backend)
        'addressBook', // CRM access for managing their contacts (scoped to their assigned contacts)
        'calendar', // Calendar for managing client appointments
        'store', // Can purchase marketing materials
        'academy', // Access training
        'settings',
        'analytics', // Their own performance analytics
        'trackingCode', // Their personal tracking link
        // REMOVED: clientsStatus, referralsStatus, emails
        // (These are system-wide admin tools, not for individual tax preparers)
      ];

    case 'affiliate':
      // Affiliates are professional external marketers
      return [
        'dashboard',
        'store', // ✅ Access to marketing materials store
        'marketing', // Professional marketing assets
        'settings',
        'analytics', // Detailed conversion tracking
        'trackingCode', // Sophisticated tracking codes
      ];

    case 'lead':
      // Leads have no permissions until approved by admin
      return [];

    case 'client':
      return [
        'dashboard',
        'uploadDocuments',
        'settings',
        'analytics', // View referral analytics (conditional)
        'trackingCode', // Personal referral link (conditional)
        'marketing', // Sharing tools (conditional)
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
  contest: '/dashboard/contest',
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
