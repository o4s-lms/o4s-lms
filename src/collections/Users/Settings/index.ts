import type { CollectionConfig } from 'payload';
import { checkRole } from '@/access/checkRole';
import { languageSelectOptions } from '@/utilities/languages';
import { AccessArgs, BeforeChangeHookData } from '@/collections/types';

export const Settings: CollectionConfig = {
  slug: 'settings',
  admin: {
    useAsTitle: 'user',
    group: 'System',
    defaultColumns: ['user', 'theme', 'language'],
    description: 'Student preferences and settings',
    listSearchableFields: ['user'],
  },
  access: {
    read: ({ req: { user } }: AccessArgs) => {
      if (checkRole(['admin'], user)) return true;
      return {
        user: {
          equals: user?.id,
        },
      };
    },
    create: ({ req: { user } }: AccessArgs) => !!user,
    update: ({ req: { user } }: AccessArgs) => {
      if (checkRole(['admin'], user)) return true;
      return {
        user: {
          equals: user?.id,
        },
      };
    },
    delete: ({ req: { user } }: AccessArgs) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      admin: {
        description: 'The user this settings belong to',
      },
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'theme',
          type: 'select',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' },
          ],
          defaultValue: 'system',
          admin: {
            description: 'The default theme for the user',
          },
        },
        {
          name: 'language',
          type: 'select',
          admin: {
            description: 'The default language for the user',
          },
          options: languageSelectOptions,
          defaultValue: 'pt',
          required: true,
          label: 'Language',
        },
        {
          name: 'emailNotifications',
          type: 'group',
          fields: [
            {
              name: 'assignments',
              type: 'checkbox',
              defaultValue: true,
              label: 'Assignment notifications',
            },
            {
              name: 'courseUpdates',
              type: 'checkbox',
              defaultValue: true,
              label: 'Course update notifications',
            },
            {
              name: 'achievements',
              type: 'checkbox',
              defaultValue: true,
              label: 'Achievement notifications',
            },
          ],
          admin: {
            description: 'Email notifications for the user',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }: BeforeChangeHookData) => {
        if (!data.user && req.user?.id) {
          if (
            typeof req.user.id === 'string' ||
            typeof req.user.id === 'number'
          ) {
            data.user = req.user.id;
          }
        }
        return data;
      },
    ],
  },
};
