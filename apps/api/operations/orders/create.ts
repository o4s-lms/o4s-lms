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

export class UpdateSubTotalError extends OperationError {
  statusCode = 400;
  code = 'UpdateSubTotalError' as const;
  message = 'Update subtotal error';
}

export default createOperation.mutation({
  input: z.object({
		product_id: z.string(),
		price: z.number().int(),
		discount: z.number().int(),
		tax: z.number().int(),
  }),
  handler: async ({ input, user, graph, operations }) => {
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
					price: input.price,
					discount: input.discount,
					tax: input.tax
				},
			})
			.exec()
		if (!item) {
			throw new ItemCreationError()
		}
		const subtotal = await operations.mutate({
			operationName: 'orders/subtotal',
			input: {
				order_id: order.id,
			}
		})
		if (!subtotal) {
			throw new UpdateSubTotalError()
		}
		const { data, error } = await operations.query({
			operationName: 'orders/id',
			input: {
				id: order.id,
			}
		})
		return data?.order
  },
})