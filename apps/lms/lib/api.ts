import { type WunderGraphClient, createClient } from '@o4s/generated-wundergraph/client';
import { getToken } from './get-token';

export const api = async (): Promise<WunderGraphClient> => {
	const { bearer } = await getToken();
	const api = createClient({
		customFetch: fetch,
		extraHeaders: {
			Authorization: `Bearer ${bearer}`,
		},
	});
	return api;
}
const { bearer } = async () => {
	const token = await getToken();
	return token.bearer;
}
export const client = createClient({
	customFetch: fetch,
	extraHeaders: {
		Authorization: `Bearer ${bearer}`,
	},
});