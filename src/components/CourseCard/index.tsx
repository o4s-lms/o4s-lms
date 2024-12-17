'use client';
import { cn } from '@/lib/utils';
import useClickableCard from '@/utilities/useClickableCard';
import Link from 'next/link';
import React, { Fragment } from 'react';

import type { Course } from '@/payload-types';

import { Media } from '@/components/Media';
import { CMSLink } from '@/components/Link';
import { Check } from 'lucide-react';

export type CourseCardPostData = Pick<Course, 'slug' | 'meta' | 'title'>;

/**const links = {
  type?: ("reference" | "custom") | null;
  newTab?: boolean | null;
  reference?: {
      relationTo: "pages";
      value: number | Page;
  } | null;
  url?: string | null;
  label: string;
  appearance?: ("default" | "outline") | null;
};*/

export const CourseCard: React.FC<{
  alignItems?: 'center';
  className?: string;
  doc?: CourseCardPostData;
  relationTo?: 'courses';
  title?: string;
}> = (props) => {
  const { card, link } = useClickableCard({});
  const { className, doc, relationTo, title: titleFromProps } = props;

  const { slug, meta, title } = doc || {};
  const { description, image: metaImage } = meta || {};

  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, ' '); // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`;

  const links = [
    {
      url: href,
      label: 'Saber mais',
      appearance: 'outline'
    },
    {
      url: `/checkout/${slug}`,
      label: 'Comprar agora',
      appearance: 'default'
    }
  ]

  return (
    
      <div className="container mx-auto">
        <div className="container grid grid-cols-1 items-center gap-8 rounded-lg border py-8 lg:grid-cols-2">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="font-regular max-w-xl text-left text-3xl tracking-tighter lg:text-5xl">
                  {titleToUse && (
                    <Link className="not-prose" href={href} ref={link.ref}>
                      {titleToUse}
                    </Link>
                  )}
                </h2>
                {description && (
                  <p className="max-w-xl text-left text-lg leading-relaxed tracking-tight text-muted-foreground">
                    {sanitizedDescription}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-3 lg:grid-cols-1 lg:pl-6">
              <div className="flex flex-row items-start gap-6">
                <Check className="mt-2 h-4 w-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Easy to use</p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve made it easy to use and understand.
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-start gap-6">
                <Check className="mt-2 h-4 w-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Fast and reliable</p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve made it fast and reliable.
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-start gap-6">
                <Check className="mt-2 h-4 w-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Beautiful and modern</p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve made it beautiful and modern.
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-start gap-6">
                {Array.isArray(links) && links.length > 0 && (
                  <ul className="flex gap-4 md:justify-center">
                    {links.map((l, i) => {
                      return (
                        <li key={i}>
                          <CMSLink label={l.label} url={l.url} appearance={l.appearance}/>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-md bg-muted">
            {!metaImage && <div className="">No image</div>}
            {metaImage && typeof metaImage !== 'string' && (
              <Media resource={metaImage} size="33vw" />
            )}
          </div>
        </div>
      </div>
   
  );
};
