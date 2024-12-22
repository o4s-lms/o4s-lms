'use client';

import React, {
  createContext,
  useCallback,
  useContext,
} from 'react';

import type { NewsletterSignup } from '@/payload-types';
import type { NewsletterContext, Subscribe } from './types';

import { gql, NEWSLETTERSIGNUP } from './gql';
import { rest } from './rest';

const Context = createContext({} as NewsletterContext);

export const NewsletterProvider: React.FC<{
  api?: 'gql' | 'rest';
  children: React.ReactNode;
}> = ({ api = 'rest', children }) => {
  
  const subscribe = useCallback<Subscribe>(
    async (args) => {
      if (api === 'rest') {
        const newslettersignup = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/newsletter-signups`,
          args,
        );

        return newslettersignup;
      }

      if (api === 'gql') {
        const { newsletterSignup: newslettersignup } = await gql(`mutation {
          newsletterSignup(data: {
            name: "${args.name}",
            email: "${args.email}" }) {
            ${NEWSLETTERSIGNUP}
          }
        }`);

        
        return newslettersignup;
      }
    },
    [api],
  );

  return (
    <Context.Provider
      value={{
        subscribe,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseNewsletter<T = NewsletterSignup> = () => NewsletterContext;

export const useNewsletter: UseNewsletter = () => useContext(Context);
