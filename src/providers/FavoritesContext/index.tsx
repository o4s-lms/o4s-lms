'use client';

import React, { useEffect, useState } from 'react';
import { BulkOperationResult, Where } from 'payload';
import { useAuth } from '../Auth';
import { stringify } from 'qs-esm';
import { fetcher } from '@/lib/fetcher';
import { Favorite, FavoritesSelect } from '@/payload-types';
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { removeUserFavorites } from '@/utilities/favorites';
import { toast } from 'sonner';

interface FavoritesContextType {
  favorites: Favorite[] | null;
  isLoading: boolean;
  removeFavorite: UseMutationResult<BulkOperationResult<"favorites", FavoritesSelect<false> | FavoritesSelect<true>>, Error, {
    id: string;
}, unknown
}

const FavoritesContext = React.createContext<FavoritesContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function TransactionsProvider({ children }: Props) {
  const [favorites, setFavorites] = useState<Favorite[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const removeFavorite = useMutation({
    mutationFn: ({ id }: { id: string }) => removeUserFavorites(id, 'lessons'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast.success('Favorite removed');
    },
    onError: (error) => {
      toast.error('Failed to remove favorite');
      console.error('Failed to remove favorite:', error);
    },
  });

  useEffect(() => {
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
          const res = await fetcher(`/api/favorites${stringifiedQuery}`)
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
  }, [user]);

  return (
    <FavoritesContext value={{ favorites, isLoading, removeFavorite }}>
      {children}
    </FavoritesContext>
  );
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
