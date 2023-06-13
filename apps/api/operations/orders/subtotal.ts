/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'
import { type OrdersIdResponseData } from '~/generated/models';

export class OrderNotFoundError extends OperationError {
  statusCode = 400;
  code = 'OrderNotFoundError' as const;
  message = 'Order not found error';
}

export class ItemCreationError extends OperationError {
  statusCode = 400;
  code = 'ItemCreationError' as const;
  message = 'Add to cart creation error';
}

type Order = OrdersIdResponseData["order"]

export default createOperation.mutation({
  input: z.object({
		order_id: z.string(),
		product_id: z.string(),
  }),
  handler: async ({ input, user, graph, operations }) => {
		const { data: order, error } = await operations.query({
			operationName: 'orders/id',
			input: {
				id: input.order_id,
			}
		})
		if (error) {
			throw new OrderNotFoundError()
		}
		const items = order?.items
		let subTotal = 0
		items.forEach(async function(item) {
			const { data: product } = await operations.query({
				operationName: 'products/id',
				input: {
					id: item.product_id
				}
			})
			subTotal = subTotal + (item.quantity * product.price)
		})
		const item = await graph
			.from('site')
			.mutate('upsertOneOrderItems')
			.where({
				where: {
					order_id_product_id: {
						order_id: order.id,
						product_id: input.product_id,
					}
				},
				update: {},
				create: {
					order: { connect: { id: order.id } },
					product: { connect: { id: input.product_id } },
				},
			})
			.exec()
		if (!item) {
			throw new ItemCreationError()
		}
		return {
			order: order,
			items: item,
		}
  },
})