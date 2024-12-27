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
import { User } from '@/payload-types';

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export const ProfileForm = ({ currentUser }: { currentUser: User }) => {
  const [user, setUser] = React.useState<User>(currentUser);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<null | string>(null);
  const [success, setSuccess] = React.useState('');

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name as string,
      email: user?.email,
    },
  });

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setIsLoading(true);

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
        form.reset({
          name: json.doc.name,
          email: json.doc.email,
        });
      } else {
        setError('There was a problem updating your account.');
        toast.error('Something went wrong.', {
          description: error,
        });
      }

      setIsLoading(false);
      return;
    },
    [error, form, user.id],
  );

  return (
    <>
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

        <Button type="submit" className="capitalize" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Processing' : 'Update account'}
        </Button>
      </form>
    </Form>
   
  </>
  );
};

export default ProfileForm;
