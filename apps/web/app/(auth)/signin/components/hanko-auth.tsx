import { Hanko, register } from "@teamhanko/hanko-elements"
import * as React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@o4s/generated-wundergraph/client"

const client = createClient({
  customFetch: fetch,
})

const hankoApi = 'http://joseantcordeiro.hopto.org:8000'

interface Props {
	callback: string;
  setError(error: Error): void;
}

function HankoAuth({ callback, setError }: Props) {
	const router = useRouter()
  const hanko = React.useMemo(() => new Hanko(hankoApi), [])

  const redirectToProfile = React.useCallback(() => {
		router.replace("/app/profile")
  }, [router])

	const redirectToCallback = React.useCallback(() => {
		router.replace(callback)
  }, [router, callback])

  React.useEffect(() => {
    register(hankoApi).catch(setError)
  }, [setError])

  React.useEffect(() => hanko.onAuthFlowCompleted(async () => {
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
    	redirectToCallback()
		}
  }), [hanko, redirectToCallback, redirectToProfile])

  return <hanko-auth />
}

export default HankoAuth