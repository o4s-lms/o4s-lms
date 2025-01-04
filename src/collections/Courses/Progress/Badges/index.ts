import type { CollectionConfig, Where, WhereField } from 'payload';
import type { User } from '@/payload-types';

type AccessArgs = {
  req: {
    user?: User | null;
  };
};

export const Badges: CollectionConfig = {
  slug: 'badges',
  admin: {
    useAsTitle: 'name',
    group: 'Gamification',
    defaultColumns: ['name', 'rarity', 'category'],
    description: 'Achievement badges for gamification',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the badge',
      },
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Detailed description of how to earn this badge',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Badge icon image',
      },
    },
    {
      name: 'rarity',
      type: 'select',
      required: true,
      options: [
        { label: 'Common', value: 'common' },
        { label: 'Uncommon', value: 'uncommon' },
        { label: 'Rare', value: 'rare' },
        { label: 'Epic', value: 'epic' },
        { label: 'Legendary', value: 'legendary' },
      ],
      admin: {
        description: 'Badge rarity level',
      },
      index: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Progress', value: 'progress' },
        { label: 'Performance', value: 'performance' },
        { label: 'Engagement', value: 'engagement' },
        { label: 'Special', value: 'special' },
      ],
      admin: {
        description: 'Badge category',
      },
      index: true,
    },
  ],
  access: {
    read: ({ req: { user } }: AccessArgs): boolean | Where => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return false;
    },
    create: ({ req: { user } }: AccessArgs) =>
      user?.role === 'admin',
    update: ({ req: { user } }: AccessArgs) =>
      user?.role === 'admin',
    delete: ({ req: { user } }: AccessArgs) =>
      user?.role === 'admin',
  },
};
