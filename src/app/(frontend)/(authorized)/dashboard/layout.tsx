import { AppSidebar } from '@/components/Layout/AppSidebar';
import SkipToMain from '@/components/SkipToMain';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { AppSideBarDataProvider } from '@/providers/AppSideBarData';
import React from 'react';
//import Sidebar from '@/components/SideBar';
//import InfoBar from '@/components/InfoBar';

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  return (
    <AppSideBarDataProvider>
      <SidebarProvider>
        <SkipToMain />
        <AppSidebar />
        <div
          id="content"
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh',
          )}
        >
          {props.children}
        </div>
      </SidebarProvider>
    </AppSideBarDataProvider>
  );
};

export default Layout;
