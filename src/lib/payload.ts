import configPromise from '@payload-config';
import { getPayload } from 'payload';

export const createPayloadClient = async () => {
  return await getPayload({ config: configPromise });
}