import type { CollectionConfig } from 'payload';

import { admin } from '@/access/admin';
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished';

export const Lessons: CollectionConfig<'lessons'> = {
  slug: 'lessons',
  access: {
    admin: admin,
    create: admin,
    delete: admin,
    read: authenticatedOrPublished,
    update: admin,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    course: true,
    module: true,
  },
  admin: {
    group: 'Courses',
    defaultColumns: ['title', 'course', 'module', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'activity',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
      defaultValue: false,
      required: true,
      label: 'Is Activity',
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
    },
    {
      name: 'module',
      type: 'relationship',
      relationTo: 'modules',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
  ],
};
