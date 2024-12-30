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
  admin: {
    group: 'Courses',
  },
  fields: [
    {
      name: 'student',
      type: 'relationship',
      label: 'Student',
      relationTo: 'users',
      admin: {
        description: 'The student whose progress is being tracked',
      },
      required: true,
      index: true,
    },
    {
      name: 'lesson',
      type: 'relationship',
      label: 'Lesson',
      relationTo: 'lessons',
      admin: {
        description: 'The lesson being tracked',
      },
      required: true,
    },
    {
      name: 'course',
      type: 'relationship',
      label: 'Course',
      relationTo: 'courses',
      admin: {
        description: 'The lesson course',
      },
    },
    {
      name: 'lastAccessed',
      type: 'date',
      label: 'Last Accessed Date',
      admin: {
        description: 'When the student accessed the lesson',
      },
      required: true,
    },
    {
      name: 'completed',
      type: 'checkbox',
      label: 'Completed',
      defaultValue: false,
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        description: 'When the student completed the lesson',
      },
    },
  ],
};
