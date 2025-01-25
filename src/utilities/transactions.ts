'use server';

import { createPayloadClient } from '@/lib/payload';
import { Course } from '@/payload-types';

export interface TransactionMutationData {
  email: string;
  name?: string;
  orderId?: string;
  transactionId?: string;
  customerId?: string;
  user?: string;
  courses: { relationTo: 'courses'; value: string | Course }[];
  provider: 'stripe' | 'paypal' | 'transfer' | 'mbway';
  discount: number;
  amount: number;
  tax: number;
  total: number;
  status:
    | 'pending'
    | 'awaiting'
    | 'cancelled'
    | 'declined'
    | 'refunded'
    | 'disputed'
    | 'completed';
}

export async function createTransaction(data: TransactionMutationData) {
  const payload = await createPayloadClient();

  const result = await payload.create({
    collection: 'transactions',
    depth: 0,
    data,
  });

  if (result) {
    //const lesson =  result.docs.map(({ lesson }) => lesson)
    //.filter((lesson) => typeof lesson === 'object')
    return result;
  }

  return null;
}
