import type { Metadata } from 'next';
import { LogOutPageClient } from './page.client';

export const metadata: Metadata = {
  title: 'Log out',
  description: 'Log out of your account',
};


export default function LogOutPage() {
  return <LogOutPageClient />;
}