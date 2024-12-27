import Link from 'next/link';
import { headers as getHeaders } from 'next/headers';
import type { Metadata } from 'next';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthSignInForm from '@/components/AuthSignInForm';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { redirect } from 'next/navigation';
import { getTranslate } from '@/tolgee/server';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'O4S LMS - Sign In',
  description: 'Sign in or create an account to get started with your courses.',
};

export default async function SigninPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  const t = await getTranslate();

  if (user) {
    redirect(
      `/dashboard/account?message=${encodeURIComponent(t('already-logged-in'))}`,
    );
  }

  return (
    <div className="flex h-full items-center justify-center p-10">
      <Button asChild className="absolute right-3 top-3" variant="ghost">
        <Link href="/">
          <Undo2 className="mr-2 h-4 w-4" /> {t('go-back')}
        </Link>
      </Button>
      <AuthSignInForm />
    </div>
  );
}
