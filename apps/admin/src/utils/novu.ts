import { Novu } from '@novu/node';

export type NotificationBody = {
	name: string;
	to: {
		subscriberId: string;
	};
	payload: {
		message: string;
		id: string;
		name: string;
		description: string;
	};
}

const config = {
	appId: process.env.NOVU_CLIENT_APP_ID as string,
	backendUrl: process.env.NOVU_API_ENDPOINT as string,
	socketUrl: process.env.NOVU_SOCKET_ENDPOINT as string,
}

export const novu = new Novu(process.env.NOVU_API_KEY as string, config);

export async function sendNotification(data: NotificationBody) {

	try {
		const response = await fetch(
			`http://joseantcordeiro.hopto.org:3003/v1/events/trigger`,
			{
				body: JSON.stringify(data),
				headers: {
					'Authorization': 'ApiKey ' + `${process.env.NOVU_API_KEY as string}`,
					'Content-Type': 'application/json',
				},
				method: 'POST'
			}

		);

		if (response.status >= 400) {
			console.error('There was an error');
		}

	} catch (error) {
		throw new Error('Failed to send notification');
	}
	console.log({ status: 'ok' });
}
