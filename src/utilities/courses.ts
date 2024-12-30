'use server';

import configPromise from '@payload-config';
import { getPayload, PaginatedDocs } from 'payload';
import type { CourseProgress } from '@/payload-types';

export async function getCourseProgress(
  userId: string,
  courseId: string,
): Promise<CourseProgress | null> {
  const payload = await getPayload({ config: configPromise });

  const result: PaginatedDocs<CourseProgress> = await payload.find({
    collection: 'course-progress',
    depth: 0,
    limit: 1,
    where: {
      and: [
        {
          student: {
            equals: userId,
          },
        },
        {
          course: {
            equals: courseId,
          },
        },
      ],
    },
  });

  //if (result.docs.length < 1) {
    //return null;
  //}

  return result.docs[0] ?? null;
}