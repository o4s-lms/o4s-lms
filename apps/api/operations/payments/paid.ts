import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'

export class OrderUpdateError extends OperationError {
  statusCode = 400;
  code = 'OrderUpdateError' as const;
  message = 'Update order status error';
}

export class PaymentUpdateError extends OperationError {
  statusCode = 400;
  code = 'PaymentUpdateError' as const;
  message = 'Update payment status error';
}

export default createOperation.mutation({
	input: z.object({
		order_id: z.string(),
		payment_id: z.string(),
		transaction_id: z.string(),
		payer_id: z.string(),
	}),
	handler: async ({ input, graph }) => {
		const order = await graph
			.from('site')
			.mutate('updateOneOrder')
			.where({
				where: { id: input.order_id },
				data: {
					status: { set: "COMPLETED" },
				},
			})
			.exec()
		if (!order) {
			throw new OrderUpdateError()
		}

		const payment = await graph
			.from('site')
			.mutate('updateOnePayment')
			.where({
				where: { id: input.payment_id },
				data: {
					status: { set: "PAID" },
					payer_id: { set: input.payer_id },
					transaction_id: { set: input.transaction_id },
				},
			})
			.exec()
		if (!payment) {
			throw new PaymentUpdateError()
		}

		return {
      order_id: order.id,
      payment_id: payment.id,
    }
	},
})