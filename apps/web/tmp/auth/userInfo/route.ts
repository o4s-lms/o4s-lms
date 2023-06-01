import cors from '@/lib/cors';
import { getToken } from 'next-auth/jwt';
import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {

	const token = await getToken({ req });

	if (token) {
		console.log(JSON.stringify(token));
		return cors(
			req,
			new Response(JSON.stringify({ sub: token.sub, name: token.name, email: token.email, locale: token.locale, roles: token.roles }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			})
		);
	} else {
		console.error('GET: No token returned from getToken');
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
			new Response(JSON.stringify({ sub: token.sub, name: token.name, email: token.email, locale: token.locale, roles: token.roles }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			})
		);
	} else {
		console.error('POST: No token returned from getToken');
		return cors(
			req,
			new Response(JSON.stringify({ message: 'Invalid token ' }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			})
		);
	}

}