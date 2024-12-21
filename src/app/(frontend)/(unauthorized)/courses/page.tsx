import type { Metadata } from 'next/types';

import { CoursesArchive } from '@/components/CoursesArchive';
import { PageRange } from '@/components/PageRange';
import { Pagination } from '@/components/Pagination';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import React from 'react';
import PageClient from './page.client';

export const dynamic = 'force-static';
export const revalidate = 600;

export default async function Page() {
  const payload = await getPayload({ config: configPromise });

  const courses = await payload.find({
    collection: 'courses',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      heroImage: true,
      sections: true,
      meta: true,
    },
  });

  return (
    <div className="pb-24 pt-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose max-w-none dark:prose-invert">
          <h1>Courses</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="courses"
          currentPage={courses.page}
          limit={12}
          totalDocs={courses.totalDocs}
        />
      </div>

      <CoursesArchive courses={courses.docs} />

      <div className="container">
        {courses.totalPages > 1 && courses.page && (
          <Pagination page={courses.page} totalPages={courses.totalPages} />
        )}
      </div>
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Courses | O4S LMS`,
  };
}
