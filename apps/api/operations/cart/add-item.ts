import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'

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
		cart_id: z.string(),
		product_id: z.string(),
		price: z.number().int(),
		discount: z.number().int(),
		tax: z.number().int(),
  }),
  handler: async ({ input, graph, operations }) => {
		const item = await graph
			.from('site')
			.mutate('upsertOneCartItems')
			.where({
				where: {
					cart_id_product_id: {
						cart_id: input.cart_id,
						product_id: input.product_id,
					}
				},
				update: {
					quantity: { increment: 1 },
				},
				create: {
					cart: { connect: { id: input.cart_id } },
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