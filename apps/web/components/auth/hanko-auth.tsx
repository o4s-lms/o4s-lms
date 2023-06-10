import { Hanko, register } from "@teamhanko/hanko-elements"
import { useCallback, useEffect, useMemo, useState } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@o4s/generated-wundergraph/client"

const client = createClient()

const hankoApi = 'http://joseantcordeiro.hopto.org:8000'

interface Props {
  setError(error: Error): void;
}

function HankoAuth({ setError }: Props) {
  const hanko = useMemo(() => new Hanko(hankoApi), [])

  const redirectToProfile = useCallback(() => {
    redirect("/profile")
  }, [])

	const redirectToLms = useCallback(() => {
    redirect("/lms")
  }, [])

  useEffect(() => {
    register(hankoApi).catch(setError)
  }, [setError])

  useEffect(() => hanko.onAuthFlowCompleted(async () => {
		const currentUser = await hanko.user.getCurrent()
		const user = await client.query({
			operationName: 'users/uuid',
			input: {
				uuid: currentUser.id
			}
		})
		if (!user) {
			const newUser = await client.mutate({
				operationName: 'users/create',
				input: {
					uuid: currentUser.id,
					email: currentUser.email,
					email_verified: true,
					roles: ['user']
				}
			})
			redirectToProfile()
		} else {
    	redirectToLms()
		}
  }), [hanko, redirectToLms, redirectToProfile])

  return <hanko-auth />
}

export default HankoAuth