import { Novu } from '@novu/node';

const config = {
	appId: String(process.env.NOVU_CLIENT_APP_ID),
	backendUrl: String(process.env.NOVU_API_ENDPOINT),
	socketUrl: String(process.env.NOVU_SOCKET_ENDPOINT),
}

export const novu = new Novu(String(process.env.NOVU_API_KEY), config);