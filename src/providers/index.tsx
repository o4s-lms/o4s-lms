'use client';

import React from 'react';

import { AuthProvider } from './Auth';
import { HeaderThemeProvider } from './HeaderTheme';
import { ThemeProvider } from './Theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }: Props) => {
  return (
    <AuthProvider
      // To toggle between the REST and GraphQL APIs,
      // change the `api` prop to either `rest` or `gql`
      api="rest" // change this to `gql` to use the GraphQL API
    >
      <ThemeProvider>
        <HeaderThemeProvider>
          <QueryClientProvider client={queryClient}>
            <NuqsAdapter>{children}</NuqsAdapter>
          </QueryClientProvider>
        </HeaderThemeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
