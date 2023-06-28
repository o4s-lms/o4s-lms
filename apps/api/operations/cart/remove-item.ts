import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'

export class ItemDeletionError extends OperationError {
  statusCode = 500;
  code = 'ItemDeletionError' as const;
  message = 'Remove from cart deletion error';
}

export class UpdateSubTotalError extends OperationError {
  statusCode = 500;
  code = 'UpdateSubTotalError' as const;
  message = 'Update subtotal error';
}

export default createOperation.mutation({
  input: z.object({
		cart_id: z.string(),
		product_id: z.string(),
  }),
  handler: async ({ input, graph, operations }) => {
		const item = await graph
			.from('site')
			.mutate('deleteOneCartItems')
			.where({
				where: {
					cart_id_product_id: {
						cart_id: input.cart_id,
						product_id: input.product_id,
					}
				},
			})
			.exec()
		if (!item) {
			throw new ItemDeletionError()
		}
		const subtotal = await operations.mutate({
			operationName: 'cart/subtotal',
			input: {
				cart_id: input.cart_id,
			}
		})
		if (!subtotal) {
			throw new UpdateSubTotalError()
		}
		const { data, error } = await operations.query({
			operationName: 'cart/id',
			input: {
				id: input.cart_id,
			}
		})
		return data?.cart
  },
})