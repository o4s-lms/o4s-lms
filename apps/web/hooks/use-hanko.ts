import { Hanko, register } from "@teamhanko/hanko-elements"
import { useEffect, useState } from "react"

const hankoApi = 'http://joseantcordeiro.hopto.org:8000'

export function useHanko() {
	const [hanko, setHankoClient] = useState<Hanko>()

  useEffect(() => {
    import("@teamhanko/hanko-elements").then(({ Hanko }) => setHankoClient(new Hanko(hankoApi)));
  }, [])

  return hanko
}