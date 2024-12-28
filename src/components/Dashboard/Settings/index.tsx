'use client';

import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { IconNotification, IconPalette, IconTool } from '@tabler/icons-react';

import type { User } from '@/payload-types';
import { toast } from 'sonner';
import { useTranslate } from '@tolgee/react';
import { useQueryState } from 'nuqs';
import { AccountForm } from './Account';
import { SidebarNav } from './SidebarNav';
import { AppearanceForm } from './Appearance';
import { NotificationsForm } from './Notifications';
import { Main } from '@/components/Layout/Main';
import ContentSection from './ContentSection';

interface SettingsProps {
  user: User
  settingsStep: string
}

export function SettingsContent({
  user,
  settingsStep
}: SettingsProps) {
  const [success, setSuccess] = useQueryState('success');
  //const [settingsStep, setSettingsStep] = useQueryState('settingsStep');
  const { t } = useTranslate();

  const sidebarNavItems = [
    {
      title: t('account'),
      icon: <IconTool size={18} />,
      step: 'account',
    },
    {
      title: t('appearance'),
      icon: <IconPalette size={18} />,
      step: 'appearance',
    },
    {
      title: t('notifications'),
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
                  ? settingsStep.charAt(0).toUpperCase() + settingsStep.slice(1)
                  : 'Account'
              }
              desc={getDesc()}
            >
              {renderStep()}
            </ContentSection>
          </div>
        </div>
      </Main>
    </>
  );
}