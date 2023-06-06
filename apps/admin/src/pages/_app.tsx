import "../styles/globals.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import type { AppProps } from "next/app";

/**import { type Middleware } from 'swr';
import { useAuthMiddleware } from '@wundergraph/nextjs';
import { withWunderGraph } from '@o4s/generated-wundergraph/nextjs';
import { getToken } from '~/utils/get-token';

const useAuthToken: Middleware = (useSWRNext) => {
  return useAuthMiddleware(useSWRNext, async () => {
    return await getToken();
  });
};*/

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
};

export default MyApp;
/**export default withWunderGraph(MyApp, {
  use: [useAuthToken],
});*/

