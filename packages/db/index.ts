// import { PrismaClient } from "@prisma/client";
// import type Prisma from "prisma";

import { PrismaClient as Site } from "../../node_modules/@prisma/client/site";
import { PrismaClient as Lms } from "../../node_modules/@prisma/client/lms";

//export * from "@prisma/client";
// export * from "./generated/site"
// export * from "./generated/lms"
// export * from "./db";
export * from "./src/sanitisePrismaObject";

//const globalForPrisma = globalThis as { prisma?: PrismaClient };
const globalForSite = globalThis as { site?: Site };
const globalForLms = globalThis as { lms?: Lms };

/**export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });*/

export const site =
	globalForSite.site ||
	new Site({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
		datasources: {
			db: {
				url: process.env.DATABASE_SITE_PROD,
			},
		},
  });

export const lms =
	globalForLms.lms ||
	new Lms({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
		datasources: {
			db: {
				url: process.env.DATABASE_LMS_DEV,
			},
		},
  });

//if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
if (process.env.NODE_ENV !== "production") globalForSite.site = site;
if (process.env.NODE_ENV !== "production") globalForLms.lms = lms;
