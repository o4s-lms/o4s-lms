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
import { useTranslate } from '@tolgee/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTheme } from '@/providers/Theme';
import { useTolgee } from '@tolgee/react';
import { setLanguage } from '@/tolgee/language';
import { PasswordInput } from '@/components/PasswordInput';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const AuthSignInForm = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const tolgee = useTolgee(['language']);
  const currentLanguage = tolgee.getLanguage();
  const { t } = useTranslate();
  const { setTheme, theme } = useTheme();

  const searchParams = useSearchParams();
  const redirect = React.useRef(searchParams.get('redirect'));
  const message = searchParams.get('message');
  const error = searchParams.get('error');

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
  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setIsLoading(true);

      try {
        const user = await login(values);
        const isAdmin = checkRole('admin', user);
        if (theme !== user.theme)
          setTheme(user.theme === 'system' ? null : user.theme);
        if (currentLanguage !== user.language) setLanguage(user.language);
        /**await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/functions/lastLogin?userId=${user.id}`,
          {
            method: 'POST',
            credentials: 'include',
          },
        );*/
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
        toast.error(t('error-something'), {
          description: t('error-credentials'),
        });
      }

      setIsLoading(false);
    },
    [currentLanguage, login, router, setTheme, t, theme],
  );

  // TODO color variant success
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        {message && (
          <Alert variant="success">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <h1 className="text-2xl font-semibold capitalize tracking-tight">
          {t('sign-in')}
        </h1>
        <p className="text-muted-foregroun text-sm">
          {t('email-password-to-sign-in')}
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
                      placeholder={t('email')}
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
                      placeholder={t('password')}
                      className="w-full"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>

                  <FormMessage className="text-red-600" />
                  <div className="flex items-center justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-muted-foreground hover:opacity-75"
                    >
                      {t('forgot-password')}?
                    </Link>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="capitalize" disabled={isLoading}>
              {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              {t('sign-in').toUpperCase()}
            </Button>
          </form>
        </Form>
        <p className="px-8 text-center text-xs text-muted-foreground">
          {t('not-have-account')}{' '}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/sign-up"
          >
            {t('sign-up')}
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
