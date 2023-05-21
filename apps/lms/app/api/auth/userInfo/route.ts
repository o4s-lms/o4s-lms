import cors from '~/app/lib/cors';
import { getToken } from 'next-auth/jwt';
import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {

	const token = await getToken({ req });

	if (token) {
		console.log(JSON.stringify(token));
		return cors(
			req,
			new Response(JSON.stringify(token), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			})
		);
	} else {
		console.log('GET: No token returned from getToken');
		return cors(
			req,
			new Response(JSON.stringify({ message: 'Invalid token ' }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			})
		);
	}

}

export async function POST(req: NextRequest) {

	const token = await getToken({ req });

	if (token) {
		console.log(JSON.stringify(token));
		return cors(
			req,
			new Response(JSON.stringify(token), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			})
		);
	} else {
		console.log('POST: No token returned from getToken');
		return cors(
			req,
			new Response(JSON.stringify({ message: 'Invalid token ' }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			})
		);
	}

}