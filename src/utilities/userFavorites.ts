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
        equals: user?.id,
      },
    },
  });

  return favorites.docs;
}

export async function createUserFavorites({
  objectType,
  objectId,
  title,
  url,
}: {
  objectType: 'pages' | 'posts' | 'courses' | 'lessons';
  objectId: number;
  title: string;
  url?: string;
}) {
  const payload = await getPayload({ config: configPromise });

  const favorite = await payload.create({
    collection: 'favorites',
    data: {
      objectType: objectType,
      objectId: objectId,
      title: title,
      url: url,
    },
  });

  return favorite;
}

export async function removeUserFavorites(id: number, objectType: 'pages' | 'posts' | 'courses' | 'lessons') {
  const headers = await getHeaders();
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers });

  const favorite = await payload.delete({
    collection: 'favorites',
    where: {
      and: [ 
        {
          user: {
            equals: user?.id,
          },
        },
        {
          objectType: {
            equals: objectType,
          },
        },
        {
          objectId: {
            equals: id,
          },
        },
      ],
    },
  });

  return favorite;
}
