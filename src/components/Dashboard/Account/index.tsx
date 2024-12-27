'use client';

import * as React from 'react';
import {
  Home,
  Library,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  User2,
} from 'lucide-react';

import { NavMain } from '@/components/NavMain';
import { NavFavorites } from '@/components/NavFavorites';
import { NavActions } from '@/components/NavActions';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

import ProfileForm from '@/components/Dashboard/Account/ProfileForm';
import type { User } from '@/payload-types';
import { toast } from 'sonner';
import { SidebarHeaderMenu } from '@/components/SideBar/HeaderMenu';
import { useTranslate } from '@tolgee/react';
import { useQueryState } from 'nuqs';
import PasswordForm from './Password';

type AccountSidebarProps = {
  user: User;
} & React.ComponentProps<typeof Sidebar>;

export function AccountWithSidebar({ user, ...props }: AccountSidebarProps) {
  const [success, setSuccess] = useQueryState('success');
  const { t } = useTranslate();

  const nav = [
    {
      title: t('search'),
      url: '#',
      icon: Search,
    },
    {
      title: t('ask-ai'),
      url: '#',
      icon: Sparkles,
    },
    {
      title: t('dashboard'),
      url: '#',
      icon: Home,
    },
    {
      title: t('courses'),
      url: '/dashboard/courses',
      icon: Library,
    },
    {
      title: t('account'),
      url: '/dashboard/account',
      icon: User2,
      isActive: true,
    },
    {
      title: t('settings'),
      url: '/dashboard/settings',
      icon: Settings2,
    },
    {
      title: t('help'),
      url: '#',
      icon: MessageCircleQuestion,
    },
  ];

  if (success) {
    toast.success(success);
    setSuccess(null);
  }

  return (
    <>
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>
          <SidebarHeaderMenu />
          <NavMain items={nav} />
        </SidebarHeader>
        <SidebarContent>
          <NavFavorites />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 font-semibold">
                    Add or update your information
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions lesson={null} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50"></div>
            <div className="aspect-video rounded-xl bg-muted/50 p-2">
              <ProfileForm currentUser={user} />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 p-2">
              <PasswordForm currentUser={user} />
            </div>
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
        </div>
      </SidebarInset>
    </>
  );
}
