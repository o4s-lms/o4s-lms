import { headers as getHeaders } from 'next/headers';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

export async function getUserFavorites() {
  const headers = await getHeaders();
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers });

  const favorites = await payload.find({
    collection: 'favorites',
    limit: 50,
    pagination: false,
    where: {
      userId: {
        equals: user?.id
      }
    },
  });

  return favorites.docs;
}
