import type { GlobalConfig } from 'payload';

export const Config: GlobalConfig = {
  slug: 'config',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'invoice',
      type: 'number',
      defaultValue: 0,
      required: true,
    },
  ],
};