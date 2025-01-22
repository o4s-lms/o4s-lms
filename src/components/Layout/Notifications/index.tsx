'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconNotification } from '@tabler/icons-react';
import { Notification } from '@/payload-types';
import { useNotifications } from '@/providers/NotificationsContext';

export function NotificationsDropdown() {
  const { notifications, isLoading } = useNotifications();

  if (isLoading) {
    return null;
  }

  const unreadCount = notifications?.length || 0;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <IconNotification className="h-6 w-6" />
          <span className="absolute inset-0 object-right-top -mr-6">
            <div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
              {unreadCount}
            </div>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Unread notifications</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-3">
          {unreadCount > 0 && notifications?.map((notification: Notification) => (
            <>
              <div key={notification.id}
                className="flex bg-white dark:bg-gray-900 items-center px-6 py-4 text-sm border-t-2 rounded-b shadow-sm border-green-500">
                <div className="ml-3">
                  <div className="font-bold text-left text-black dark:text-gray-50">{notification.type}</div>
                  <div className="w-full text-gray-900 dark:text-gray-300 mt-1">{notification.subject}</div>
                </div>
              </div>
            </>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

