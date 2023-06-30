"use server"

import { sendTest } from "@o4s/ui"

export async function sendEmail(to: string) {

  return await sendTest(to)

}
