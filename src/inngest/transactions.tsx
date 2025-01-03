import { render } from '@react-email/components';
import { inngest } from './client';
import { PaymentInstructionsEmail } from '@/emails/payment-instructions';


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
    })

    await step.run('send-payment-instructions-email', async () => {
      try {
      await payload.sendEmail({
        to: transaction.email,
        subject: 'Payment instructions',
        html: await render(<PaymentInstructionsEmail transaction={transaction} />),
      });
    } catch (error) {
      throw error;
    }
    });
    
    return { message: `Payment instructions sent to ${transaction.email}!` };
  },
);