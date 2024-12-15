import React from 'react';
import Sidebar from '@/components/SideBar';
import InfoBar from '@/components/InfoBar';

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="w-full">
        <InfoBar />
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
