import type { CollectionConfig } from 'payload';

import { authenticated } from '@/access/authenticated';
import { admin } from '@/access/admin';

export const CourseProgress: CollectionConfig = {
  slug: 'course-progress',
  access: {
    admin: admin,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['student', 'course', 'overallProgress'],
    useAsTitle: 'student',
  },
  fields: [
    {
      name: 'student',
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
      relationTo: ['section-progress'],
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
    {
      name: 'lastAccessedLesson',
      type: 'relationship',
      relationTo: ['lessons'],
      label: 'Last Accessed Lesson',
    },
  ],
  timestamps: true,
};
