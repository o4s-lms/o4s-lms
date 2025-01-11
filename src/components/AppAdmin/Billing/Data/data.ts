import {
  IconBrandPaypal,
  IconBuildingBank,
  IconTransactionEuro,
  IconBrandStripe,
} from '@tabler/icons-react'
import { TransactionStatus } from './schema'

export const statusTypes = new Map<TransactionStatus, string>([
  ['completed', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['pending', 'bg-neutral-300/40 border-neutral-300'],
  ['awaiting', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'cancelled',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
  [
    'declined',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
  [
    'refunded',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
  [
    'disputed',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const transactionProviders = [
  {
    label: 'Stripe',
    value: 'stripe',
    icon: IconBrandStripe,
  },
  {
    label: 'Paypal',
    value: 'paypal',
    icon: IconBrandPaypal,
  },
  {
    label: 'Bank Transfer',
    value: 'transfer',
    icon: IconBuildingBank,
  },
  {
    label: 'MB Way',
    value: 'mbway',
    icon: IconTransactionEuro,
  },
] as const

export const transactionStatus = [
  {
    label: 'pending',
    value: 'Pending',
  },
  {
    label: 'Awaiting',
    value: 'awaiting',
  },
  {
    label: 'Cancelled',
    value: 'cancelled',
  },
  {
    label: 'Declined',
    value: 'declined',
  },
  {
    label: 'Refunded',
    value: 'refunded',
  },
  {
    label: 'Disputed',
    value: 'disputed',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
] as const