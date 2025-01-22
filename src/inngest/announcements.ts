import { Where } from 'payload';
import { inngest } from './client';

export const createAnnouncementNotifications = inngest.createFunction(
  { id: 'create-notifications-for-announcement' },
  { event: 'announcements/create.notifications.records' },
  async ({ event, step, payload }) => {
    const now = new Date().toISOString();

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
        'wait-for-publish-date',
        announcement.schedule.publishAt,
      );
    }

    // step 2 - get recipient records
    const recipients = await step.run('get-recipient-records', async () => {
      /**if (announcement.status !== 'published') {
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
      }*/
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

    // step 3 - create notification records
    await step.run('create-notification-records', async () => {
      recipients.map(async (recipient) => {
        try {
          await payload.create({
            collection: 'notifications',
            data: {
              subject: announcement.title,
              announcement: announcement.id,
              recipient: recipient.id,
              type: announcement.type,
              read: false,
            },
          });
        } catch (error) {
          throw error;
        }
        
      });
    });

    // step 4 - get the notifications number
    const notifications = await step.run('get-notifications-number', async () => {
      try {
        const result = await payload.count({
          collection: 'notifications',
          where: {
            announcement: {
              equals: announcement.id,
            }
          },
        });
        return result.totalDocs;
      } catch (error) {
        throw error;
      }
    });

    // step 5 - update announcement to processed
    await step.run('update-announcement-to-processed', async () => {
      try {
        await payload.update({
          collection: 'announcements',
          id: event.data.id,
          data: {
            notifications: notifications,
            processed: true,
          },
        });
      } catch (error) {
        throw error;
      }
    });

    return {
      success: true,
      notifications: notifications,
    }
  },
);
