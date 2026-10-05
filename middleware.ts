import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth_token')?.value;
  const authRole = request.cookies.get('auth_role')?.value;

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAskRoute = pathname.startsWith('/ask');
  const isAdminRoute = pathname.startsWith('/admin');

  // If already authenticated and visiting login/signup, redirect to appropriate area
  if (isAuthRoute && authToken) {
    if (authRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protected User Routes: /dashboard and /ask
  if ((isDashboardRoute || isAskRoute) && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protected Admin Routes: /admin
  if (isAdminRoute) {
    if (!authToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (authRole !== 'admin') {
      // Authenticated but not an admin — redirect to user dashboard with alert
      const dashboardUrl = new URL('/dashboard', request.url);
      dashboardUrl.searchParams.set('denied', 'admin_only');
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/ask',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
};
