import { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrTeacher, isTeacher } from '@/access/roles'
import { AccessArgs } from 'payload'

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  admin: {
    useAsTitle: 'title',
    group: 'Communications',
    description: 'System-wide announcements',
  },
  access: {
    read: ({ req: { user } }: AccessArgs) => {
      if (isAdminOrTeacher(user)) return true
      return {
        status: {
          equals: 'published'
        }
      }
    },
    create: isAdminOrTeacher,
    update: isAdminOrTeacher,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
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
        { label: 'General', value: 'general' },
        { label: 'Course', value: 'course' },
        { label: 'System', value: 'system' },
        { label: 'Maintenance', value: 'maintenance' },
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
      name: 'audience',
      type: 'group',
      fields: [
        {
          name: 'roles',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'All Users', value: 'all' },
            { label: 'Students', value: 'student' },
            { label: 'Teacher', value: 'teacher' },
            { label: 'User', value: 'user' },
            { label: 'Admins', value: 'admin' },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'schedule',
      type: 'group',
      fields: [
        {
          name: 'publishAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'expireAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.status === 'published' && !data.schedule.publishAt) {
          data.schedule.publishAt = new Date()
        }
        return data
      },
    ],
  },
}