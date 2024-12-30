'use client';

import * as React from 'react';
import { GalleryVerticalEnd, Minus, Plus } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SearchForm } from './SearchForm';
import RichText from '@/components/RichText';

import type { Module } from '@/payload-types';
import { NavActions } from '@/components/NavActions';
import {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical';
import { NavFavorites } from '@/components/Layout/NavFavorites';
import { parseAsInteger, useQueryState } from 'nuqs';
import { NavGroup } from '@/components/Layout/NavGroup';
import { IconDualScreen, IconFileDescription } from '@tabler/icons-react';

type CourseSidebarProps = {
  title: string;
  data: Module[];
} & React.ComponentProps<typeof Sidebar>;

export function CourseWithSidebar({
  title,
  data,
  ...props
}: CourseSidebarProps) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [lessonId, setLessonId] = useQueryState('lessonId');
  const [modules, setModules] = React.useState<Module[]>(data);
  const [content, setContent] = React.useState<
    SerializedEditorState | null | undefined
  >(null);
  const [lesson, setLesson] = React.useState<{
    id: string;
    title: string;
    content: SerializedEditorState | null | undefined;
  } | null>(null);

  const groups = modules.map((module) => ({
    title: module.title,
    icon: IconDualScreen,
    items: module.lessons
      .map(({ value }) => value)
      .filter((lesson) => typeof lesson === 'object')
      .map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        url: '#',
        icon: IconFileDescription,
      })),
  }));

  const nav = [
    {
      title: title,
      items: groups,
    },
  ];

  React.useEffect(() => {
    modules.map((item) => {
      const lessons = item.lessons
        .map(({ value }) => value)
        .filter((lesson) => typeof lesson === 'object');
      const currentLesson = lessons.filter((item) => item.id === lessonId);
      console.log('currentLesson:', JSON.stringify(currentLesson));
      setLesson({ ...currentLesson[0] });
      //setContent(currentLesson[0].content);
    });
  }, [lessonId, modules]);

  return (
    <>
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                  </div>
                  <div
                    onClick={() => {
                      setLesson(null);
                      setLessonId(null);
                    }}
                    className="flex flex-col gap-0.5 leading-none"
                  >
                    <span className="font-semibold">{title}</span>
                    <span className="">v1.0.0</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SearchForm />
        </SidebarHeader>
        <SidebarContent>
          {nav && (
            <>
              {nav.map((props) => (
                <NavGroup key={props.title} {...props} />
              ))}
            </>
          )}

          <SidebarGroup>
            <SidebarMenu>
              {modules.map((item, index) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={index === 1}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {item.title}{' '}
                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.lessons?.length ? (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.lessons
                            .map(({ value }) => value)
                            .filter((lesson) => typeof lesson === 'object')
                            .map((item) => (
                              <SidebarMenuSubItem key={item.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={item.id === lessonId}
                                >
                                  <a
                                    href="#"
                                    onClick={() => {
                                      //setContent(item.content);
                                      //setLesson({ ...item });
                                      setLessonId(item.id);
                                    }}
                                  >
                                    {item.title}
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <NavFavorites />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    {lesson ? lesson.title : title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions lesson={lesson} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {!lesson && (
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
          )}
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <RichText
              className="mx-auto max-w-[48rem]"
              data={lesson?.content}
              enableGutter={false}
            />
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
