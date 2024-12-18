import type { CollectionConfig } from 'payload';

import { authenticated } from '@/access/authenticated';
import { admin } from '@/access/admin';

export const SectionProgress: CollectionConfig = {
  slug: 'section-progress',
  access: {
    admin: admin,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'section',
      type: 'relationship',
      relationTo: ['sections'],
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