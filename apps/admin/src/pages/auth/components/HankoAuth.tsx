import { Hanko, register } from "@teamhanko/hanko-elements";
import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

const api = 'http://joseantcordeiro.hopto.org:8000';

interface Props {
  setError(error: Error): void;
}

function HankoAuth({ setError }: Props) {
  const router = useRouter();
  const hankoClient = useMemo(() => new Hanko(api), []);

  const redirectToProfile = useCallback(() => {
    router.replace("/auth/profile").catch(setError);
  }, [router, setError]);

  useEffect(() => {
    register(api).catch(setError);
  }, [setError]);

  useEffect(() => hankoClient.onAuthFlowCompleted(() => {
    redirectToProfile()
  }), [hankoClient, redirectToProfile]);

  return <hanko-auth />;
}

export default HankoAuth;