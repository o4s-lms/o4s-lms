import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/inngest/client'; // Import our client

// Opt out of caching; every request should send a new event
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  await inngest.send({
    name: 'announcements/create.notifications.records',
    data: {
      id: id,
    },
  });

  return NextResponse.json({ message: 'Event sent!' });
}
