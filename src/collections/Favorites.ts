import type { CollectionConfig } from 'payload';

import { authenticated } from '../access/authenticated';
import { admin } from '@/access/admin';

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
      name: 'userId',
      type: 'number',
      required: true,
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
      type: 'number',
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
};