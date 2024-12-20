import { CourseOrderData } from '@/components/CheckoutPage/OrderPreview';
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
  status: string;
}) => Promise<Transaction>;

export type navigateToStep = (step: number) => Promise<void>;

export interface CheckoutContext {
  create: Create;
  navigateToStep: (step: number) => void;
  checkoutStep: number,
  setTransaction: (transaction: null | Transaction) => void;
  transaction?: null | Transaction;
  discount: number;
  amount: number;
  courses: CourseOrderData[];
  isLoading: boolean;
};
