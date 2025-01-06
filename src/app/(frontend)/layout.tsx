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
import { getLanguage } from '@/tolgee/language';
import { getStaticData } from '@/tolgee/shared';
import { TolgeeNextProvider } from '@/tolgee/client';
import { MessageCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Support } from '@/components/Support';
import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function RootLayout({ children }: Props) {
  const { isEnabled } = await draftMode();

  const locale = await getLanguage();
  // it's important you provide all data which are needed for initial render
  // so current language and also fallback languages + necessary namespaces
  const staticData = await getStaticData([locale]);

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
          <TolgeeNextProvider language={locale} staticData={staticData}>
            {children}
          </TolgeeNextProvider>
          <Support
            className={cn(
              buttonVariants({
                variant: 'secondary',
              }),
              'text-fd-secondary-foreground/80 fixed bottom-4 right-4 z-10 gap-2 rounded-xl bg-secondary/50 shadow-lg backdrop-blur-lg md:bottom-8 md:right-8',
            )}
          >
            <MessageCircle className="size-4" />
            Support
          </Support>
        </Providers>
        <Toaster richColors={true} position="top-center" />
      </body>
    </html>
  );
}
