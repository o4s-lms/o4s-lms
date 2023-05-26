import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";
import EmailProvider from "next-auth/providers/email";
import { User } from "next-auth";
// import FusionAuthProvider from "next-auth/providers/fusionauth";

import { prisma } from "@o4s/db";

import { sendVerificationRequest } from "./utils/sendVerificationRequest";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string | undefined;
      // ...other properties
      roles: string[];
    } & DefaultSession["user"];
  }

	interface JWT extends DefaultJWT {
		token: {
			roles: string[];
		} & DefaultJWT["token"];
	}

  interface User {
    // ...other properties
		id: string;
    roles: string[];
  }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
			sendVerificationRequest,
    }),
		/** FusionAuthProvider({
			issuer: process.env.FUSIONAUTH_ISSUER,
			clientId: process.env.FUSIONAUTH_CLIENT_ID,
			clientSecret: process.env.FUSIONAUTH_CLIENT_SECRET,
			wellKnown: `${process.env.FUSIONAUTH_URL}/.well-known/openid-configuration/${process.env.FUSIONAUTH_TENANT_ID}`,
			tenantId: process.env.FUSIONAUTH_TENANT_ID, // Only required if you're using multi-tenancy
		}), */
  ],
	/**
	events: {
		async signIn(message) { // on successful sign in },
		async signOut(message) { // on signout },
		async createUser(message) { // user created },
		async updateUser(message) { // user updated - e.g. their email was verified },
		async linkAccount(message) { // account (e.g. Twitter) linked to a user },
		async session(message) { // session is active },
	},
	pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/lms/users/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  }, */
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/require-await
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      console.log(`url: ${url} - baseUrl: ${baseUrl}`);
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    jwt: ({ token, user }) => {
      console.log("JWT Callback", { token, user });
      if (user) {
        token.roles = user.roles;
        return {
          ...token,
					...user
        };
      }
      return token;
    },
		// eslint-disable-next-line @typescript-eslint/require-await
		async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user.id = token.sub;
			session.user.name = token.name;
			session.user.email = token.email;
			session.user.image = token.picture;
			session.user.roles = token.roles;
			session.expires = token.exp;

      return session;
    },
		/**async session({ session, token, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.roles = [user.roles];
      }
      console.log("Session Callback", { session, token, user });
      return session;
    },*/
  },
};
