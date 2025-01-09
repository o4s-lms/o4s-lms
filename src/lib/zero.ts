'use server';

import { headers as getHeaders } from 'next/headers';
import { Zero } from '@rocicorp/zero';
import { schema } from '@/zero/schema'

export const zero = async () => {
  const headers = await getHeaders();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        cookie: headers.get('cookie') || '',
      },
    },
  );

  const { user, token } = await res.json();
  
  return new Zero({
    schema: schema,
    auth: token, // your JWT
    userID: user.id, // this must match the `sub` field from `token`
  });
};
