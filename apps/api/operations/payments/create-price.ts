import { createOperation, z } from '../../generated/wundergraph.factory';
import { Stripe } from 'stripe';

export default createOperation.mutation({
	input: z.object({
		unit_amount: z.number(),
		currency: z.enum(['eur', 'usd']),
		productId: z.number(),
	}),
	handler: async ({ input, operations }) => {
		if (!process.env.STRIPE_SECRET_KEY)
			throw new Error('STRIPE_SECRET_KEY missing')

		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: '2022-11-15',
		});
		
		const price = await stripe.prices.create({
			unit_amount: input.unit_amount,
			currency: input.currency,
			product: input.productId as unknown as string,
		});

		// TODO: handle errors here

		const { data, error } = await operations.mutate({
      operationName: 'products/update-stripe-price',
      input: {
        productId: input.productId,
				priceId: price.id,
      },
    });

		return price;
	},
});