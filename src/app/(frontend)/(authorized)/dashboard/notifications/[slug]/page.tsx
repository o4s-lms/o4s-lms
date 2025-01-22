import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { TopNav } from '@/components/Layout/TopNav';
import { LanguageSelector } from '@/components/LangSelector.';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { ProfileDropdown } from '@/components/Layout/ProfileDropdown';
import { currentUser } from '@/lib/session';
import { createPayloadClient } from '@/lib/payload';
import { Where } from 'payload';
import { Notifications } from '@/components/Dashboard/Notifications';
import { NotificationsDropdown } from '@/components/Layout/Notifications';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Notifications | O4S LMS',
  description: 'Get started with your courses.',
};

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function NotificationsPage({ params: paramsPromise }: Args) {
  const { slug = 'unread' } = await paramsPromise;
  const user = await currentUser();

  if (!user) {
    redirect(
      `/sign-in?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard/notifications/${slug}`,
    );
  }

  const userId = user.id;
  const type = slug;

  const notifications = await queryNotificationsByUser({userId, type});

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

      <Notifications notifications={notifications} notificationsType={slug} />
    </>
  );
}

const queryNotificationsByUser = async ({ userId, type }: { userId: string; type: string }) => {
  const payload = await createPayloadClient();

  function query() {
    switch (type) {
      case 'all':
        return {
          recipient: {
            equals: userId,
          },
        };
      case 'unread':
        return {
          and: [
            {
              recipient: {
                equals: userId,
              },
            },
            {
              read: {
                equals: false,
              },
            },
          ],
        };
      default:
        return {
          and: [
            {
              recipient: {
                equals: userId,
              },
            },
            {
              type: {
                equals: type,
              },
            },
          ],
        };
    }
  };

  const result = await payload.find({
    collection: 'notifications',
    depth: 0,
    limit: 10,
    pagination: false,
    where: query() as unknown as Where,
  });

  return result.docs ?? null;
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
