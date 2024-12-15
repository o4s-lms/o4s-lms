import type { Metadata } from 'next';

import React from 'react';

import { Footer } from '@/Footer/Component';
import { Header } from '@/Header/Component';
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph';
import { getServerSideURL } from '@/utilities/getURL';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@joseantcordeiro',
  },
};
