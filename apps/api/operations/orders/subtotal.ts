/* eslint-disable @typescript-eslint/no-misused-promises */
import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'
import { type OrdersIdResponseData } from '~/generated/models';

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

type Order = OrdersIdResponseData["order"]

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
		items?.forEach(async function(item) {
			const { data, error } = await operations.query({
				operationName: 'products/id',
				input: {
					id: item.product_id
				}
			})
			if (data) {
				subTotal = subTotal + (item.quantity * data?.product?.price)
				if (item.tax > 0) {
					subTotalWithTax = subTotal + (subTotal * item.tax / 100)
				} else {
					subTotalWithTax = subTotal
				}
			}
		})
		const item = await graph
			.from('site')
			.mutate('updateOneOrder')
			.where({
				where: { id: input.order_id },
				data: {
					sub_total: subTotal,
					sub_total_with_tax: subTotalWithTax ,
				},
			})
			.exec()
		if (!item) {
			throw new OrderUpdateError()
		}
		return { order: {
				id: input.order_id,
				sub_total: subTotal,
				sub_total_with_tax: subTotalWithTax,
			}
		}
  },
})