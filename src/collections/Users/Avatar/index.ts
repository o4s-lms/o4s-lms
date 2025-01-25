import type { CollectionConfig } from 'payload';

import path from 'path';
import { fileURLToPath } from 'url';

import { anyone } from '@/access/anyone';
import { authenticated } from '@/access/authenticated';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Avatar: CollectionConfig = {
  slug: 'avatar',
  access: {
    create: anyone,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'System',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/avatar'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
      },
    ],
  },
};
