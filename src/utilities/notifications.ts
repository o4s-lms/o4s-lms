import { createPayloadClient } from "@/lib/payload";
import { Notification } from "@/payload-types";

export async function getNotifications(userId: string): Promise<Notification[] | null> {
  const payload = await createPayloadClient();

  const notifications = await payload.find({
    collection: 'notifications',
    depth: 1,
    where: {
      recipient: {
        equals: userId,
      }
    }
  })

  return notifications.docs ?? null
}
export async function unreadNotifications(userId: string): Promise<Notification[] | null> {
  const payload = await createPayloadClient();

  const notifications = await payload.find({
    collection: 'notifications',
    depth: 0,
    where: {
      and: [
        {
          recipient: {
            equals: userId,
          },
        },
        {
          read: {
            equals: false,
          },
        },
      ],
    }
  })

  return notifications.docs ?? null
}