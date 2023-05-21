import { Novu } from '@novu/node';

const config = {
	appId: process.env.NOVU_CLIENT_APP_ID as string,
	backendUrl: process.env.NOVU_API_ENDPOINT as string,
	socketUrl: process.env.NOVU_SOCKET_ENDPOINT as string,
}

export const novu = new Novu(process.env.NOVU_API_KEY as string, config);