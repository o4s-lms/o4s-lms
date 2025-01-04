import type { User } from '@/payload-types';

export const checkRole = (
  role: User['role'],
  user: User | null | undefined,
): boolean => {
  if (user) {
    return user.role === role;
  }

  return false;
};
