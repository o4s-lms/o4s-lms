import type { Metadata } from 'next';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import React, { cache } from 'react';
import { PayloadRedirects } from '@/components/PayloadRedirects';
import { SidebarProvider } from '@/components/ui/sidebar';
import SkipToMain from '@/components/SkipToMain';
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
  const { slug = '' } = await paramsPromise;
  const url = '/dashboard/courses/' + slug;
  const course = await queryCourseBySlug({ slug });

  if (!course) return <PayloadRedirects url={url} />;

  const modules = course.modules
    .map(({ value }) => value)
    .filter((module) => typeof module === 'object');

  return (
    <SidebarProvider>
      <SkipToMain />
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
        <CourseContent />
      </div>
    </SidebarProvider>
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
