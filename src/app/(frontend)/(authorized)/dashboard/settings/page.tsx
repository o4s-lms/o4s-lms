import type { Metadata } from 'next';
import { headers as getHeaders } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { SettingsContent } from '@/components/Dashboard/Settings';
import { Header } from '@/components/Layout/Header';
import { TopNav } from '@/components/Layout/TopNav';
import { LanguageSelector } from '@/components/LangSelector.';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { ProfileDropdown } from '@/components/ProfileDropdown';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Settings | O4S LMS',
  description: 'Get started with your courses.',
};

export default async function Settings() {
  const headers = await getHeaders();
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers });

  if (!user) {
    redirect(
      `/sign-in?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard/settings`,
    );
  }

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

      <SettingsContent user={user} />
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
