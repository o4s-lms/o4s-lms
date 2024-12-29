'use server';

import { headers as getHeaders } from 'next/headers';
import configPromise from '@payload-config';
import { getPayload, PaginatedDocs } from 'payload';
import type { LessonProgress } from '@/payload-types';

export async function getLessonProgress(
  lessonId: string,
): Promise<LessonProgress | null> {
  const headers = await getHeaders();
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers });

  if (!user) return null;

  const result: PaginatedDocs<LessonProgress> = await payload.find({
    collection: 'lesson-progress',
    depth: 0,
    limit: 1,
    where: {
      and: [
        {
          student: {
            equals: user.id,
          },
        },
        {
          lesson: {
            equals: lessonId,
          },
        },
      ],
    },
  });

  if (result.docs.length < 1) {
    // is the first access to the lesson, create it
    const lessonProgress = await payload.create({
      collection: 'lesson-progress',
      depth: 0,
      data: {
        student: user.id,
        lesson: lessonId,
        lastAccessed: new Date().toISOString(),
      },
    });
    return lessonProgress;
  }

  return result.docs[0];
}
