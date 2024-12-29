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
} from '@tabler/icons-react';
import { type SidebarData } from '@/components/Layout/types';
import { getTranslate } from '@/tolgee/server';

export const sidebarData = async (): Promise<SidebarData> => {
  const t = await getTranslate();

  const navGroups = [
    {
      title: 'General',
      items: [
        {
          title: t('dashboard'),
          url: '/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: t('settings'),
          icon: IconSettings,
          items: [
            {
              title: t('account'),
              url: '/dashboard/settings/account',
              icon: IconTool,
            },
            {
              title: t('appearance'),
              url: '/dashboard/settings/appearance',
              icon: IconPalette,
            },
            {
              title: t('notifications'),
              url: '/dashboard/settings/notifications',
              icon: IconNotification,
            },
          ],
        },
      ],
    },
    {
      title: 'Learning',
      items: [
        {
          title: t('courses'),
          url: '/dashboard/courses',
          icon: IconBooks,
        },
        {
          title: t('ask-ai'),
          url: '/dashboard/ask-ai',
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
