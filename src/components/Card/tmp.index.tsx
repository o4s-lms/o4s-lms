'use client';
import { cn } from '@/utilities/cn';
import { format } from 'timeago.js';
import useClickableCard from '@/utilities/useClickableCard';
import Link from 'next/link';
import React, { Fragment } from 'react';

import type { Post } from '@/payload-types';

import { Media } from '@/components/Media';

export type CardPostData = Pick<
  Post,
  'slug' | 'categories' | 'meta' | 'title' | 'publishedAt' | 'populatedAuthors'
>;

export const Card: React.FC<{
  alignItems?: 'center';
  className?: string;
  doc?: CardPostData;
  relationTo?: 'posts';
  showCategories?: boolean;
  title?: string;
}> = (props) => {
  const { card, link } = useClickableCard({});
  const {
    className,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
  } = props;

  const { slug, categories, meta, title, publishedAt, populatedAuthors } =
    doc || {};
  const { description, image: metaImage } = meta || {};

  const hasCategories =
    categories && Array.isArray(categories) && categories.length > 0;
  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, ' '); // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`;
  const hasAuthor =
    populatedAuthors &&
    Array.isArray(populatedAuthors) &&
    populatedAuthors.length > 0;
  let authorName = '';
  if (hasAuthor) {
    authorName = populatedAuthors[0].name as string;
  }

  return (
    <div className="mb-12 flex flex-col gap-8 xl:flex-row">
      {/* image */}
      {metaImage && typeof metaImage !== 'string' && (
        <div className="rounded-2xl object-cover md:hidden xl:block xl:w-1/3">
          <Media
            resource={metaImage}
            size="33vw"
            className="rounded-2xl object-cover"
          />
        </div>
      )}
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        {titleToUse && (
          <Link href={href} ref={link.ref} className="text-4xl font-semibold">
            {titleToUse}
          </Link>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          {hasAuthor && (
            <>
              <span>Written by</span>
              <div className="text-blue-800">{authorName}</div>
              <span>on</span>
            </>
          )}
          <div className="text-blue-800">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category;

                const categoryTitle = titleFromCategory || 'Untitled category';

                const isLast = index === categories.length - 1;

                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                );
              }

              return null;
            })}
          </div>
          {publishedAt && <span>{format(publishedAt)}</span>}
        </div>
        {description && <p>{sanitizedDescription}</p>}
        <Link
          href={href}
          ref={link.ref}
          className="text-sm text-blue-800 underline"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};
