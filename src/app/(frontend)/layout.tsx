import type { Metadata } from 'next';

import { DM_Sans } from 'next/font/google';
import React from 'react';

import { Toaster } from 'sonner';
import { AdminBar } from '@/components/AdminBar';
import { Providers } from '@/providers';
import { InitTheme } from '@/providers/Theme/InitTheme';
import { draftMode } from 'next/headers';

const font = DM_Sans({ subsets: ['latin'] });
import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();

  return (
    <html className={font.className} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          {children}
        </Providers>
        <Toaster richColors={true} position="top-center" />
      </body>
    </html>
  );
}
