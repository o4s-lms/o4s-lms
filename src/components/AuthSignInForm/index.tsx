'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { checkRole } from '@/access/checkRole';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface AuthFormProps {
  variant: 'signin' | 'signup' | 'invitation';
  id?: string;
}

export const AuthSignInForm = ({ variant, id }: AuthFormProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<null | string>(null);

  const searchParams = useSearchParams();
  const allParams = searchParams.toString()
    ? `?${searchParams.toString()}`
    : '';
  //const errorParam = React.useRef(searchParams.get('error'));
  const redirect = React.useRef(searchParams.get('redirect'));

  //if (errorParam) {
  //  toast.error(errorParam.current)
  //}
  const { login } = useAuth();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      setError(null);
      const user = await login(values);
      const isAdmin = checkRole(['admin'], user);
      setIsLoading(false);
      if (redirect?.current) {
        router.push(redirect.current);
      } else {
        if (isAdmin) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (_) {
      setError(
        'There was an error with the credentials provided. Please try again.',
      );
    }

    setIsLoading(false);

    if (error) {
      toast.error('Something went wrong.', {
        description: error,
      });
      return;
    }
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
          Enter your email and password below to {primaryMessage}
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
                      placeholder="Email Address"
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
            <Button type="submit" className="capitalize" disabled={isLoading}>
              {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              {secondaryMessage} with Email and Password
            </Button>
          </form>
        </Form>
        <p className="px-8 text-center text-xs text-muted-foreground">
          If you do not have account click to create one.{' '}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/sign-up"
          >
            Sign Up
          </Link>
        </p>
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

export default AuthSignInForm;
