import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthSignUpForm from '@/components/Auth/SignUpForm';
import { getTranslate } from '@/tolgee/server';
import { currentUser } from '@/lib/session';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'O4S LMS - Sign Up',
  description: 'Sign in or create an account to get started with your courses.',
};

export default async function SignUpPage() {
  const user = await currentUser();
  const t = await getTranslate();

  if (user) {
    redirect(
      `/dashboard?message=${encodeURIComponent('You are already signed un.')}`,
    );
  }

  return (
    <div className="flex h-full items-center justify-center p-10">
      <Button asChild className="absolute right-3 top-3" variant="ghost">
        <Link href="#">
          <Undo2 className="mr-2 h-4 w-4" /> {t('go-back')}
        </Link>
      </Button>
      <AuthSignUpForm />
    </div>
  );
}
