import type { CollectionConfig, Where, WhereField, ValidateOptions } from 'payload'
import type { User } from '@/payload-types'

type AccessArgs = {
  req: {
    user?: User | null
  }
}

export const Points: CollectionConfig = {
  slug: 'points',
  admin: {
    useAsTitle: 'id',
    group: 'Gamification',
    defaultColumns: ['student', 'type', 'amount', 'createdAt'],
    description: 'Point transactions for gamification',
  },
  fields: [
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Student who earned the points',
      },
      index: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Lesson Completion', value: 'lessonComplete' },
        { label: 'Quiz Score', value: 'quizScore' },
        { label: 'Assignment Submit', value: 'assignmentSubmit' },
        { label: 'Discussion Post', value: 'discussionPost' },
        { label: 'Achievement Unlock', value: 'achievementUnlock' },
      ],
      admin: {
        description: 'Type of activity that earned points',
      },
      index: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Number of points earned',
      },
    },
    {
      name: 'source',
      type: 'group',
      admin: {
        description: 'Source that generated these points',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Lesson', value: 'lessons' },
            { label: 'Achievement', value: 'achievements' },
          ],
          index: true,
        },
        {
          name: 'lesson',
          type: 'relationship',
          relationTo: 'lessons',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'lessons',
          },
          index: true,
        },
        {
          name: 'achievement',
          type: 'relationship',
          relationTo: 'achievements',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'achievements',
          },
          index: true,
        },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional context about the points earned',
      },
    },
  ],
  access: {
    read: ({ req: { user } }: AccessArgs): boolean | Where => {
      if (!user) return false
      if (user.roles.includes('admin') || user.roles.includes('teacher')) return true
      return {
        student: {
          equals: user.id,
        } as WhereField,
      }
    },
    create: () => false, // Only created by system
    update: () => false, // Points are immutable
    delete: ({ req: { user } }: AccessArgs) => user?.roles.includes('admin') ?? false,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'update') {
          throw new Error('Points cannot be modified after creation')
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          // Get the source document to find the course
          const sourceDoc = await req.payload.findByID({
            collection: doc.source.type,
            id: doc.source[doc.source.type]?.id,
          })

          if (!sourceDoc?.course) {
            console.warn('No course found for source document')
            return
          }

          // Find the progress record for this student and course
          const progress = await req.payload.find({
            collection: 'course-progress',
            where: {
              and: [
                {
                  student: {
                    equals: doc.student,
                  },
                },
                {
                  course: {
                    equals: sourceDoc.course,
                  },
                },
              ],
            },
          })

          if (progress.docs.length > 0) {
            await req.payload.update({
              collection: 'course-progress',
              id: progress.docs[0].id,
              data: {
                pointsEarned: (progress.docs[0].pointsEarned || 0) + doc.amount,
              },
            })
          } else {
            console.warn('No progress record found for student and course')
          }
        }
      },
    ],
  },
}