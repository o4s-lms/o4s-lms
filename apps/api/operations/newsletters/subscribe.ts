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

export class NewsletterSubscritionError extends OperationError {
  statusCode = 400;
  code = 'NewsletterSubscritionError' as const;
  message = 'Newsletter subscrition error';
}

export class TopicSubscritionError extends OperationError {
  statusCode = 400;
  code = 'TopicSubscritionError' as const;
  message = 'Novu topic subscrition error';
}

export default createOperation.mutation({
  input: z.object({
		member_id: z.string(),
		newsletter_id: z.string(),
  }),
  handler: async ({ input, graph }) => {
		const newsletter = await graph
			.from('lms')
			.mutate('createOneNewsletterMembers')
			.where({ data: {
				member: { connect: { id: input.member_id } },
				newsletter: { connect: { id: input.newsletter_id } },
			}})
			.exec()
		if (!newsletter) {
			throw new NewsletterSubscritionError()
		}
		const response = await novu.topics.addSubscribers(input.newsletter_id, {
			subscribers: [input.member_id],
		})
		//if (response.statusText === 'OK') {
			return {
				newsletter: newsletter,
				topic: response.data,
			}
		//} else {
			//throw new TopicSubscritionError()
		//}
  },
})