import type { CollectionConfig } from 'payload';

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  admin: {
    useAsTitle: 'name',
    group: 'Gamification',
    defaultColumns: ['name', 'type', 'badge', 'points'],
    description: 'Achievement definitions and criteria',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the achievement',
      },
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Detailed description of how to earn this achievement',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Course Progress', value: 'courseProgress' },
        { label: 'Quiz Score', value: 'quizScore' },
        { label: 'Assignment', value: 'assignment' },
        { label: 'Discussion', value: 'discussion' },
        { label: 'Custom', value: 'custom' },
      ],
      admin: {
        description: 'Type of activity tracked',
      },
    },
    {
      name: 'criteria',
      type: 'group',
      fields: [
        {
          name: 'metric',
          type: 'select',
          required: true,
          options: [
            { label: 'Count', value: 'count' },
            { label: 'Score', value: 'score' },
            { label: 'Duration', value: 'duration' },
            { label: 'Custom', value: 'custom' },
          ],
          admin: {
            description: 'What to measure',
          },
        },
        {
          name: 'threshold',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Target value to achieve',
          },
        },
        {
          name: 'timeframe',
          type: 'select',
          options: [
            { label: 'All Time', value: 'allTime' },
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ],
          defaultValue: 'allTime',
          admin: {
            description: 'Time period to measure over',
          },
        },
        {
          name: 'customRule',
          type: 'code',
          admin: {
            language: 'typescript',
            description: 'Custom achievement criteria logic',
            condition: (data, siblingData) => siblingData?.metric === 'custom',
          },
        },
      ],
    },
    {
      name: 'badge',
      type: 'relationship',
      relationTo: 'badges' as const,
      required: true,
      admin: {
        description: 'Badge awarded for this achievement',
      },
      /**filterOptions: ({ user }: FilterOptionsProps<any>): Where => {
        if (user?.roles?.includes('admin')) return {} as Where
      },*/
    },
    {
      name: 'points',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Points awarded for this achievement',
      },
    },
    {
      name: 'secret',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Hide this achievement until unlocked',
      },
    },
  ],
};
