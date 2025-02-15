import { PayloadRequest, CollectionSlug } from 'payload';

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  courses: '/courses',
  lessons: '/lessons',
  pages: '',
};

type Props = {
  collection: keyof typeof collectionPrefixMap;
  slug: string;
  req: PayloadRequest; // TODO: make this required once 3.5.1 is out, it's a new argument in that version
};

export const generatePreviewPath = ({ collection, slug, req }: Props) => {
  const path = `${collectionPrefixMap[collection]}/${slug}`;

  const params = {
    slug,
    collection,
    path,
  };

  const encodedParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    encodedParams.append(key, value);
  });

  let url = `${req.protocol}//${req.host}/next/preview?${encodedParams.toString()}`;

  return url;
};
