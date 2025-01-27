import type { GlobalConfig } from 'payload';

export const Config: GlobalConfig = {
  slug: 'config',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'invoice',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          defaultValue: 'O4S LMS',
          required: true,
        },
        {
          name: 'taxID',
          type: 'text',
          defaultValue: 'PT199999999',
          required: true,
        },
        {
          name: 'prefix',
          type: 'text',
          defaultValue: 'INV',
          required: true,
        },
        {
          name: 'num',
          type: 'number',
          defaultValue: 0,
          required: true,
        },
      ],
    },
  ],
};