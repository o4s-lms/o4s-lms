import { Access } from 'payload';

export const isAdmin: Access = ({ req: { user } }): boolean => {
  if (!user) return false;
  return user?.roles.includes('admin');
};

export const isTeacher: Access = ({ req: { user } }): boolean => {
  if (!user) return false;
  return user?.roles.includes('teacher');
};

export const isStudent: Access = ({ req: { user } }): boolean => {
  if (!user) return false;
  return user?.roles.includes('student');
};

export const hasRole: Access = (
  { req: { user } },
  role?: 'admin' | 'user' | 'student' | 'teacher',
): boolean => {
  if (!user || !role) return false;
  return user.roles.includes(role);
};

export const isSameUser: Access = ({ req: { user } }, id?: string): boolean => {
  if (!user || !id) return false;
  return user.id.toString() === id;
};
