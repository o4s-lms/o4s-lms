import SkipToMain from '@/components/SkipToMain';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NotificationsProvider } from '@/providers/NotificationsContext';
import React from 'react';
//import Sidebar from '@/components/SideBar';
//import InfoBar from '@/components/InfoBar';

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  return (
    <SidebarProvider>
      <NotificationsProvider>
        <SkipToMain />
        {props.children}
      </NotificationsProvider>
    </SidebarProvider>
  );
};

export default Layout;
