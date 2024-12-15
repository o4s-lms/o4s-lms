'use client';
import { cn } from '@/lib/utils';
import useClickableCard from '@/utilities/useClickableCard';
import Link from 'next/link';
import React, { Fragment } from 'react';

import type { Course } from '@/payload-types';

import { Media } from '@/components/Media';

export type CourseCardPostData = Pick<
  Course,
  'slug' | 'sections' | 'meta' | 'title'
>;

export const CourseCard: React.FC<{
  alignItems?: 'center';
  className?: string;
  doc?: CourseCardPostData;
  relationTo?: 'courses';
  showSections?: boolean;
  title?: string;
}> = (props) => {
  const { card, link } = useClickableCard({});
  const {
    className,
    doc,
    relationTo,
    showSections,
    title: titleFromProps,
  } = props;

  const { slug, sections, meta, title } = doc || {};
  const { description, image: metaImage } = meta || {};

  const hasSections =
    sections && Array.isArray(sections) && sections.length > 0;
  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, ' '); // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`;

  return (
    <article
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full">
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media resource={metaImage} size="33vw" />
        )}
      </div>
      <div className="p-4">
        {showSections && hasSections && (
          <div className="mb-4 text-sm uppercase">
            {showSections && hasSections && (
              <div>
                {sections?.map((section, index) => {
                  if (typeof section === 'object') {
                    const { title: titleFromSection } = section;

                    const sectionTitle = titleFromSection || 'Untitled section';

                    const isLast = index === sections.length - 1;

                    return (
                      <Fragment key={index}>
                        {sectionTitle}
                        {!isLast && <Fragment>, &nbsp;</Fragment>}
                      </Fragment>
                    );
                  }

                  return null;
                })}
              </div>
            )}
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && (
          <div className="mt-2">
            {description && <p>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
    </article>
  );
};
