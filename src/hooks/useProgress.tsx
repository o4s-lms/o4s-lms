'use client';

import { useAuth } from '@/providers/Auth';
import { getLessonProgress } from '@/utilities/lessons';
import { useQueryState } from 'nuqs';
import * as React from 'react';
import type { CourseProgress, LessonProgress } from '@/payload-types';
import { getCourseProgress } from '@/utilities/courses';

export function useProgress() {
  const { user, isLoaded, isSignedIn } = useAuth();
  const [lessonId, setLessonId] = useQueryState('lessonId');
  const [lessonProgress, setLessonProgress] =
    React.useState<LessonProgress | null>(null);
  const [courseProgress, setCourseProgress] =
    React.useState<CourseProgress | null>(null);

  React.useEffect(() => {
    async function get() {
      if (user && isLoaded && isSignedIn && lessonId) {
        const l = await getLessonProgress(user.id, lessonId);
        setLessonProgress(l);
        const c = await getCourseProgress(user.id, l?.course as string);
        setCourseProgress(c);
      }
    }

    void get();
  }, [isLoaded, isSignedIn, lessonId, user]);

  return {
    lastAccessed: lessonProgress?.lastAccessed ?? null,
    completed: lessonProgress?.completed ?? null,
    completedAt: lessonProgress?.completedAt ?? null,
    overallProgress: courseProgress?.overallProgress ?? null,
    pointsEarned: courseProgress?.pointsEarned ?? null,
  };
}
