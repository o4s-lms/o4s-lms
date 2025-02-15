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
import NotificationCard from './NotificationsCard';
import { BellIcon } from 'lucide-react';

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
          <BellIcon className="h-6 w-6" />
          <span className="absolute inset-0 -mr-6 object-right-top">
            <div className="inline-flex items-center rounded-full border-2 border-white bg-red-500 px-1.5 py-0.5 text-xs font-semibold leading-4 text-white">
              {unreadCount}
            </div>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-112" align="end" forceMount>
        <NotificationCard
          notifications={notifications}
          unreadCount={unreadCount}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
