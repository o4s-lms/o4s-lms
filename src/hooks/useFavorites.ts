import { useEffect, useState } from 'react';
import { Favorite } from '@/payload-types';
import { useAuth } from '@/providers/Auth';
import { getCachedFavorites } from '@/utilities/getFavorites';

export const useFavorites = () => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [favorities, setFavorites] = useState<Favorite[]>([]);
  const { user, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      setisLoading(true);

      const result = getCachedFavorites(user?.id);
      if (Array.isArray(result) && result.length > 0) {
        setFavorites(result);
      }
    };

    if (isLoaded && isSignedIn) {
      void fetchFavorites();
      setisLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  return { favorities, isLoading };
};
