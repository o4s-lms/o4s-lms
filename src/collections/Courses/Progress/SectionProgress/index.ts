import type { CollectionConfig } from 'payload';

import { authenticated } from '@/access/authenticated';

export const SectionProgress: CollectionConfig = {
  slug: 'sectionProgress',
  access: {
    admin: authenticated,
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
    },
    {
      name: 'lessonProgress',
      type: 'relationship',
      label: 'Lessons Progress',
      hasMany: true,
      relationTo: ['lessonProgress'],
    },
  ],
  timestamps: true,
};