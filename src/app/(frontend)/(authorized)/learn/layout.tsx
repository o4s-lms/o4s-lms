import SkipToMain from '@/components/SkipToMain';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
//import Sidebar from '@/components/SideBar';
//import InfoBar from '@/components/InfoBar';

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  return (
    <SidebarProvider>
      <SkipToMain />
      {props.children}
    </SidebarProvider>
  );
};

export default Layout;
