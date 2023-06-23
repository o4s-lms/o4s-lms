/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID as string
const PAYPAL_APP_SECRET = process.env.PAYPAL_APP_SECRET as string
const base = "https://api-m.sandbox.paypal.com"

export class OrderNotFoundError extends OperationError {
  statusCode = 400;
  code = 'OrderNotFoundError' as const;
  message = 'Order not found error';
}

export class OrderCreationError extends OperationError {
  statusCode = 400;
  code = 'OrderCreationError' as const;
}

export class AccessTokenError extends OperationError {
  statusCode = 400;
  code = 'AccessTokenError' as const;
  message = 'Failed to generate Access Token';
}

const generateAccessToken = async () => {
	try {
			const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET).toString("base64")
			const response = await fetch(`${base}/v1/oauth2/token`, {
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

async function handleResponse(response: Response) {
	if (response.status === 200 || response.status === 201) {
		return response.json();
	}

	const errorMessage = await response.text();
	throw new OrderCreationError({ message: errorMessage });
}


export default createOperation.mutation({
  input: z.object({
		order_id: z.string(),
  }),
  handler: async ({ input, user, graph, operations }) => {
		const { data: order } = await operations.query({
			operationName: 'orders/id',
			input: {
				id: input.order_id,
			}
		})
		if (!order) {
			throw new OrderNotFoundError()
		}
		const accessToken = await generateAccessToken()
    const url = `${base}/v2/checkout/orders`
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
        {
            amount: {
            currency_code: "USD",
            value: "0.02",
            },
        },
        ],
    }

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
    })

    return handleResponse(response)
  },
})
