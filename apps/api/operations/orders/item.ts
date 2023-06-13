import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'

export class OrderCreationError extends OperationError {
  statusCode = 400;
  code = 'OrderCreationError' as const;
  message = 'Order creation error';
}

export class ItemCreationError extends OperationError {
  statusCode = 400;
  code = 'ItemCreationError' as const;
  message = 'Add to cart creation error';
}

export default createOperation.mutation({
  input: z.object({
		order_id: z.string(),
		product_id: z.string(),
		price: z.number().int(),
		discount: z.number().int(),
		tax: z.number().int(),
  }),
  handler: async ({ input, graph, operations }) => {
		const item = await graph
			.from('site')
			.mutate('upsertOneOrderItems')
			.where({
				where: {
					order_id_product_id: {
						order_id: input.order_id,
						product_id: input.product_id,
					}
				},
				update: {
					quantity: { increment: 1 },
				},
				create: {
					order: { connect: { id: input.order_id } },
					product: { connect: { id: input.product_id } },
					price: input.price,
					discount: input.discount,
					tax: input.tax
				},
			})
			.exec()
		if (!item) {
			throw new ItemCreationError()
		}
		const { data, error } = operations.mutate({
			operationName: 'orders/subtotal',
			input: {
				order_id: input.order_id,
			}
		})
		return { order: {
				id: input.order_id,
				item: item,
			}
		}
  },
})