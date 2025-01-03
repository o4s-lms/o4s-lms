import { render } from '@react-email/components';
import { inngest } from './client';
import { PaymentInstructionsEmail } from '@/emails/payment-instructions';
import { ProofOfPaymentEmail } from '@/emails/proof-of-payment';


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

export const emailProofOfPayment = inngest.createFunction(
  { id: 'proof-of-payment-email' },
  { event: 'transactions/proof.of.payment' },
  async ({ event, step, payload }) => {

    await step.run('send-proof-of-payment-email', async () => {
      try {
      await payload.sendEmail({
        to: 'joseantcordeiro@gmail.com',
        subject: 'Proof of payment received',
        html: await render(<ProofOfPaymentEmail transactionId={event.data.transactionId} files={event.data.files}/>),
      });
    } catch (error) {
      throw error;
    }
    });
    
    return { message: `Proof of payment received sent joseantcordeiro@gmail.com!` };
  },
);