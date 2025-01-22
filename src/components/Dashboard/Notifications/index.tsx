'use client';

import { Main } from '@/components/Layout/Main';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './SidebarNav';
import { useTranslate } from '@tolgee/react';
import { NOTIFICATIONS_TYPES } from '@/lib/constants';
import { toast } from 'sonner';
import ContentSection from '../ContentSection';
import { Notification } from '@/payload-types';

interface NotificationsProps {
  notifications: Notification[];
  notificationsType: string;
}

export function Notifications({
  notifications,
  notificationsType,
}: NotificationsProps) {
  //const [success, setSuccess] = useQueryState('success');
  const { t } = useTranslate();
  const sidebarNavItems = NOTIFICATIONS_TYPES;

  /**const renderStep = () => {
    switch (notificationsType) {
      case 'all':
        return <AccountForm currentUser={user} />;
      case 'appearance':
        return <AppearanceForm currentUser={user} />;
      case 'notifications':
        return <NotificationsForm currentUser={user} />;
      default:
        return <AccountForm currentUser={user} />;
    }
  };

  if (success) {
    toast.success(success);
    setSuccess(null);
  } */

  return (
    <>
      <Main fixed>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Notifications
          </h1>
          <p className="text-muted-foreground">Read your notifications.</p>
        </div>

        <Separator className="my-4 lg:my-6" />
        <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="top-0 lg:sticky lg:w-1/5">
            <SidebarNav
              notificationsType={
                notificationsType ? notificationsType : 'unread'
              }
              items={sidebarNavItems}
            />
          </aside>
          <div className="flex w-full overflow-y-hidden p-1 pr-4">
            <ContentSection
              title={
                notificationsType
                  ? notificationsType.charAt(0).toUpperCase() +
                    notificationsType.slice(1)
                  : 'Unread'
              }
              desc={`Read ${notificationsType} notifications`}
            >
              <ul>
                {notifications.map((notification) => {
                  return (
                    <>
                      <li>
                        {JSON.stringify(notification)}
                      </li>
                    </>
                  );
                })}
              </ul>
            </ContentSection>
          </div>
        </div>
      </Main>
    </>
  );
}
