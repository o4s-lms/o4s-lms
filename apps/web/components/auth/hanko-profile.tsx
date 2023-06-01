import { register } from "@teamhanko/hanko-elements"
import { useEffect } from "react"

const hankoApi = 'http://joseantcordeiro.hopto.org:8000'

interface Props {
  setError(error: Error): void;
}

function HankoProfile({ setError }: Props) {
  useEffect(() => {
    register(hankoApi).catch(setError);
  }, [setError])

  return <hanko-profile />
}

export default HankoProfile