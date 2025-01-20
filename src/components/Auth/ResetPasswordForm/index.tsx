'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 as Spinner } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/Auth';
import { fetcher } from '@/lib/fetcher';

const formSchema = z
  .object({
    token: z.string().nullable(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { login } = useAuth();

  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: token,
      password: '',
      passwordConfirmation: '',
    },
  });

  // when Next.js populates token within router,
  // reset form with new token value
  React.useEffect(() => {
    form.reset({ token: token || undefined });
  }, [form, token]);

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setIsLoading(true);
      const response = await fetcher(
        `/api/users/reset-password`,
        {
          body: JSON.stringify(values),
          method: 'POST',
        },
      );

      if (response.ok) {
        const json = await response.json();

        // Automatically log the user in after they successfully reset password
        try {
          const user = await login({ email: json.user.email, password: values.password });
          await fetcher(
            `/api/functions/lastLogin?userId=${user.id}`,
            {
              method: 'POST',
            },
          );
        } catch (error) {
          throw error;
        }

        await fetcher(
          `/api/functions/emailPasswordUpdated?email=${json.user.email}`,
          {
            method: 'POST',
          },
        );

        setIsLoading(false);

        // Redirect them to `/dashboard` with success message in URL
        router.push(`/dashboard?success=${encodeURIComponent('Password reset successfully.')}`);
      } else {
        setIsLoading(false);
        toast.error(
          'There was a problem while resetting your password. Please try again later.',
        );
      }
    },
    [router, login],
  );

  /**React.useEffect(() => {
    if (user === null) {
      router.push(`/sign-in?unauthorized=account`);
    }

    // Once user is loaded, reset form to have default values
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        password: '',
        passwordConfirmation: '',
      });
    }
  }, [user, router, form, changePassword]);*/

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
        <h1>Reset Password</h1>
        <p>Please enter a new password below.</p>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  required
                  type="password"
                  placeholder="Password"
                  {...field}
                  className="w-full"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  required
                  type="password"
                  placeholder="Confirm Password"
                  {...field}
                  className="w-full"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        <input type="hidden" {...form.register('token')} />

        <Button type="submit" className="capitalize" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Processing' : 'Change password'}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
