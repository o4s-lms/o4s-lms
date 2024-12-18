import type { CollectionConfig } from 'payload';

import { authenticated } from '@/access/authenticated';
import { admin } from '@/access/admin';

export const LessonProgress: CollectionConfig = {
  slug: 'lesson-progress',
  access: {
    admin: admin,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'lesson',
      type: 'relationship',
      label: 'Lesson',
      relationTo: ['lessons'],
    },
    {
      name: 'completed',
      type: 'checkbox',
      label: 'Completed',
      defaultValue: false,
    },
  ],
  timestamps: true,
};
