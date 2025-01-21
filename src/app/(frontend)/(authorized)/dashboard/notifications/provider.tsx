'use client';

import { ZeroProvider } from '@rocicorp/zero/react';
import { Zero } from '@rocicorp/zero';
import { schema } from '@/zero/schema';
import { useEffect, useState } from 'react';
import { fetcher } from '@/lib/fetcher';

export const Z = ({ userID, children }: { userID: string; children: React.ReactNode }) => {
  const [token, setToken] = useState('');
  //const [userID, setUserID] = useState('');

  useEffect(() => {
    const t = async () => {
      const res = await fetcher(`/api/users/me`, {
        method: 'GET',
      });

      const { token } = await res.json();
      setToken(token);
      //setUserID(user.id);
    };

    return () => {
      t();
    };
  }, []);

  const z = new Zero({
    schema: schema,
    auth: token, // your JWT
    server: process.env.ZERO_PUBLIC_SERVER,
    userID: userID, // this must match the `sub` field from `token`
  });

  return <ZeroProvider zero={z}>{children}</ZeroProvider>;
};
