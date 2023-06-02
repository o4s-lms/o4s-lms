import { createClient } from '@o4s/generated-wundergraph'

export const client = createClient({
  baseURL: 'http://joseantcordeiro.hopto.org:9991',
	customFetch: fetch,
})