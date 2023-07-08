import { register } from "@teamhanko/hanko-elements"
import { all } from "@teamhanko/hanko-elements/i18n/all"
import { pt } from "@/components/auth/translation"
import { useEffect } from "react"

const hankoApi = 'http://joseantcordeiro.hopto.org:8000'

interface Props {
  setError(error: Error): void;
}

function HankoProfile({ setError }: Props) {
  useEffect(() => {
    register(hankoApi, {translations: {...all, pt}}).catch(setError);
  }, [setError])

  return <hanko-profile lang="pt" />
}

export default HankoProfile
