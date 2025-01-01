'use client';

import * as React from 'react';
import { useTranslate } from '@tolgee/react';
import type { Enrollment, Course, CourseProgress } from '@/payload-types';
import { Main } from '@/components/Layout/Main';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLastLessonAccessed } from '@/utilities/lessons';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { startCourse, type StartCourseMutationData } from '@/utilities/courses';
import { Media } from '@/components/Media';
import { Progress } from '@/components/ui/animata/graphs/progress';
import { format } from 'timeago.js';

interface CoursesProps {
  userId: string;
  enrollments: Enrollment[];
}

export function CoursesContent({ userId, enrollments }: CoursesProps) {
  const { t } = useTranslate();
  const router = useRouter();

  const e = enrollments.map((enrollment) => ({
    status: enrollment.status,
    enrolledAt: enrollment.enrolledAt,
    startedAt: enrollment.startedAt,
    course: enrollment.course as Course,
    progress: enrollment.progress as CourseProgress,
  }));

  const start = useMutation({
    mutationFn: async (courseId: string) => {
      const data: StartCourseMutationData = {
        userId: userId,
        courseId: courseId,
      };
      return await startCourse(data);
    },
    onSuccess: () => {
      //queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast.success('Course started successful');
    },
    onError: (error) => {
      toast.error('Failed to start the course', {
        description: error.message,
      });
    },
  });

  const handleClick = async (index: number, courseId: string, slug: string) => {
    if (enrollments[index].startedAt) {
      const lastLesson = await getLastLessonAccessed(userId, courseId);
      router.push(`/learn/${slug}?lessonId=${lastLesson}`);
    } else {
      start.mutate(courseId);
      router.push(
        `/learn/${slug}?message=${encodeURIComponent('Course started successful')}`,
      );
    }
  };

  return (
    <Main fixed>
      <div id="courses-content" className="flex flex-1 flex-col gap-4 p-4">
        <span className="relative flex justify-center">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>

          <span className="relative z-10 bg-white px-6 font-bold dark:bg-black">
            My courses
          </span>
        </span>
        {e.map((item, index) => (
          <>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
              <article className="flex bg-white transition hover:shadow-xl">
                <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
                  <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900">
                    <span>Enrolled</span>
                    <span className="w-px flex-1 bg-gray-900/10"></span>
                    <span>{format(item.enrolledAt)}</span>
                  </div>
                </div>

                <div className="hidden sm:block sm:basis-56">
                  {!item.course.badgeImage && <div className="">No image</div>}
                  {item.course.badgeImage &&
                    typeof item.course.badgeImage !== 'string' && (
                      <Media
                        resource={item.course.badgeImage}
                        size="33vw"
                        className="aspect-square h-full w-full object-cover"
                      />
                    )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
                    <a href="#">
                      <h3 className="font-bold uppercase text-gray-900">
                        {item.course.title}
                      </h3>
                    </a>
                    <div>
                      <strong className="font-normal text-gray-700">
                        <strong>{item.progress.overallProgress}%</strong> progress
                      </strong>
                      <div className="h-[12px] sm:w-96">
                        <Progress progress={item.progress.overallProgress} />
                      </div>
                      <strong className="font-normal text-gray-700">
                        <strong>{item.progress.pointsEarned}</strong> points
                      </strong>
                    </div>

                    <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-700">
                      {item.course.description}
                    </p>
                  </div>

                  <div className="sm:flex sm:items-end sm:justify-end">
                    <Link
                      href="#"
                      onClick={() =>
                        handleClick(
                          index,
                          item.course.id,
                          item.course.slug as string,
                        )
                      }
                      className="block bg-green-300 px-5 py-3 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-green-400"
                    >
                      {item.startedAt
                        ? `Started at ${format(item.startedAt)} - Continue`
                        : `Enrolled at ${format(item.enrolledAt)} - Start now`}
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </>
        ))}
      </div>
    </Main>
  );
}
