import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
//import Sidebar from '@/components/SideBar';
//import InfoBar from '@/components/InfoBar';

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarProvider>{props.children}</SidebarProvider>
    </div>
  );
};

export default Layout;
