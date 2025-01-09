import SkipToMain from '@/components/SkipToMain';
import { Support } from '@/components/Support';
import { buttonVariants } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';
import React from 'react';
//import Sidebar from '@/components/SideBar';
//import InfoBar from '@/components/InfoBar';

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  return (
    <SidebarProvider>
      <SkipToMain />
      {props.children}
      <Support
        className={cn(
          buttonVariants({
            variant: 'secondary',
          }),
          'text-fd-secondary-foreground/80 fixed bottom-4 right-4 z-10 gap-2 rounded-xl bg-secondary/50 shadow-lg backdrop-blur-lg md:bottom-8 md:right-8',
        )}
      >
        <MessageCircle className="size-4" />
        Support
      </Support>
    </SidebarProvider>
  );
};

export default Layout;
