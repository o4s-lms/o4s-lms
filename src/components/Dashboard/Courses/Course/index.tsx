'use client';

import * as React from 'react';

import RichText from '@/components/RichText';

import type { Module } from '@/payload-types';
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { useQueryState } from 'nuqs';
import { getLessonById } from '@/utilities/lessons';

interface CourseSidebarProps {
  title: string;
  data: Module[];
}

export function CourseContent() {
  const [lessonId, setLessonId] = useQueryState('lessonId');
  //const [modules, setModules] = React.useState<Module[]>(data);
  const [lesson, setLesson] = React.useState<
    | {
        id: string;
        title: string;
        content: SerializedEditorState | null | undefined;
      }
    | null
    | undefined
  >(null);

  React.useEffect(() => {
    const getLesson = async () => {
      const l = await getLessonById(lessonId);
      setLesson({ ...l });
    };

    void getLesson();
  }, [lessonId]);

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
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          {lesson?.title}
          <RichText
            className="mx-auto max-w-[48rem]"
            data={lesson?.content}
            enableGutter={false}
          />
        </div>
      </div>
    </>
  );
}
