import { headers as getHeaders } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@/payload.config';
import ProfileForm from '@/components/ProfileForm';

export default async function Account() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { permissions, user } = await payload.auth({ headers });

  if (!user) {
    redirect(
      `/sign-in?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard/account`,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Settings</span>
      </h1>
      <div className="flex flex-col gap-10 p-6">
        <div>
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p className="text-base text-white/50">
            Add or update your information
          </p>
        </div>
        <ProfileForm />
      </div>
    </div>
  );
}
