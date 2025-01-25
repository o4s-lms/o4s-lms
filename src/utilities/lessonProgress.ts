'use server';

import type { LessonProgress } from '@/payload-types';
import { createPayloadClient } from '@/lib/payload';
import { PaginatedDocs } from 'payload';

export async function getLessonProgress(
  userId: string,
  lessonId: string,
): Promise<LessonProgress | null> {
  const payload = await createPayloadClient();

  const result: PaginatedDocs<LessonProgress> = await payload.find({
    collection: 'lesson-progress',
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
        student: userId,
        lesson: lessonId,
        lastAccessed: new Date().toISOString(),
      },
    });
    return lessonProgress;
  }

  return result.docs[0];
}

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  state: boolean,
): Promise<LessonProgress | null> {
  const payload = await createPayloadClient();

  const result = await payload.update({
    collection: 'lesson-progress',
    depth: 0,
    where: {
      and: [
        {
          student: {
            equals: userId,
          },
        },
        {
          lesson: {
            equals: lessonId,
          },
        },
      ],
    },
    data: {
      completed: state,
      completedAt: state ? new Date().toISOString() : undefined,
    },
  });

  return result.docs[0] ?? null;
}
