import type { GlobalConfig } from 'payload';

import { link } from '@/fields/link';
import { revalidateFooter } from './hooks/revalidateFooter';

export const FooterEs: GlobalConfig = {
  slug: 'footer_es',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
};