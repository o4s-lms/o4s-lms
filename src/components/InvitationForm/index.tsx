'use client';

import { authClient } from '@/lib/auth.client';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import * as React from 'react';
import { Router, Loader2 as Spinner } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email(),
});

interface InvitationFormProps {
  id: string;
}

export const InvitationForm = ({ id }: InvitationFormProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function acceptInvitation() {
    setIsLoading(true);

    const { data, error } = await authClient.organization.acceptInvitation({
      invitationId: id,
    });

    setIsLoading(false);

    if (error) {
      return toast.error('Something went wrong.', {
        description: error.message,
      });
    }

    toast.success('Invitation accepted', {
      description: 'You can to access to your course.',
    });

    router.push('/dashboard');
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold capitalize tracking-tight text-white">
          Accept invitation
        </h1>
        <p className="text-muted-foregroun text-sm">
          Click on the button below to accept invitation
        </p>
      </div>
      <div className="grid gap-6">
        <Button
          onClick={() => acceptInvitation()}
          type="submit"
          className="capitalize"
          disabled={isLoading}
        >
          {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
          Accept invitation
        </Button>

        <p className="px-8 text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/terms"
          >
            Terms
          </Link>{' '}
          and{' '}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default InvitationForm;
