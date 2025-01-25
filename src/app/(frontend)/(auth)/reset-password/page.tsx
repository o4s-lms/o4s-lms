import Link from 'next/link';
import type { Metadata } from 'next';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResetPasswordForm from '@/components/Auth/ResetPasswordForm';
import { getTranslate } from '@/tolgee/server';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Reset Your Password | O4S LMS',
  description: 'Reset Your Password.',
};

export default async function ResetPasswordPage() {
  const t = await getTranslate();
  return (
    <div className="flex h-full items-center justify-center p-10">
      <Button asChild className="absolute right-3 top-3" variant="ghost">
        <Link href="#">
          <Undo2 className="mr-2 h-4 w-4" /> {t('go-back')}
        </Link>
      </Button>
      <ResetPasswordForm />
    </div>
  );
}
