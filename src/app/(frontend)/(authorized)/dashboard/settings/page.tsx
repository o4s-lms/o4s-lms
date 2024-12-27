import type { Metadata } from 'next';
import { headers as getHeaders } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { SettingsWithSidebar } from '@/components/Dashboard/Settings';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Settings | O4S LMS',
  description: 'Get started with your courses.',
};

export default async function Settings() {
  const headers = await getHeaders();
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers });

  if (!user) {
    redirect(
      `/sign-in?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard/settings`,
    );
  }

  const settings = await payload.find({
    collection: 'settings',
    limit: 1,
    pagination: false,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  return (
    
    <SettingsWithSidebar user={user} />
  );
}
