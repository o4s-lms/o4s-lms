import { createOperation, z } from '../../generated/wundergraph.factory';
import { Stripe } from 'stripe';

export default createOperation.mutation({
	input: z.object({
		customerId: z.string(),
		customerEmail: z.string(),
		price: z.string(),
		quantity: z.number(),
	}),
	handler: async ({ input }) => {
		if (!process.env.STRIPE_SECRET_KEY)
			throw new Error('STRIPE_SECRET_KEY missing')

		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: '2022-11-15',
		});
		
		const domainURL = process.env.PUBLIC_URL;

		 // Create new Checkout Session for the order
		// Other optional params include:
		// [billing_address_collection] - to display billing address details on the page
		// [customer] - if you have an existing Stripe Customer ID
		// [customer_email] - lets you prefill the email input in the Checkout page
		// [automatic_tax] - to automatically calculate sales tax, VAT and GST in the checkout page
		// For full details see https://stripe.com/docs/api/checkout/sessions/create
		const session = await stripe.checkout.sessions.create({
			customer: input.customerId,
			customer_email: input.customerEmail,
			mode: 'payment',
			line_items: [
				{
					price: input.price,
					quantity: input.quantity
				},
			],
			// ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
			success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${domainURL}/canceled.html`,
			// automatic_tax: {enabled: true},
		});
		return session;
	},
});