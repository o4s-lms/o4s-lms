import type { CollectionConfig } from 'payload';

import { anyone } from '@/access/anyone';
import { admin } from '@/access/admin';

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import { slugField } from '@/fields/slug';

export const Sections: CollectionConfig = {
  slug: 'sections',
  access: {
    create: admin,
    delete: admin,
    read: anyone,
    update: admin,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
      label: false,
    },
    ...slugField(),
    {
      name: 'lessons',
      type: 'relationship',
      hasMany: true,
      admin: {
        isSortable: true,
      },
      label: 'Lessons',
      relationTo: ['lessons'],
      required: true,
    },
  ],
  labels: {
    plural: 'Course Sections',
    singular: 'Course Section',
  },
};
