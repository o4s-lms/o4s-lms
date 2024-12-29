'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { useQueryState } from 'nuqs';
import { JSX, useState } from 'react';
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
    step: string | null;
    icon: JSX.Element;
    title: string;
  }[];
  currentStep: string | null;
}

export function SidebarNav({
  className,
  items,
  currentStep,
  ...props
}: SidebarNavProps) {
  //const [settingsStep, setSettingsStep] = useQueryState('settingsStep');
  const [val, setVal] = useState(
    currentStep
      ? `/dashboard/settings/${currentStep}`
      : 'dashboard/settings/account',
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
                key={item.title}
                value={`/dashboard/settings/${item.step}`}
              >
                <div className="flex gap-x-4 px-2 py-1">
                  <span className="scale-125">{item.icon}</span>
                  <span className="text-md">{item.title}</span>
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
              key={item.title}
              href={`/dashboard/settings/${item.step}`}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                currentStep === item.step
                  ? 'bg-muted hover:bg-muted'
                  : 'hover:bg-transparent hover:underline',
                'justify-start',
              )}
            >
              <div className="flex gap-x-4 px-2 py-1">
                <span className="scale-100">{item.icon}</span>
                <span className="text-md">{item.title}</span>
              </div>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  );
}
