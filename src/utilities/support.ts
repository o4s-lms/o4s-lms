'use server';

import { createPayloadClient } from '@/lib/payload';
import type { SupportTicket, User } from '@/payload-types';

export interface CreateSupportTicketData {
  url: string
  category: 'other' | 'bug' | 'account' | 'payments' | 'learn'
  priority: 'low' | 'medium' | 'high'
  status: 'new' | 'done' | 'canceled' | 'unanswered'
  guest?: {
    name: string
    email: string
  }
  user?: User
  key?: string
  messages: {
    message: string
    timestamp: string
    sender: 'guest' | 'user' | 'system'
  }[]
}

export async function createSupportTicket(data: CreateSupportTicketData): Promise<SupportTicket | null> {
  const payload = await createPayloadClient();

  const ticket = await payload.create({
    collection: 'support-tickets',
    data: data,
  })

  return ticket ?? null
}

export async function getSupportTickets(): Promise<SupportTicket[]> {
  const payload = await createPayloadClient();

  const tickets = await payload.find({
    collection: 'support-tickets',
    depth: 1,
  })

  return tickets.docs
}