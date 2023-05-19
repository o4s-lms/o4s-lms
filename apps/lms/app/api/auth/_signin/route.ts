import cors from '@/lib/cors';
import { signIn } from 'next-auth/react';
import type { NextRequest } from 'next/server';


export async function POST(req: NextRequest) {

	const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

	const response = await signIn('email', {
		email: email,
		redirect: false,
	})

	if (response?.error) {
		console.log(JSON.stringify(response));
		return cors(
			req,
			new Response(JSON.stringify(response.error), {
				status: response.status,
				headers: { "Content-Type": "application/json" },
			})
		);
	} else {
		console.log('POST: No token returned from getToken');
		return cors(
			req,
			new Response(JSON.stringify({ message: 'Magic Link Sent' }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			})
		);
	}

}