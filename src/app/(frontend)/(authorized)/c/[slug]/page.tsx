import type { Metadata } from 'next';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import React, { cache } from 'react';
import { CourseWithSidebar } from '@/components/Dashboard/Course';
import { PayloadRedirects } from '@/components/PayloadRedirects';

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

  return <CourseWithSidebar title={course.title} data={modules} />;
}

const queryCourseBySlug = cache(
  async ({ slug }: { slug: string }) => {
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
  },
);
