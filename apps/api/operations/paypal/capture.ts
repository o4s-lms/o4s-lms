/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID as string
const PAYPAL_APP_SECRET = process.env.PAYPAL_APP_SECRET as string
const baseURL = {
	sandbox: "https://api-m.sandbox.paypal.com",
	production: "https://api-m.paypal.com"
}

export class AccessTokenError extends OperationError {
  statusCode = 400;
  code = 'AccessTokenError' as const;
  message = 'Failed to generate Access Token';
}

const generateAccessToken = async () => {
	try {
			const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET).toString("base64")
			const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
				method: "POST",
				body: "grant_type=client_credentials",
				headers: {
					Authorization: `Basic ${auth}`,
				},
			})
		
			const data = await response.json()
			return data.access_token
	} catch(error) {
			console.error("Failed to generate Access Token:", error)
      throw new AccessTokenError()
	}
}

export default createOperation.mutation({
  input: z.object({
		order_id: z.string(),
  }),
  handler: async ({ input }) => {
		const accessToken = await generateAccessToken()

		const url = `${baseURL.sandbox}/v2/checkout/orders/${input.order_id}/capture`

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		})

		return response
  },
})