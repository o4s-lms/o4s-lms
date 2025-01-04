import { admin } from '@/access/admin';
import { anyone } from '@/access/anyone';
import type { AccessArgs, CollectionConfig } from 'payload';

//import { generateEmailHTML } from '../email/generateEmailHTML'

export const Newsletter: CollectionConfig = {
  slug: 'newsletter-signups',
  access: {
    create: anyone,
    delete: admin,
    read: ({ req: { user } }: AccessArgs) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        and: [
          {
            email: {
              equals: user.email,
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
            email: {
              equals: user.email,
            },
          },
        ],
      };
    },
  },
  admin: {
    group: 'Newsletters',
    defaultColumns: ['name', 'email'],
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'text',
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          req.payload
            .sendEmail({
              from: process.env.SMTP_FROM,
              html: `
                <!doctype html>
                <html>
                  <body>
                    <h1>Welcome to the newsletter!</h1>
                    <p>${doc.name ? `Hi ${doc.name}` : 'Hi'}!</p>
                    <p>
                      We'll be in touch soon...
                    </p>
                  </body>
                </html>
              `,
              subject: 'Thanks for signing up!',
              to: doc.email,
            })
            .catch((error) => {
              console.error('Error sending email:', error);
            });
        }
      },
    ],
  },
};
