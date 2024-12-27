import Link from 'next/link';
import { headers as getHeaders } from 'next/headers';
import type { Metadata } from 'next';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { getTranslate } from '@/tolgee/server';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'O4S LMS - Sign In',
  description: 'Verify your account to get started with your courses.',
};

export default async function Verify({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  const t = await getTranslate();

  const result = await payload.verifyEmail({
    collection: 'users',
    token: token as string,
  });

  if (!result) {
    toast.error(t('error-something'));
    redirect(`/sign-up`);
  }

  if (user && result) {
    redirect(
      `/dashboard/account?message=${encodeURIComponent(t('already-logged-in'))}`,
    );
  } else {
    redirect(
      `/sign-in?message=${encodeURIComponent(t('email-is-verified'))}`,
    );
  }

  return (
    <div className="flex h-full items-center justify-center p-10">
      <Button asChild className="absolute right-3 top-3" variant="ghost">
        <Link href="/">
          <Undo2 className="mr-2 h-4 w-4" /> {t('go-back')}
        </Link>
      </Button>
    </div>
  );
}
