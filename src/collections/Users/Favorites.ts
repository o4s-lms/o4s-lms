import type { CollectionConfig } from 'payload';

import { authenticated } from '@/access/authenticated';
import { admin } from '@/access/admin';
import { AccessArgs, BeforeChangeHookData } from '@/collections/types';

export const Favorites: CollectionConfig = {
  slug: 'favorites',
  access: {
    admin: admin,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The user this favorite belong to',
      },
      index: true,
    },
    {
      name: 'objectType',
      type: 'select',
      options: [
        { label: 'Lesson', value: 'lessons' },
        { label: 'Course', value: 'courses' },
        { label: 'Post', value: 'posts' },
        { label: 'Page', value: 'pages' },
      ],
      required: true,
      defaultValue: 'lessons',
    },
    {
      name: 'objectId',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
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
