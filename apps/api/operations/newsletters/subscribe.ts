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
		email: z.string().email(),
		newsletter_id: z.string(),
  }),
  handler: async ({ input, graph }) => {
		const member = await graph
			.from('lms')
			.mutate('upsertOneMember')
			.where({
				where: { email: input.email },
				update: {},
				create: {	email: input.email },
			})
			.exec()
		if (!member) {
			throw new MemberCreationError()
		}
		const newsletter = await graph
			.from('lms')
			.mutate('upsertOneNewsletterMembers')
			.where({
				where: {
					member_id_newsletter_id: {
						member_id: member.id,
						newsletter_id: input.newsletter_id,
					}
				},
				update: {},
				create: {
					member: { connect: { id: member.id } },
					newsletter: { connect: { id: input.newsletter_id } },
				},
			})
			.exec()
		if (!newsletter) {
			throw new NewsletterSubscritionError()
		}
		const trigger = await novu.trigger('welcome-newsletter-pt', {
			to: {
				subscriberId: member.id,
				email: member.email,
				locale: 'pt'
			},
			payload: {}
		})
		const response = await novu.topics.addSubscribers(input.newsletter_id, {
			subscribers: [member.id],
		})
		//if (response.data.succeeded) {
			return {
				newsletter: newsletter,
				topic: response.data,
			}
		//} else {
		//	throw new TopicSubscritionError()
		//}
  },
})