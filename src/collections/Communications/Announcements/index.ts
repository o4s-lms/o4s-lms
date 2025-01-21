import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrTeacher, isTeacher } from '@/access/roles';
import { AccessArgs } from 'payload';
import { DEFAULT_LANGUAGE, ALL_LANGUAGES as LANGUAGES } from '@/tolgee/shared';
import { getLocaleDisplayName } from '@/utilities/getLocaleDisplayName';
import { fetcher } from '@/lib/fetcher';

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  admin: {
    useAsTitle: 'title',
    group: 'Communications',
    description: 'System-wide announcements',
  },
  access: {
    read: ({ req: { user } }: AccessArgs) => {
      if (!user) return false;
      if (user.role === 'admin' || user.role === 'teacher') return true;

      return {
        status: {
          equals: 'published',
        },
      };
    },
    create: isAdminOrTeacher,
    update: isAdminOrTeacher,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'language',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      options: LANGUAGES.map((locale) => ({
        label: getLocaleDisplayName(locale),
        value: locale,
      })),
      required: true,
      defaultValue: DEFAULT_LANGUAGE,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'General', value: 'general' },
        { label: 'Announcement', value: 'announcement' },
        { label: 'Course Update', value: 'course' },
        { label: 'Assignment', value: 'assignment' },
        { label: 'Achievement', value: 'achievement' },
        { label: 'Quiz', value: 'quiz' },
        { label: 'Discussion', value: 'discussion' },
        { label: 'System', value: 'system' },
        { label: 'Maintenance', value: 'maintenance' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    },
    {
      name: 'audience',
      type: 'group',
      fields: [
        {
          name: 'roles',
          type: 'select',
          hasMany: true,
          required: true,
          options: [
            { label: 'All Users', value: 'all' },
            { label: 'Students', value: 'student' },
            { label: 'Teacher', value: 'teacher' },
            { label: 'User', value: 'user' },
            { label: 'Admins', value: 'admin' },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'schedule',
      type: 'group',
      fields: [
        {
          name: 'publishAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'expireAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.status === 'published' && !data.schedule.publishAt) {
          data.schedule.publishAt = new Date();
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (
          operation === 'create' &&
          (doc.status === 'scheduled' || doc.status === 'published')
        ) {
          await fetcher(
            `/api/functions/createAnnouncementNotifications?id=${doc.id}`,
            {
              method: 'POST',
              body: JSON.stringify(doc),
            },
          );
        }

        /**if (operation === 'update' && doc.processed === false) {
              
              switch (doc.status) {
                case 'completed':
                  const f = doc.user ? 'processTransaction' : 'waitUserSignUp';
                  await fetcher(`/api/functions/${f}`, {
                    method: 'POST',
                    body: JSON.stringify(doc),
                
                  });
                  break;
                case 'disputed':
                  // transaction disputed - revoke the student access
                  break;
                case 'refunded':
                  // transaction refunded - revoke the student access
                  break;
              }
            }*/
      },
    ],
  },
};
