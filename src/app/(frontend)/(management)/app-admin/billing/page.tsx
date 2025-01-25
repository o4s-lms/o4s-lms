import type { Metadata } from 'next';
import { LanguageSelector } from '@/components/LangSelector.';
import { Header } from '@/components/Layout/Header';
import { TopNav } from '@/components/Layout/TopNav';
import { ProfileDropdown } from '@/components/Layout/ProfileDropdown';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { createPayloadClient } from '@/lib/payload';
import AppAdminTransactions from '@/components/AppAdmin/Billing';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'App Admin Dashboard | O4S LMS',
  description: 'Get started with your courses.',
};

export default async function AppAdminTransactionsPage() {
  const payload = await createPayloadClient();

  const transactions = await payload.find({
    collection: 'transactions',
    depth: 1,
    select: {
      name: true,
      email: true,
      transactionId: true,
      provider: true,
      amount: true,
      discount: true,
      tax: true,
      total: true,
      status: true,
      processed: true,
      processedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

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
      <AppAdminTransactions transactions={transactions.docs} />
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
