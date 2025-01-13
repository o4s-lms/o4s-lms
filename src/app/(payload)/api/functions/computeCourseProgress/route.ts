import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/inngest/client'; // Import our client

// Opt out of caching; every request should send a new event
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const courseId = searchParams.get('courseId');
  // Send your event payload to Inngest
  await inngest.send({
    name: 'courses/compute.course.progress',
    data: {
      userId: userId,
      courseId: courseId,
    },
  });

  return NextResponse.json({ message: 'Event sent!' });
}
