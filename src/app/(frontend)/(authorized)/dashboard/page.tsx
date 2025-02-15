import type { Metadata } from 'next';
import React from 'react';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { TopNav } from '@/components/Layout/TopNav';
import { LanguageSelector } from '@/components/LangSelector.';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { ProfileDropdown } from '@/components/Layout/ProfileDropdown';
import ComingSoon from '@/components/ComingSoon';
import { currentUser } from '@/lib/session';
import { NotificationsDropdown } from '@/components/Layout/Notifications';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Dashboard | O4S LMS',
  description: 'Get started with your courses.',
};

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
    disabled: false,
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

const DashboardPage = async () => {
  const user = await currentUser();

  if (!user) {
    // unauthorized()
    redirect(
      `/sign-in?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard`,
    );
  }

  return (
    <>
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
      <ComingSoon />
    </>
  );
};

export default DashboardPage;
