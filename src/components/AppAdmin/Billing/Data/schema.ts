import { z } from 'zod'

const transactionStatusSchema = z.union([
  z.literal('pending'),
  z.literal('awaiting'),
  z.literal('cancelled'),
  z.literal('declined'),
  z.literal('refunded'),
  z.literal('disputed'),
  z.literal('completed'),
])
export type TransactionStatus = z.infer<typeof transactionStatusSchema>

const transactionProviderSchema = z.union([
  z.literal('stripe'),
  z.literal('paypal'),
  z.literal('transfer'),
  z.literal('mbway'),
])

const transactionSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  transactionId: z.string().optional(),
  provider: transactionProviderSchema,
  amount: z.number(),
  discount: z.number(),
  tax: z.number(),
  total: z.number(),
  status: transactionStatusSchema,
  processed: z.boolean(),
  processedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Transaction = z.infer<typeof transactionSchema>

export const transactionListSchema = z.array(transactionSchema)