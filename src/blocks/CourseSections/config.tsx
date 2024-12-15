import type { Block } from 'payload';

export const CourseSection: Block = {
  slug: 'section',
  interfaceName: 'CourseSectionBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
  ],
  labels: {
    plural: 'Course Sections',
    singular: 'Course Section',
  },
};
