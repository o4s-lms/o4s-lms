'use server';

import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { unstable_cache } from 'next/cache';

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

// TODO cache
