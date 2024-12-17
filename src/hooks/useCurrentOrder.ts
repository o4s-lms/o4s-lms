import { getPayload, Where } from 'payload';
import configPromise from '@payload-config';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CourseOrderData } from '@/components/CheckoutPage/OrderPreview';
import { DEFAULT_LANGUAGE } from '@/tolgee/shared';

export const useCurrentOrder = () => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<CourseOrderData[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') ?? '';
  const language = searchParams.get('language') ?? DEFAULT_LANGUAGE;
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

  useEffect(() => {
    const fetchCourse = async () => {
      setisLoading(true);
      let total = 0;
      let disc = 0;
      const payload = await getPayload({ config: configPromise });

      const result = await payload.find({
        collection: 'courses',
        limit: 1,
        pagination: false,
        where: query,
        select: {
          title: true,
          price: true,
        },
      });
      if (Array.isArray(result.docs) && result.docs.length > 0) {
        setCourses(result.docs);
        for (const data of result.docs) {
          total += data.price;
        }

        if (result.docs.length > 1) {
          disc = 1000 * result.docs.length;
          setDiscount(disc);
        }

        setAmount(total - disc);
      }
    };

    if (query !== null) {
      void fetchCourse();
      setisLoading(false);
    }
  }, [query]);

  return { courses, amount, discount, isLoading };
};
