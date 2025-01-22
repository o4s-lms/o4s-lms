import { CollectionConfig } from 'payload';
import { isAdmin } from '@/access/roles';
import { AccessArgs } from 'payload';
import { ANNOUNCEMENT_TYPES } from '@/lib/constants';

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'subject',
    group: 'Communications',
    description: 'System notifications and alerts',
  },
  access: {
    read: ({ req: { user } }: AccessArgs) => {
      if (!user) return false;
      if (user?.role === 'admin') return true;
      return {
        recipient: {
          equals: user?.id,
        },
      };
    },
    create: ({ req: { user } }: AccessArgs) => {
      if (!user) return false;
      if (user.role === 'admin' || user.role === 'teacher') return true;
      return false;
    },
    update: ({ req: { user } }: AccessArgs) => {
      if (!user) return false;
      if (user?.role === 'admin') return true;
      return {
        recipient: {
          equals: user?.id,
        },
      };
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'announcement',
      type: 'relationship',
      relationTo: 'announcements',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ANNOUNCEMENT_TYPES,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'readAt',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'update' && data.read && !data.readAt) {
          data.readAt = new Date();
        }

        return data;
      },
    ],
  },
};
