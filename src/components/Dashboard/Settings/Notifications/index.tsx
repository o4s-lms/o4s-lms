'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Loader2 as Spinner } from 'lucide-react';
import { User } from '@/payload-types';

const notificationsFormSchema = z.object({
  assignments: z.boolean(),
  courseUpdates: z.boolean(),
  achievements: z.boolean(),
  security: z.boolean(),
  communication: z.boolean(),
  marketing: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export function NotificationsForm({ currentUser }: { currentUser: User }) {
  const [user, setUser] = React.useState<User>(currentUser);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const defaultValues: Partial<NotificationsFormValues> = {
    assignments: user.notifications.assignments,
    courseUpdates: user.notifications.courseUpdates,
    achievements: user.notifications.achievements,
    security: user.notifications.security,
    communication: user.notifications.communication,
    marketing: user.notifications.marketing,
  };

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });

  const onSubmit = React.useCallback(
    async (notifications: NotificationsFormValues) => {
      setIsLoading(true);

      const values = {
        notifications: notifications,
      };

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
        toast.info('Successfully updated notifications preferences.');
        form.reset({
          assignments: json.doc.notifications.assignments,
          courseUpdates: json.doc.notifications.courseUpdates,
          achievements: json.doc.notifications.achievements,
          security: json.doc.notifications.security,
          communication: json.doc.notifications.communication,
          marketing: json.doc.notifications.marketing,
        });
      } else {
        toast.error('There was a problem updating your preferences.');
      }

      setIsLoading(false);
      return;
    },
    [form, user.id],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-medium">Learning Notifications</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="assignments"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Assignment notifications
                    </FormLabel>
                    <FormDescription>
                      Receive emails about your assignments activity.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseUpdates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Course update notifications
                    </FormLabel>
                    <FormDescription>
                      Receive emails about course updates, new features, and
                      more.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="achievements"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Achievement notifications
                    </FormLabel>
                    <FormDescription>
                      Receive emails about your achievements activity.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="security"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Security emails</FormLabel>
                    <FormDescription>
                      Receive emails about your account activity and security.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="communication"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Communication emails
                    </FormLabel>
                    <FormDescription>
                      Receive emails about your account activity.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Marketing emails
                    </FormLabel>
                    <FormDescription>
                      Receive emails about new products, features, and more.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Processing' : 'Update notifications'}
        </Button>
      </form>
    </Form>
  );
}
