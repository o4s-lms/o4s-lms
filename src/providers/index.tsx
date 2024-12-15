import React from 'react';

import { AuthProvider } from './Auth';

import { TolgeeNextProvider } from '@/tolgee/client';
import { getStaticData } from '@/tolgee/shared';
import { getLanguage } from '@/tolgee/language';

import { HeaderThemeProvider } from './HeaderTheme';
import { ThemeProvider } from './Theme';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export const Providers: React.FC<{
  children: React.ReactNode;
}> = async ({ children }: Props) => {
  const locale = await getLanguage();
  // it's important you provide all data which are needed for initial render
  // so current language and also fallback languages + necessary namespaces
  const staticData = await getStaticData([locale, 'pt']);
  return (
    <AuthProvider
      // To toggle between the REST and GraphQL APIs,
      // change the `api` prop to either `rest` or `gql`
      api="rest" // change this to `gql` to use the GraphQL API
    >
      <TolgeeNextProvider language={locale} staticData={staticData}>
        <ThemeProvider>
          <HeaderThemeProvider>{children}</HeaderThemeProvider>
        </ThemeProvider>
      </TolgeeNextProvider>
    </AuthProvider>
  );
};
