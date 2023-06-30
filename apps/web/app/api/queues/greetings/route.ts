"use server"

import { NextResponse } from "next/server"
import { greetings } from "@/queues/greetings"

export async function POST(req: Request) {
  const { id, to } = await req.json()

  await greetings.enqueue(to, {
    id: id,
  })

  return NextResponse.json({ status: "OK" })
}
