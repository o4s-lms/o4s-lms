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
		order_id: z.string(),
  }),
  handler: async ({ input, graph, operations }) => {
		const { data: order } = await operations.query({
			operationName: 'orders/id',
			input: {
				id: input.order_id,
			}
		})

		async function items () {
			await order?.order?.items?.reduce(async (promise, item) => {
				// This line will wait for the last async function to finish.
				// The first iteration uses an already resolved Promise
				// so, it will immediately continue.
				await promise
				const order_item = await graph
					.from('lms')
					.mutate('upsertOneCourseMember')
					.where({
						where: {
							user_uuid_course_id: {
								user_uuid: order?.order?.customer_uuid,
								course_id: item.product.courses[0],
							}
						},
						update: {},
						create: {
							user: { connect: { uuid: order?.order?.customer_uuid } },
							course: { connect: { id: item.product.courses[0] } },
							role: 'STUDENT',
						},
					})
					.exec()
				if (!order_item) {
					throw new ItemCreationError()
				}
			}, Promise.resolve())
		}
		await items()
		const newsletter = await graph
			.from('site')
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
		const subscriber = await novu.subscribers.identify(member.id, {
			email: member.email,
			locale: member.locale,
		})
		const welcome = `welcome-newsletter-${member.locale}` 
		const trigger = await novu.trigger(welcome, {
			to: {
				subscriberId: member.id,
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