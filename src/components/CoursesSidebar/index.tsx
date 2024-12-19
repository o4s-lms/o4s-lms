'use client';

import * as React from 'react';
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  GalleryVerticalEnd,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from 'lucide-react';

import { NavFavorites } from '@/components/NavFavorites';
import { NavMain } from '@/components/NavMain';
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
import { NavActions } from '../NavActions';

// This is sample data.
const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: Command,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
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
      title: 'Home',
      url: '#',
      icon: Home,
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
  favorites: [
    {
      name: 'Project Management & Task Tracking',
      url: '#',
      emoji: '📊',
    },
    {
      name: 'Family Recipe Collection & Meal Planning',
      url: '#',
      emoji: '🍳',
    },
    {
      name: 'Fitness Tracker & Workout Routines',
      url: '#',
      emoji: '💪',
    },
    {
      name: 'Book Notes & Reading List',
      url: '#',
      emoji: '📚',
    },
    {
      name: 'Sustainable Gardening Tips & Plant Care',
      url: '#',
      emoji: '🌱',
    },
    {
      name: 'Language Learning Progress & Resources',
      url: '#',
      emoji: '🗣️',
    },
    {
      name: 'Home Renovation Ideas & Budget Tracker',
      url: '#',
      emoji: '🏠',
    },
    {
      name: 'Personal Finance & Investment Portfolio',
      url: '#',
      emoji: '💰',
    },
    {
      name: 'Movie & TV Show Watchlist with Reviews',
      url: '#',
      emoji: '🎬',
    },
    {
      name: 'Daily Habit Tracker & Goal Setting',
      url: '#',
      emoji: '✅',
    },
  ],
  
};

export function CoursesSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <>
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
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
          <NavFavorites favorites={data.favorites} />
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
                    Courses
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

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
        </div>
      </SidebarInset>
    </>
  );
}
