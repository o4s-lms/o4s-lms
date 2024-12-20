import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { unstable_cache } from 'next/cache';

async function getFavorites(userId: number, depth = 0) {
  const payload = await getPayload({ config: configPromise });

  const favorites = await payload.find({
    collection: 'favorites',
    limit: 50,
    pagination: false,
    where: {
      userId: {
        equals: userId
      }
    },
  });

  return favorites.docs;
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedFavorites = (userId: number, depth = 0) =>
  unstable_cache(async () => getFavorites(userId, depth), [String(userId)], {
    tags: [`favorities_${String(userId)}`],
  });