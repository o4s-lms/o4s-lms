import { cookies } from 'next/headers'

const cookieName = 'hanko'

export async function getToken() {
	const cookieStore = cookies()
	return cookieStore.get(cookieName)?.value
}