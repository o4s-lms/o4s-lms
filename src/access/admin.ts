import type { AccessArgs } from 'payload';

import type { User } from '@/payload-types';
import { checkRole } from './checkRole';

type isAdmin = (args: AccessArgs<User>) => boolean;

export const admin: isAdmin = ({ req: { user } }) => {
  return checkRole(['admin'], user);
};
