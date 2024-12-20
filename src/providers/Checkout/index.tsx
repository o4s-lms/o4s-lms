'use client';

import { getPayload, type Where } from 'payload';
import configPromise from '@payload-config';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { Transaction } from '@/payload-types';
import type { CheckoutContext, Create } from './types';

import { useRouter } from 'next/navigation';
import { DEFAULT_LANGUAGE } from '@/tolgee/shared';
import { CourseOrderData } from '@/components/CheckoutPage/OrderPreview';

import { gql, TRANSACTION } from './gql';
import { rest } from './rest';

const Context = createContext({} as CheckoutContext);

export const CheckoutProvider: React.FC<{
  api?: 'gql' | 'rest';
  children: React.ReactNode;
}> = ({ api = 'rest', children }) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<CourseOrderData[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [transaction, setTransaction] = useState<null | Transaction>();
  //const { isLoaded, isSignedIn } = useAuth();
  const [slug] = useState(window.localStorage.getItem('slug') ?? '');
  const [language] = useState(window.localStorage.getItem('language') ?? DEFAULT_LANGUAGE);
  const [checkoutStep] = useState<number>(parseInt(window.localStorage.getItem('step') ?? '1', 10));
  let query: Where | null = null;

  if (slug === 'all') {
    query = {
      language: {
        equals: language,
      },
    };
  } else {
    query = {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          language: {
            equals: language,
          },
        },
      ],
    };
  }

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
          createTransaction(data: { email: "${args.email}", customerId: "${args.customerId}", transactionId: "${args.transactionId}", provider: "${args.provider}", discount: "${args.discount}", amount: "${args.amount}", status: "${args.status}" }) {
            ${TRANSACTION}
          }
        }`);

        setTransaction(transaction);
        return transaction;
      }
    },
    [api],
  );

  // On mount, get user and set
  useEffect(() => {
    const fetchCourse = async () => {
      setisLoading(true);
      let total = 0;
      let disc = 0;
      const payload = await getPayload({ config: configPromise });

      const result = await payload.find({
        collection: 'courses',
        limit: 1,
        pagination: false,
        where: query,
        select: {
          title: true,
          price: true,
        },
      });
      if (Array.isArray(result.docs) && result.docs.length > 0) {
        setCourses(result.docs);
        for (const data of result.docs) {
          total += data.price;
        }

        if (result.docs.length > 1) {
          disc = 1000 * result.docs.length;
          setDiscount(disc);
        }

        setAmount(total - disc);
      }
    };

    if (query !== null) {
      void fetchCourse();
      setisLoading(false);
    }
  }, [query]);

  const navigateToStep = useCallback(
    (step: number) => {
      const newStep = Math.min(Math.max(1, step), 3);
      //const showSignUp = isSignedIn ? 'true' : 'false';
      const showSignUp = 'false';

      router.push(
        `/checkout?step=${newStep}&slug=${slug}&showSignUp=${showSignUp}`,
        {
          scroll: false,
        },
      );
    },
    [router, slug],
  );

  /**useEffect(() => {
    if (isLoaded && !isSignedIn && checkoutStep > 1) {
      navigateToStep(1);
    }
  }, [isLoaded, isSignedIn, checkoutStep, navigateToStep]);*/

  return (
    <Context.Provider
      value={{
        create,
        navigateToStep,
        checkoutStep,
        setTransaction,
        transaction,
        courses,
        discount,
        amount,
        isLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseCheckout<T = Transaction> = () => CheckoutContext;

export const useCheckout: UseCheckout = () => useContext(Context);
