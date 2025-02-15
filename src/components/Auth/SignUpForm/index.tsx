'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Check, ChevronsUpDown, Loader2 as Spinner } from 'lucide-react';
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
import { useTolgee, useTranslate } from '@tolgee/react';
import { PasswordInput } from '@/components/PasswordInput';
import { fetcher } from '@/lib/fetcher';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { languages } from '@/lib/constants';

const formSchema = z
  .object({
    name: z.string(),
    language: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

export const AuthSignUpForm = () => {
  const { t } = useTranslate();
  const tolgee = useTolgee(['language']);
  const currentLanguage = tolgee.getLanguage();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<null | string>(null);

  const searchParams = useSearchParams();
  const allParams = searchParams.toString()
    ? `?${searchParams.toString()}`
    : '';

  const { login } = useAuth();
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      language: currentLanguage,
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const response = await fetcher(`/api/users`, {
      body: JSON.stringify(values),
      method: 'POST',
    });

    if (!response.ok) {
      const message =
        response.statusText || 'There was an error creating the account.';
      setError(message);
      setIsLoading(false);
      toast.error('Something went wrong.', {
        description: error,
      });
      return;
    }

    const redirect = searchParams.get('redirect');

    const { email, password } = values;

    try {
      await login({ email, password });
      setIsLoading(false);
      if (redirect) {
        router.push(redirect);
      } else {
        router.push(
          `/dashboard/settings/account?success=${encodeURIComponent('Account created successfully')}`,
        );
      }
    } catch (_) {
      setIsLoading(false);
      setError(
        'There was an error with the credentials provided. Please try again.',
      );
    }

    if (error) {
      toast.error('Something went wrong.', {
        description: error,
      });
      return;
    }

    return toast.success('Check your email', {
      description:
        'We sent you a link to confirm the email address. Be sure to check your spam too.',
    });
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold capitalize tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foregroun text-sm">
          Enter your data below to create an account
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      required
                      placeholder="Your name"
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
              name="language"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? languages.find(
                                (language) => language.value === field.value,
                              )?.label
                            : 'Select language'}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search language..." />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue('language', language.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2',
                                    language.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {language.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <PasswordInput
                      required
                      placeholder="e.g., S3cur3P@ssw0rd"
                      className="w-full"
                      {...field}
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
                    <PasswordInput
                      required
                      placeholder="Confirm Password"
                      className="w-full"
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
              Sign Up
            </Button>
          </form>
        </Form>
        <p className="px-8 text-center text-xs text-muted-foreground">
          If you have a account click to login.{' '}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/sign-in"
          >
            Sign In
          </Link>
        </p>
        <p className="px-8 text-center text-xs text-muted-foreground">
          {t('clicking-continue')}{' '}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/terms"
          >
            {t('terms')}
          </Link>{' '}
          {t('and')}{' '}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/privacy"
          >
            {t('privacy')}
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default AuthSignUpForm;
