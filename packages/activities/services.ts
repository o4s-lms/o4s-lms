import { ApplicationFailure, Context } from '@temporalio/activity'
import { site, lms } from '@o4s/db'
import { Novu } from '@novu/node'

const config = {
	appId: process.env.NOVU_CLIENT_APP_ID as string,
	backendUrl: process.env.NOVU_API_ENDPOINT as string,
	socketUrl: process.env.NOVU_SOCKET_ENDPOINT as string,
}
const novu = new Novu(process.env.NOVU_API_KEY as string, config)

interface MessageOptions {
	to: string;
	message: string;
	subject: string;
}

export const notificationService = {
  async sendNotification({ type, messageOptions }: { type: string; messageOptions: MessageOptions }) {
		const user = await lms.user.findUnique({
			where: { email: messageOptions.to },
			select: {
				id: true,
			},
		})
		if (!user) {
      throw new Error(`Failed to send ${type} notification. Unable to find the user.`)
    }
		switch (type)
		{
			case "email":
				await novu.trigger('order-status-pt', {
					to: {
						subscriberId: user.id,
					},
					payload: {
						subject: messageOptions.subject,
						message: messageOptions.message,
					}
				})
				break
			case "push": 
				console.log(`Sent ${type} notification: ${messageOptions.message}`)
				break

			default: 
				console.log('Notification not sent')
		}
    //if (Math.random() < 0.7) {
    //  throw new Error(`Failed to send ${type} notification. Unable to reach notification service.`)
    //}

    console.log(`Sent ${type} notification: ${messageOptions.message}`)
  },
	/**sendEmail(props: Pick<SendMailOptions, 'to' | 'html' | 'subject'>) {
		const transporter = createTransport({
			host: process.env.EMAIL_SERVER_HOST,
			port: Number(process.env.EMAIL_SERVER_PORT),
			auth: {
				user: process.env.EMAIL_SERVER_USER,
				pass: process.env.EMAIL_SERVER_PASSWORD,
			},
		})
	
		return transporter.sendMail({
			from: process.env.EMAIL_FROM ?? 'noreply@o4s-lms.com',
			...props,
		})
	},*/
}

export const paymentService = {
  charge(cents: number) {
    // In a real app, we would pass an idempotency token to the downstream service
    const _idempotencyToken = `${Context.current().info.workflowExecution.workflowId}-charge`
    if (cents >= 3500) {
      throw ApplicationFailure.create({ nonRetryable: true, message: 'Card declined: insufficient funds' })
    }
    if (Math.random() < 0.7) {
      throw new Error('Failed to charge. Unable to reach payment service.')
    }
    console.log(`Charged $${cents / 100}`)
  },

  refund(cents: number) {
    // In a real app, we would pass an idempotency token to the downstream service
    const _idempotencyToken = `${Context.current().info.workflowExecution.workflowId}-refund`
    if (Math.random() < 0.7) {
      throw new Error('Failed to refund. Unable to reach payment service.')
    }

    console.log(`Refunded $${cents / 100}`)
  },
}

export const orderService = {
	async get(orderId: string) {
		return await site.order.findUnique({
			where: { id: orderId },
			select: {
				id: true,
				status: true,
				customer_email: true,
			},
		})
	},

	async archive(orderId: string) {
		return await site.order.update({
			where: { id: orderId },
			data: {
				status: 'ARCHIVED'
			},
		})
	},

	async cancel(orderId: string) {
		return await site.order.update({
			where: { id: orderId },
			data: {
				status: 'CANCELLED'
			},
		})
	},

}
