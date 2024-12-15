import type { CollectionConfig } from 'payload';

import { authenticated } from '@/access/authenticated';
import { anyone } from '@/access/anyone';

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
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
      generateEmailHTML: ({ req, token, user }) => {
        // Use the token provided to allow your user to verify their account
        const verifyURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify?token=${token}`;

        return `
          <!doctype html>
          <html>
            <body>
              <h1>Verify your email</h1>
              <p>Hello, ${user.email}!</p>
              <p>Click below to verify your email.</p>
              <p>
                <a href="${verifyURL}">${verifyURL}</a>
              </p>
            </body>
          </html>
        `;
      },
    },
    forgotPassword: {
      generateEmailHTML: ({ req, token, user }) => {
        // Use the token provided to allow your user to reset their password
        const resetPasswordURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`;

        return `
          <!doctype html>
          <html>
            <body>
              <h1>Reset your password!</h1>
              <p>Hello, ${user.email}!</p>
              <p>Click below to reset your password.</p>
              <p>
                <a href="${resetPasswordURL}">${resetPasswordURL}</a>
              </p>
            </body>
          </html>
        `;
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
      ],
      required: true,
      defaultValue: ['user'],
    },
  ],
  timestamps: true,
};
