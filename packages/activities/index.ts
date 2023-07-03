import { notificationService, paymentService, orderService } from './services'

interface Order {
	id: string;
	status: string;
	customer_email: string;
}

interface MessageOptions {
	to: string;
	message: string;
	subject: string;
}

export async function sendPushNotification(messageOptions: MessageOptions): Promise<void> {
  notificationService.sendNotification({ type: 'push', messageOptions })
}

export async function sendEmailNotification(messageOptions: MessageOptions): Promise<void> {
  notificationService.sendNotification({ type: 'email', messageOptions })
}

export async function archiveOrder(orderId: string): Promise<void> {
  orderService.archive(orderId)
}

export async function cancelOrder(orderId: string): Promise<void> {
  orderService.cancel(orderId)
}

export async function getOrder(orderId: string): Promise<Order | null> {
	return await orderService.get(orderId)
}
