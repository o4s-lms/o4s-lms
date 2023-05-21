import { novu, sanitizeUrl } from "@o4s/comm";
import { prisma } from "@o4s/db";

type Props = {
  identifier: string;
  url: string;
}

export const sendVerificationRequest = async ({ identifier, url }: Props) => {
	const user = await prisma.user.findUnique({ 
		where: { email: identifier },
		select: { id: true },
	});
	if (user === null) {
			throw new Error("User not found");
	}
  try {
		await novu.trigger('signin-verification-email', {
			to: {
				subscriberId: user.id,
				email: identifier
			},
			payload: {
				url: sanitizeUrl(url)
			}
		});
  } catch (err) {
    throw new Error(`Email(s) could not be sent`)
  }
}
