import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { getUserPermissions, UserRole, UserPermissions, Permission } from '@/lib/permissions';
import { utmTrackingMiddleware } from '@/middleware/utm-tracking';
import { attributionTrackingMiddleware, isShortLinkRequest } from '@/middleware/attribution-tracking';
import { getEffectiveRole } from '@/lib/utils/role-switcher';
import { logger } from '@/lib/logger'

const isPublicRoute = createRouteMatcher([
  '/auth/login(.*)',
  '/auth/signup(.*)',
  '/',
  '/preparer(.*)',
  '/referral(.*)',
  '/affiliate(.*)',      // Affiliate pages (application, info)
  '/start-filing(.*)',   // Customer lead generation page
  '/find-a-refund(.*)',  // Public refund tracker utility
  '/refund-advance(.*)', // Refund advance information page
  '/tax-calculator(.*)', // Interactive tax calculator
  '/about(.*)',
  '/services(.*)',
  '/contact(.*)',
  '/personal-tax-filing(.*)', // Personal tax services page
  '/business-tax(.*)',   // Business tax services page
  '/tax-planning(.*)',   // Tax planning & advisory page
  '/audit-protection(.*)', // Audit protection page
  '/irs-resolution(.*)', // IRS resolution services page
  '/tax-guide(.*)',      // 2024 tax guide page
  '/blog(.*)',           // Tax blog & tips page
  '/help(.*)',           // Help center page
  '/debug-role',         // Debug page to check user role
  '/api/admin/set-role', // Temporary public endpoint to set admin role
  '/lead/(.*)',          // Short link for lead generation (Epic 6)
  '/intake/(.*)',        // Short link for tax intake (Epic 6)
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // EPIC 6: Check for attribution short links FIRST (before Clerk auth)
  // This must run before any auth checks so public links work
  if (isShortLinkRequest(req.nextUrl.pathname)) {
    const attributionResponse = await attributionTrackingMiddleware(req);
    if (attributionResponse) {
      return attributionResponse; // Returns redirect with attribution cookie
    }
  }

  // Run UTM tracking middleware (Epic 6)
  const utmResponse = utmTrackingMiddleware(req);

  // If user is not signed in and trying to access protected route, redirect to login
  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL('/auth/login', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If user is signed in
  if (userId) {
    const pathname = req.nextUrl.pathname;
    const validRoles: string[] = ['super_admin', 'admin', 'lead', 'client', 'tax_preparer', 'affiliate'];

    // ALWAYS check database first - session can be stale
    let role: string | undefined;

    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      role = user.publicMetadata?.role as string | undefined;

      // If database role differs from session role, log it
      const sessionRole = sessionClaims?.metadata?.role as string | undefined;
      if (sessionRole && role && sessionRole !== role) {
        logger.info(`🔄 Role mismatch - Session: "${sessionRole}", Database: "${role}" - Using database role`);
      }
    } catch (error) {
      logger.error('Error fetching user from database:', error);
      // Fallback to session if database fails
      role = sessionClaims?.metadata?.role as string | undefined;
    }

    const isValidRole = role && validRoles.includes(role);

    // Get effective role (checks if admin is viewing as another role)
    let effectiveRole = role;
    let isViewingAsOtherRole = false;
    let viewingRoleName: string | undefined;

    if (isValidRole && (role === 'super_admin' || role === 'admin')) {
      try {
        const roleInfo = await getEffectiveRole(role as UserRole, userId);
        effectiveRole = roleInfo.effectiveRole;
        isViewingAsOtherRole = roleInfo.isViewingAsOtherRole;
        viewingRoleName = roleInfo.viewingRoleName;

        if (isViewingAsOtherRole) {
          logger.info(`👁️  Admin ${userId} viewing as ${viewingRoleName} (${effectiveRole})`);
        }
      } catch (error) {
        logger.error('Error getting effective role:', error);
        // Fall back to actual role if there's an error
        effectiveRole = role;
      }
    }

    // Special bypass for /setup-admin - only accessible by iradwatkins@gmail.com
    if (pathname === '/setup-admin') {
      try {
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        const userEmail = user.emailAddresses[0]?.emailAddress;

        if (userEmail === 'iradwatkins@gmail.com') {
          return NextResponse.next(); // Allow access
        }
      } catch (error) {
        logger.error('Error checking user email:', error);
      }
      return NextResponse.redirect(new URL('/forbidden', req.url));
    }

    // Restrict /admin routes with granular permission checks
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard/admin')) {
      // Check ACTUAL role first - must be admin or super_admin (security check)
      // This prevents non-admins from accessing admin routes even if viewing cookie is manipulated
      if (role !== 'admin' && role !== 'super_admin') {
        return NextResponse.redirect(new URL('/forbidden', req.url));
      }

      // Get user permissions for granular checks using EFFECTIVE role
      // This allows admins to see what other roles see while maintaining security
      try {
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        const customPermissions = user.publicMetadata?.permissions as Partial<UserPermissions> | undefined;

        // Use effectiveRole for permission checks (what user sees)
        const permissions = getUserPermissions(effectiveRole as UserRole, customPermissions);

        // Define route to permission mappings
        const routePermissions: Record<string, Permission> = {
          '/admin/users': 'users',
          '/admin/payouts': 'payouts',
          '/admin/earnings': 'earnings',
          '/admin/content-generator': 'contentGenerator',
          '/admin/database': 'database',
          '/admin/analytics': 'analytics',
        };

        // Check if current path requires a specific permission
        for (const [route, permission] of Object.entries(routePermissions)) {
          if (pathname.startsWith(route)) {
            if (!permissions[permission]) {
              return NextResponse.redirect(new URL('/forbidden', req.url));
            }
            break;
          }
        }
      } catch (error) {
        logger.error('Error checking permissions in middleware:', error);
      }
    }

    // Restrict /store access to tax_preparer, affiliate, admin, and super_admin only
    // Use effectiveRole so admins can preview store as other roles
    if (pathname.startsWith('/store')) {
      if (!effectiveRole || (effectiveRole !== 'tax_preparer' && effectiveRole !== 'affiliate' && effectiveRole !== 'admin' && effectiveRole !== 'super_admin')) {
        return NextResponse.redirect(new URL('/forbidden', req.url));
      }
    }

    // Restrict /app/academy access to tax_preparer, admin, and super_admin only
    // Use effectiveRole so admins can preview academy as other roles
    if (pathname.startsWith('/app/academy')) {
      if (!effectiveRole || (effectiveRole !== 'tax_preparer' && effectiveRole !== 'admin' && effectiveRole !== 'super_admin')) {
        return NextResponse.redirect(new URL('/forbidden', req.url));
      }
    }

    // REMOVED: Auto-assign role logic (was causing infinite loops and overwriting roles)
    // Users without roles should be redirected to a role selection page, NOT auto-assigned
    if (!isValidRole) {
      // If trying to access admin routes without admin role, block immediately
      if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard/admin')) {
        return NextResponse.redirect(new URL('/forbidden', req.url));
      }

      // If trying to access debug page, allow it without auto-assignment
      if (pathname === '/debug-role') {
        return NextResponse.next();
      }

      // Allow users without roles to access setup-admin page
      if (pathname === '/setup-admin') {
        return NextResponse.next();
      }

      // For users without a valid role, redirect to role selection page
      // This prevents auto-assigning and overwriting roles
      logger.info(`⚠️  User ${userId} has no valid role, redirecting to role setup`);

      // If they're on a public route, let them through
      if (isPublicRoute(req)) {
        return NextResponse.next();
      }

      // Otherwise redirect to dashboard - it will handle role setup
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // If user has a role and tries to access /dashboard, redirect to role-specific dashboard
    // Use effectiveRole so admins viewing as another role get redirected to that role's dashboard
    if (isValidRole && pathname === '/dashboard') {
      const dashboardUrls: Record<string, string> = {
        super_admin: '/dashboard/admin',
        admin: '/dashboard/admin',
        lead: '/dashboard/lead',
        client: '/dashboard/client',
        tax_preparer: '/dashboard/tax-preparer',
        affiliate: '/dashboard/affiliate',
      };
      const targetUrl = dashboardUrls[effectiveRole || role || 'lead'] || '/dashboard/lead';
      const redirect = NextResponse.redirect(new URL(targetUrl, req.url));
      // Copy UTM cookies to redirect response
      utmResponse.cookies.getAll().forEach(cookie => {
        redirect.cookies.set(cookie.name, cookie.value, cookie);
      });
      return redirect;
    }
  }

  // Return UTM response with any cookies set
  return utmResponse;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
