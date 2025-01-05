import type { AccessArgs, CollectionConfig } from 'payload';

import { admin } from '@/access/admin';
import { anyone } from '@/access/anyone';

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
      async ({ data, originalDoc, operation }) => {

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

        return data; 
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        
        if (operation === 'create' && doc.status === 'completed') {
          const f = doc.user ? 'processTransaction' : 'waitUserSignUp';
       
          await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/functions/${f}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(doc),
        
          });
        }

        if (operation === 'update' && doc.processed === false) {
          
          switch (doc.status) {
            case 'completed':
              const f = doc.user ? 'processTransaction' : 'waitUserSignUp';
              await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/functions/${f}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
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
