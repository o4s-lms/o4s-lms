import NextAuth from "next-auth";

import { authOptions } from "@o4s/auth";
// import { withCors } from "@/lib/cors";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };