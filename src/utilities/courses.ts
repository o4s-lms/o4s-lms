'use server';

import type { CourseProgress } from '@/payload-types';
import { createPayloadClient } from '@/lib/payload';
import { PaginatedDocs } from 'payload';

export interface StartCourseMutationData {
  userId: string;
  courseId: string;
}

export async function getCourseProgress(
  userId: string,
  courseId: string,
): Promise<CourseProgress | null> {
  const payload = await createPayloadClient();

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

export async function startCourse(data: StartCourseMutationData) {
  const payload = await createPayloadClient();
  const now = new Date().toISOString();

  try {
    await payload.update({
      collection: 'enrollments',
      depth: 0,
      where: {
        and: [
          {
            student: {
              equals: data.userId,
            },
          },
          {
            course: {
              equals: data.courseId,
            },
          },
        ],
      },
      data: {
        startedAt: now,
      },
    });
  } catch (error) {
    throw error;
  }

  try {
    await payload.update({
      collection: 'course-progress',
      depth: 0,
      where: {
        and: [
          {
            student: {
              equals: data.userId,
            },
          },
          {
            course: {
              equals: data.courseId,
            },
          },
        ],
      },
      data: {
        status: 'inProgress',
        startedAt: now,
      },
    });
  } catch (error) {
    throw error;
  }
  return true;
}
