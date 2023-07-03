import { render } from '@react-email/render'
import { sendEmail } from './send-email'
import { OrderStatusMessage } from './templates/order-status-message'

const PUBLIC_URL = process.env.PUBLIC_URL

export const sendOrderStatusMessage = async (to: string, message: string, subject: string) => {
	const emailHtml = render(OrderStatusMessage({ message: message }))

	const options = {
		to: to,
		subject: subject,
		html: emailHtml,
	}

	return await sendEmail(options)
}