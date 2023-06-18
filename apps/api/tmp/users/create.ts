import { type UserCreaterolesInput } from '../../generated/orm/schemas/lms'
import { createOperation, z } from '../../generated/wundergraph.factory'
import { Novu } from '@novu/node'

const config = {
	appId: process.env.NOVU_CLIENT_APP_ID as string,
	backendUrl: process.env.NOVU_API_ENDPOINT as string,
	socketUrl: process.env.NOVU_SOCKET_ENDPOINT as string,
}
const novu = new Novu(process.env.NOVU_API_KEY as string, config)

export default createOperation.mutation({
  input: z.object({
		uuid: z.string().uuid().length(36),
		email: z.string().email(),
		email_verified: z.boolean(),
		roles: z.string().array(),
  }),
  handler: async ({ input, graph }) => {
		const user = await graph
			.from('lms')
			.mutate('createOneUser')
			.where({ data: {
				uuid: input.uuid,
				email: input.email,
				email_verified: input.email_verified,
				locale: 'pt',
				roles: input.roles as unknown as UserCreaterolesInput,
			}})
			.exec()
		const trigger = await novu.trigger('welcome-new-user', {
			to: {
				subscriberId: user.id,
				email: user.email,
				locale: 'pt'
			},
			payload: {}
		})
		return user
  },
})