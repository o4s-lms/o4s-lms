import { UserCreaterolesInput } from '../../generated/orm/schemas/lms'
import { createOperation, z } from '../../generated/wundergraph.factory'

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
				roles: input.roles as unknown as UserCreaterolesInput,
			}})
			.exec()
		return user
  },
})