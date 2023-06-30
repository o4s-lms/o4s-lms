"use server"

import { Queue } from "quirrel/next-app"
import { sendTest } from "@o4s/ui"

interface Params {
  to: string;
}

export const greetings = Queue(
  "api/queues/greetings", // 👈 the route it's reachable on
  async (to: string) => {
    await sendTest(to)
  }
)
