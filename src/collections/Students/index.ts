import type { CollectionConfig } from 'payload';

import { authenticated } from '../../access/authenticated';

export const Students: CollectionConfig = {
  slug: 'students',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'email',
  },
  auth: {
    loginWithUsername: {
      allowEmailLogin: true, // default: false
      requireEmail: true, // default: false
    },
    verify: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
};
