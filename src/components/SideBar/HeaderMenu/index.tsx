import Image from 'next/image';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { VERSION } from '@/lib/constants';

export const SidebarHeaderMenu = () => {
  return (
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
  );
};
