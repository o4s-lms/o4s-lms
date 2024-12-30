'use client';

import * as React from 'react';

import RichText from '@/components/RichText';
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { useQueryState } from 'nuqs';
import { getLessonById, getLessonProgress } from '@/utilities/lessons';
import { useProgress } from '@/hooks/useProgress';
import type { LessonProgress } from '@/payload-types';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CourseProps {
  userId: string;
  courseId: string;
}

export function CourseContent({ userId, courseId }: CourseProps) {
  const [lessonId, setLessonId] = useQueryState('lessonId');
  const [lesson, setLesson] = React.useState<
    | {
        id: string;
        title: string;
        content: SerializedEditorState | null | undefined;
      }
    | null
    | undefined
  >(null);
  const [progress, setLessonProgress] = React.useState<LessonProgress | null>(
    null,
  );
  //const { lastAccessed, completed, completedAt } = useProgress();

  React.useEffect(() => {
    const getLesson = async () => {
      if (lessonId) {
        const l = await getLessonById(lessonId);
        setLesson({ ...l });
        const p = await getLessonProgress(userId, lessonId);
        setLessonProgress(p);
        await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/functions/lastLessonAccess?userId=${userId}&courseId=${courseId}&lessonId=${lessonId}`,
          {
            method: 'POST',
            credentials: 'include',
          },
        );
      }
    };

    void getLesson();
  }, [courseId, lessonId, userId]);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {!lesson && (
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="h-16 rounded-xl bg-muted/50">
            <CourseProgress value={13} />
          </div>
          <div className="h-16 rounded-xl bg-muted/50"></div>
          <div className="h-16 rounded-xl bg-muted/50"></div>
        </div>

        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          {lesson?.title} - {progress?.lastAccessed}
          <ScrollArea className="h-full w-full rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">{lesson?.title}</h4>
              <RichText
                className="mx-auto max-w-[96rem]"
                data={lesson?.content}
                enableGutter={false}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

function CourseProgress({ value }: { value: number }) {
  const [progress, setProgress] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Progress
      value={progress}
      className="relative h-[25px] w-[60%] overflow-hidden rounded-full"
    />
  );
}
