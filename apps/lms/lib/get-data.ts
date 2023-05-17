import { cookies } from "next/headers";
import { API_URL } from "./constants";

export async function getData({
  operation,
  revalidate,
	cache,
}: {
  operation: string;
  revalidate: number;
	cache: RequestCache;
}) {

  const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
	const cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token";
  const cookieStore = cookies();
  const bearer = cookieStore.get(cookieName)?.value;
	
	const res = await fetch(`${API_URL}${operation}`,
			{
				...(bearer && {
					headers: {
						Authorization: `Bearer ${bearer}`,
						"Content-Type": "application/json",
					},
				}),
				cache: cache,
				// data will revalidate every x seconds
				next: { revalidate: revalidate },
			},
		)
    /**.then((res) => res.json())
    .catch((e) => {
			console.error(e);
			throw new Error('Failed to fetch data');
		}) */

		const json = await res.json();
		if (!res.ok) {
			if (json.error) {
				const error = new Error(json.error) as Error & {
					status: number;
				};
				error.status = res.status;
				throw error;
			} else {
				throw new Error("An unexpected error occurred");
			}
		}
 
  return json.data;
}