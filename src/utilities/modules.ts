'use server';

import configPromise from '@payload-config';
import { getPayload } from 'payload';

export async function getModulesByCourseId(courseId: string) {
  const payload = await getPayload({ config: configPromise });

  const course = await payload.findByID({
    collection: 'courses',
    id: courseId,
    depth: 0,
    select: {
      title: true,
    },
  });

  const result = await payload.find({
    collection: 'modules',
    depth: 1,
    limit: 50,
    pagination: false,
    where: {
      course: {
        equals: courseId,
      },
    },
    select: {
      title: true,
      course: true,
      lessons: true,
    },
  });

  const groups = result.docs.map((module) => ({
    title: module.title,
    items: module.lessons
      .map(({ value }) => value)
      .filter((lesson) => typeof lesson === 'object')
      .map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        url: '#',
        icon: null,
      })),
  }));

  const nav = [
    {
      title: course.title,
      items: groups,
    },
  ];

  return nav;
}
