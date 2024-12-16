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
  );
};
