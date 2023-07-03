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
import { render } from '@react-email/render'
import { OrderStatusMessage } from '@o4s/ui/emails/templates/order-status'

type OrderState = 'PENDING' | 'COMPLETED' | 'ARCHIVED' | 'CANCELLED' | 'REQUIRES_ACTION'

export interface OrderStatus {
  orderId: number
  state: OrderState
  paidAt?: Date
}

interface EmailOptions {
	to: string;
	html: string;
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

export async function order(orderId: string): Promise<void> {
	const order = await getOrder(orderId)
  if (!order) {
    throw ApplicationFailure.create({ message: `Order ${orderId} not found` })
  }

	let emailOptions: EmailOptions = {
		to: order.customer_email,
		html: '',
		subject: '',
	}
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
			emailOptions.html = render(OrderStatusMessage({ message: 'Order cancelled' }))
			emailOptions.subject = 'Order cancelled'
			await cancelAndNotify(orderId, emailOptions)
			throw ApplicationFailure.create({ message: 'Order cancelled' })
    }
  })

  setHandler(getStatusQuery, () => {
    return { state, paidAt, orderId }
  })

  // business logic

  state = 'PENDING'

  const notPaidInTime = !(await condition(() => state === 'PENDING', '7 days'))
  if (notPaidInTime) {
    state = 'ARCHIVED'
		emailOptions.html = render(OrderStatusMessage({ message: 'Not paied in time' }))
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
