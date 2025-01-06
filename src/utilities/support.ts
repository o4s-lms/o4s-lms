'use server';

import { createPayloadClient } from '@/lib/payload';
import type { SupportTicket, User } from '@/payload-types';

export interface CreateSupportTicketData {
  url: string
  description: string
  category: 'other' | 'bug' | 'account' | 'payments' | 'learn'
  priority: 'low' | 'medium' | 'high'
  status: 'new' | 'done' | 'canceled' | 'unanswered'
  guest?: {
    name: string
    email: string
  }
  user?: User
}

export async function createSupportTicket(data: CreateSupportTicketData): Promise<SupportTicket | null> {
  const payload = await createPayloadClient();

  const ticket = await payload.create({
    collection: 'support-tickets',
    data: data,
  })

  return ticket ?? null
}