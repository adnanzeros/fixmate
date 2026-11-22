// fixmath/src/proxy.js  (must sit inside src/, next to the app folder. On Next.js 15 rename it to middleware.js and the function to `middleware`)
import { NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

/**
 * Fast, cookie-only check:
 *  - logged-out users on /dashboard or /payment go to /sign-in (and come back after login)
 *  - logged-in users on /sign-in or /sign-up go to /dashboard (which redirects by role)
 * Role checks are done on the server in the dashboard layouts, not here.
 */
export function proxy(request) {
  const sessionCookie = getSessionCookie(request);
  const { pathname, search } = request.nextUrl;

  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';
  const isPrivate =
    pathname.startsWith('/dashboard') || pathname.startsWith('/payment');

  if (!sessionCookie && isPrivate) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/payment/:path*', '/sign-in', '/sign-up'],
};
