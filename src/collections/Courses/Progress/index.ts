import type { CollectionConfig } from 'payload';

import { authenticated } from '@/access/authenticated';

export const CourseProgress: CollectionConfig = {
  slug: 'courseProgress',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      label: 'Student',
      relationTo: ['users'],
      required: true,
    },
    {
      name: 'course',
      type: 'relationship',
      label: 'Course',
      relationTo: ['courses'],
      required: true,
    },
    {
        name: 'sections',
        type: 'relationship',
        label: 'Sections Progress',
        hasMany: true,
        relationTo: ['sectionProgress'],
        required: true,
      },
    {
        name: 'enrollmentDate',
        type: 'date',
        label: 'Enrollment Date',
    },
    {
        name: 'overallProgress',
        type: 'number',
        label: 'Overall Progress',
        required: true,
        defaultValue: 0,
    },
    {
        name: 'lastAccessed',
        type: 'date',
        label: 'Last Accessed Date',
    },
  ],
  timestamps: true,
};
