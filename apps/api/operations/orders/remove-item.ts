import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'

export class ItemDeletionError extends OperationError {
  statusCode = 400;
  code = 'ItemDeletionError' as const;
  message = 'Remove from cart deletion error';
}

export class UpdateSubTotalError extends OperationError {
  statusCode = 400;
  code = 'UpdateSubTotalError' as const;
  message = 'Update subtotal error';
}

export default createOperation.mutation({
  input: z.object({
		order_id: z.string(),
		product_id: z.string(),
  }),
  handler: async ({ input, graph, operations }) => {
		const item = await graph
			.from('site')
			.mutate('deleteOneOrderItems')
			.where({
				where: {
					order_id_product_id: {
						order_id: input.order_id,
						product_id: input.product_id,
					}
				},
			})
			.exec()
		if (!item) {
			throw new ItemDeletionError()
		}
		const subtotal = await operations.mutate({
			operationName: 'orders/subtotal',
			input: {
				order_id: input.order_id,
			}
		})
		if (!subtotal) {
			throw new UpdateSubTotalError()
		}
		const { data, error } = await operations.query({
			operationName: 'orders/id',
			input: {
				id: input.order_id,
			}
		})
		return data?.order
  },
})