import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/inngest/client'; // Import our client

// Opt out of caching; every request should send a new event
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  // Send your event payload to Inngest
  await inngest.send({
    name: 'auth/password.updated',
    data: {
      email: email,
    },
  });

  return NextResponse.json({ message: 'Event sent!' });
}
