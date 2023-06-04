import { createClient } from '@o4s/generated-wundergraph'
import { cookies } from 'next/headers'

/**const cookieName = 'hanko'

const token = async () => {
	const cookieStore = cookies()
	const token = cookieStore.get(cookieName)?.value
	return token
}

export const client = createClient({
		baseURL: 'http://joseantcordeiro.hopto.org:9991',
		customFetch: fetch,
		extraHeaders: {
			Authorization: `Bearer ${token}`,
		},
	})*/

function updateOptions(options) {
  const update = { ...options };
  if (localStorage.hanko) {
    update.headers = {
      ...update.headers,
      Authorization: `Bearer ${localStorage.hanko}`,
    };
  }
  return update;
}
  
export default function fetcher(url: URL, options) {
  return fetch(url, updateOptions(options));
}

export const client = createClient({
	baseURL: 'http://joseantcordeiro.hopto.org:9991',
	customFetch: fetch,
})