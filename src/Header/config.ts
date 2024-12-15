import type { GlobalConfig } from 'payload';

import { link } from '@/fields/link';
import { revalidateHeader } from './hooks/revalidateHeader';
import { languageSelectOptions } from '@/utilities/languages';

export const Header: GlobalConfig = {
  slug: 'header',
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
          RowLabel: '@/Header/RowLabel#RowLabel',
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
    afterChange: [revalidateHeader],
  },
};
