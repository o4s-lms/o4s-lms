'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Home,
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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

import ProfileForm from '@/components/ProfileForm';
import { Favorite, User } from '@/payload-types';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

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
      isActive: true,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'Help',
      url: '#',
      icon: MessageCircleQuestion,
    },
  ],
};

type AccountSidebarProps = {
  user: User;
  favorites: Favorite[];
} & React.ComponentProps<typeof Sidebar>;

export function AccountSidebar({ user, favorites, ...props }: AccountSidebarProps) {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  if (success) toast.info(success);

  return (
    <>
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                    <Image
                      src="/iconO4S-100x100.png"
                      width={24}
                      height={24}
                      alt="Open For Sustainability"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">O4S LMS</span>
                    <span className="">v1.0.0</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
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
                    Add or update your information
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
