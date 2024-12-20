import type { Transaction } from '@/payload-types';

export type Create = (args: {
  email: string;
  customerId: string | null | undefined;
  transactionId: string | null | undefined;
  user: number | undefined;
  courses: number[];
  provider: string;
  discount: number;
  amount: number;
  total: number;
  status: string;
}) => Promise<Transaction>;

export interface CheckoutContext {
  create: Create;
  setTransaction: (transaction: null | Transaction) => void;
  transaction?: null | Transaction;
};
