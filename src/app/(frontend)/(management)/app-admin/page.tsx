import type { Metadata } from 'next';
import { LanguageSelector } from '@/components/LangSelector.';
import { Header } from '@/components/Layout/Header';
import { TopNav } from '@/components/Layout/TopNav';
import { ProfileDropdown } from '@/components/Layout/ProfileDropdown';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { AppAdminDashboard } from '@/components/AppAdmin';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'App Admin Dashboard | O4S LMS',
  description: 'Get started with your courses.',
};

export default async function AppAdminPage() {
  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          {/**<Search />
            <ThemeSwitch />*/}
          <LanguageSelector />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <AppAdminDashboard />
    </>
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
