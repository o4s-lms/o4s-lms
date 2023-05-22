import { createOperation, z } from '../../generated/wundergraph.factory';
import { Stripe } from 'stripe';

export default createOperation.query({
	input: z.object({
		sessionId: z.string(),
	}),
	handler: async ({ input }) => {
		if (!process.env.STRIPE_SECRET_KEY)
			throw new Error('STRIPE_SECRET_KEY missing')

		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: '2022-11-15',
		});

		const session = await stripe.checkout.sessions.retrieve(input.sessionId);

		return session;
	},
});