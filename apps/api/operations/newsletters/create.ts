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

export class NewsletterCreationError extends OperationError {
  statusCode = 400;
  code = 'NewsletterCreationError' as const;
  message = 'Newsletter creation error';
}

export class TopicCreationError extends OperationError {
  statusCode = 400;
  code = 'TopicCreationError' as const;
  message = 'Novu topic creation error';
}

export default createOperation.mutation({
  input: z.object({
		name: z.string().min(10).max(100),
		description: z.string().max(1000),
		sender_name: z.string().min(3).max(50),
		sender_email: z.string().email(),
		sender_reply_to: z.string().email(),
  }),
	requireAuthentication: true,
  rbac: {
    requireMatchAll: ['admin'],
  },
  handler: async ({ input, user, graph }) => {
		const newsletter = await graph
			.from('lms')
			.mutate('createOneNewsletter')
			.where({ data: {
				name: input.name,
				description: input.description,
				sender_name: input.sender_name,
				sender_email: input.sender_email,
				sender_reply_to: input.sender_reply_to,
				created_by: user?.userId as string,
			}})
			.exec()
		if (!newsletter) {
			throw new NewsletterCreationError()
		}
		const response = await novu.topics.create({
			key: newsletter.id,
			name: input.name,
		})
		//if (response.statusText === 'OK') {
			return {
				newsletter: newsletter,
				topic: response.data,
			}
		//} else {
		//	throw new TopicCreationError()
		//}
  },
})