import { Hanko, register, Translation } from "@teamhanko/hanko-elements"
import { all } from "@teamhanko/hanko-elements/i18n/all"
import { pt } from "@/components/auth/translation"
import * as React from "react"
import { useRouter } from "next/navigation"
/**import { createClient } from "@o4s/generated-wundergraph/client"
import useNewUserMutation from "@/hooks/profile/use-new-user-mutation"

const client = createClient({
  customFetch: fetch,
})*/

const hankoApi = 'http://joseantcordeiro.hopto.org:8000'

interface Props {
	callback: string;
  setError(error: Error): void;
}

function HankoAuth({ callback, setError }: Props) {
	const router = useRouter()
  const hanko = React.useMemo(() => new Hanko(hankoApi), [])
	//const createUser = useNewUserMutation()

	const redirectToCallback = React.useCallback(() => {
		router.replace(callback)
  }, [router, callback])

  React.useEffect(() => {
    register(hankoApi, {translations: {...all, pt}}).catch(setError)
  }, [setError])

  React.useEffect(() => hanko.onAuthFlowCompleted(async () => {
		/**const currentUser = await hanko.user.getCurrent()
		const { data: user } = await client.query({
			operationName: 'users/uuid',
			input: {
				uuid: currentUser.id
			}
		})
		if (!user) {
			const newUser = await createUser.trigger({
					uuid: currentUser.id,
					email: currentUser.email,
					email_verified: true,
					roles: ['user']
			}, { throwOnError: false })
		}*/
		redirectToCallback()
  }), [hanko, redirectToCallback])

  return <hanko-auth lang="pt" />
}

export default HankoAuth
