import "../styles/globals.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import type { AppType } from "next/app";
import type { Session } from "@o4s/auth";
import { SessionProvider } from "next-auth/react";

/**import { type Middleware } from 'swr';
import { useAuthMiddleware } from '@wundergraph/nextjs';
import { withWunderGraph } from '@o4s/generated-wundergraph/nextjs';
import { getToken } from 'next-auth/jwt';

const useAuthToken: Middleware = (useSWRNext) => {
  return useAuthMiddleware(useSWRNext, async () => {
    return await getToken();
  });
}; */

import { api } from "~/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
			<Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

//export default withWunderGraph(MyApp, {
//  use: [useAuthToken],
//});

