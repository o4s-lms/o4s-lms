import { getPayload } from 'payload';
import config from '@payload-config';

export const createPayloadClient = async () => {
  return await getPayload({ config });
};
