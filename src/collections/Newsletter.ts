import { admin } from '@/access/admin';
import { anyone } from '@/access/anyone';
import { authenticated } from '@/access/authenticated';
import type { CollectionConfig } from 'payload';

//import { generateEmailHTML } from '../email/generateEmailHTML'

export const Newsletter: CollectionConfig = {
  slug: 'newsletter-signups',
  access: {
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
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
