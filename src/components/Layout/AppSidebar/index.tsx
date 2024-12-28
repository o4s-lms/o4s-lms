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
import { useTolgee } from '@tolgee/react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [nav, setNav] = useState<SidebarData | null>(null);
  const tolgee = useTolgee(['language']);
  const currentLanguage = tolgee.getLanguage();

  useEffect(() => {
    async function getNav() {
      setNav(await sidebarData());
    }

    getNav();
  }, [currentLanguage]);

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
