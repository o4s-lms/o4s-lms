import type { AccessArgs, CollectionConfig } from 'payload';

import path from 'path';
import { fileURLToPath } from 'url';

import { anyone } from '@/access/anyone';
import { admin } from '@/access/admin';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Invoice: CollectionConfig = {
  slug: 'invoice',
  access: {
    admin: admin,
    create: anyone,
    delete: admin,
    read: ({ req: { user } }: AccessArgs) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        and: [
          {
            user: {
              equals: user.id,
            },
          },
        ],
      };
    },
    update: admin,
  },
  admin: {
    group: 'Orders',
  },
  fields: [
    {
      name: 'invoice',
      type: 'number',
    },
  ],
  upload: {
    mimeTypes: ['application/pdf'],
    staticDir: path.resolve(dirname, '../../public/invoice'),
    adminThumbnail: () => `/file.svg`,
  },
};