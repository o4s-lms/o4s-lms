'use client';

import * as React from 'react';
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  LineChart,
  Link,
  MoreHorizontal,
  Settings2,
  Star,
  StarOff,
  Trash,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavUser } from '@/components/NavUser';
import { LanguageSelector } from '../LangSelector.';
import { ThemeSelector } from '@/providers/Theme/ThemeSelector';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Lesson } from '@/payload-types';
import { FavoriteMutationData, useUserFavorites } from '@/hooks/useFavorites';
import {
  createUserFavorites,
  removeUserFavorites,
} from '@/utilities/userFavorites';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

const data = [
  [
    {
      label: 'Customize Page',
      icon: Settings2,
    },
    {
      label: 'Turn into wiki',
      icon: FileText,
    },
  ],
  [
    {
      label: 'Copy Link',
      icon: Link,
    },
    {
      label: 'Duplicate',
      icon: Copy,
    },
    {
      label: 'Move to',
      icon: CornerUpRight,
    },
    {
      label: 'Move to Trash',
      icon: Trash2,
    },
  ],
  [
    {
      label: 'Undo',
      icon: CornerUpLeft,
    },
    {
      label: 'View analytics',
      icon: LineChart,
    },
    {
      label: 'Version History',
      icon: GalleryVerticalEnd,
    },
    {
      label: 'Show delete pages',
      icon: Trash,
    },
    {
      label: 'Notifications',
      icon: Bell,
    },
  ],
  [
    {
      label: 'Import',
      icon: ArrowUp,
    },
    {
      label: 'Export',
      icon: ArrowDown,
    },
  ],
];

export function NavActions({
  lesson,
}: {
  lesson: { id: number; title: string } | null;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const { isPending, isError, data: favorites, error } = useUserFavorites();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  //if (lesson?.id === lessonId) setIsFavorite(true);

  
  console.log('pathname: ', pathname);
  console.log('id: ', lesson?.id);

  const createFavorite = useMutation({
    mutationFn: () => {
      const data: FavoriteMutationData = {
        objectType: 'lessons',
        objectId: lesson?.id as number,
        title: lesson?.title as string,
        url: `${pathname}?lessonId=${lesson?.id}`
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
      return removeUserFavorites(lesson?.id as number, 'lessons');
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

  const favorite = () => {
    if (!isFavorite) {
      createFavorite.mutate();
    } else {
      removeFavorite.mutate();
    }
  };

  //if (favorites?.map(({ id }) => ( id )).includes(lesson.id)) setIsFavorite(true);

  console.log('isFavorite:', isFavorite);

  return (
    <div className="flex items-center gap-2 text-sm">
      {lesson && (
        <Button
          onClick={favorite}
          variant="ghost"
          size="icon"
          className="h-7 w-7"
        >
          {favorites?.map(({ id }) => ( id )).includes(lesson.id) ? <StarOff /> : <Star />}
        </Button>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 data-[state=open]:bg-accent"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton>
                            <item.icon /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
      <LanguageSelector />
      <ThemeSelector />
      <NavUser />
    </div>
  );
}
