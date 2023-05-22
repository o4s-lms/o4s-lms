import { createWebhook } from '../generated/wundergraph.webhooks';
import { Stripe } from 'stripe';

export default createWebhook({
  handler: async (event, context) => {
		if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET)
			throw new Error('STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET missing')

		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: '2022-11-15',
		});
		const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string

		let data;
  	let eventType;

		if (endpointSecret) {
			// Get the signature sent by Stripe
			const signature = event.headers['stripe-signature'];
			try {
				const stripeEvent = stripe.webhooks.constructEvent(
					event.body,
					signature,
					endpointSecret
				);
				data = stripeEvent.data;
    		eventType = stripeEvent.type;
			} catch (err) {
				console.log(`⚠️  Webhook signature verification failed.`, err.message);
				return {
					statusCode: 400,
					headers: {
						'Content-Type': 'application/json',
					},
					body: null,
				};
			}
		} else {
			// Webhook signing is recommended, but if the secret is not configured in `.env STRIPE_WEBHOOK_SECRET`,
			// retrieve the event data directly from the request body.
			data = event.body.data;
			eventType = event.body.type;
		}

		switch (eventType) {
			case 'checkout.session.completed':
				console.log(`🔔  Payment received!`);
				break;
			case 'payment_intent.succeeded':
				const paymentIntent = data.object;
				// Then define and call a method to handle the successful payment intent.
				// handlePaymentIntentSucceeded(paymentIntent);
				break;
			case 'payment_method.attached':
				const paymentMethod = data.object;
				// Then define and call a method to handle the successful attachment of a PaymentMethod.
				// handlePaymentMethodAttached(paymentMethod);
				break;
			// ... handle other event types
			default:
				console.log(`Unhandled event type ${eventType}`);
		}

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ received: true }),
    };
  },
});