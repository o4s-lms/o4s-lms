import type { Metadata } from 'next/types';

import { CoursesArchive } from '@/components/CoursesArchive';
import { PageRange } from '@/components/PageRange';
import { Pagination } from '@/components/Pagination';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import React from 'react';
import PageClient from './page.client';
import { notFound } from 'next/navigation';
import { getLanguage } from '@/tolgee/language';

export const revalidate = 600;

type Args = {
  params: Promise<{
    pageNumber: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const language = await getLanguage();
  const { pageNumber } = await paramsPromise;
  const payload = await getPayload({ config: configPromise });

  const sanitizedPageNumber = Number(pageNumber);

  if (!Number.isInteger(sanitizedPageNumber)) notFound();

  const courses = await payload.find({
    collection: 'courses',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
    where: {
      language: {
        equals: language,
      }
    }
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
        {courses?.page && courses?.totalPages > 1 && (
          <Pagination page={courses.page} totalPages={courses.totalPages} />
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise;
  return {
    title: `O4S LMS Course Page ${pageNumber || ''}`,
  };
}

export async function generateStaticParams() {
  const language = await getLanguage();
  const payload = await getPayload({ config: configPromise });
  const { totalDocs } = await payload.count({
    collection: 'courses',
    overrideAccess: false,
    where: {
      language: {
        equals: language,
      },
    },
  });

  const totalPages = Math.ceil(totalDocs / 10);

  const pages: { pageNumber: string }[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) });
  }

  return pages;
}
