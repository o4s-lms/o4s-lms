import { Where } from 'payload';
import { inngest } from './client';
import { createId } from '@paralleldrive/cuid2';
import { schema } from '@/zero/schema';
import { Zero } from '@rocicorp/zero';

export const createAnnouncementNotifications = inngest.createFunction(
  { id: 'create-notifications-for-announcement' },
  { event: 'announcements/create.notifications.records' },
  async ({ event, step, payload }) => {
    const now = new Date().toISOString();
    const z = new Zero({
      schema: schema,
      auth: event.user.token,
      server: process.env.ZERO_PUBLIC_SERVER,
      userID: event.user.id,
    });

    // step 1 - create notification records
    const announcement = await step.run(
      'create-notification-records',
      async () => {
        try {
          const announcement = await payload.findByID({
            collection: 'announcements',
            id: event.data.id,
            depth: 0,
          });
          return announcement;
        } catch (error) {
          throw error;
        }
      },
    );

    if (
      announcement.schedule?.publishAt &&
      Date.parse(announcement.schedule?.publishAt) > Date.parse(now)
    ) {
      await step.sleepUntil(
        'wait-for-iso-string',
        announcement.schedule.publishAt,
      );
    }

    // step 2 - get recipient records
    const recipients = await step.run('get-recipient-records', async () => {
      if (announcement.status !== 'published') {
        try {
          await payload.update({
            collection: 'announcements',
            id: event.data.id,
            data: {
              status: 'published',
            },
          });
        } catch (error) {
          throw error;
        }
      }
      let query: Where;
      if (announcement.audience?.roles.includes('all')) {
        query = {
          language: {
            equals: announcement.language,
          },
        };
      } else {
        query = {
          and: [
            {
              role: {
                in: announcement.audience?.roles,
              },
            },
            {
              language: {
                equals: announcement.language,
              },
            },
          ],
        };
      }

      try {
        const users = await payload.find({
          collection: 'users',
          where: query,
          select: {
            language: true,
          },
        });
        return users.docs;
      } catch (error) {
        throw error;
      }
    });

    // step 2 - create notification zero records
    await step.run('create-notification-records', async () => {
      recipients.map((recipient) => {
        z.mutate.notification.insert({
          id: createId(),
          recipient: recipient.id,
          subject: announcement.title,
          content: announcement.content,
          type: announcement.type,
          priority: announcement.priority,
          read: false,
          reference: {
            collection: 'announcements',
            id: announcement.id,
          },
        });
      });
    });
  },
);
