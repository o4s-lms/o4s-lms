import { type SendMailOptions } from 'nodemailer'
import { sendEmail } from './sendEmail'
import { type ComponentProps } from 'react'
import { MagicLinkEmail } from './MagicLink'
import { render } from '@react-email/render'

export const sendMagicLinkEmail = ({
  to,
  ...props
}: Pick<SendMailOptions, 'to'> & ComponentProps<typeof MagicLinkEmail>) => {
	const emailHtml = render(MagicLinkEmail({...props}));
  void sendEmail({
    to,
    subject: 'Sign in to LMS',
    html: emailHtml,
  })
}