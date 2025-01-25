import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/inngest/client'; // Import our client

// Opt out of caching; every request should send a new event
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Send your event payload to Inngest
  await inngest.send({
    name: 'transactions/process.transaction',
    data: {
      transaction: body,
    },
  });

  return NextResponse.json({ message: 'Event sent!' });
}
