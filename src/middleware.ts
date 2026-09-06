import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'aimsa-admin-secret-key-change-in-production-2026'
);

const COOKIE_NAME = 'aimsa-admin-session';
const PUBLIC_ADMIN_ROUTES = ['/admin/login', '/admin/forgot-password'];
const PUBLIC_STATIC_PATHS = ['/admin/login', '/admin/api'];

function isPublicAdminRoute(pathname: string): boolean {
  return PUBLIC_ADMIN_ROUTES.some((route) => pathname === route) ||
    PUBLIC_STATIC_PATHS.some((path) => pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (isPublicAdminRoute(pathname)) {
      return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
