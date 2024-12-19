import type { Metadata } from 'next';
import { CoursesSidebar } from '@/components/CoursesSidebar';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Courses | O4S LMS',
  description: 'Get started with your courses.',
};

export default function Page() {
  return <CoursesSidebar />;
}
