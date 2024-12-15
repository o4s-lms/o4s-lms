import Link from 'next/link';
import type { Metadata } from 'next';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoutPage } from '@/components/AuthLogoutPage';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'O4S LMS - Log Out',
  description: 'Sign in or create an account to get started with your courses.',
};

export default function LogOutPage() {
  return (
    <div className="flex h-full items-center justify-center p-10">
      <Button asChild className="absolute right-3 top-3" variant="ghost">
        <Link href="/">
          <Undo2 className="mr-2 h-4 w-4" /> Go back
        </Link>
      </Button>
      <LogoutPage />
    </div>
  );
}
