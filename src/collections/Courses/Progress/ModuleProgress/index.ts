import type { CollectionConfig } from 'payload';

import { authenticated } from '@/access/authenticated';
import { admin } from '@/access/admin';

export const ModuleProgress: CollectionConfig = {
  slug: 'module-progress',
  access: {
    admin: admin,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Courses',
  },
  fields: [
    {
      name: 'module',
      type: 'relationship',
      relationTo: ['modules'],
      required: true,
    },
    {
      name: 'lessonProgress',
      type: 'relationship',
      label: 'Lessons Progress',
      hasMany: true,
      relationTo: ['lesson-progress'],
    },
  ],
  timestamps: true,
};
