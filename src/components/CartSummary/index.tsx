'use client';

import { formatPrice } from '@/lib/utils';
import { useCheckout } from '@/providers/Checkout';
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
import { useCallback, useState } from 'react';

export interface Cart {
  items: {
    id: number;
    title: string;
    slug?: string | null | undefined;
    price: number;
    badgeImage?: ((number | null) | MediaType) | undefined;
  }[];
  discount: number;
  amount: number;
  tax: number;
  total: number;
}

type OrderSummaryProps = {
  cart: Cart;
};

function OrderContent({ cart }: OrderSummaryProps) {
  const [currentCart, setCurrentCart] = useState<Cart>(cart);
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const { create } = useCheckout();
  const { user } = useAuth();

  const updateCart = useCallback(async (courseId: number) => {
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
      return <p>Course not found</p>;
    }

    tmpCart.amount = a;
    tmpCart.discount = d;
    tmpCart.tax = t;
    tmpCart.total = a - d + t;

    setCurrentCart(tmpCart);
  }, [currentCart]);

  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: 'vertical' },
    createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: (Math.round(cart.total) / 100).toFixed(2),
            },
          },
        ],
      });
    },
    onApprove(data, actions) {
      /**
       * data: {
       *   orderID: string;
       *   payerID: string;
       *   paymentID: string | null;
       *   billingToken: string | null;
       *   facilitatorAccesstoken: string;
       * }
       */
      return actions.order.capture().then(async (details) => {
        toast.info(
          `Transaction ${data.paymentID} completed by ${details?.payer.name.given_name ?? 'No details'}`,
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

        const transaction = await create({
          email: user?.email as string,
          transactionId: data.paymentID,
          customerId: data.payerID,
          user: user?.id,
          courses: cart.items.map(({ id }) => id),
          provider: 'paypal',
          discount: cart.discount || 0,
          amount: cart.amount || 0,
          total: cart.total || 0,
          status: 'completed',
        });

        //navigateToStep(3);
      });
    },
  };

  return (
    <>
      <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-3xl">
        <div key="shopping-cart" className="space-y-6">
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
                        1
                      </p>
                    </div>
                    <div className="text-end md:order-4 md:w-32">
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {formatPrice(item.price)}
                      </p>
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

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateCart(item.id)}
                        type="button"
                        className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                      >
                        <X size={18} />
                        Remove
                      </button>
                    </div>
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
                {formatPrice(currentCart.total + cart.total * 0.06)}
              </dd>
            </dl>
          </div>

          {isPending ? <h2>Load Smart Payment Button...</h2> : null}
          <PayPalButtons {...paypalbuttonTransactionProps} />

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
    </>
  );
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  return (
    <PayPalProvider>
      <OrderContent cart={cart} />
    </PayPalProvider>
  );
}