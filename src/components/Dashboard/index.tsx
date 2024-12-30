'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  CreditCard,
  Home,
  Library,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
} from 'lucide-react';

import { NavMain } from '@/components/NavMain';
import { NavFavorites } from '@/components/Layout/NavFavorites';
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
import { useTranslate } from '@tolgee/react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { SidebarHeaderMenu } from '../SideBar/HeaderMenu';

export function DashboardWithSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

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
      url: '/dashboard',
      icon: Home,
      isActive: true,
    },
    {
      title: t('courses'),
      url: '/dashboard/courses',
      icon: Library,
    },
    {
      title: 'Billing',
      url: '/dashboard/billing',
      icon: CreditCard,
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

  if (message) toast.success(message);

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
                    {t('dashboard')}
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
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
        </div>
      </SidebarInset>
    </>
  );
}
