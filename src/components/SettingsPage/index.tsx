'use client';

import * as React from 'react';
import {
  Home,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  User2,
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

import ProfileForm from '@/components/Dashboard/Account/ProfileForm';
import { Favorite, User } from '@/payload-types';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { SidebarHeaderMenu } from '@/components/SideBar/HeaderMenu';

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Search',
      url: '#',
      icon: Search,
    },
    {
      title: 'Ask AI',
      url: '#',
      icon: Sparkles,
    },
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'Account',
      url: '#',
      icon: User2,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      isActive: true,
    },
    {
      title: 'Help',
      url: '#',
      icon: MessageCircleQuestion,
    },
  ],
};

type SettingsPageProps = {
  user: User;
  favorites: Favorite[];
} & React.ComponentProps<typeof Sidebar>;

export function SettingsPage({ user, favorites, ...props }: SettingsPageProps) {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  if (success) toast.info(success);

  return (
    <>
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>
          <SidebarHeaderMenu />
          <NavMain items={data.navMain} />
        </SidebarHeader>
        <SidebarContent>
          <NavFavorites favorites={favorites} />
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
                    Update your default settings
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <ProfileForm currentUser={user} />
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
