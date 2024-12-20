import type { Metadata } from 'next';
import { headers as getHeaders } from 'next/headers';
import { DashboardSidebar } from '@/components/DashboardSideBar';
import React from 'react';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Dashboard | O4S LMS',
  description: 'Get started with your courses.',
};

const DashboardPage = async () => {
  const headers = await getHeaders();
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers });

  if (!user) {
    redirect(
      `/sign-in?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard`,
    );
  }

  const favorites = await payload.find({
    collection: 'favorites',
    limit: 50,
    pagination: false,
    where: {
      userId: {
        equals: user.id,
      },
    },
  });

  return <DashboardSidebar favorites={favorites.docs} />;
};

export default DashboardPage;
