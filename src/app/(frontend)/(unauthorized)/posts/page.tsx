import type { Metadata } from 'next/types';

import { CollectionArchive } from '@/components/CollectionArchive';
import { PageRange } from '@/components/PageRange';
import { Pagination } from '@/components/Pagination';
import React, { cache } from 'react';
import PageClient from './page.client';
import { HighLight } from '@/heros/HighLight';
import { getLanguage } from '@/tolgee/language';
import { createPayloadClient } from '@/lib/payload';

export const dynamic = 'force-static';
export const revalidate = 600;

export default async function Page() {
  const language = await getLanguage();

  const posts = await queryPostsByLanguage({ language: language })

  return (
    <div className="pb-24 pt-24">
      <PageClient />

      <HighLight
        msg="Consulte o nosso blogue e leia os melhores"
        highlightMsg="artigos sobre sustentabilidade"
      />

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  );
}

const queryPostsByLanguage = cache(async ({ language }: { language: string }) => {
  const payload = await createPayloadClient();

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: {
      language: {
        equals: language,
      },
    },
    select: {
      title: true,
      slug: true,
      heroImage: true,
      categories: true,
      populatedAuthors: true,
      publishedAt: true,
      meta: true,
    },
  });

  return posts ?? null;

});

export function generateMetadata(): Metadata {
  return {
    title: `O4S LMS Website Blog`,
  };
}
