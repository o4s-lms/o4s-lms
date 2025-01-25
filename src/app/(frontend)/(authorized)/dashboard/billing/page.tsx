import type { Metadata } from 'next';
import { LanguageSelector } from '@/components/LangSelector.';
import { Header } from '@/components/Layout/Header';
import { TopNav } from '@/components/Layout/TopNav';
import { ProfileDropdown } from '@/components/Layout/ProfileDropdown';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { createPayloadClient } from '@/lib/payload';
import { redirect } from 'next/navigation';
import { Billing } from '@/components/Dashboard/Billing';
import { cache } from 'react';
import { currentUser } from '@/lib/session';
import { NotificationsDropdown } from '@/components/Layout/Notifications';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Billing | O4S LMS',
  description: 'Get started with your courses.',
};

export default async function BillingPage() {
  const user = await currentUser();

  if (!user) {
    // unauthorized()
    redirect(
      `/sign-in?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard/billing`,
    );
  }

  const transactions = await queryTransactionsByUser({ email: user?.email });

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
      <Billing transactions={transactions} />
    </>
  );
}

const queryTransactionsByUser = cache(async ({ email }: { email: string }) => {
  const payload = await createPayloadClient();

  const result = await payload.find({
    collection: 'transactions',
    depth: 1,
    limit: 10,
    pagination: false,
    where: {
      email: {
        equals: email,
      },
    },
  });

  return result.docs ?? null;
});

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
