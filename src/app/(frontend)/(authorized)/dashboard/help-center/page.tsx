import ComingSoon from '@/components/ComingSoon';
import { LanguageSelector } from '@/components/LangSelector.';
import { AppSidebar } from '@/components/Layout/AppSidebar';
import { Header } from '@/components/Layout/Header';
import { TopNav } from '@/components/Layout/TopNav';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import SkipToMain from '@/components/SkipToMain';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { cn } from '@/lib/utils';

export default function HelpCenterPage() {
  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          {/**<Search />
            <ThemeSwitch />*/}
          <LanguageSelector />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <ComingSoon />
    </>
  );
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
];
