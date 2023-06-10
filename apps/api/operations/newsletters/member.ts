/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'
import { Novu } from '@novu/node'

const config = {
	appId: process.env.NOVU_CLIENT_APP_ID as string,
	backendUrl: process.env.NOVU_API_ENDPOINT as string,
	socketUrl: process.env.NOVU_SOCKET_ENDPOINT as string,
}
const novu = new Novu(process.env.NOVU_API_KEY as string, config)

export class MemberCreationError extends OperationError {
  statusCode = 400;
  code = 'MemberCreationError' as const;
  message = 'Member creation error';
}

export class SubscriberError extends OperationError {
  statusCode = 400;
  code = 'SubscriberError' as const;
  message = 'Novu subscriber error';
}

export default createOperation.mutation({
  input: z.object({
		email: z.string().email(),
  }),
  handler: async ({ input, graph }) => {
		await graph.from('lms').query('findUniqueMember').where({ email: input.email }).exec()
		const member = await graph
			.from('lms')
			.mutate('createOneMember')
			.where({ data: {
				email: input.email,
			}})
			.exec()
		if (!member) {
			throw new MemberCreationError()
		}
		const response = await novu.subscribers.identify(member.id, {
			email: input.email,
			locale: 'pt',
		})
		//if (response.status === 200) {
			return {
				member: member.id,
				subscriber: response.data,
			}
		//} else {
		//	throw new SubscriberError()
		//}
  },
})