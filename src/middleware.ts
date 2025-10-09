import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/auth/login(.*)', '/auth/signup(.*)', '/']);
const isSelectRoleRoute = createRouteMatcher(['/auth/select-role(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // If user is not signed in and trying to access protected route, redirect to login
  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL('/auth/login', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // If user is signed in
  if (userId) {
    const role = sessionClaims?.metadata?.role as string | undefined;
    const validRoles: string[] = ['client', 'preparer', 'referrer', 'admin'];
    const isValidRole = role && validRoles.includes(role);

    // If user doesn't have a valid role and is not on select-role page, redirect them there
    if (!isValidRole && !isSelectRoleRoute(req)) {
      return NextResponse.redirect(new URL('/auth/select-role', req.url));
    }

    // If user has a role and tries to access /dashboard, redirect to role-specific dashboard
    if (isValidRole && req.nextUrl.pathname === '/dashboard') {
      const dashboardUrls: Record<string, string> = {
        client: '/dashboard/client',
        preparer: '/dashboard/preparer',
        referrer: '/dashboard/referrer',
        admin: '/dashboard/admin',
      };
      const targetUrl = dashboardUrls[role] || '/dashboard/client';
      return NextResponse.redirect(new URL(targetUrl, req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
