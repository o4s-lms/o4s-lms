'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { User } from '@/payload-types';

export const PasswordForm = ({ currentUser }: { currentUser: User }) => {
  const [user, setUser] = React.useState<User>(currentUser);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const recoverPassword = React.useCallback(async (data: { email: string }) => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
      {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    )

    if (response.ok) {
      toast.info('We sent an email to reset your password.');
    } else {
      toast.error('Something went wrong.', {
        description: 'There was a problem while attempting to send you a password reset email. Please try again.',
      });
      setIsLoading(false);
    }
  }, [])

  return (
    <>
   
    <p>
    {'To change your password, '}
    <Button
      variant="link"
      onClick={() => recoverPassword({ email: user.email })}
      disabled={isLoading}
    >
      click here
    </Button>
    .
  </p>
  </>
  );
};

export default PasswordForm;
