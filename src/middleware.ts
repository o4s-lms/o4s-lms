import { NextResponse, type NextRequest } from 'next/server';
import { checkRole } from './access/checkRole';

//const protectedRoutes = ["/dashboard", "/admin"];

export default async function authMiddleware(request: NextRequest) {
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/learn');
  const isAdminRoute =
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/app-admin');
  //const path = request.nextUrl.pathname;
  //const isProtectedRoute = protectedRoutes.includes(path);

  if (!isProtectedRoute && !isAdminRoute) return NextResponse.next();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') || '',
      },
    },
  );

  const { user } = await res.json();

  if (!user) {
    return NextResponse.redirect(
      new URL(
        `/sign-in?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=${request.url}`,
        request.url,
      ),
    );
  }

  const isAdmin = checkRole('admin', user);

  if (!isAdmin && isAdminRoute) {
    return NextResponse.redirect(
      new URL(
        `/dashboard?error=${encodeURIComponent('Only admins have access to admin dashboard.')}`,
        request.url,
      ),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
