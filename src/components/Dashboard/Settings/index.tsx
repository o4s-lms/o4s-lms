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

import type { User } from '@/payload-types';
import { toast } from 'sonner';
import { SidebarHeaderMenu } from '@/components/SideBar/HeaderMenu';
import { useTranslate } from '@tolgee/react';
import { useQueryState } from 'nuqs';
import { AccountForm } from './Account';
import { SidebarNav } from './SidebarNav';
import { AppearanceForm } from './Appearance';
import { NotificationsForm } from './Notifications';

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
      step: 'account',
    },
    {
      title: 'Appearance',
      step: 'appearance',
    },
    {
      title: 'Notifications',
      step: 'notifications',
    },
  ];

  const renderStep = () => {
    switch (settingsStep) {
      case 'account':
        return <AccountForm currentUser={user} />;
      case 'appearance':
        return <AppearanceForm />;
      case 'notifications':
        return <NotificationsForm />;
      default:
        return <AccountForm currentUser={user} />;
    }
  };

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
        <div className="hidden space-y-6 p-10 pb-16 md:block">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and set e-mail preferences.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav
                currentStep={settingsStep ? settingsStep : 'account'}
                items={sidebarNavItems}
              />
            </aside>
            <div className="flex-1 lg:max-w-2xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">
                    {settingsStep
                      ? settingsStep.charAt(0).toUpperCase() +
                        settingsStep.slice(1)
                      : 'Account'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {(!settingsStep || settingsStep === 'account') && (
                      <span>
                        Manage your account settings and set e-mail preferences.
                      </span>
                    )}
                    {settingsStep === 'appearance' && (
                      <span>
                        Customize the appearance of the app. Automatically
                        switch between day and night themes.
                      </span>
                    )}
                    {settingsStep === 'notifications' && (
                      <span>Configure how you receive notifications.</span>
                    )}
                  </p>
                </div>
                <Separator />
                {renderStep()}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
