import { OperationError } from '@wundergraph/sdk/operations'
import { createOperation, z } from '../../generated/wundergraph.factory'
import { connectToTemporal } from '../../temporal/temporal-client'
import { OrderWorkflow } from '@o4s/workflows'

export class CartNotFoundError extends OperationError {
  statusCode = 500;
  code = 'CartNotFoundError' as const;
  message = 'Cart not found error';
}

export class OrderCreationError extends OperationError {
  statusCode = 500;
  code = 'OrderCreationError' as const;
  message = 'Order creation error';
}

export class ItemCreationError extends OperationError {
  statusCode = 500;
  code = 'ItemCreationError' as const;
  message = 'Order item creation error';
}

export class UpdateSubTotalError extends OperationError {
  statusCode = 500;
  code = 'UpdateSubTotalError' as const;
  message = 'Order update subtotal error';
}

export class PaymentCreationError extends OperationError {
  statusCode = 500;
  code = 'PaymentCreationError' as const;
  message = 'Payment creation error';
}

export default createOperation.mutation({
  input: z.object({
		cart_id: z.string(),
		payment_method: z.string(),
  }),
  handler: async ({ input, user, graph, operations }) => {
		const { data: currentCard } = await operations.query({
			operationName: 'cart/id',
			input: {
				id: input.cart_id,
			}
		})
		if (!currentCard) {
			throw new CartNotFoundError()
		}
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
		async function items () {
			await currentCard?.cart?.items?.reduce(async (promise, item) => {
				// This line will wait for the last async function to finish.
				// The first iteration uses an already resolved Promise
				// so, it will immediately continue.
				await promise
				const order_item = await graph
					.from('site')
					.mutate('upsertOneOrderItems')
					.where({
						where: {
							order_id_product_id: {
								order_id: order.id,
								product_id: item.product_id,
							}
						},
						update: {},
						create: {
							order: { connect: { id: order.id } },
							product: { connect: { id: item.product_id } },
							price: item.price,
							discount: item.discount,
							tax: item.tax
						},
					})
					.exec()
				if (!order_item) {
					throw new ItemCreationError()
				}
			}, Promise.resolve());
		}
		await items()
		const { data: subtotal } = await operations.mutate({
			operationName: 'orders/subtotal',
			input: {
				order_id: order.id,
			}
		})
		if (!subtotal) {
			throw new UpdateSubTotalError()
		}
		const { data: payment } = await operations.mutate({
			operationName: 'payments/create',
			input: {
				status: 'PENDING',
				value: subtotal.order.sub_total_with_tax,
				method_id: input.payment_method,
				order_id: order.id,
			}
		})
		if (!payment) {
			throw new PaymentCreationError()
		}

		const { data: newOrder } = await operations.query({
			operationName: 'orders/id',
			input: {
				id: order.id,
			}
		})

		const temporal = await connectToTemporal()
		await temporal.workflow.start(OrderWorkflow, {
			taskQueue: 'site-order',
			workflowId: `order-workflow-${newOrder.order.id}`,
			args: [newOrder.order],
		})

		return newOrder
  },
})