import { render } from '@react-email/components';
import { inngest } from './client';
import { PasswordResetEmail } from '@/emails/password-updated';
import { stringify } from 'qs-esm';
import { Where } from 'payload';

export const emailPasswordUpdated = inngest.createFunction(
  { id: 'password-updated-email' },
  { event: 'auth/password.updated' },
  async ({ event, step, payload }) => {
    await step.run('send-password-updated-email', async () => {
      try {
        await payload.sendEmail({
          to: event.user.email,
          subject: 'Your password as been reset successful',
          html: await render(<PasswordResetEmail />),
        });
      } catch (error) {
        throw error;
      }
    });
    return { message: `Email sent to ${event.user.email}!` };
  },
);

export const updateUserRole = inngest.createFunction(
  { id: 'update-user-role' },
  { event: 'auth/update.user.role' },
  async ({ event, step }) => {
    const data = await step.run('update-role', async () => {
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${event.user.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
            },
            body: JSON.stringify({
              role: event.user.role,
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

export const waitUserSignUp = inngest.createFunction(
  { id: 'wait-for-user-sign-up' },
  { event: 'auth/wait.user.sign.up' },
  async ({ event, step, payload }) => {
    const user = await step.run('verify-is-user', async () => {
      const query: Where = {
        email: {
          equals: event.data.transaction.email,
        },
      };
      const stringifiedQuery = stringify(
        {
          where: query,
        },
        { addQueryPrefix: true },
      );
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users${stringifiedQuery}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
            },
          },
        );
        const data = await result.json();
        if (data.docs.lenght > 0) return data.docs[0];
        return null;
      } catch (error) {
        throw error;
      }
    });

    if (!user) {
      const onboardingCompleted = await step.waitForEvent(
        'waiting-for-user-sign-up',
        {
          event: 'auth/sign-up.completed',
          timeout: '3d',
          match: 'data.transaction.email',
        },
      );
      if (!onboardingCompleted) {
        // if no event is received within 3 days, onboardingCompleted will be null
      } else {
        const transaction = await step.run(
          'find-transaction-record-with-user',
          async () => {
            try {
              const transaction = await payload.find({
                collection: 'transactions',
                depth: 0,
                where: {
                  id: {
                    equals: event.data.transaction.id,
                  },
                },
              });
              return transaction;
            } catch (error) {
              throw error;
            }
          },
        );
        await step.sendEvent('send-process-transaction-event', {
          name: 'transactions/process.transaction',
          data: { transaction: transaction },
        });
      }
    }

    return { message: '' };
  },
);
