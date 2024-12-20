'use client';

import { Cart } from '@/app/(frontend)/(unauthorized)/add-to-cart/page';
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

type OrderSummaryProps = {
  cart: Cart;
};

function OrderContent({ cart }: OrderSummaryProps) {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const { create } = useCheckout();
  const { user } = useAuth();

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
                {formatPrice(cart.amount)}
              </dd>
            </dl>

            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                Discount
              </dt>
              <dd className="text-base font-medium text-green-600">
                {formatPrice(cart.discount)}
              </dd>
            </dl>

            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                Tax
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                $799
              </dd>
            </dl>
          </div>

          <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
            <dt className="text-base font-bold text-gray-900 dark:text-white">
              Total
            </dt>
            <dd className="text-base font-bold text-gray-900 dark:text-white">
              {formatPrice(cart.total)}
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
            href="#"
            title=""
            className="text-primary-700 dark:text-primary-500 inline-flex items-center gap-2 text-sm font-medium underline hover:no-underline"
          >
            Continue Shopping
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 12H5m14 0-4 4m4-4-4-4"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  return (
    <PayPalProvider>
      <OrderContent cart={cart} />
    </PayPalProvider>
  );
}
