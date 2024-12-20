'use client';

import OrderPreview from '@/components/CheckoutPage/OrderPreview';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/Auth';
import Link from 'next/link';
import { useCheckout } from '@/providers/Checkout';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const CheckoutDetailsPage = () => {
  const searchParams = useSearchParams();
  const showSignUp = searchParams.get('showSignUp') === 'true';
  const { navigateToStep, courses, discount, isLoading } = useCheckout();
  const { isSignedIn, isLoaded } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  if (isLoading && !isLoaded) return <Loading />;
  //if (isError) return <div>Failed to fetch course data</div>;
  if (!(Array.isArray(courses) && courses.length > 0))
    return <div>Courses not found</div>;

  if (isSignedIn) navigateToStep(2);

  function onSubmit(values: z.infer<typeof formSchema>) {
    navigateToStep(2);
  }

  return (
    <div className="h-fit w-full gap-10">
      <div className="gap-10 sm:flex">
        <div className="basis-1/2 rounded-lg">
          <OrderPreview courses={courses} discount={discount} />
        </div>

        {/* STRETCH FEATURE */}
        <div className="flex h-auto flex-1 basis-1/2 flex-col gap-10">
          <div className="w-full rounded-lg bg-customgreys-secondarybg px-24 py-12">
            <h2 className="mb-2 text-center text-3xl font-bold">
              Guest Checkout
            </h2>
            <p className="mx-auto mb-6 text-center text-sm text-gray-400">
              Enter email to receive course access details and order
              confirmation. You can create an account after purchase.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                <Button
                  type="submit"
                  className="bg-primary-700 hover:bg-primary-600 text-white-100 my-6 w-full rounded py-3 text-sm font-semibold shadow"
                >
                  Continue as Guest
                </Button>
              </form>
            </Form>
          </div>

          <div className="flex items-center justify-between">
            <hr className="w-full border-customgreys-dirtyGrey" />
            <span className="whitespace-nowrap px-4 text-sm text-gray-400">
              Or
            </span>
            <hr className="w-full border-customgreys-dirtyGrey" />
          </div>

          <div className="flex w-full items-center justify-center rounded-lg bg-customgreys-secondarybg">
            {showSignUp ? (
              <Button className="bg-primary-700 hover:bg-primary-600 text-white-100 my-6 w-full rounded py-3 text-sm font-semibold shadow">
                <Link
                  href={`/sign-up?redirect=/checkout?step=1&slug=${searchParams.get('slug')}&showSignUp=false`}
                  scroll={false}
                >
                  Sign Up
                </Link>
              </Button>
            ) : (
              <Button className="bg-primary-700 hover:bg-primary-600 text-white-100 my-6 w-full rounded py-3 text-sm font-semibold shadow">
                <Link
                  href={`/sign-in?redirect=/checkout?step=1&slug=${searchParams.get('slug')}&showSignUp=false`}
                >
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetailsPage;
