import { headers as getHeaders } from 'next/headers';
import { User } from '@/payload-types';
import { createPayloadClient } from './payload';

export async function currentUser(): Promise<User | null> {
  const headers = await getHeaders();
  const payload = await createPayloadClient();

  const { user } = await payload.auth({ headers });

  return user;
}
