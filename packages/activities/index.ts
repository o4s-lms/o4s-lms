import { notificationService, paymentService, orderService } from './services'

interface Order {
	id: string;
	status: string;
	customer_email: string;
}

export async function sendPushNotification(message: string): Promise<void> {
  notificationService.sendNotification({ type: 'push', message })
}

export async function sendEmailNotification({ to: string, html: string, subject: string }): Promise<void> {
  notificationService.sendEmail({ to: to, html: html, subject: subject })
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
