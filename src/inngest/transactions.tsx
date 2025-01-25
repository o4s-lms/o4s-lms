import { render } from '@react-email/components';
import { inngest } from './client';
import { PaymentInstructionsEmail } from '@/emails/payment-instructions';
import { ProofOfPaymentEmail } from '@/emails/proof-of-payment';
import { TransactionCancelledEmail } from '@/emails/transaction-cancelled';

export const emailPaymentInstructions = inngest.createFunction(
  { id: 'payment-instructions-email' },
  { event: 'transactions/payment.instructions' },
  async ({ event, step, payload }) => {
    const transaction = await step.run('get-transaction-details', async () => {
      try {
        const t = await payload.findByID({
          collection: 'transactions',
          id: event.data.transactionId,
          depth: 0,
        });
        return t;
      } catch (error) {
        throw error;
      }
    });

    await step.run('send-payment-instructions-email', async () => {
      try {
        await payload.sendEmail({
          to: transaction.email,
          subject: 'Payment instructions',
          html: await render(
            <PaymentInstructionsEmail transaction={transaction} />,
          ),
        });
      } catch (error) {
        throw error;
      }
    });

    return { message: `Payment instructions sent to ${transaction.email}!` };
  },
);

export const emailProofOfPayment = inngest.createFunction(
  { id: 'proof-of-payment-email' },
  { event: 'transactions/proof.of.payment' },
  async ({ event, step, payload }) => {
    await step.run('send-proof-of-payment-email', async () => {
      try {
        await payload.sendEmail({
          to: 'joseantcordeiro@gmail.com',
          subject: 'Proof of payment received',
          html: await render(
            <ProofOfPaymentEmail
              transactionId={event.data.transactionId}
              files={event.data.files}
            />,
          ),
        });
      } catch (error) {
        throw error;
      }
    });

    return {
      message: `Proof of payment received sent joseantcordeiro@gmail.com!`,
    };
  },
);

export const pendingTransaction = inngest.createFunction(
  { id: 'pending-transaction' },
  { event: 'transactions/pending.transaction' },
  async ({ event, step, payload }) => {
    const { transaction } = event.data;

    const transactionCompleted = await step.waitForEvent(
      'wait-for-transaction-completed',
      {
        event: 'transactions/transaction.completed',
        timeout: '15d',
        match: 'data.transaction.id',
      },
    );
    if (!transactionCompleted) {
      // if no event is received within 15 days, update transaction to cancelled
      await step.run('cancel-transaction', async () => {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/${transaction.id}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
              },
              body: JSON.stringify({
                status: 'cancelled',
              }),
            },
          );
          // send message to the user
          await payload.sendEmail({
            to: transaction.email,
            subject: 'Transaction cancelled',
            html: await render(
              <TransactionCancelledEmail transaction={transaction} />,
            ),
          });
        } catch (error) {
          throw error;
        }
      });
    } else {
      await step.sendEvent('send-process-transaction-event', {
        name: 'transactions/process.transaction',
        data: { transaction: transaction },
      });
    }
  },
);

export const processTransaction = inngest.createFunction(
  { id: 'process-transaction' },
  { event: 'transactions/process.transaction' },
  async ({ event, step, payload }) => {
    const { transaction } = event.data;

    await step.sendEvent('send-update-role-event', {
      name: 'auth/update.user.role',
      user: { id: transaction.user, role: 'student' },
    });
    await step.run('create-courses-enrollments', async () => {
      transaction.courses.map(async (course) => {
        try {
          await payload.create({
            collection: 'enrollments',
            data: {
              student: transaction.user,
              course: course.value,
              status: 'active',
              enrolledAt: new Date().toISOString(),
            },
          });
        } catch (error) {
          throw error;
        }
      });
    });

    const t = await step.run('update-transaction-to-processed', async () => {
      try {
        const result = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions/${transaction.id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
            },
            body: JSON.stringify({
              processed: true,
              processedAt: new Date().toISOString(),
            }),
          },
        );
        const data = await result.json();
        return data.doc;
      } catch (error) {
        throw error;
      }
    });

    return {
      message: 'Transaction processed',
      transaction: t,
    };
  },
);
