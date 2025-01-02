import { render } from '@react-email/components';
import { inngest } from './client';
import { PaymentInstructionsEmail } from '@/emails/payment-instructions';


export const emailPaymentInstructions = inngest.createFunction(
  { id: 'payment-instructions-email' },
  { event: 'transactions/payment.instructions' },
  async ({ event, step, payload }) => {

    await step.run('send-payment.instructions-email', async () => {
      try {
      await payload.sendEmail({
        to: event.data.email,
        subject: 'Payment instructions',
        html: await render(<PaymentInstructionsEmail transactionId={event.data.transactionId} total={event.data.total} />),
      });
    } catch (error) {
      throw error;
    }
    });
    return { message: `Payment instructions sent to ${event.data.email}!` };
  },
);