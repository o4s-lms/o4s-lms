import type { Transaction } from '@/payload-types';

export type Create = (args: {
  email: string;
  orderId: string | null | undefined;
  customerId: string | null | undefined;
  transactionId: string | null | undefined;
  user: number | undefined;
  courses: number[];
  provider: string;
  amount: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
}) => Promise<Transaction>;

export interface CheckoutContext {
  create: Create;
  setTransaction: (transaction: null | Transaction) => void;
  transaction?: null | Transaction;
};
