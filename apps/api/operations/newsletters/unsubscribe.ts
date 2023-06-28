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

export class MemberNotFoundError extends OperationError {
  statusCode = 500;
  code = 'MemberNotFoundError' as const;
  message = 'Member not found error';
}

export class NewsletterSubscritionError extends OperationError {
  statusCode = 500;
  code = 'NewsletterSubscritionError' as const;
  message = 'Newsletter subscrition error';
}

export class TopicSubscritionError extends OperationError {
  statusCode = 500;
  code = 'TopicSubscritionError' as const;
  message = 'Novu topic subscrition error';
}

export default createOperation.mutation({
  input: z.object({
		email: z.string().email(),
		//member_id: z.string(),
		newsletter_id: z.string(),
  }),
  handler: async ({ input, graph }) => {
		const member = await graph
			.from('site')
			.query('findUniqueMember')
			.where({ where: { email: input.email } })
			.exec()
		if (!member) {
			throw new MemberNotFoundError()
		}
		const newsletter = await graph
			.from('site')
			.mutate('deleteOneNewsletterMembers')
			.where({
				where: {
					member_id_newsletter_id: {
						member_id: member.id,
						newsletter_id: input.newsletter_id,
					}
				},
			})
			.exec()
		if (!newsletter) {
			throw new NewsletterSubscritionError()
		}
		const response = await novu.topics.removeSubscribers(input.newsletter_id, {
			subscribers: [member.id],
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