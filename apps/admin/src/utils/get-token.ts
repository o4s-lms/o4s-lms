import { getCookie } from 'cookies-next'

const cookieName = 'hanko'

export async function getToken() {
	const res = await fetch('/api/token');

	if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

	return res
}