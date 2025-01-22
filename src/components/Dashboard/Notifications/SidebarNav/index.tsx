'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    label: string | null;
    value: string;
  }[];
  notificationsType: string | null;
}

export function SidebarNav({
  className,
  items,
  notificationsType,
  ...props
}: SidebarNavProps) {
  //const [settingsStep, setSettingsStep] = useQueryState('settingsStep');
  const [val, setVal] = useState(
    notificationsType
      ? `/dashboard/notifications/${notificationsType}`
      : 'dashboard/notifications/unread',
  );
  const router = useRouter();

  const handleSelect = (e: string) => {
    setVal(e);
    router.push(e);
  };

  return (
    <>
      <div className="p-1 md:hidden">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-12 sm:w-48">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem
                key={item.value}
                value={`/dashboard/notifications/${item.value}`}
              >
                <div className="flex gap-x-4 px-2 py-1">
                  <span className="text-md">{item.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea
        orientation="horizontal"
        type="always"
        className="hidden w-full min-w-40 bg-background px-1 py-2 md:block"
      >
        <nav
          className={cn(
            'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
            className,
          )}
          {...props}
        >
          {items.map((item) => (
            <Link
              key={item.value}
              href={`/dashboard/notifications/${item.value}`}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                notificationsType === item.value
                  ? 'bg-muted hover:bg-muted'
                  : 'hover:bg-transparent hover:underline',
                'justify-start',
              )}
            >
              <div className="flex gap-x-4 px-2 py-1">
                <span className="text-md">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  );
}
