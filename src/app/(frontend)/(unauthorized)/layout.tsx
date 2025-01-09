import type { Metadata } from 'next';

import React from 'react';

import { Footer } from '@/Footer/Component';
import { Header } from '@/Header/Component';
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph';
import { getServerSideURL } from '@/utilities/getURL';
import { Support } from '@/components/Support';
import { buttonVariants } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
