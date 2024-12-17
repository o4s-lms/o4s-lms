import type {
  Course,
  CoursesArchiveBlock as CoursesArchiveBlockProps,
} from '@/payload-types';

import React from 'react';
import RichText from '@/components/RichText';

import { CoursesArchive } from '@/components/CoursesArchive';

export const CoursesArchiveBlock: React.FC<
  CoursesArchiveBlockProps & {
    id?: string;
  }
> = async (props) => {
  const { id, introContent, selectedDocs } = props;

  let courses: Course[] = [];

  if (selectedDocs?.length) {
    const filteredSelectedCourses = selectedDocs.map((course) => {
      if (typeof course.value === 'object') return course.value;
    }) as Course[];

    courses = filteredSelectedCourses;
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText
            className="ml-0 max-w-[48rem]"
            data={introContent}
            enableGutter={false}
          />
        </div>
      )}
      <CoursesArchive courses={courses} />
    </div>
  );
};
