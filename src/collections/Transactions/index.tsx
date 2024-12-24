import type { CollectionConfig } from 'payload';

import { admin } from '@/access/admin';
import { anyone } from '@/access/anyone';
import { authenticated } from '@/access/authenticated';

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  access: {
    admin: admin,
    create: anyone,
    delete: admin,
    read: authenticated,
    update: admin,
  },
  admin: {
    defaultColumns: ['email', 'provider', 'transactionId', 'total'],
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
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
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'courses',
      type: 'relationship',
      hasMany: true,
      relationTo: 'courses',
      required: true,
    },
  ],
  timestamps: true,
};
