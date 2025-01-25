'use client';

import * as React from 'react';
import { useAuth } from '../Auth';
import { Notification } from '@/payload-types';
import { useQuery } from '@tanstack/react-query';
import { unreadNotifications } from '@/utilities/notifications';

interface NotificationsContextType {
  notifications: Notification[] | null | undefined;
  isLoading: boolean;
}

const NotificationsContext =
  React.createContext<NotificationsContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export function NotificationsProvider({ children }: Props) {
  const { user } = useAuth();

  const { data: notifications, isPending } = useQuery({
    queryKey: ['unread-notifications', user?.id],
    queryFn: () => unreadNotifications(user?.id || ''),
    enabled: !!user?.id,
  });

  const value: NotificationsContextType = React.useMemo(
    () => ({
      notifications: notifications,
      isLoading: isPending,
    }),
    [notifications, isPending],
  );

  return <NotificationsContext value={value}>{children}</NotificationsContext>;
}

export const useNotifications = () => {
  const notificationsContext = React.useContext(NotificationsContext);

  if (!notificationsContext) {
    throw new Error(
      'useNotifications has to be used within <NotificationsContext>',
    );
  }

  return notificationsContext;
};
