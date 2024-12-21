import type { Metadata } from 'next/types';
import { Completion } from '@/components/CartSummary/Completion';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'COMPLETED | O4S LMS',
  description: 'Get started with your courses.',
};

type Args = {
  searchParams: Promise<{
    guest: string;
    transactionId: string;
  }>;
};
export default async function CompletionPage({
  searchParams: searchParamsPromise,
}: Args) {
  const { guest, transactionId } = await searchParamsPromise;

  return (
    <div className="py-16 antialiased md:py-24">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <Completion transactionId={transactionId} />
      </div>
    </div>
  );
}
