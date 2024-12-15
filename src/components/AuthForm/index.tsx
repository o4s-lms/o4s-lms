'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { signIn } from '@/lib/auth.client';
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

const formSchema = z.object({
  email: z.string().email(),
});

interface AuthFormProps {
  variant: 'signin' | 'signup' | 'invitation';
  id?: string;
}

export const AuthForm = ({ variant, id }: AuthFormProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    let callbackURL = `http://localhost:3000/dashboard`;

    if (variant === 'invitation') {
      callbackURL = `http://localhost:3000/accept-invitation/${id}`;
    }

    const { data, error } = await signIn.magicLink({
      email: values.email.toLowerCase(),
      callbackURL: callbackURL,
    });

    setIsLoading(false);

    if (error) {
      return toast.error('Something went wrong.', {
        description: error.message,
      });
    }

    return toast.success('Check your email', {
      description: 'We sent you a login link. Be sure to check your spam too.',
    });
  }

  // Messaging
  let primaryMessage = 'create an account to accept the invitation';
  let secondaryMessage = 'sign up';
  if (variant === 'signin') {
    primaryMessage = 'sign in';
    secondaryMessage = 'sign in';
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold capitalize tracking-tight text-white">
          {primaryMessage}
        </h1>
        <p className="text-muted-foregroun text-sm">
          Enter your email below to {primaryMessage}
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      required
                      placeholder="name@example.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <Button type="submit" className="capitalize" disabled={isLoading}>
              {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              {secondaryMessage} with Email
            </Button>
          </form>
        </Form>
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

export default AuthForm;
