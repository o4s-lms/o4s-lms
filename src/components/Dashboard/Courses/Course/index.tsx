'use client';

import * as React from 'react';

import RichText from '@/components/RichText';
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { useQueryState } from 'nuqs';
import { getLessonById, getLessonProgress } from '@/utilities/lessons';
import { usePathname } from 'next/navigation';
import type { LessonProgress } from '@/payload-types';
import { Speeddial } from '@/components/ui/animata/fabs/speed-dial';
import { Check, Copy, Share2, SquarePen, Star, StarOff, Trash } from 'lucide-react';
import { Main } from '@/components/Layout/Main';
import { ContentSection } from './ContentSection';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FavoriteMutationData } from '@/hooks/useFavorites';
import {
  createUserFavorites,
  removeUserFavorites,
  verifyIsFavorite,
} from '@/utilities/favorites';
import { toast } from 'sonner';
import { format } from 'timeago.js';
import { useTranslate } from '@tolgee/react';

interface CourseProps {
  userId: string;
  courseId: string;
}

export function CourseContent({ userId, courseId }: CourseProps) {
  const [lessonId, setLessonId] = useQueryState('lessonId');
  const pathname = usePathname();
  const { t } = useTranslate();
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
  const [isFavorite, setIsFavorite] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const getLesson = async () => {
      if (lessonId) {
        const l = await getLessonById(lessonId);
        setLesson({ ...l });
        const p = await getLessonProgress(userId, lessonId);
        setLessonProgress(p);
        const f = await verifyIsFavorite(userId, lessonId);
        setIsFavorite(f);
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

  const createFavorite = useMutation({
    mutationFn: () => {
      const data: FavoriteMutationData = {
        objectType: 'lessons',
        objectId: lesson?.id as string,
        title: lesson?.title as string,
        url: `${pathname}?lessonId=${lesson?.id}`,
      };
      return createUserFavorites(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast.success('Favorite added');
    },
    onError: (error) => {
      toast.error('Failed to add favorite');
      console.error('Failed to add favorite:', error);
    },
  });

  const removeFavorite = useMutation({
    mutationFn: () => {
      return removeUserFavorites(lesson?.id as string, 'lessons');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast.success('Favorite removed');
    },
    onError: (error) => {
      toast.error('Failed to remove favorite');
      console.error('Failed to remove favorite:', error);
    },
  });

  const handleFavorite = () => {
    console.log('isFavorite: ', isFavorite);
    if (isFavorite) {
      removeFavorite.mutate()
    } else {
      createFavorite.mutate()
    }
  }

  const renderIcon = () => {
    if (isFavorite) return <StarOff />
    return <Star />
  }

  return (
    <Main fixed>
      <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="hidden lg:block top-0 lg:sticky lg:w-16">
          <Speeddial
            actionButtons={[
              {
                action: () => {handleFavorite()},
                //icon: {!isFavorite ? <Star /> : <StarOff />},
                icon: renderIcon(),
                key: 'favorite',
                label: 'Favorite',
              },
              {
                action: () => {},
                icon: <Check />,
                key: 'complete',
                label: 'Complete',
              },
              {
                action: () => {},
                icon: <Share2 />,
                key: 'share',
                label: 'Share',
              },
              {
                action: () => {},
                icon: <Trash />,
                key: 'delete',
                label: 'Delete',
              },
            ]}
            direction="down"
          />
        </aside>

        <aside className="lg:hidden top-0 lg:sticky lg:h-16">
          <Speeddial
            actionButtons={[
              {
                action: () => {},
                icon: <Star />,
                key: 'copy',
                label: 'Copy',
              },
              {
                action: () => {},
                icon: <SquarePen />,
                key: 'edit',
                label: 'Edit',
              },
              {
                action: () => {},
                icon: <Share2 />,
                key: 'share',
                label: 'Share',
              },
              {
                action: () => {},
                icon: <Trash />,
                key: 'delete',
                label: 'Delete',
              },
            ]}
            direction="right"
          />
        </aside>

        <div className="flex w-full overflow-y-hidden p-1 pr-4">
          <ContentSection title={lesson?.title} desc={`Last access: ${format(progress?.lastAccessed)}`}>
            <RichText
              className="mx-auto max-w-[96rem]"
              data={lesson?.content}
              enableGutter={false}
            />
          </ContentSection>
        </div>
      </div>
    </Main>
  );
}
