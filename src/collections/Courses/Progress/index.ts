import type { CollectionConfig } from 'payload';

import { authenticated } from '@/access/authenticated';
import { admin } from '@/access/admin';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

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
    group: 'Courses',
    defaultColumns: ['student', 'course', 'overallProgress'],
    useAsTitle: 'student',
  },
  fields: [
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The student whose progress is being tracked',
      },
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      admin: {
        description: 'The course being tracked',
      },
    },
    {
      name: 'completedLessons',
      type: 'relationship',
      relationTo: 'lesson-progress',
      hasMany: true,
      admin: {
        description: 'Lessons that have been completed',
      },
    },
    {
      name: 'quizAttempts',
      type: 'array',
      admin: {
        description: 'Quiz attempts and scores',
      },
      fields: [
        {
          name: 'lesson',
          type: 'relationship',
          relationTo: 'lessons',
          required: true,
        },
        {
          name: 'score',
          type: 'number',
          required: true,
          min: 0,
          max: 100,
        },
        {
          name: 'answers',
          type: 'json',
          required: true,
        },
        {
          name: 'completedAt',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      name: 'assignments',
      type: 'array',
      admin: {
        description: 'Assignment submissions and grades',
      },
      fields: [
        {
          name: 'lesson',
          type: 'relationship',
          relationTo: ['lessons'],
          required: true,
        },
        {
          name: 'submission',
          type: 'json',
          required: true,
        },
        {
          name: 'grade',
          type: 'number',
          min: 0,
          max: 100,
        },
        {
          name: 'feedback',
          type: 'richText',
          editor: lexicalEditor(),
        },
        {
          name: 'submittedAt',
          type: 'date',
          required: true,
        },
        {
          name: 'gradedAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'discussions',
      type: 'array',
      admin: {
        description: 'Discussion participation',
      },
      fields: [
        {
          name: 'lesson',
          type: 'relationship',
          relationTo: ['lessons'],
          required: true,
        },
        {
          name: 'post',
          type: 'richText',
          editor: lexicalEditor(),
          required: true,
        },
        {
          name: 'replies',
          type: 'array',
          fields: [
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users',
              required: true,
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor(),
              required: true,
            },
            {
              name: 'postedAt',
              type: 'date',
              required: true,
            },
          ],
        },
        {
          name: 'postedAt',
          type: 'date',
          required: true,
        },
      ],
    },
    {
      name: 'overallProgress',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      defaultValue: 0,
      admin: {
        description: 'Overall course completion percentage',
      },
    },
    {
      name: 'pointsEarned',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Total points earned in this course',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'not_started',
      options: [
        { label: 'Not Started', value: 'notStarted' },
        { label: 'In Progress', value: 'inProgress' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'startedAt',
      type: 'date',
      admin: {
        description: 'When the student started the course',
      },
    },
    {
      name: 'lastAccessed',
      type: 'date',
      admin: {
        description: 'Last time the student accessed the course',
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        description: 'When the student completed the course',
      },
    },
  ],
  timestamps: true,
};
