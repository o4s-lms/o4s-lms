/* eslint-disable import/no-anonymous-default-export */
import { getToken } from 'next-auth/jwt';
import { type NextApiRequest, type NextApiResponse } from 'next/types';
import { withCors } from "~/utils/cors";

export default withCors(async (req: NextApiRequest, res: NextApiResponse) => {
	// If you don't have NEXTAUTH_SECRET set, you will have to pass your secret as `secret` to `getToken`
	const token = await getToken({ req });

	if (token) {
		res.status(200);
		res.json({ sub: token.sub, name: token.name, email: token.email, locale: token.locale, roles: token.roles });
	} else {
		// Not Signed in
		res.status(401);
	}
	res.end();
});