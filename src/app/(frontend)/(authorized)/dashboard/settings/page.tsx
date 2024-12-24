import { headers as getHeaders } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { AccountSidebar } from '@/components/AccountSidebar';

export default async function Settings() {
  const headers = await getHeaders();
  const payload = await getPayload({ config: configPromise });
  const { user } = await payload.auth({ headers });

  if (!user) {
    redirect(
      `/sign-in?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard/account`,
    );
  }

  const settings = await payload.find({
    collection: 'settings',
    limit: 1,
    pagination: false,
    where: {
      userId: {
        equals: user.id,
      },
    },
  });

  return (
    
    <p>Settings</p>
  );
}
