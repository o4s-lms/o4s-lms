import type { AccessArgs, CollectionConfig } from 'payload';
import * as crypto from 'crypto';
import { admin } from '@/access/admin';
import { anyone } from '@/access/anyone';
import { fetcher } from '@/lib/fetcher';
import { getLanguage } from '@/tolgee/language';

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  access: {
    admin: admin,
    create: anyone,
    delete: admin,
    read: ({ req: { user } }: AccessArgs) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        and: [
          {
            user: {
              equals: user.id,
            },
          },
        ],
      };
    },
    update: admin,
  },
  admin: {
    group: 'Orders',
    defaultColumns: ['email', 'provider', 'transactionId', 'total'],
    useAsTitle: 'email',
  },
  hooks: {
    beforeChange: [
      async ({ req, data, originalDoc, operation }) => {
        if (operation === 'create' && !data.user) {
          try {
            const user = await req.payload.find({
              collection: 'users',
              depth: 0,
              where: {
                email: {
                  equals: data.email,
                },
              },
            });
            if (user.docs.length > 0) {
              data.user = user.docs[0].id;
            } else {
              const currentLanguage = await getLanguage();
              const password = crypto.randomBytes(16).toString('hex');
              try {
                const result = await fetch(
                  `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `users API-Key ${process.env.PAYLOAD_ADMIN_API_KEY}`,
                    },
                    body: JSON.stringify({
                      name: data.name,
                      email: data.email,
                      password: password,
                      passwordConfirmation: password,
                      language: currentLanguage
                    }),
                  },
                );
                const user = await result.json();
                data.user = user.doc.id;
              } catch (error) {
                throw error;
              }
            }
          } catch (error) {
            throw error;
          }
        }
        // Handle status changes
        if (operation === 'update' && data.status && originalDoc.processed) {
          switch (data.status) {
            case 'disputed':
              // transaction disputed - revoke the student access
              break;
            case 'refunded':
              // transaction refunded - revoke the student access
              break;
          }
        }

        if (operation === 'update' && data.processed) {
          if (data.processed && !data.processedAt)
            data.processedAt = new Date().toISOString();
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create' && doc.status === 'completed') {
          await fetcher(`/api/functions/processTransaction`, {
            method: 'POST',
            body: JSON.stringify(doc),
          });
        }

        if (operation === 'update' && doc.processed === false) {
          switch (doc.status) {
            case 'completed':
              await fetcher(`/api/functions/processTransaction`, {
                method: 'POST',
                body: JSON.stringify(doc),
              });
              break;
            case 'disputed':
              // transaction disputed - revoke the student access
              break;
            case 'refunded':
              // transaction refunded - revoke the student access
              break;
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'orderId',
      type: 'text',
    },
    {
      name: 'customerId',
      type: 'text',
    },
    {
      name: 'transactionId',
      type: 'text',
    },
    {
      name: 'provider',
      type: 'select',
      options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'Paypal', value: 'paypal' },
        { label: 'Bank Transfer', value: 'transfer' },
        { label: 'MB Way', value: 'mbway' },
      ],
      required: true,
      defaultValue: 'paypal',
    },
    {
      name: 'amount',
      type: 'number',
      min: 0,
      required: true,
      defaultValue: 0,
    },
    {
      name: 'discount',
      type: 'number',
      min: 0,
      required: true,
      defaultValue: 0,
    },
    {
      name: 'tax',
      type: 'number',
      min: 0,
      required: true,
      defaultValue: 0,
    },
    {
      name: 'total',
      type: 'number',
      min: 0,
      required: true,
      defaultValue: 0,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Awaiting Payment ', value: 'awaiting' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Declined', value: 'declined' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Disputed', value: 'disputed' },
        { label: 'Completed', value: 'completed' },
      ],
      required: true,
      defaultValue: 'pending',
    },
    {
      name: 'processed',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'processedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'invoice',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'pdf',
      type: 'relationship',
      relationTo: 'invoice',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'courses',
      type: 'relationship',
      hasMany: true,
      relationTo: ['courses'],
      required: true,
    },
  ],
  timestamps: true,
};
