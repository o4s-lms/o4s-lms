// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
	matcher: '/api/wg/:function*',
};

export function middleware(request: NextRequest) {
	//const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
	//const cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token";
	const requestHeaders = new Headers(request.headers)
	const cookieName = 'hanko'
	const token = request.cookies.get(cookieName)?.value

	if (token) {
		requestHeaders.set('Authorization', `Bearer ${token}`)
	}

	let pathname = request.nextUrl.pathname.replace('/api/wg', '')

	const url = new URL(pathname + request.nextUrl.search, process.env.WG_PUBLIC_NODE_URL);

	/**const headers = new Headers({
		Authorization: `Bearer ${token}`,
	});*/

	return NextResponse.rewrite(url, {
		request: {
			headers: requestHeaders,
		},
	})

	//return response
}