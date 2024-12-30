'use client';

import {
  ArrowUpRight,
  Link,
  MoreHorizontal,
  StarOff,
  Trash2,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useUserFavorites } from '@/hooks/useFavorites';
import { useTranslate } from '@tolgee/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeUserFavorites } from '@/utilities/userFavorites';
import { toast } from 'sonner';

export function NavFavorites() {
  const { isMobile } = useSidebar();
  const { t } = useTranslate();
  const { isPending, isError, data: favorites, error } = useUserFavorites();
  const queryClient = useQueryClient();

  const removeFavorite = useMutation({
    mutationFn: ({ id }: { id: number }) => removeUserFavorites(id, 'lessons'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast.success('Favorite removed');
    },
    onError: (error) => {
      toast.error('Failed to remove favorite');
      console.error('Failed to remove favorite:', error);
    },
  });

  const remove = (id: number) => {
    removeFavorite.mutate({ id });
  };

  if (isPending) return null;

  console.log('Favorites: ', JSON.stringify(favorites));

  return (
    <>
      {!isError && favorites?.length > 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>{t('favorites')}</SidebarGroupLabel>
          <SidebarMenu>
            {favorites?.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild>
                  <a href={item.url} title={item.title}>
                    {/**<span>{item.emoji}</span>*/}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">{t('more')}</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 rounded-lg"
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                  >
                    <DropdownMenuItem onClick={() => remove(item.id)}>
                      <StarOff className="text-muted-foreground" />
                      <span>{t('remove-from-favorites')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link className="text-muted-foreground" />
                      <span>{t('copy-link')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ArrowUpRight className="text-muted-foreground" />
                      <span>{t('open-in-new-tab')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>{t('delete')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <MoreHorizontal />
                <span>{t('more')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  );
}
