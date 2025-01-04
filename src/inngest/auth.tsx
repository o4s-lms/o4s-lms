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

export const updateUserRole = inngest.createFunction(
  { id: 'update-user-role' },
  { event: 'auth/update.user.role' },
  async ({ event, step }) => {
    const data = await step.run('update-role', async () => {
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${event.data.userId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
            },
            body: JSON.stringify({
              role: event.data.role,
            }),
          },
        );
        const data = await result.json();
        return data;
      } catch (error) {
        throw error;
      }
    });
    return {
      message: data.message,
      userId: data.doc.id,
      role: data.doc.role,
    };
  },
);
