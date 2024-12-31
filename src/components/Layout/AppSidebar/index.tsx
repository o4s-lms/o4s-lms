'use client';

import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavGroup } from '@/components/Layout/NavGroup';
import { NavUser } from '@/components/Layout/NavUser';
import { sidebarData } from '@/components/Layout/Data/AppSidebar';
import { VERSION } from '@/lib/constants';
import { useEffect, useState } from 'react';
import type { SidebarData } from '@/components/Layout/types';
import { useTolgee, useTranslate } from '@tolgee/react';
import { Favorite, Module } from '@/payload-types';
import { IconDualScreen, IconFileDescription, IconStar } from '@tabler/icons-react';

type AppSidebarProps = {
  title?: string;
  modules?: Module[];
  favorites?: Favorite[];
} & React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ title, modules, favorites, ...props }: AppSidebarProps) {
  const [nav, setNav] = useState<SidebarData | null>(null);
  const tolgee = useTolgee(['language']);
  const currentLanguage = tolgee.getLanguage();
  const { t } = useTranslate();

  useEffect(() => {
    async function getNav() {
      const groups = await sidebarData();
      if (favorites && favorites.length > 0) {
        const favs = favorites?.map((favorite) => ({
          title: favorite?.title,
          url: favorite.url,
          icon: IconStar,
          isFavorite: true,
        }))

        const favoritesNav = {
          title: t('favorites'),
          items: favs,
        }
        groups.navGroups.push(favoritesNav);
      }
      
      if (title) {
        const tmp = modules?.map((module) => ({
          title: module.title,
          icon: IconDualScreen,
          items: module.lessons
            .map(({ value }) => value)
            .filter((lesson) => typeof lesson === 'object')
            .map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              url: '#',
              icon: IconFileDescription,
            })),
        }));
        const courseNav = {
          title: title,
          items: tmp,
        };

        groups.navGroups.unshift(courseNav);
      }

      setNav(groups);
    }

    void getNav();
  }, [currentLanguage, title, modules, t, favorites]);

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
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
                  <span className="">{VERSION}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {nav && (
        <SidebarContent>
          {nav.navGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </SidebarContent>
      )}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
