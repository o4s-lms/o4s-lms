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
} from '@tabler/icons-react'
import { type SidebarData } from '@/components/Layout/types'
import { getTranslate } from '@/tolgee/server'

export const sidebarData= async (): Promise<SidebarData> => {
  const t = await getTranslate()

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
          title: 'Tasks',
          url: '/tasks',
          icon: IconChecklist,
        },
        {
          title: t('courses'),
          url: '/dashboard/courses',
          icon: IconBooks,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: IconMessages,
        },
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: IconBug,
          items: [
            {
              title: 'Unauthorized',
              url: '/401',
              icon: IconLock,
            },
            {
              title: 'Forbidden',
              url: '/403',
              icon: IconUserOff,
            },
            {
              title: 'Not Found',
              url: '/404',
              icon: IconError404,
            },
            {
              title: 'Internal Server Error',
              url: '/500',
              icon: IconServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/503',
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
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
        {
          title: t('ask-ai'),
          url: '#',
          icon: IconMessageCircleQuestion,
        },
        {
          title: t('help'),
          url: '/dashboard/help-center',
          icon: IconHelp,
        },
      ],
    },
  ]

  return { navGroups }
}