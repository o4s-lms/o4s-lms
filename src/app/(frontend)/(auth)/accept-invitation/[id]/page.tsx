import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import type { Metadata } from 'next';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InvitationForm from '@/components/InvitationForm';
import * as React from 'react';
import { headers } from 'next/headers';
import { betterFetch } from '@better-fetch/fetch';
import type { Session } from 'better-auth/types';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'O4S LMS - Invitation',
  description: 'Accept the invitation to get started with your course.',
};

export default async function AcceptInvitationPage(props: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const { id } = await props.params;

  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      //baseURL: request.nextUrl.origin,
      baseURL: 'http://localhost:4321',
      headers: await headers(),
    },
  );

  /**const session = await auth.api.getSession({
    headers: await headers()
  });
  if (isPending)
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  //const { data: session } = await authClient.getSession();
  if (data?.session) setIsSignin(true);*/
  console.log(JSON.stringify(id));
  //if (!session) {
  return (
    <div className="flex h-full items-center justify-center p-10">
      <Button asChild className="absolute right-3 top-3" variant="ghost">
        <Link href="/">
          <Undo2 className="mr-2 h-4 w-4" /> Go back
        </Link>
      </Button>
      {!session ? (
        <AuthForm variant="invitation" id={id} />
      ) : (
        <InvitationForm id={id} />
      )}
    </div>
  );
}
