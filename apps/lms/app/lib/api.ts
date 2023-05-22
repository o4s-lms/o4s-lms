import { type WunderGraphClient, createClient } from '@o4s/generated-wundergraph/client';
import { getBearer } from './getBearer';

const token = async () => await getBearer();

export const client = createClient({
	customFetch: fetch,
	//extraHeaders: {
	//	Authorization: `Bearer ${bearer}`,
	//},
	extraHeaders: {
			Authorization: `Bearer ${token}`,
		}
	},
);