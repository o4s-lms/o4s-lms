/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import express from 'express';
import { type GetVerificationKey, expressjwt as jwt, type Request as JWTRequest } from "express-jwt";
import jwksRsa from "jwks-rsa";
import cors from "cors";
import cookieParser from "cookie-parser";
import { site } from "@o4s/db";

const app = express();
const jwksHost = process.env.PUBLIC_HANKO_API;

const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 100,
      jwksUri: `${jwksHost}/.well-known/jwks.json`,
    }) as GetVerificationKey,
    algorithms: ["RS256"],
    getToken: function fromCookieOrHeader(req) {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        return req.headers.authorization.split(" ")[1];
      } else if (req.cookies && req.cookies.hanko) {
        return req.cookies.hanko;
      }
      return null;
    },
  })
);

app.get("/userInfo", async (req: JWTRequest, res: express.Response) => {
	//console.log(JSON.stringify(res));
  const userUUID = req.auth?.sub;
	if (userUUID) {
		const user = await site.user.findUnique({
			where: { uuid: userUUID },
			select: {
				name: true,
				given_name: true,
				family_name: true,
				email: true,
				email_verified: true,
				gender: true,
				locale: true,
				picture: true,
				roles: true,
			},
		});
  
		res.status(200).send(
			JSON.stringify({
				sub: userUUID,
				name: user?.name,
				given_name: user?.given_name,
				family_name: user?.family_name,
				gender: user?.gender,
				email: user?.email,
				email_verified: user?.email_verified,
				picture: user?.picture,
				locale: user?.locale,
				roles: user?.roles,
			}),
		);
	} else res.sendStatus(401);
});

const server = app.listen(8002, () =>
  console.log(`
🚀 Server ready at: http://localhost:8002`),
);