"use server";

import cors from "@/lib/cors";
import { decode } from "next-auth/jwt";

import { cookies } from 'next/headers';
// import { type SessionStore } from "next-auth/core/lib/cookie";

export async function GET(request: Request) {

	// const token = await getToken();
	const secret = process.env.NEXTAUTH_SECRET;
	const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
	const cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token";
  const cookieStore = cookies();
  const cookie = cookieStore.get(cookieName)?.value;
	// const cookie = request.cookies.get(cookieName)?.value;
	// const cookie = sessionStore.value

	let jwt = request.headers.get("Authorization");

	if (!jwt) {
		return cors(
			request,
			new Response(JSON.stringify({ message: 'Invalid token ' }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			})
		);
	}
	
	// remove Bearer if using Bearer Authorization mechanism
	if (jwt.toLowerCase().startsWith('bearer')) {
		jwt = jwt.slice('bearer'.length).trim();
	}

	const authenticated = (cookie === jwt);

	if (!authenticated) {
		return cors(
			request,
			new Response(JSON.stringify({ message: `Unauthorized: ${jwt} ${cookie}` }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			})
		);
  }

	const decoded = await decode({cookie, secret});

	return cors(
    request,
    new Response(JSON.stringify(decoded), {
      status: 200,
			headers: { "Content-Type": "application/json" },
    })
  );

}