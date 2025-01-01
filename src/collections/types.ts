import type { User } from '@/payload-types';
import { PayloadRequest } from 'payload';

export type AccessArgs = {
  req: {
    user?: User | null;
  };
};

export interface BeforeChangeHookData {
  data: {
    user?: string | number;
    [key: string]: unknown;
  };
  req: PayloadRequest;
}
