import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserFavorites, createUserFavorites } from '@/utilities/userFavorites';
import { toast } from 'sonner';

export interface FavoriteMutationData {
  objectType: 'pages' | 'posts' | 'courses' | 'lessons';
  objectId: number;
  title: string;
  url?: string;
}

export function useUserFavorites() {
  return useQuery({
    queryKey: ['user-favorites'],
    queryFn: getUserFavorites,
  })
}

