'use server';

import { createPayloadClient } from '@/lib/payload';
import type { SupportTicket } from '@/payload-types';

export async function createSupportTicket(data: Partial<SupportTicket>): Promise<SupportTicket | null> {
  const payload = await createPayloadClient();

  const ticket = await payload.create({
    collection: 'support-tickets',
    data: data,
  })

  return ticket ?? null
}