/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createWebhook } from '../generated/wundergraph.webhooks';
// import { symmetric } from 'secure-webhooks';
import { Novu } from '@novu/node';

// const secret = process.env.WEBHOOK_SECRET as string;

const config = {
	appId: process.env.NOVU_CLIENT_APP_ID as string,
	backendUrl: process.env.NOVU_API_ENDPOINT as string,
	socketUrl: process.env.NOVU_SOCKET_ENDPOINT as string,
}
const novu = new Novu(process.env.NOVU_API_KEY as string, config);

export default createWebhook({
  handler: async (event, context) => {
    /**event.body;
    event.url;
    event.headers;
    event.method;
    event.query; */

		/** const isTrustWorthy = symmetric.verify(
			event.body, // 👈 needs to be exactly the same as above, make sure to disable any body parsing for this route
			secret,
			event.headers["x-webhook-signature"]
		);

		if (!isTrustWorthy) {
			return {
				statusCode: 401,
				headers: {
					'Content-Type': 'application/json',
				},
				body: {
					data: { message: 'Not Authorized' },
				},
			};
		}; */

		console.log(event.body);
		
		const data ={
			to: {
				subscriberId: event.body.to.subscriberId,
			},
			payload: event.body.payload,
		};

		const res = await novu.trigger(event.body.eventId, data);

    return {
      statusCode: res.status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        statusText: res.statusText,
				data: res.data,
      },
    };
  },
});