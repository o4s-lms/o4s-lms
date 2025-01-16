'use server';

import configPromise from '@payload-config';
import { getPayload, PaginatedDocs } from 'payload';
import { unstable_cache } from 'next/cache';
import type { LessonProgress } from '@/payload-types';

export async function getLastLessonAccessed(userId: string, courseId: string) {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'lesson-progress',
    depth: 0,
    limit: 1,
    sort: '-lastAccessed',
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

  if (result.docs.length > 0) {
    //const lesson =  result.docs.map(({ lesson }) => lesson)
    //.filter((lesson) => typeof lesson === 'object')
    return result.docs[0].lesson as string;
  }
  
  return null;
}

export async function getLessonById(lessonId: string | null, depth = 0) {
  const payload = await getPayload({ config: configPromise });

  if (!lessonId) return null;

  const lesson = await payload.findByID({
    collection: 'lessons',
    id: lessonId,
    depth,
    select: {
      title: true,
      content: true,
    },
  });

  return lesson;
}

export async function getLessonContent(lessonId: string | null, depth = 0) {
  const payload = await getPayload({ config: configPromise });

  if (!lessonId) return null;

  const lesson = await payload.find({
    collection: 'lessons-content',
    depth,
    limit: 1,
    where: {
      lesson: {
        equals: lessonId,
      }
    },
    select: {
      title: true,
      content: true,
    },
  });

  return lesson.docs[0] ?? null;
}

export async function getLessonProgress(
  userId: string,
  lessonId: string,
): Promise<LessonProgress | null> {
  const payload = await getPayload({ config: configPromise });

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

  //if (result.docs.length < 1) {
    //return null;
  //}

  return result.docs[0] ?? null;
}

// TODO cache
