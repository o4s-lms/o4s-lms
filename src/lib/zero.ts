import { Zero } from '@rocicorp/zero';
import { schema } from '@/zero/schema';
import { fetcher } from './fetcher';

export const zero = async () => {
  try {
    const req = await fetcher('/api/users/me');
    const { user, token } = await req.json();
    const z = new Zero({
      schema: schema,
      auth: token as unknown as string, // your JWT
      server: process.env.ZERO_PUBLIC_SERVER,
      userID: user?.id ?? ' ', // this must match the `sub` field from `token`
    });

    return z;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
