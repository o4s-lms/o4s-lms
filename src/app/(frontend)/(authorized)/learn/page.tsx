import type { Metadata } from 'next';
import { CoursesContent } from '@/components/Learn/Courses';
import { redirect } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { TopNav } from '@/components/Layout/TopNav';
import { LanguageSelector } from '@/components/LangSelector.';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { ProfileDropdown } from '@/components/Layout/ProfileDropdown';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { cn } from '@/lib/utils';
import { cache } from 'react';
import { createPayloadClient } from '@/lib/payload';
import { currentUser } from '@/lib/session';
import { AppSideBarDataProvider } from '@/providers/AppSideBarData';
import { NotificationsDropdown } from '@/components/Layout/Notifications';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Courses | O4S LMS',
  description: 'Get started with your courses.',
};

export default async function Page() {
  const user = await currentUser();

  if (!user) {
    redirect(
      `/sign-in?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard/courses`,
    );
  }

  const enrollments = await queryEnrollmentsByUser({ userId: user.id });

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
            {/**<Search />*/}
            <NotificationsDropdown />
            <LanguageSelector />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>

        <CoursesContent userId={user.id} enrollments={enrollments} />
      </div>
    </AppSideBarDataProvider>
  );
}

const queryEnrollmentsByUser = cache(async ({ userId }: { userId: string }) => {
  const payload = await createPayloadClient();

  const result = await payload.find({
    collection: 'enrollments',
    depth: 2,
    limit: 10,
    pagination: false,
    where: {
      student: {
        equals: userId,
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
