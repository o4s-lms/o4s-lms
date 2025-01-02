import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/inngest/client'; // Import our client

// Opt out of caching; every request should send a new event
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const transactionId = searchParams.get('transactionId');
  const email = searchParams.get('email');
  const total = searchParams.get('total');
  // Send your event payload to Inngest
  await inngest.send({
    name: 'transactions/payment.instructions',
    data: {
      transactionId: transactionId,
      email: email,
      total: total,
    },
  });

  return NextResponse.json({ message: 'Event sent!' });
}
