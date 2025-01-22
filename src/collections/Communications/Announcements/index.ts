import { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrTeacher } from '@/access/roles';
import { AccessArgs } from 'payload';
import { DEFAULT_LANGUAGE, ALL_LANGUAGES as LANGUAGES } from '@/tolgee/shared';
import { getLocaleDisplayName } from '@/utilities/getLocaleDisplayName';
import { fetcher } from '@/lib/fetcher';
import { ANNOUNCEMENT_TYPES } from '@/lib/constants';

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
      options: ANNOUNCEMENT_TYPES,
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
    {
      name: 'notifications',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'processed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'processedAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.status === 'published' && !data.schedule.publishAt) {
          data.schedule.publishAt = new Date();
        }

        if (data.processed && !data.processedAt) {
          data.processedAt = new Date();
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
            },
          );
        }
      },
    ],
  },
};
