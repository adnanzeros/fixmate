// src/proxy.js  (Next.js 16 uses proxy.js; on Next.js 15 rename it to middleware.js and the function to `middleware`)
import { NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

/**
 * Fast, cookie-only check for private pages: logged-out users go to /sign-in and come
 * back after login.
 *
 * Sign-in / sign-up are NOT handled here on purpose. A cookie can exist while its session
 * is already gone (expired, DB reseeded, different secret). Redirecting on the cookie alone
 * made /sign-in -> /dashboard -> /sign-in loop forever. The (auth) layout checks the real
 * session on the server instead. Role checks live in the dashboard layouts.
 */
export function proxy(request) {
  const sessionCookie = getSessionCookie(request);
  const { pathname, search } = request.nextUrl;

  if (!sessionCookie) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/payment/:path*'],
};
