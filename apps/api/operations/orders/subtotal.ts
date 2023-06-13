/* eslint-disable @typescript-eslint/no-misused-promises */
import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'

export class OrderNotFoundError extends OperationError {
  statusCode = 400;
  code = 'OrderNotFoundError' as const;
  message = 'Order not found error';
}

export class OrderUpdateError extends OperationError {
  statusCode = 400;
  code = 'ItemUpdateError' as const;
  message = 'Update subtotal value error';
}

export default createOperation.mutation({
  input: z.object({
		order_id: z.string(),
  }),
  handler: async ({ input, graph, operations }) => {
		const { data, error } = await operations.query({
			operationName: 'orders/id',
			input: {
				id: input.order_id,
			}
		})
		if (!data || error) {
			throw new OrderNotFoundError()
		}
		const items = data?.order?.items
		let subTotal = 0
		let subTotalWithTax = 0
		let discount = 0
		let tax = 0
		items?.forEach(function(item) {
			const realPrice = item.price - item.discount
			subTotal = subTotal + (item.quantity * realPrice)
			discount = discount + (item.quantity * item.discount)
			if (item.tax > 0) {
				subTotalWithTax = subTotalWithTax + (item.quantity * (realPrice * (item.tax / 100)))
				tax = tax + (item.quantity * (realPrice * (item.tax / 100)))
			} else {
				subTotalWithTax = subTotalWithTax + (item.quantity * realPrice)
			}
		})
		const item = await graph
			.from('site')
			.mutate('updateOneOrder')
			.where({
				where: { id: input.order_id },
				data: {
					tax_total: { set: Math.round(tax) },
					discount_total: { set: Math.round(discount) },
					sub_total: { set: Math.round(subTotal) },
					sub_total_with_tax: { set: Math.round(subTotalWithTax) },
				},
			})
			.exec()
		if (!item) {
			throw new OrderUpdateError()
		}
		return { order: {
				id: data?.order?.id,
				tax_total: item.tax_total,
				discount_total: item.discount_total,
				sub_total: item.sub_total,
				sub_total_with_tax: item.sub_total_with_tax,
			}
		}
  },
})