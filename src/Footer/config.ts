import type { GlobalConfig } from 'payload';

import { link } from '@/fields/link';
import { revalidateFooter } from './hooks/revalidateFooter';
import { languageSelectOptions } from '@/utilities/languages';

export const Footer: GlobalConfig = {
  slug: 'footer',
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
    {
      name: 'language',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      options: languageSelectOptions,
      defaultValue: 'pt',
      required: true,
      label: 'Language',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
};
