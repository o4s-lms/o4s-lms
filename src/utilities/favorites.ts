'use server';

import { headers as getHeaders } from 'next/headers';
import { createPayloadClient } from '@/lib/payload';
import { Favorite } from '@/payload-types';

export async function verifyIsFavorite(userId: string, lessonId: string) {
  const payload = await createPayloadClient();

  const favorite = await payload.find({
    collection: 'favorites',
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      and: [
        {
          user: {
            equals: userId,
          },
        },
        {
          objectType: {
            equals: 'lessons',
          },
        },
        {
          objectId: {
            equals: lessonId,
          },
        },
      ],
    },
  });

  if (favorite && favorite.docs.length > 0) return true;

  return false;
}
export async function getUserFavorites() {
  const headers = await getHeaders();
  const payload = await createPayloadClient();
  const { user } = await payload.auth({ headers });

  const favorites = await payload.find({
    collection: 'favorites',
    depth: 0,
    limit: 10,
    pagination: false,
    where: {
      user: {
        equals: user?.id,
      },
    },
  });

  return favorites.docs;
}

export async function getFavorites(
  userId: string | undefined,
): Promise<Favorite[] | null> {
  if (!userId) return null;

  const payload = await createPayloadClient();

  const favorites = await payload.find({
    collection: 'favorites',
    depth: 0,
    limit: 10,
    pagination: false,
    where: {
      user: {
        equals: userId,
      },
    },
  });

  return favorites.docs ?? null;
}

export async function createUserFavorites({
  objectType,
  objectId,
  title,
  url,
}: {
  objectType: 'pages' | 'posts' | 'courses' | 'lessons';
  objectId: string;
  title: string;
  url?: string;
}) {
  const headers = await getHeaders();
  const payload = await createPayloadClient();
  const { user } = await payload.auth({ headers });

  const favorite = await payload.create({
    collection: 'favorites',
    depth: 0,
    data: {
      user: user?.id as string,
      objectType: objectType,
      objectId: objectId,
      title: title,
      url: url,
    },
  });

  return favorite;
}

export async function removeUserFavorites(
  id: string,
  objectType: 'pages' | 'posts' | 'courses' | 'lessons',
) {
  const headers = await getHeaders();
  const payload = await createPayloadClient();
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

  return favorite.docs[0] ?? null;
}
