import type { Metadata } from 'next';
import { DashboardSidebar } from '@/components/DashboardSideBar';
import React from 'react';

export const metadata: Metadata = {
  //metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'Dashboard | O4S LMS',
  description: 'Get started with your courses.',
};

const DashboardPage = () => {
  return <DashboardSidebar />
};

export default DashboardPage;
