import { register } from "@teamhanko/hanko-elements";
import { useEffect } from "react";

const api = 'http://joseantcordeiro.hopto.org:8000';

interface Props {
  setError(error: Error): void;
}

function HankoProfile({ setError }: Props) {
  useEffect(() => {
    register(api).catch(setError);
  }, [setError]);

  return <hanko-profile />;
}

export default HankoProfile;