// import { Novu } from '@novu/node';
// import { symmetric } from "secure-webhooks";

export type NotificationPayload = {
	"eventId": string;
	"to": {
		"subscriberId": string;
	};
	"payload": {
		"message": string;
		"id": string;
		"name": string;
		"description": string;
	};
}

/** const config = {
	appId: process.env.NOVU_CLIENT_APP_ID as string,
	backendUrl: process.env.NOVU_API_ENDPOINT as string,
	socketUrl: process.env.NOVU_SOCKET_ENDPOINT as string,
}

export const novu = new Novu(process.env.NOVU_API_KEY as string, config);

const secret = process.env.WEBHOOK_SECRET as string; */

export async function sendToNotificationWebhook(body: NotificationPayload) {
	const payload = JSON.stringify(body);
	// const signature = symmetric.sign(payload, secret);

	try {
		const response = await fetch(
			`${process.env.WG_PUBLIC_NODE_URL}webhooks/notification`, {
				method: "POST",
				body: payload,
				headers: {
					//"x-webhook-signature": signature,
					"Content-Type": "application/json",
				},
			}

		);

		if (response.status >= 400) {
			console.error('There was an error');
		}

	} catch (error) {
		throw new Error('Failed to send notification');
	}
	console.log({ message: 'Notification sent!' });
}
