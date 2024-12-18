import { formatDateTime } from '@/utilities/formatDateTime';
import React from 'react';

import type { Course } from '@/payload-types';

import { Media } from '@/components/Media';
import { formatPrice } from '@/lib/utils';

export const CourseHero: React.FC<{
  course: Course;
}> = ({ course }) => {
  const { heroImage, populatedAuthors, publishedAt, title, price } = course;

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container relative z-10 pb-8 text-white lg:grid lg:grid-cols-[1fr_48rem_1fr]">
        <div className="col-span-1 col-start-1 md:col-span-2 md:col-start-2">
          <div className="">
            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl">{title}</h1>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:gap-16">
            <div className="flex flex-col gap-4">
              {populatedAuthors && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Author</p>
                  {populatedAuthors.map((author, index) => {
                    const { name } = author;

                    const isLast = index === populatedAuthors.length - 1;
                    const secondToLast = index === populatedAuthors.length - 2;

                    return (
                      <React.Fragment key={index}>
                        {name}
                        {secondToLast && populatedAuthors.length > 2 && (
                          <React.Fragment>, </React.Fragment>
                        )}
                        {secondToLast && populatedAuthors.length === 2 && (
                          <React.Fragment> </React.Fragment>
                        )}
                        {!isLast && populatedAuthors.length > 1 && (
                          <React.Fragment>and </React.Fragment>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>

                <time dateTime={publishedAt}>
                  {formatDateTime(publishedAt)}
                </time>
              </div>
            )}
            {price && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Price</p>

                {formatPrice(price)}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media
            fill
            priority
            imgClassName="-z-10 object-cover"
            resource={heroImage}
          />
        )}
        <div className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  );
};
