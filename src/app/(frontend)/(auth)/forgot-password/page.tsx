import Link from 'next/link';
import { headers as getHeaders } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ForgotPasswordForm } from '@/components/Auth/ForgotPasswordForm';
import { getTranslate } from '@/tolgee/server';
import { createPayloadClient } from '@/lib/payload';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'O4S LMS - Forgot Password',
  description: 'Sign in or create an account to get started with your courses.',
};

export default async function ForgotPasswordPage() {
  const headers = await getHeaders();
  const payload = await createPayloadClient();
  const { user } = await payload.auth({ headers });
  const t = await getTranslate();

  if (user) {
    redirect(
      `/dashboard?message=${encodeURIComponent('You are already signed un.')}`,
    );
  }

  return (
    <div className="flex h-full items-center justify-center p-10">
      <Button asChild className="absolute right-3 top-3" variant="ghost">
        <Link href="#" onClick={() => redirect('/')}>
          <Undo2 className="mr-2 h-4 w-4" /> {t('go-back')}
        </Link>
      </Button>
      <ForgotPasswordForm />
    </div>
  );
}
