import type { CollectionConfig } from 'payload';

import { authenticated } from '@/access/authenticated';
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
              /**options: [
                { label: 'Português', value: 'pt' },
                { label: 'English', value: 'en' },
                { label: 'Français', value: 'fr' },
                { label: 'Españhol', value: 'es' },
              ],*/
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
