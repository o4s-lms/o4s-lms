import { cn } from '@/lib/utils';
import React from 'react';

import type { Course } from '@/payload-types';

import { CourseCard, CourseCardPostData } from '@/components/CourseCard';

export type Props = {
  courses: CourseCardPostData[];
};

export const CoursesArchive: React.FC<Props> = (props) => {
  const { courses } = props;

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 lg:gap-x-8 lg:gap-y-8 xl:gap-x-8">
          {courses?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <CourseCard
                    className="h-full"
                    doc={result}
                    relationTo="courses"
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};
