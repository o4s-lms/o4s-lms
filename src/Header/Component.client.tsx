'use client';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import type { Header } from '@/payload-types';

import { HeaderNav } from './Nav';
import { useAuth } from '@/providers/Auth';
import { MenuIcon, SearchIcon } from 'lucide-react';
import { LanguageSelector } from '@/components/LangSelector.';
import { ThemeSelector } from '@/providers/Theme/ThemeSelector';

interface HeaderClientProps {
  data: Header;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null);
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    setHeaderTheme(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme]);

  return (
    <header
      className="fixed left-0 right-0 z-[100] flex items-center justify-between border-b-[1px] border-neutral-900 bg-black/40 px-4 py-4 backdrop-blur-lg dark:bg-black/80"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <aside className="dark:text-white">
        <Link
          href={'/'}
          className="flex items-center gap-[4px]"
        >
          <p className="text-3xl font-bold">O4S</p>
          <Image
            src="/iconO4S-100x100.png"
            width={24}
            height={24}
            alt="Open For Sustainability"
            className="O4S LMS"
          />
          <p className="text-3xl font-bold">LMS</p>
        </Link>
      </aside>
      <HeaderNav data={data} />
      <aside className="flex items-center gap-4 dark:text-white">
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
        <LanguageSelector />
        <ThemeSelector />
        <Link
          href={isSignedIn ? '/dashboard' : '/sign-in'}
          className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            {isSignedIn ? 'Dashboard' : 'Get Started'}
          </span>
        </Link>
        {isSignedIn ? (
          <Link
            href="/log-out"
            className="relative inline-flex h-10 overflow-hidden rounded-full p-[6px]"
          >
            Logout
          </Link>
        ) : null}
        <MenuIcon className="md:hidden" />
      </aside>
    </header>
  );
};
