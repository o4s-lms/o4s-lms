'use client';
import Link from 'next/link';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/Auth';
import { useTranslate } from '@tolgee/react';
import { Fragment, useEffect } from 'react';

export function LogOutPageClient() {
  const { logout } = useAuth();
  const { t } = useTranslate();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
    }

    doLogout();

  }, []);

  return (
    <div className="flex h-full items-center justify-center p-10">
      <Button asChild className="absolute right-3 top-3" variant="ghost">
        <Link href="/">
          <Undo2 className="mr-2 h-4 w-4" /> {t('go-back')}
        </Link>
      </Button>
      <Fragment>
        <div>
          <p>
            {'What would you like to do next? '}
            <Link
              href="/"
              className="text-lg font-bold transition-colors hover:text-primary"
            >
              Click here
            </Link>
            {` to go to the home page. To log back in, `}
            <Link
              href="/sign-in"
              className="text-lg font-bold transition-colors hover:text-primary"
            >
              click here
            </Link>
            .
          </p>
        </div>
      </Fragment>
    </div>
  );
}
