import type { AccessArgs, CollectionConfig } from 'payload';

import { anyone } from '@/access/anyone';
import { admin } from '@/access/admin';
import { render } from '@react-email/components';
import { VerifyEmail } from '@/emails/verify';
import { ResetPasswordEmail } from '@/emails/reset-password';
import { DEFAULT_LANGUAGE, ALL_LANGUAGES as LANGUAGES } from '@/tolgee/shared';
import { getLocaleDisplayName } from '@/utilities/getLocaleDisplayName';

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: admin,
    create: anyone,
    delete: ({ req: { user } }: AccessArgs) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        and: [
          {
            id: {
              equals: user.id,
            },
          },
        ],
      };
    },
    read: ({ req: { user } }: AccessArgs) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        and: [
          {
            id: {
              equals: user.id,
            },
          },
        ],
      };
    },
    update: ({ req: { user } }: AccessArgs) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        and: [
          {
            id: {
              equals: user.id,
            },
          },
        ],
      };
    },
  },
  admin: {
    group: 'System',
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: {
    useAPIKey: true,
    tokenExpiration: 7200, // How many seconds to keep the user logged in
    //verify: true, // Require email verification before being allowed to authenticate
    maxLoginAttempts: 5, // Automatically lock a user out after X amount of failed logins
    lockTime: 600 * 1000, // Time period to allow the max login attempts
    // More options are available
    verify: {
      generateEmailHTML: async ({ token }) => {
        // Use the token provided to allow your user to verify their account
        return await render(<VerifyEmail token={token} />);
      },
    },
    forgotPassword: {
      generateEmailHTML: async ({ token }) => {
        // Use the token provided to allow your user to reset their password
        return await render(<ResetPasswordEmail token={token} />);
      },
    },
  },
  hooks: {
    afterLogin: [
      async ({ req, user }) => {
        await req.payload.update({
          collection: 'users',
          where: {
            id: {
              equals: user.id,
            },
          },
          data: {
            lastLogin: new Date().toISOString(),
          },
        });
      },
    ],
    afterChange: [
      async ({ req, doc, operation }) => {
        // Set enrolledAt on creation
        if (operation === 'create') {
          // update sub for zero
          if (!doc.sub) {
            await req.payload.update({
              collection: 'users',
              id: doc.id,
              data: {
                sub: doc.id,
              },
            });
          }
          // update eventual existing transactions
          await req.payload.update({
            collection: 'transactions',
            where: {
              email: {
                equals: doc.email,
              },
            },
            data: {
              user: doc,
            },
          });
        }
      },
    ],
  },
  fields: [
    {
      name: 'sub',
      type: 'text',
      saveToJWT: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      saveToJWT: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Student', value: 'student' },
        { label: 'Teacher', value: 'teacher' },
      ],
      required: true,
      defaultValue: 'user',
      access: {
        update: ({ req: { user } }) => {
          if (user?.role === 'admin') return true;
          return false;
        },
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'avatar',
      admin: {
        description:
          'Maximum size: 4MB. Accepted formats: .jpg, .jpeg, .png, .gif',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'language',
              type: 'select',
              admin: {
                position: 'sidebar',
              },
              options: LANGUAGES.map((locale) => ({
                label: getLocaleDisplayName(locale),
                value: locale,
              })),
              required: true,
              defaultValue: DEFAULT_LANGUAGE,
            },
            {
              name: 'theme',
              type: 'select',
              admin: {
                position: 'sidebar',
              },
              options: [
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
                { label: 'System', value: 'system' },
              ],
              required: true,
              defaultValue: 'system',
            },
            {
              name: 'notifications',
              type: 'group',
              fields: [
                {
                  name: 'assignments',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Assignment notifications',
                },
                {
                  name: 'courseUpdates',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Course update notifications',
                },
                {
                  name: 'achievements',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Achievement notifications',
                },
                {
                  name: 'security',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Security emails',
                },
                {
                  name: 'communication',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Communication emails',
                },
                {
                  name: 'marketing',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Marketing emails',
                },
              ],
              admin: {
                description: 'Email notifications for the user',
              },
            },
          ],
          label: 'Settings',
        },
      ],
    },
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
};
