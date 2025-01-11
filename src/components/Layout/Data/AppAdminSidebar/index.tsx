import {
  IconBarrierBlock,
  IconBooks,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconMessageCircleQuestion,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
  IconCreditCard,
} from '@tabler/icons-react';
import type { SidebarData } from '@/components/Layout/types';
import { getTranslate } from '@/tolgee/server';

export const sidebarData = async (): Promise<SidebarData> => {
  const t = await getTranslate();

  const navGroups = [
    {
      title: 'General',
      items: [
        {
          title: t('dashboard'),
          url: '/app-admin',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Users',
          url: '/app-admin/users',
          icon: IconUsers,
        },
        {
          title: 'Support tickets',
          url: '/app-admin/support',
          icon: IconMessageCircleQuestion,
        },
        {
          title: t('billing'),
          url: '/app-admin/billing',
          icon: IconCreditCard,
        },
      ],
    },
    {
      title: 'Learning',
      items: [
        {
          title: t('courses'),
          url: '/app-admin/courses',
          icon: IconBooks,
        },
        {
          title: t('ask-ai'),
          url: '/learn/ask-ai',
          icon: IconMessageCircleQuestion,
        },
      ],
    },
    {
      title: t('help'),
      items: [
        {
          title: t('help'),
          url: '/dashboard/help-center',
          icon: IconHelp,
        },
      ],
    },
  ];

  return { navGroups };
};
