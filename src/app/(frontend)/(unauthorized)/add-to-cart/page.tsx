import { Media } from '@/components/Media';
import { formatPrice } from '@/lib/utils';
import { Media as MediaType } from '@/payload-types';
import configPromise from '@payload-config';
import { getPayload, type Where } from 'payload';
import { OrderSummary } from '@/components/CartSummary';

export interface Cart {
  items: {
    id: number;
    title: string;
    price: number;
    badgeImage?: ((number | null) | MediaType) | undefined;
  }[];
  discount: number;
  amount: number;
  total: number;
}

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
  let query: Where | null = null;

  if (slug === 'all') {
    query = {
      language: {
        equals: language,
      },
    };
  } else {
    query = {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          language: {
            equals: language,
          },
        },
      ],
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

  const cart: Cart = {
    items: result.docs,
    discount: discount,
    amount: amount,
    total: amount - discount,
  };

  return (
    <div className="py-16 antialiased md:py-24">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          Shopping Cart
        </h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-3xl">
            <div key="shopping-cart" className="space-y-6">
              {cart.items.map((item) => (
                <>
                  <div
                    key={item.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      {!item.badgeImage && <div className="">No image</div>}
                      {item.badgeImage &&
                        typeof item.badgeImage !== 'string' && (
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
                          href="#"
                          className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                        >
                          {item.title}
                        </a>

                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                          >
                            <svg
                              className="me-1.5 h-5 w-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18 17.94 6M18 18 6.06 6"
                              />
                            </svg>
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
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
