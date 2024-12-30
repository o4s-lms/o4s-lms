import type { Metadata } from 'next';
import { headers as getHeaders } from 'next/headers';
import { redirect } from 'next/navigation';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import React, { cache } from 'react';
import { PayloadRedirects } from '@/components/PayloadRedirects';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { cn } from '@/lib/utils';
import { CourseContent } from '@/components/Dashboard/Courses/Course';
import { Header } from '@/components/Layout/Header';
import { TopNav } from '@/components/Layout/TopNav';
import { LanguageSelector } from '@/components/LangSelector.';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { ProfileDropdown } from '@/components/ProfileDropdown';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Your course | O4S LMS',
  description: 'Get started with your course.',
};

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const headers = await getHeaders();
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers });

  if (!user) {
    // unauthorized()
    redirect(
      `/sign-in?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard`,
    );
  }

  const { slug = '' } = await paramsPromise;
  const url = '/learn/' + slug;
  const course = await queryCourseBySlug({ slug });

  if (!course) return <PayloadRedirects url={url} />;

  const modules = course.modules
    .map(({ value }) => value)
    .filter((module) => typeof module === 'object');

  return (
    <>
      <AppSidebar title={course.title} modules={modules} />
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
            <LanguageSelector />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <CourseContent userId={user.id} />
      </div>
    </>
  );
}

const queryCourseBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'courses',
    depth: 2,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
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
