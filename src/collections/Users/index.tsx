import type { CollectionConfig } from 'payload';

import { authenticated } from '@/access/authenticated';
import { anyone } from '@/access/anyone';
import { admin } from '@/access/admin';
import { render } from '@react-email/components';
import { VerifyEmail } from '@/emails/verify';
import { ResetPasswordEmail } from '@/emails/reset-password';

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: admin,
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'System',
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: {
    tokenExpiration: 7200, // How many seconds to keep the user logged in
    //verify: true, // Require email verification before being allowed to authenticate
    maxLoginAttempts: 5, // Automatically lock a user out after X amount of failed logins
    lockTime: 600 * 1000, // Time period to allow the max login attempts
    // More options are available
    verify: {
      generateEmailHTML: async ({ req, token, user }) => {
        // Use the token provided to allow your user to verify their account
        return await render(<VerifyEmail token={token} />);
      },
    },
    forgotPassword: {
      generateEmailHTML: async ({ req, token, user }) => {
        // Use the token provided to allow your user to reset their password
        return await render(<ResetPasswordEmail token={token} />);
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Student', value: 'student' },
        { label: 'Teacher', value: 'teacher' },
      ],
      required: true,
      defaultValue: ['user'],
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Maximum size: 4MB. Accepted formats: .jpg, .jpeg, .png, .gif',
      },
    },
    {
      name: 'settings',
      type: 'relationship',
      relationTo: 'settings',
      /**admin: {
        condition: (data: { roles?: string[] }) => data.roles?.includes('user'),
      },*/
    },
    {
      name: 'lastLogin',
      type: 'date',
    }
  ],
  timestamps: true,
};
