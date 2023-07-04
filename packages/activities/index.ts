import { notificationService, userService, orderService } from './services'

interface Order {
	id: string;
	status: string;
	customer_email: string;
}

interface User {
	id: string;
}

interface MessageOptions {
	to: string;
	message: string;
	subject: string;
	template: string;
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

export async function getUser(userUuid: string): Promise<User | null> {
	return await userService.get(userUuid)
}

export async function addUserToCourse(courseId: string, userUuid: string): Promise<void> {
	await userService.member(courseId, userUuid)
}
