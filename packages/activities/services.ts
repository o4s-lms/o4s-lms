import { ApplicationFailure, Context } from '@temporalio/activity'
import { createTransport, type SendMailOptions } from 'nodemailer'

export const notificationService = {
  sendNotification({ type, message }: { type: string; message: string }) {
    if (Math.random() < 0.7) {
      throw new Error(`Failed to send ${type} notification. Unable to reach notification service.`)
    }

    console.log(`Sent ${type} notification: ${message}`)
  },
	sendEmail(props: Pick<SendMailOptions, 'to' | 'html' | 'subject'>) {
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
	},
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
