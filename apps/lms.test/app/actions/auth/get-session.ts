import { getServerSession } from "next-auth";

import { authOptions } from "@o4s/auth";

export default async function getSession() {
  return await getServerSession(authOptions);
}