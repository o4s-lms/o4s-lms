import { betterFetch } from '@better-fetch/fetch';
import type { Session } from 'better-auth/types';
import { NextResponse, type NextRequest } from 'next/server';

export default async function authMiddleware(request: NextRequest) {
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      //baseURL: request.nextUrl.origin,
      baseURL:
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:4321',
      headers: {
        //get the cookie from the request
        cookie: request.headers.get('cookie') || '',
      },
    },
  );

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
};
