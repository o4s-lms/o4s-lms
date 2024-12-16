import type { Metadata } from 'next';

import { PayloadRedirects } from '@/components/PayloadRedirects';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { draftMode } from 'next/headers';
import React, { cache } from 'react';
import RichText from '@/components/RichText';

import type { Course } from '@/payload-types';

import { CourseHero } from '@/heros/CourseHero';
import { generateMeta } from '@/utilities/generateMeta';
import PageClient from './page.client';
import { LivePreviewListener } from '@/components/LivePreviewListener';

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const courses = await payload.find({
    collection: 'courses',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  const params = courses.docs.map(({ slug }) => {
    return { slug };
  });

  return params;
}

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Course({ params: paramsPromise }: Args) {
  // TO DO: get the current language
  const { isEnabled: draft } = await draftMode();
  const { slug = '' } = await paramsPromise;
  const url = '/courses/' + slug;
  const course = await queryCourseBySlug({ slug });

  if (!course) return <PayloadRedirects url={url} />;

  return (
    <article className="pb-16 pt-16">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <CourseHero course={course} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText
            className="mx-auto max-w-[48rem]"
            data={course.content}
            enableGutter={false}
          />
        </div>
      </div>
    </article>
  );
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise;
  const post = await queryCourseBySlug({ slug });

  return generateMeta({ doc: post });
}

const queryCourseBySlug = cache(async ({ slug, language = 'pt' }: { slug: string, language?: string }) => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'courses',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          language: {
            equals: language,
          },
        },
      ],
    },
  });

  return result.docs?.[0] || null;
});
