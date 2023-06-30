import { render } from '@react-email/render'
import { sendEmail } from './send-email'
import { Test } from './templates/test'

const PUBLIC_URL = process.env.PUBLIC_URL

export const sendTest = async (to: string) => {
	const emailHtml = render(<Test url={`${PUBLIC_URL}/app/courses`} />)

	const options = {
		to: to,
		subject: 'Test send email',
		html: emailHtml,
	}

	return await sendEmail(options)
}

