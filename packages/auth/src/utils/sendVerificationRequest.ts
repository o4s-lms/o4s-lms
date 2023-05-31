// import { lms } from "@o4s/db";
import { sendMagicLinkEmail } from "../email/sendMagicLink";

type Props = {
  identifier: string;
  url: string;
}

export const sendVerificationRequest = async ({ identifier, url }: Props) => {

	try {
    sendMagicLinkEmail({ url, to: identifier })
  } catch (err) {
    throw new Error(`Email(s) could not be sent`)
  }


	/** const user = await lms.user.findUnique({ 
		where: { email: identifier },
		select: { id: true },
	});
	if (user === null) {
			// is new user, send a welcome mail to another
			throw new Error("User not found");
	}
  const data = {
		name: "signin-verification-email",
		to: {
			subscriberId: user.id,
			email: identifier
		},
		payload: {
			url: url
		}
	};
	try {
		
		const response = await fetch(
			`http://joseantcordeiro.hopto.org:3003/v1/events/trigger`,
			{
				body: JSON.stringify(data),
				headers: {
					'Authorization': 'ApiKey 846a77c201ca42671c1e1c37e47617cd' + `${process.env.NOVU_API_KEY}`,
					'Content-Type': 'application/json',
				},
				method: 'POST'
			}

		);

		const response = await fetch(
			`http://joseantcordeiro.hopto.org:9991/webhooks/notification`,
			{
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST'
			}

		);

		if (response.status >= 400) {
			console.error('There was an error');
		}

	} catch (error) {
		throw new Error('Failed to send email');
	}
	console.log({ status: 'ok' }); */
}
