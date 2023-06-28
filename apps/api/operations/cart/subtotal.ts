import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'

export class CartNotFoundError extends OperationError {
  statusCode = 500;
  code = 'CartNotFoundError' as const;
  message = 'Cart not found error';
}

export class CartUpdateError extends OperationError {
  statusCode = 500;
  code = 'CartUpdateError' as const;
  message = 'Update subtotal value error';
}

export default createOperation.mutation({
  input: z.object({
		cart_id: z.string(),
  }),
  handler: async ({ input, graph, operations }) => {
		const { data, error } = await operations.query({
			operationName: 'cart/id',
			input: {
				id: input.cart_id,
			}
		})
		if (!data || error) {
			throw new CartNotFoundError()
		}
		const items = data?.cart?.items
		let subTotal = 0
		let subTotalWithTax = 0
		let discount = 0
		let tax = 0
		items?.forEach(function(item) {
			const realPrice = item.price - item.discount
			subTotal += (item.quantity * realPrice)
			discount += (item.quantity * item.discount)
			if (item.tax > 0) {
				subTotalWithTax += (item.quantity * (realPrice + (realPrice * (item.tax / 100))))
				tax += (item.quantity * (realPrice * (item.tax / 100)))
			} else {
				subTotalWithTax += (item.quantity * realPrice)
			}
		})
		const item = await graph
			.from('site')
			.mutate('updateOneCart')
			.where({
				where: { id: input.cart_id },
				data: {
					tax_total: { set: Math.round(tax) },
					discount_total: { set: Math.round(discount) },
					sub_total: { set: Math.round(subTotal) },
					sub_total_with_tax: { set: Math.round(subTotalWithTax) },
				},
			})
			.exec()
		if (!item) {
			throw new CartUpdateError()
		}
		return { cart: {
				id: data?.cart?.id,
				tax_total: item.tax_total,
				discount_total: item.discount_total,
				sub_total: item.sub_total,
				sub_total_with_tax: item.sub_total_with_tax,
			}
		}
  },
})