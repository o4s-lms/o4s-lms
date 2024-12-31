import { render } from '@react-email/components';
import { inngest } from './client';
import { PasswordResetEmail } from '@/emails/password-updated';


export const emailPasswordUpdated = inngest.createFunction(
  { id: 'password-updated-email' },
  { event: 'auth/password.updated' },
  async ({ event, step, payload }) => {

    await step.run('send-password-updated-email', async () => {
      try {
      await payload.sendEmail({
        to: event.data.email,
        subject: 'Your password as been reset successful',
        html: await render(<PasswordResetEmail />),
      });
    } catch (error) {
      throw error;
    }
    });
    return { message: `Email sent to ${event.data.email}!` };
  },
);
