"use server";

import { type JWT, decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export interface TokenResponse {
	authenticated: boolean;
	token: JWT | null;
	bearer: string | undefined;
}

export async function getToken(): Promise<TokenResponse> {

	const secret = process.env.NEXTAUTH_SECRET;
  const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
	const cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token";
  const cookieStore = cookies();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
		return {
			authenticated: false,
			token: null,
			bearer: undefined,
		};
  }

	const decoded = await decode({token, secret});

	return {
		authenticated: true,
		token: decoded,
		bearer: token,
	};
}