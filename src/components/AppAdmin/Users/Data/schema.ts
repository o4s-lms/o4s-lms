import { z } from 'zod';

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
]);
export type UserStatus = z.infer<typeof userStatusSchema>;

const userRoleSchema = z.union([
  z.literal('admin'),
  z.literal('user'),
  z.literal('student'),
  z.literal('teacher'),
]);

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  language: z.string(),
  role: userRoleSchema,
  lastLogin: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type User = z.infer<typeof userSchema>;

export const userListSchema = z.array(userSchema);
