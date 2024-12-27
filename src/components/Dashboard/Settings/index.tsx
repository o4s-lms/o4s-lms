'use client';

import * as React from 'react';
import {
  Home,
  Library,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  CreditCard,
} from 'lucide-react';

import { NavMain } from '@/components/NavMain';
import { NavFavorites } from '@/components/NavFavorites';
import { NavActions } from '@/components/NavActions';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { IconNotification, IconPalette, IconTool } from '@tabler/icons-react';

import type { User } from '@/payload-types';
import { toast } from 'sonner';
import { SidebarHeaderMenu } from '@/components/SideBar/HeaderMenu';
import { useTranslate } from '@tolgee/react';
import { useQueryState } from 'nuqs';
import { AccountForm } from './Account';
import { SidebarNav } from './SidebarNav';
import { AppearanceForm } from './Appearance';
import { NotificationsForm } from './Notifications';
import { Main } from '@/components/Layout/Main';
import ContentSection from './ContentSection';

type SettingsWithSidebarProps = {
  user: User;
} & React.ComponentProps<typeof Sidebar>;

export function SettingsWithSidebar({
  user,
  ...props
}: SettingsWithSidebarProps) {
  const [success, setSuccess] = useQueryState('success');
  const [settingsStep, setSettingsStep] = useQueryState('settingsStep');
  const { t } = useTranslate();

  const nav = [
    {
      title: t('search'),
      url: '#',
      icon: Search,
    },
    {
      title: t('ask-ai'),
      url: '#',
      icon: Sparkles,
    },
    {
      title: t('dashboard'),
      url: '/dashboard',
      icon: Home,
    },
    {
      title: t('courses'),
      url: '/dashboard/courses',
      icon: Library,
    },
    {
      title: 'Billing',
      url: '/dashboard/billing',
      icon: CreditCard,
    },
    {
      title: t('settings'),
      url: '/dashboard/settings',
      icon: Settings2,
      isActive: true,
    },
    {
      title: t('help'),
      url: '#',
      icon: MessageCircleQuestion,
    },
  ];

  const sidebarNavItems = [
    {
      title: 'Account',
      icon: <IconTool size={18} />,
      step: 'account',
    },
    {
      title: 'Appearance',
      icon: <IconPalette size={18} />,
      step: 'appearance',
    },
    {
      title: 'Notifications',
      icon: <IconNotification size={18} />,
      step: 'notifications',
    },
  ];

  const renderStep = () => {
    switch (settingsStep) {
      case 'account':
        return <AccountForm currentUser={user} />;
      case 'appearance':
        return <AppearanceForm currentUser={user} />;
      case 'notifications':
        return <NotificationsForm />;
      default:
        return <AccountForm currentUser={user} />;
    }
  };

  function getDesc(): string {
    if (!settingsStep || settingsStep === 'account')
      return 'Manage your account settings and set language preferences.';
    if (settingsStep === 'appearance')
      return 'Customize the appearance of the app. Automatically switch between day and night themes.';
    if (settingsStep === 'notifications')
      return 'Configure how you receive notifications.';
    return '';
  }

  if (success) {
    toast.success(success);
    setSuccess(null);
  }

  return (
    <>
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>
          <SidebarHeaderMenu />
          <NavMain items={nav} />
        </SidebarHeader>
        <SidebarContent>
          <NavFavorites />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{t('settings')}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {settingsStep
                      ? settingsStep.charAt(0).toUpperCase() +
                        settingsStep.slice(1)
                      : 'Account'}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions lesson={null} />
          </div>
        </header>
        <Main fixed>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your settings and preferences.
            </p>
          </div>

          <Separator className="my-4 lg:my-6" />
          <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="top-0 lg:sticky lg:w-1/5">
              <SidebarNav
                currentStep={settingsStep ? settingsStep : 'account'}
                items={sidebarNavItems}
              />
            </aside>
            <div className="flex w-full overflow-y-hidden p-1 pr-4">
              <ContentSection
                title={
                  settingsStep
                    ? settingsStep.charAt(0).toUpperCase() +
                      settingsStep.slice(1)
                    : 'Account'
                }
                desc={getDesc()}
              >
                {renderStep()}
              </ContentSection>
            </div>
          </div>
        </Main>
      </SidebarInset>
    </>
  );
}
