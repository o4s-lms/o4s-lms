import { createWunderGraphNext } from '@o4s/generated-wundergraph/nextjs';

const { client, withWunderGraph, useQuery, useMutation, useSubscription, useUser, useAuth, useFileUpload } =
	createWunderGraphNext({
		baseURL: `http://joseantcordeiro.hopto.org:4000/api/wg`,
		ssr: true,
	});

export { client, withWunderGraph, useQuery, useMutation, useSubscription, useUser, useAuth, useFileUpload };