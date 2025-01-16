'use client';

import * as React from 'react';
import { sidebarData } from '@/components/Layout/Data/AppSidebar';
import {
  IconDualScreen,
  IconFileDescription,
  IconStar,
} from '@tabler/icons-react';
import { SidebarData } from '@/components/Layout/types';
import type { Favorite, Module } from '@/payload-types';
import { useTranslate } from '@tolgee/react';

interface AppSideBarDataContextType {
  nav: SidebarData;
}

const AppSideBarDataContext =
  React.createContext<AppSideBarDataContextType | null>(null);

interface Props {
  title?: string;
  modules?: Module[];
  favorites?: Favorite[];
  children: React.ReactNode;
}

export function AppSideBarDataProvider({
  title,
  modules,
  favorites,
  children,
}: Props) {
  const [nav, setNav] = React.useState<SidebarData | null>(null);
  const { t } = useTranslate();
  //const [favorites, setFavorites] = React.useState<Favorite[] | null>(null);
  //const [isLoading, setIsLoading] = React.useState<boolean>(false);

  /**const { data: modules, isPending } = useQuery({
    queryKey: ['sidebar-data-modules'],
    queryFn: () => getModulesByCourseId(courseId),
  });*/

  React.useEffect(() => {
    async function getNav() {
      const groups = await sidebarData();
      if (favorites && favorites.length > 0) {
        const favs = favorites?.map((favorite) => ({
          title: favorite?.title,
          url: favorite.url,
          icon: IconStar,
          isFavorite: true,
        }));

        const favoritesNav = {
          title: t('favorites'),
          items: favs,
        };
        groups.navGroups.push(favoritesNav);
      }

      if (title) {
        const tmp = modules?.map((module) => ({
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
        const courseNav = {
          title: title,
          items: tmp,
        };

        groups.navGroups.unshift(courseNav);
      }

      setNav(groups);
    }

    void getNav();
  }, [favorites, modules, t, title]);

  const value: AppSideBarDataContextType = React.useMemo(
    () => ({
      nav: nav,
    }),
    [nav],
  );

  return (
    <AppSideBarDataContext value={value}>{children}</AppSideBarDataContext>
  );
}

export const useAppSideBarData = () => {
  const appSideBarDataContext = React.useContext(AppSideBarDataContext);

  if (!appSideBarDataContext) {
    throw new Error(
      'useAppSideBarData has to be used within <AppSideBarDataContext>',
    );
  }

  return appSideBarDataContext;
};
