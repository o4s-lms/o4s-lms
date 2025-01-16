'use client';

import * as React from 'react';
import { useAuth } from '../Auth';
import { Favorite } from '@/payload-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFavorites, removeUserFavorites } from '@/utilities/favorites';
import { toast } from 'sonner';

interface FavoritesContextType {
  favorites: Favorite[] | null | undefined;
  isLoading: boolean;
  removeFavorite: (id: string) => Promise<Favorite | unknown>;
}

const FavoritesContext = React.createContext<FavoritesContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export function FavoritesProvider({ children }: Props) {
  //const [favorites, setFavorites] = React.useState<Favorite[] | null>(null);
  //const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites, isPending } = useQuery({
    queryKey: ['user-favorites'],
    queryFn: () => getFavorites(user?.id),
  });

  const {
    mutate: removeFavorite,
  } = useMutation({
    mutationFn: (id: string) => removeUserFavorites(id, 'lessons'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast.success('Favorite removed');
    },
    onError: (error) => {
      toast.error('Failed to remove favorite');
      console.error('Failed to remove favorite:', error);
    },
  });

  /**React.useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      if (user) {
        const select: Where = {
          user: {
            equals: user,
          },
        };

        const stringifiedQuery = stringify(
          {
            select, // ensure that `qs` adds the `select` property, too!
          },
          { addQueryPrefix: true },
        );

        try {
          const res = await fetcher(`/api/favorites${stringifiedQuery}`);
          const data = await res.json();
          setFavorites(data.docs);
        } catch (error) {
          console.log('Failed to get user favorites:', error);
          throw error;
        }
      }
      setIsLoading(false);
    };

    void fetchFavorites();
  }, [user]);*/

  const value: FavoritesContextType = React.useMemo(
    () => ({
      favorites: favorites,
      isLoading: isPending,
      removeFavorite,
    }),
    [favorites, isPending, removeFavorite],
  );

  return <FavoritesContext value={value}>{children}</FavoritesContext>;
}

export const useFavorites = () => {
  const favoritesContext = React.useContext(FavoritesContext);

  if (!favoritesContext) {
    throw new Error(
      'useTransactions has to be used within <TransactionsContext>',
    );
  }

  return favoritesContext;
};
