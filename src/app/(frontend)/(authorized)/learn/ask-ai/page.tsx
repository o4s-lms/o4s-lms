import type { Metadata } from 'next';
//import ComingSoon from '@/components/ComingSoon';
import { LanguageSelector } from '@/components/LangSelector.';
import { Header } from '@/components/Layout/Header';
import { TopNav } from '@/components/Layout/TopNav';
import { ProfileDropdown } from '@/components/Layout/ProfileDropdown';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { cn } from '@/lib/utils';
import { AskAi } from '@/components/Learn/AskAi';
import { AppSideBarDataProvider } from '@/providers/AppSideBarData';
import { NotificationsDropdown } from '@/components/Layout/Notifications';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Ask IA | O4S LMS',
  description: 'Get started with your courses.',
};

export default function AskAIPage() {
  return (
    <AppSideBarDataProvider>
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
        <Header>
          <TopNav links={topNav} />
          <div className="ml-auto flex items-center space-x-4">
            {/**<Search />
                                   <ThemeSwitch />*/}
            <NotificationsDropdown />
            <LanguageSelector />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>

        <AskAi />
      </div>
    </AppSideBarDataProvider>
  );
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
];
