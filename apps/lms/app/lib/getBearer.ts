"use server";

import { cookies } from "next/headers";

export async function getBearer(): Promise<string | undefined> {

	const secret = process.env.NEXTAUTH_SECRET;
  const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
	const cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token";
  const cookieStore = cookies();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
		return undefined;
  }

	return token;
}