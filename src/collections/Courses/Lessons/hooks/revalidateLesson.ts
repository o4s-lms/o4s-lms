import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload';

import { revalidatePath, revalidateTag } from 'next/cache';

import type { Lesson } from '@/payload-types';

export const revalidateLesson: CollectionAfterChangeHook<Lesson> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/lessons/${doc.slug}`;

      payload.logger.info(`Revalidating lesson at path: ${path}`);

      revalidatePath(path);
      //revalidateTag('courses-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/lessons/${previousDoc.slug}`;

      payload.logger.info(`Revalidating old lesson at path: ${oldPath}`);

      revalidatePath(oldPath);
      //revalidateTag('courses-sitemap')
    }
  }
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Course> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/courses/${doc?.slug}`;

    revalidatePath(path);
    revalidateTag('courses-sitemap')
  }

  return doc;
};
