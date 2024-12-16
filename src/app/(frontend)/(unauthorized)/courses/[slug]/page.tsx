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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';

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

      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="md:grid-col-2 flex gap-10">
            <div className="flex basis-3/5 flex-col gap-10">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <RichText
                    className="mx-auto max-w-[48rem]"
                    data={course.content}
                    enableGutter={false}
                  />
                </div>
                <div className="">
                  <Button className="gap-4" variant="outline">
                    Any questions? Reach out <PhoneCall className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="basis-2/5">
              <div className="prose max-w-none dark:prose-invert">
                <h4>Conteúdo do curso</h4>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {course.sections.map((section, index) => (
                  <AccordionItem key={index} value={'index-' + index}>
                    <AccordionTrigger>{section.title}</AccordionTrigger>
                    <AccordionContent>
                      {section.richText && (
                        <RichText
                          className="mx-auto max-w-[48rem]"
                          data={section.richText}
                          enableGutter={false}
                        />
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
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

const queryCourseBySlug = cache(
  async ({ slug, language = 'pt' }: { slug: string; language?: string }) => {
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
  },
);
