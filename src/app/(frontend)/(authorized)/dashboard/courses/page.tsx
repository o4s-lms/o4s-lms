import type { Metadata } from 'next';
import { headers as getHeaders } from 'next/headers';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { CoursesSidebar } from '@/components/CoursesSidebar';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Courses | O4S LMS',
  description: 'Get started with your courses.',
};

export default async function Page() {
  const headers = await getHeaders();
    const payload = await getPayload({ config: configPromise });
    const { user } = await payload.auth({ headers });
  
    if (!user) {
      redirect(
        `/sign-in?error=${encodeURIComponent('You must be logged in to access your account.')}&redirect=/dashboard/courses`,
      );
    }

  return <CoursesSidebar />;
}
