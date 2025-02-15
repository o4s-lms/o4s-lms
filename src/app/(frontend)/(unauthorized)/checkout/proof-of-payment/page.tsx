import type { Metadata } from 'next/types';
import { createPayloadClient } from '@/lib/payload';
import { ProofOfPaymentForm } from '@/components/CartSummary/ProofOfPaymentForm';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Proof of Payment | O4S LMS',
  description: 'Get started with your courses.',
};

type Args = {
  searchParams: Promise<{
    transactionId: string;
  }>;
};
export default async function ProofOfPayment({
  searchParams: searchParamsPromise,
}: Args) {
  const { transactionId } = await searchParamsPromise;

  return (
    <div className="py-16 antialiased md:py-24">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <ProofOfPaymentForm transactionId={transactionId} />
      </div>
    </div>
  );
}
