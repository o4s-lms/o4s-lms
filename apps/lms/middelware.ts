import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// the middleware will run for all requests that match this pattern,
// we don't actually need to define an api route for this.
export const config = {
  matcher: '/api/wg/:function*',
};

export function middleware(request: NextRequest) {
  // retrieve the session token from the cookie
	const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
	const cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token";
	const cookieStore = cookies();
  const token = cookieStore.get(cookieName)?.value;
  // const token = request.cookies.get(cookieName)?.value;

  let pathname = request.nextUrl.pathname.replace('/api/wg', '');

  // rewrite the api url to the WunderGraph API
  const url = new URL(pathname + request.nextUrl.search, 'http://joseantcordeiro.hopto.org:9991');

  // add the token to the Authorization header
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  // rewrite the request to the WunderGraph API
  const response = NextResponse.rewrite(url, {
    request: {
      headers,
    },
  });

  return response;
}