/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createWebhook } from '../generated/wundergraph.webhooks';
import { Novu } from '@novu/node';

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

		const data ={
			to: {
				subscriberId: event.body.subscriberId
			},
			payload: {
				message: event.body.message,
				objectId: event.body.objectId,
			}
		};

		console.log(JSON.stringify(context));

		const res = await novu.trigger(event.body.eventId, data);

    return {
      statusCode: res.status,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        statusText: res.statusText,
				data: JSON.stringify(res.data),
      },
    };
  },
});