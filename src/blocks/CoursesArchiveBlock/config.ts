import type { Block } from 'payload';

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';

export const CoursesArchive: Block = {
  slug: 'coursesArchive',
  interfaceName: 'CoursesArchiveBlock',
  fields: [
    {
      name: 'introContent',
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
      label: 'Intro Content',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      hasMany: true,
      label: 'Selection',
      relationTo: ['courses'],
    },
  ],
  labels: {
    plural: 'Course Archives',
    singular: 'Course Archive',
  },
};
