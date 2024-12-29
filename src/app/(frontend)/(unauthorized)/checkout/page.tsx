import type { Metadata } from 'next/types';
import configPromise from '@payload-config';
import { getPayload, type Where } from 'payload';
import { Cart, OrderSummary } from '@/components/CartSummary';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Checkout | O4S LMS',
  description: 'Get started with your courses.',
};

type Args = {
  searchParams: Promise<{
    slug: string;
    language: string;
  }>;
};
export default async function AddToCart({
  searchParams: searchParamsPromise,
}: Args) {
  const { slug, language } = await searchParamsPromise;

  const payload = await getPayload({ config: configPromise });

  let amount = 0;
  let discount = 0;
  let tax = 0;
  let query: Where | null = null;

  if (slug === 'all') {
    query = {
      language: {
        equals: language,
      },
    };
  } else {
    query = {
      slug: {
        equals: slug,
      },
    };
  }

  const result = await payload.find({
    collection: 'courses',
    limit: 10,
    pagination: false,
    where: query,
    select: {
      title: true,
      price: true,
      slug: true,
      badgeImage: true,
    },
  });

  if (Array.isArray(result.docs) && result.docs.length > 0) {
    for (const data of result.docs) {
      amount += data.price;
    }

    if (result.docs.length > 1) {
      discount = 1000 * result.docs.length;
    }
  } else {
    return <p>Course not found</p>;
  }

  tax = (amount - discount) * 0.06;

  const cart: Cart = {
    items: result.docs,
    discount: discount,
    amount: amount,
    tax: tax,
    total: amount - discount + tax,
  };

  return (
    <div className="py-16 antialiased md:py-24">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Shopping Cart
        </h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
