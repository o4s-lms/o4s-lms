import { fetcher } from '@/lib/fetcher';
import type { CollectionConfig, AccessArgs } from 'payload';

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    useAsTitle: 'id',
    group: 'Learning',
    defaultColumns: ['student', 'course', 'status', 'enrolledAt'],
    description: 'Student course enrollments',
  },
  access: {
    read: ({ req: { user } }: AccessArgs) => {
      if (!user) return false;
      if (user.role === 'admin' || user.role === 'teacher') return true;
      return {
        and: [
          {
            student: {
              equals: user.id,
            },
          },
        ],
      };
    },
    create: ({ req: { user } }: AccessArgs) => {
      if (!user || !user.role) return false;
      // Allow admins and instructors to enroll students
      if (user.role === 'admin' || user.role === 'teacher') return true;
      // Allow students to self-enroll if the course allows it
      if (user.role === 'student') {
        return {
          and: [
            {
              'course.settings.allowSelfEnrollment': {
                equals: true,
              },
            },
          ],
        };
      }
      return false;
    },
    update: ({ req: { user } }: AccessArgs) => {
      if (!user || !user.role) return false;
      if (user.role === 'admin' || user.role === 'teacher') return true;
      // Students can only update their own enrollment status
      return {
        and: [
          {
            student: {
              equals: user.id,
            },
          },
        ],
      };
    },
    delete: ({ req: { user } }: AccessArgs) => {
      if (!user || !user.role) return false;
      return user.role === 'admin';
    },
  },
  fields: [
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'The enrolled student',
      },
      index: true,
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      admin: {
        description: 'The course being enrolled in',
      },
      index: true,
    },
    {
      name: 'progress',
      type: 'relationship',
      relationTo: 'course-progress',
      admin: {
        description: 'The student progress of the course being enrolled in',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Dropped', value: 'dropped' },
        { label: 'Pending', value: 'pending' },
      ],
      defaultValue: 'active',
    },
    {
      name: 'enrolledAt',
      type: 'date',
      required: true,
      admin: {
        description: 'When the enrollment was created',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
      admin: {
        description: 'When the student started the course',
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        description: 'When the student completed the course',
      },
    },
    {
      name: 'droppedAt',
      type: 'date',
      admin: {
        description: 'When the student dropped the course',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'When the enrollment expires',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Set enrolledAt on creation
        if (operation === 'create') {
          data.enrolledAt = new Date().toISOString();
        }

        // Handle status changes
        if (operation === 'update' && data.status) {
          const now = new Date().toISOString();
          switch (data.status) {
            case 'active':
              if (!data.startedAt) data.startedAt = now;
              break;
            case 'completed':
              data.completedAt = now;
              break;
            case 'dropped':
              data.droppedAt = now;
              break;
          }
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Create initial progress record on enrollment
        if (operation === 'create') {
          await fetcher(
            `/api/function/updateUserRole?userId=${doc.student}&role=student`, {
            method: 'POST',
          }
          );
          const progress = await req.payload.create({
            collection: 'course-progress',
            data: {
              student: doc.student,
              course: doc.course,
              //startedAt: new Date().toISOString(),
              //lastAccessed: new Date().toISOString(),
              status: 'notStarted',
              overallProgress: 0,
              pointsEarned: 0,
            },
          });
          await req.payload.update({
            collection: 'enrollments',
            where: {
              id: {
                equals: doc.id,
              },
            },
            data: {
              progress: progress,
            },
          });
        }
      },
    ],
  },
};
