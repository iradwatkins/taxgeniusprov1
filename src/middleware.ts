import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { getUserPermissions, UserRole, UserPermissions, Permission } from '@/lib/permissions';
import { utmTrackingMiddleware } from '@/middleware/utm-tracking';

const isPublicRoute = createRouteMatcher([
  '/auth/login(.*)',
  '/auth/signup(.*)',
  '/',
  '/preparer(.*)',
  '/referral(.*)',
  '/affiliate(.*)',      // Affiliate lead generation pages
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
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Run UTM tracking middleware first (Epic 6)
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
    const validRoles: string[] = ['super_admin', 'admin', 'client', 'tax_preparer', 'referrer', 'affiliate'];

    // ALWAYS check database first - session can be stale
    let role: string | undefined;

    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      role = user.publicMetadata?.role as string | undefined;

      // If database role differs from session role, log it
      const sessionRole = sessionClaims?.metadata?.role as string | undefined;
      if (sessionRole && role && sessionRole !== role) {
        console.log(`🔄 Role mismatch - Session: "${sessionRole}", Database: "${role}" - Using database role`);
      }
    } catch (error) {
      console.error('Error fetching user from database:', error);
      // Fallback to session if database fails
      role = sessionClaims?.metadata?.role as string | undefined;
    }

    const isValidRole = role && validRoles.includes(role);

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
        console.error('Error checking user email:', error);
      }
      return NextResponse.redirect(new URL('/forbidden', req.url));
    }

    // Restrict /admin routes with granular permission checks
    if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard/admin')) {
      // Check role first - must be admin or super_admin
      if (role !== 'admin' && role !== 'super_admin') {
        return NextResponse.redirect(new URL('/forbidden', req.url));
      }

      // Get user permissions for granular checks
      try {
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        const customPermissions = user.publicMetadata?.permissions as Partial<UserPermissions> | undefined;
        const permissions = getUserPermissions(role as UserRole, customPermissions);

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
        console.error('Error checking permissions in middleware:', error);
      }
    }

    // Restrict /store access to tax_preparer, affiliate, admin, and super_admin only
    if (pathname.startsWith('/store')) {
      if (!role || (role !== 'tax_preparer' && role !== 'affiliate' && role !== 'admin' && role !== 'super_admin')) {
        return NextResponse.redirect(new URL('/forbidden', req.url));
      }
    }

    // Restrict /app/academy access to tax_preparer, admin, and super_admin only
    if (pathname.startsWith('/app/academy')) {
      if (!role || (role !== 'tax_preparer' && role !== 'admin' && role !== 'super_admin')) {
        return NextResponse.redirect(new URL('/forbidden', req.url));
      }
    }

    // Auto-assign role based on entry point ONLY if user has NO role in database
    if (!isValidRole) {
      // If trying to access admin routes without admin role, block immediately
      if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard/admin')) {
        return NextResponse.redirect(new URL('/forbidden', req.url));
      }

      // If trying to access debug page, allow it without auto-assignment
      if (pathname === '/debug-role') {
        return NextResponse.next();
      }

      let assignedRole: string = 'client'; // Default to client

      // Determine role from current path
      if (pathname.startsWith('/preparer') || pathname.startsWith('/dashboard/tax-preparer')) {
        assignedRole = 'tax_preparer';
      } else if (pathname.startsWith('/referral') || pathname.startsWith('/dashboard/referrer')) {
        assignedRole = 'referrer';
      } else if (pathname.startsWith('/affiliate') || pathname.startsWith('/dashboard/affiliate')) {
        assignedRole = 'affiliate';
      }

      // Check if role was passed in signup/login redirect
      const intendedRole = req.nextUrl.searchParams.get('role');
      if (intendedRole && validRoles.includes(intendedRole)) {
        assignedRole = intendedRole;
      }

      // ONLY assign role if user truly has no role
      // This prevents overwriting existing roles
      try {
        const clerk = await clerkClient();
        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: { role: assignedRole }
        });
        console.log(`✅ Auto-assigned role "${assignedRole}" to user ${userId} (first time setup)`);
      } catch (error) {
        console.error('Error auto-assigning role:', error);
      }

      // Redirect to appropriate dashboard with a session refresh parameter
      const dashboardUrls: Record<string, string> = {
        super_admin: '/dashboard/admin',
        admin: '/dashboard/admin',
        client: '/dashboard/client',
        tax_preparer: '/dashboard/tax-preparer',
        referrer: '/dashboard/referrer',
        affiliate: '/dashboard/affiliate',
      };

      // Add refresh parameter to force Clerk to revalidate session
      const redirectUrl = new URL(dashboardUrls[assignedRole] || '/dashboard/client', req.url);
      redirectUrl.searchParams.set('_clerk_refresh', '1');
      return NextResponse.redirect(redirectUrl);
    }

    // If user has a role and tries to access /dashboard, redirect to role-specific dashboard
    if (isValidRole && pathname === '/dashboard') {
      const dashboardUrls: Record<string, string> = {
        super_admin: '/dashboard/admin',
        admin: '/dashboard/admin',
        client: '/dashboard/client',
        tax_preparer: '/dashboard/tax-preparer',
        referrer: '/dashboard/referrer',
        affiliate: '/dashboard/affiliate',
      };
      const targetUrl = dashboardUrls[role] || '/dashboard/client';
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
