import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client"; // Import our client

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic";

// Create a simple async Next.js API route handler
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId')
  // Send your event payload to Inngest
  await inngest.send({
    name: "users/last.login",
    data: {
      userId: userId,
    },
  });

  return NextResponse.json({ message: "Event sent!" });
}
