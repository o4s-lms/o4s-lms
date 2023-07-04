import {
  defineSignal,
  defineQuery,
  setHandler,
  condition,
  ApplicationFailure,
  sleep,
  proxyActivities,
} from '@temporalio/workflow'
import { errorMessage } from '@o4s/common'
import type * as activities from '@o4s/activities'
import { OrdersIdResponseData } from "@o4s/generated-wundergraph/models"

type Order = OrdersIdResponseData["order"]

type OrderState = 'PENDING' | 'COMPLETED' | 'ARCHIVED' | 'CANCELLED' | 'REQUIRES_ACTION'

export interface OrderStatus {
  orderId: string;
  state: OrderState;
  paidAt?: Date;
}

interface EmailOptions {
	to: string;
	message: string;
	subject: string;
}

export const paidSignal = defineSignal('paid')
export const cancelSignal = defineSignal('cancel')
export const getStatusQuery = defineQuery<OrderStatus>('getStatus')

const { getOrder, archiveOrder, cancelOrder, sendEmailNotification } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1m',
  retry: {
    maximumInterval: '5s', // Just for demo purposes. Usually this should be larger.
  },
})

export async function OrderWorkflow(order: Order): Promise<void> {
	//const order = await getOrder(orderId)
  if (!order) {
    throw ApplicationFailure.create({ message: 'Order not found' })
  }

	let emailOptions: EmailOptions = {
		to: order.customer_email,
		message: 'Order created',
		subject: 'Order created',
	}
	const orderId: string = order.id
  let state: OrderState = order.status as OrderState
  let paidAt: Date

  // setup Signal and Query handlers
  setHandler(paidSignal, () => {
    if (state === 'PENDING') {
      state = 'COMPLETED'
			paidAt = new Date()
    }
  })

	setHandler(cancelSignal, async () => {
    if (state === 'PENDING') {
      state = 'CANCELLED'
			emailOptions.message = 'Order cancelled'
			emailOptions.subject = 'Order cancelled'
			await cancelAndNotify(orderId, emailOptions)
			throw ApplicationFailure.create({ message: 'Order cancelled' })
    }
  })

  setHandler(getStatusQuery, () => {
    return { state, paidAt, orderId }
  })

  // business logic

  if (state === 'PENDING') {
		await sendEmailNotification(emailOptions)
	}

  const notPaidInTime = !(await condition(() => state === 'PENDING', '1 day'))
  if (notPaidInTime) {
    state = 'ARCHIVED'
		emailOptions.message = 'Order archived'
		emailOptions.subject = 'Order archived'
    await archiveAndNotify(orderId, emailOptions)
    throw ApplicationFailure.create({ message: 'Not paied in time' })
  }

  //await sendPushNotification('✅ Order delivered!')

  //await sleep('1 min') // this could also be hours or even months

  //await sendPushNotification(`✍️ Rate your meal. How was the ${product.name.toLowerCase()}?`)
}

async function archiveAndNotify(orderId: string, emailOptions: EmailOptions) {
  await archiveOrder(orderId)
  await sendEmailNotification(emailOptions)
}

async function cancelAndNotify(orderId: string, emailOptions: EmailOptions) {
  await cancelOrder(orderId)
  await sendEmailNotification(emailOptions)
}
