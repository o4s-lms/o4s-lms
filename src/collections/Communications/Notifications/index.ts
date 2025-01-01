import { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrTeacher } from '@/access/roles'
import { AccessArgs } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'subject',
    group: 'Communications',
    description: 'System notifications and alerts',
  },
  access: {
    read: ({ req: { user } }: AccessArgs) => {
      if (isAdmin(user)) return true
      return {
        recipient: {
          equals: user?.id
        }
      }
    },
    create: ({ req: { user } }: AccessArgs) => isAdminOrTeacher(user),
    update: ({ req: { user } }: AccessArgs) => {
      if (isAdmin(user)) return true
      return {
        recipient: {
          equals: user?.id
        }
      }
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Course Update', value: 'course_update' },
        { label: 'Assignment', value: 'assignment' },
        { label: 'Achievement', value: 'achievement' },
        { label: 'Announcement', value: 'announcement' },
        { label: 'System', value: 'system' },
        { label: 'Quiz', value: 'quiz' },
        { label: 'Discussion', value: 'discussion' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'reference',
      type: 'group',
      fields: [
        {
          name: 'collection',
          type: 'text',
        },
        {
          name: 'id',
          type: 'text',
        },
      ],
    },
  ],
}