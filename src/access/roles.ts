import { Access, AccessArgs } from 'payload';

export const isAdmin: Access = ({ req: { user } }: AccessArgs): boolean => {
  if (!user) return false;
  return user?.role === 'admin';
};

export const isTeacher: Access = ({ req: { user } }: AccessArgs): boolean => {
  if (!user) return false;
  return user?.role === 'teacher';
};

export const isAdminOrTeacher: Access = ({
  req: { user },
}: AccessArgs): boolean => {
  if (!user) return false;
  return user?.role === 'admin' || user?.role === 'teacher';
};

export const isStudent: Access = ({ req: { user } }: AccessArgs): boolean => {
  if (!user) return false;
  return user?.role === 'student';
};

export const hasRole: Access = (
  { req: { user } }: AccessArgs,
  role?: 'admin' | 'user' | 'student' | 'teacher',
): boolean => {
  if (!user || !role) return false;
  return user.role === role;
};

export const isSameUser: Access = (
  { req: { user } }: AccessArgs,
  id?: string,
): boolean => {
  if (!user || !id) return false;
  return user.id.toString() === id;
};
