'use client';

import { formatPrice, until } from '@/lib/utils';
import PayPalProvider from './PayPalProvider';
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import { useAuth } from '@/providers/Auth';
import { Media as MediaType } from '@/payload-types';
import { ArrowRight, X } from 'lucide-react';
import { Media } from '../Media';
import * as React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import {
  createTransaction,
  TransactionMutationData,
} from '@/utilities/transactions';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslate } from '@tolgee/react';
import Link from 'next/link';

export interface Cart {
  items: {
    id: string;
    title: string;
    slug?: string | null | undefined;
    price: number;
    badgeImage?: string | MediaType | null | undefined;
  }[];
  discount: number;
  amount: number;
  tax: number;
  total: number;
}

type OrderSummaryProps = {
  cart: Cart;
};

const formSchema = z.object({
  name: z.string().min(8),
  email: z.string().email(),
});

function OrderContent({ cart }: OrderSummaryProps) {
  const [currentCart, setCurrentCart] = React.useState<Cart>(cart);
  const [key, setKey] = React.useState(0);
  const [paymentType, setPaymentType] = React.useState<'paypal' | 'transfer'>(
    'transfer',
  );
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const { user, isSignedIn } = useAuth();
  const router = useRouter();
  const { t } = useTranslate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  });

  const updateCart = React.useCallback(
    async (courseId: string) => {
      const tmpCart = currentCart;
      let a = 0;
      let d = 0;
      let t = 0;
      tmpCart.items = tmpCart.items.filter((item) => item.id !== courseId);

      if (Array.isArray(tmpCart.items) && tmpCart.items.length > 0) {
        for (const data of tmpCart.items) {
          a += data.price;
        }

        if (tmpCart.items.length > 1) {
          d = 1000 * tmpCart.items.length;
        }
        t = (a - d) * 0.06;
      } else {
        router.push('/courses');
      }

      tmpCart.amount = a;
      tmpCart.discount = d;
      tmpCart.tax = t;
      tmpCart.total = a - d + t;

      setCurrentCart(tmpCart);
      setKey(key + 1);
    },
    [currentCart, key, router],
  );

  const create = useMutation({
    mutationFn: async (data: TransactionMutationData) => {
      return await createTransaction({ ...data });
    },
    onSuccess: (data) => {
      router.push(
        `/checkout/completion?guest=${isSignedIn ? 'false' : 'true'}&transactionId=${data?.id}&provider=${data?.provider}`,
      );
    },
    /**onError: (error) => {
      toast.error('Failed to create transaction');
      console.error('Failed to create transaction:', error);
    },*/
  });

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const transaction = await create.mutateAsync({
          email: values.email,
          name: values.name,
          user: isSignedIn ? user?.id : undefined,
          courses: currentCart.items.map(({ id }) => {
            return {
              relationTo: 'courses',
              value: id,
            };
          }),
          provider: 'transfer',
          discount: currentCart.discount || 0,
          amount: currentCart.amount || 0,
          tax: currentCart.tax || 0,
          total: currentCart.total || 0,
          status: 'awaiting',
        });
        console.log(transaction);
      } catch (error) {
        toast.error('Failed to create transaction');
        console.error('Failed to create transaction:', error);
      } finally {
        toast.success('Transaction created');
      }
    },
    [create, currentCart, isSignedIn, user?.id],
  );

  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: 'vertical' },
    createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              //currency_code: 'EUR',
              value: (Math.round(cart.total) / 100).toFixed(2),
            },
            /**items: currentCart.items.map((item) => {
              return {
                name: item.title,
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: (Math.round(item.price) / 100).toFixed(2)
                },
                tax: {
                  currency_code: 'EUR',
                  value: (Math.round(cart.tax) / 100).toFixed(2),
                },
              }
            }),*/
          },
        ],
      });
    },
    async onApprove(data, actions) {
      /**
       * data: {
       *   orderID: string;
       *   payerID: string;
       *   paymentID: string | null;
       *   billingToken: string | null;
       *   facilitatorAccesstoken: string;
       * }
       */
      const details = await actions.order?.capture();
      toast.info(
        `Transaction ${data.paymentID} completed by ${details?.payer?.name?.given_name ?? 'No details'}`,
      );
      /**const transactionData: Partial<Transaction> = {
        email: user?.email,
        transactionId: data.paymentID,
        customerId: data.payerID,
        user: user?.id,
        courses: courses.map(({ id }) => ( id )),
        provider: 'paypal',
        discount: discount || 0,
        amount: amount || 0,
        status: 'completed',
      };*/

      try {
        const transaction = await create.mutateAsync({
          email: isSignedIn
            ? (user?.email as string)
            : (details?.payer?.email_address as string),
          name: details?.payer?.name?.full_name ?? undefined,
          orderId: data.orderID ?? undefined,
          transactionId: data.paymentID ?? undefined,
          customerId: data.payerID ?? undefined,
          user: isSignedIn ? user?.id : undefined,
          courses: currentCart.items.map(({ id }) => {
            return {
              relationTo: 'courses',
              value: id,
            };
          }),
          provider: 'paypal',
          discount: currentCart.discount || 0,
          amount: currentCart.amount || 0,
          tax: currentCart.tax || 0,
          total: currentCart.total || 0,
          status: 'completed',
        });
        console.log(transaction);
      } catch (error) {
        toast.error('Failed to create transaction');
        console.error('Failed to create transaction:', error);
      } finally {
        toast.success('Transaction created');
      }
    },
  };

  return (
    <React.Fragment>
      <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-3xl">
        <div key={key} className="space-y-6">
          {currentCart.items.map((item) => (
            <>
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                  {!item.badgeImage && <div className="">No image</div>}
                  {item.badgeImage && typeof item.badgeImage !== 'string' && (
                    <Media
                      resource={item.badgeImage}
                      size="33vw"
                      className="h-24 w-24"
                    />
                  )}

                  <div className="flex items-center justify-between md:order-3 md:justify-end">
                    <div className="flex items-center">
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-end md:order-4 md:w-32">
                      <button
                        onClick={() => updateCart(item.id)}
                        type="button"
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                    <a
                      href={`/courses/${item.slug}`}
                      target="_blank"
                      title={item.title}
                      className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                    >
                      {item.title}
                    </a>

                    <div className="flex items-center gap-4"></div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            Order summary
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Original price
                </dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">
                  {formatPrice(currentCart.amount)}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Discount
                </dt>
                <dd className="text-base font-medium text-green-600">
                  {formatPrice(currentCart.discount)}
                </dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                  Tax
                </dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">
                  {formatPrice(currentCart.tax)}
                </dd>
              </dl>
            </div>

            <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
              <dt className="text-base font-bold text-gray-900 dark:text-white">
                Total
              </dt>
              <dd className="text-base font-bold text-gray-900 dark:text-white">
                {formatPrice(currentCart.total)}
              </dd>
            </dl>
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            Payment
          </p>

          {isPending ? <h2>Load Smart Payment Button...</h2> : null}
          <PayPalButtons {...paypalbuttonTransactionProps} />
          {paymentType === 'transfer' && (
            <div className="grid gap-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-2"
                >
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
                            disabled={isSignedIn}
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
                            placeholder={t('email')}
                            {...field}
                            className="w-full"
                            disabled={isSignedIn}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="capitalize">
                    Pay by Bank Transfer
                  </Button>
                </form>
              </Form>
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
          )}

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {' '}
              or{' '}
            </span>
            <a
              href={`/courses`}
              title=""
              className="text-primary-700 dark:text-primary-500 inline-flex items-center gap-2 text-sm font-medium underline hover:no-underline"
            >
              Continue Shopping
              <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  return (
    <PayPalProvider>
      <OrderContent cart={cart} />
    </PayPalProvider>
  );
}
