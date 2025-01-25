import Link from 'next/link';
import type { Metadata } from 'next';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoutPage } from '@/components/Auth/LogoutPage';
import { getTranslate } from '@/tolgee/server';
import { fetcher } from '@/lib/fetcher';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'O4S LMS - Log Out',
  description: 'Log out from your account.',
};

export default async function LogOutPage() {
  const t = await getTranslate();

  const req = await fetcher('/api/users/logout', {
    method: 'POST',
  });

  return (
    <div className="flex h-full items-center justify-center p-10">
      <Button asChild className="absolute right-3 top-3" variant="ghost">
        <Link href="#">
          <Undo2 className="mr-2 h-4 w-4" /> {t('go-back')}
        </Link>
      </Button>
      <LogoutPage
        success={req.ok ? 'You have been logged out successfully.' : null}
        error={req.ok ? null : 'Something went wrong. Please try again.'}
      />
    </div>
  );
}
