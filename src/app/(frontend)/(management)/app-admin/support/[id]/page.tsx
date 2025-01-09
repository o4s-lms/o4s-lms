import type { Metadata } from 'next';
import { LanguageSelector } from '@/components/LangSelector.';
import { Header } from '@/components/Layout/Header';
import { TopNav } from '@/components/Layout/TopNav';
import { ProfileDropdown } from '@/components/Layout/ProfileDropdown';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { createPayloadClient } from '@/lib/payload';
import { TicketChat } from '@/components/AppAdmin/Support/TicketChat';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Support | O4S LMS',
  description: 'Get started with your courses.',
};

type Args = {
  params: Promise<{
    id?: string;
  }>;
};

export default async function AppAdminTicketSupportPage({ params: paramsPromise }: Args) {
  const { id = '' } = await paramsPromise;
  const payload = await createPayloadClient();

  const ticket = await payload.findByID({
    collection: 'support-tickets',
    id: id,
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
      <TicketChat ticket={ticket} />
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
