import type { CollectionConfig } from 'payload';

import { authenticated } from '@/access/authenticated';

export const LessonProgress: CollectionConfig = {
  slug: 'lessonProgress',
  access: {
    admin: authenticated,
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
