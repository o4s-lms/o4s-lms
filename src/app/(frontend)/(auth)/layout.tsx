import Link from 'next/link';
import { Logo } from '@/components/Brand/logo';
import * as React from 'react';
import styles from './auth.module.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="container relative h-dvh flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div
        className={`relative hidden h-full flex-col justify-center p-10 text-white lg:flex ${styles.bgGrid}`}
      >
        <Link
          href="/"
          className="flex items-center"
          title="O4S LMS - Open For Sustainability"
        >
          <Logo className="mr-2 h-[120px]" />
        </Link>
      </div>
      {children}
    </div>
  );
}
