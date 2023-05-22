import { createHooks } from '@wundergraph/react-query';
// import { cache } from "react";
import { createClient, Operations } from '@o4s//generated-wundergraph/client';
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

export const { useQuery, useMutation, useSubscription, useUser, useFileUpload, useAuth, queryKey } =
	createHooks<Operations>(client);