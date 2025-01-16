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
import { VERSION } from '@/lib/constants';
import { useTranslate } from '@tolgee/react';
import { Support } from '@/components/Support';
import { MessageCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppSideBarData } from '@/providers/AppSideBarData';
//import { useFavorites } from '@/providers/FavoritesContext';
//import { favorites } from '@/payload-generated-schema';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { nav } = useAppSideBarData();
  const { t } = useTranslate();

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
        <Support
          className={cn(
            buttonVariants({
              variant: 'secondary',
            }),
            'text-fd-secondary-foreground/80 bottom-4 right-4 z-10 gap-2 rounded-xl bg-secondary/50 shadow-lg backdrop-blur-lg md:bottom-8 md:right-8',
          )}
        >
          <MessageCircle className="size-4" />
          <span className="max-w-52 text-wrap">{t('support')}</span>
        </Support>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};