import { createOperation, z } from '../../generated/wundergraph.factory'

export default createOperation.mutation({
  input: z.object({
		uuid: z.string().uuid().length(36),
		email: z.string().email(),
		email_verified: z.boolean().default(true),
		roles: z.string().array().default(['user']),
  }),
  handler: async ({ input, graph }) => {
		input.email_verified = true
		input.roles = ['user']
		const user = await graph
			.from('site')
			.mutate('createOneUser')
			.where({ data: {
				uuid: input.uuid,
				email: input.email,
				email_verified: input.email_verified,
				roles: input.roles,
			}})
			.exec()
		return user
  },
})