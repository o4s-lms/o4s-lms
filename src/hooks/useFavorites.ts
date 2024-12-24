import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserFavorites } from '@/utilities/getUserFavorites';

export function useUserFavorites() {
  return useQuery({
    queryKey: ['user-favorites'],
    queryFn: getUserFavorites,
  })
}

