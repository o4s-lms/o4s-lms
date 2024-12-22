'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, CircleDashed } from 'lucide-react';

import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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

export const NewsletterBlock: React.FC = () => {
  const [status, setStatus] = React.useState<
    'loading' | 'Subscribe' | 'Subscribed'
  >();
  const isEnabled = !status || status === 'Subscribe';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isEnabled) {
      return;
    }

    setStatus('loading');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/newsletter-signups`,
      {
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    if (!response.ok) {
      toast.error('There was an error creating the signup!', {
        description: 'Please try again.',
      });
      setStatus('Subscribe');
      return;
    }

    toast.info('You subscribed our newsletter successful!');
    setStatus('Subscribed');
  }

  return (
    <div className="container py-24 sm:py-32">
      <div className="relative flex w-full items-center justify-center">
        <div className="relative z-40 flex w-full flex-col items-center justify-center bg-gray-800 bg-opacity-80 px-4 py-10 md:mx-24 md:my-16 md:px-12 lg:py-16">
          <h1 className="text-center text-4xl font-semibold leading-9 text-white">
            Get notified about new articles!
          </h1>
          <p className="mt-6 text-center text-base leading-normal text-white">
            We won&apos;t send you spam. Unsubscribe at any time.
          </p>
          <div className="mt-12 flex w-full flex-col items-center space-y-4 border-white sm:flex-row sm:space-y-0 sm:border lg:w-5/12">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
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
                          className="w-full border border-white bg-transparent p-4 text-base font-medium leading-none text-white placeholder-white focus:outline-none sm:border-transparent"
                          disabled={!isEnabled}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  disabled={!isEnabled}
                  className="w-full min-w-40 border border-white bg-teal-500 px-6 py-4 hover:bg-teal-600 hover:bg-opacity-75 focus:outline-none focus:ring focus:ring-offset-2 sm:w-auto sm:border-transparent"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      // Remount the component so that the animation can be restarted
                      key={status}
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.075 }}
                      className={cn('flex items-center justify-center gap-1')}
                    >
                      {status === 'Subscribed' && (
                        <motion.span
                          className="h-fit w-fit"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.075, type: 'spring' }}
                        >
                          <CheckCircle2 className="h-4 w-4 fill-white stroke-teal-500 group-hover:stroke-teal-600" />
                        </motion.span>
                      )}

                      {status == 'loading' ? (
                        <CircleDashed className="h-4 w-4 animate-spin" />
                      ) : (
                        (status ?? 'Subscribe')
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
