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
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/Auth';

const formSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

export const ProfileForm = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<null | string>(null);
  const [success, setSuccess] = React.useState('');
  const { setUser, user } = useAuth();
  const [changePassword, setChangePassword] = React.useState(false);

  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name as string,
      email: user?.email,
      password: '',
      passwordConfirmation: '',
    },
  });

  const password = React.useRef({});
  password.current = form.watch('password', '');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (user) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`,
        {
          // Make sure to include cookies with fetch
          body: JSON.stringify(values),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        },
      );

      if (response.ok) {
        const json = await response.json();
        setUser(json.doc);
        setSuccess('Successfully updated account.');
        toast.info('Successfully updated account.');
        setError('');
        setChangePassword(false);
        form.reset({
          name: json.doc.name,
          email: json.doc.email,
          password: '',
          passwordConfirmation: '',
        });
      } else {
        setError('There was a problem updating your account.');
        toast.error('Something went wrong.', {
          description: error,
        });
      }
    }
    setIsLoading(false);
    return;
  }

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
        {changePassword ? (
          <>
            <p>
              {'Change your password below, or '}
              <Button
                variant="link"
                onClick={() => setChangePassword(!changePassword)}
                disabled={isLoading}
              >
                cancel
              </Button>
              .
            </p>
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
          </>
        ) : (
          <>
            <p>
              {'To change your password, '}
              <Button
                variant="link"
                onClick={() => setChangePassword(!changePassword)}
                disabled={isLoading}
              >
                click here
              </Button>
              .
            </p>
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
          </>
        )}
        <Button type="submit" className="capitalize" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading
            ? 'Processing'
            : changePassword
              ? 'Change password'
              : 'Update account'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
