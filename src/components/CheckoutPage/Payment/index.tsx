import React from 'react';
import PayPalProvider from './PayPalProvider';
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { useCheckoutNavigation } from '@/hooks/useCheckoutNavigation';
import { useCurrentOrder } from '@/hooks/useCurrentOrder';
import OrderPreview from '@/components/CheckoutPage/OrderPreview';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/providers/Auth';
//import { Transaction } from '@/payload-types';
import Loading from '@/components/Loading';

const PaymentPageContent = () => {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const { navigateToStep } = useCheckoutNavigation();
  const { courses, amount, discount, isLoading } = useCurrentOrder();
  const { user, logout } = useAuth();

  if (isLoading) return <Loading />;

  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: 'vertical' },
    createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: (Math.round(amount) / 100).toFixed(2),
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

        const payload = await getPayload({ config: configPromise });

        await payload.create({
          collection: 'transactions',
          data: {
            email: user?.email as string,
            transactionId: data.paymentID,
            customerId: data.payerID,
            user: user?.id,
            courses: courses.map(({ id }) => id),
            provider: 'paypal',
            discount: discount || 0,
            amount: amount || 0,
            status: 'completed',
          },
        });

        navigateToStep(3);
      });
    },
  };

  const handleSignOutAndNavigate = async () => {
    await logout();
    navigateToStep(1);
  };

  if (!(Array.isArray(courses) && courses.length > 0)) return null;

  return (
    <div className="flex w-full flex-col">
      <div className="mb-6 gap-10 sm:flex">
        {/* Order Summary */}
        <div className="basis-1/2 rounded-lg">
          <OrderPreview courses={courses} discount={discount} />
        </div>

        {/* Pyament Form */}
        <div className="basis-1/2">
          <div className="flex flex-col gap-4 rounded-lg bg-customgreys-secondarybg px-10 py-10">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <p className="text-sm text-gray-400">
              Fill out the payment details below to complete your purchase.
            </p>

            <div className="mt-6 flex w-full flex-col gap-2">
              <h3 className="text-md">Payment Method</h3>

              <div className="border-white-100/5 flex flex-col rounded-lg border-[2px]">
                <div className="bg-white-50/5 flex items-center gap-2 px-2 py-2">
                  <CreditCard size={24} />
                  <span>Credit/Debit Card</span>
                </div>
                <div className="px-4 py-6">
                  {isPending ? <h2>Load Smart Payment Button...</h2> : null}
                  <PayPalButtons {...paypalbuttonTransactionProps} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex w-full items-center justify-between">
        <Button
          className="hover:bg-white-50/10"
          onClick={handleSignOutAndNavigate}
          variant="outline"
          type="button"
        >
          Switch Account
        </Button>

        <Button
          form="payment-form"
          type="submit"
          className="hover:bg-primary-600 bg-primary-700"
        >
          Pay with Credit Card
        </Button>
      </div>
    </div>
  );
};

const PaymentPage = () => (
  <PayPalProvider>
    <PaymentPageContent />
  </PayPalProvider>
);

export default PaymentPage;
