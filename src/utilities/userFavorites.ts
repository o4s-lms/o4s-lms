'use server';

import { headers as getHeaders } from 'next/headers';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

export async function getUserFavorites() {
  const headers = await getHeaders();
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers });

  const favorites = await payload.find({
    collection: 'favorites',
    depth: 0,
    limit: 50,
    pagination: false,
    where: {
      user: {
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
  const headers = await getHeaders();
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers });

  const favorite = await payload.create({
    collection: 'favorites',
    data: {
      user: user?.id,
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
            equals: user,
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
