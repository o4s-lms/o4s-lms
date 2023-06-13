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
		product_id: z.string(),
  }),
  handler: async ({ input, user, graph }) => {
		const order = await graph
			.from('site')
			.mutate('createOneOrder')
			.where({ data: {
				customer_uuid: user?.userId as string,
				customer_email: user?.email as string,
			}})
			.exec()
		if (!order) {
			throw new OrderCreationError()
		}
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