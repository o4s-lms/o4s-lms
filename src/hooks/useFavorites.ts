import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserFavorites, createUserFavorites } from '@/utilities/favorites';

export interface FavoriteMutationData {
  objectType: 'pages' | 'posts' | 'courses' | 'lessons';
  objectId: string;
  title: string;
  url?: string;
}

export function useUserFavorites() {
  return useQuery({
    queryKey: ['user-favorites'],
    queryFn: getUserFavorites,
  });
}
