'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import type { Transaction } from '@/payload-types';
import type { CheckoutContext, Create } from './types';

import { gql, TRANSACTION } from './gql';
import { rest } from './rest';

const Context = createContext({} as CheckoutContext);

export const CheckoutProvider: React.FC<{
  api?: 'gql' | 'rest';
  children: React.ReactNode;
}> = ({ api = 'rest', children }) => {
  const [transaction, setTransaction] = useState<null | Transaction>();
  
  const create = useCallback<Create>(
    async (args) => {
      if (api === 'rest') {
        const transaction = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions`,
          args,
        );
        setTransaction(transaction);
        return transaction;
      }

      if (api === 'gql') {
        const { createTransaction: transaction } = await gql(`mutation {
          createTransaction(data: {
            email: "${args.email}",
            orderId: "${args.orderId}",
            customerId: "${args.customerId}",
            transactionId: "${args.transactionId}",
            user: "${args.user}",
            courses: "${args.courses}",
            provider: "${args.provider}",
            discount: "${args.discount}",
            amount: "${args.amount}",
            amount: "${args.amount}",
            tax: "${args.tax}",
            status: "${args.status}" }) {
            ${TRANSACTION}
          }
        }`);

        setTransaction(transaction);
        return transaction;
      }
    },
    [api],
  );

  return (
    <Context.Provider
      value={{
        create,
        setTransaction,
        transaction,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseCheckout<T = Transaction> = () => CheckoutContext;

export const useCheckout: UseCheckout = () => useContext(Context);
