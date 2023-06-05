import { Hanko, register } from "@teamhanko/hanko-elements"
import { useCallback, useEffect, useMemo, useState } from "react"
import { redirect } from "next/navigation"

const hankoApi = 'http://joseantcordeiro.hopto.org:8000'

interface Props {
  setError(error: Error): void;
}

function HankoAuth({ setError }: Props) {
  const hanko = useMemo(() => new Hanko(hankoApi), [])

  const redirectToProfile = useCallback(() => {
    redirect("/lms")
  }, [])

  useEffect(() => {
    register(hankoApi).catch(setError)
  }, [setError])

  useEffect(() => hanko.onAuthFlowCompleted(() => {
    redirectToProfile()
  }), [hanko, redirectToProfile])

  return <hanko-auth />
}

export default HankoAuth