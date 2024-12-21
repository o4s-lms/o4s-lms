import React from 'react';

import { AuthProvider } from './Auth';
import { HeaderThemeProvider } from './HeaderTheme';
import { ThemeProvider } from './Theme';

type Props = {
  children: React.ReactNode;
};

export const Providers: React.FC<{
  children: React.ReactNode;
}> = async ({ children }: Props) => {
  return (
    <AuthProvider
      // To toggle between the REST and GraphQL APIs,
      // change the `api` prop to either `rest` or `gql`
      api="rest" // change this to `gql` to use the GraphQL API
    >
      <ThemeProvider>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
