'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { useQueryState } from 'nuqs';
import { JSX } from 'react';

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
  const [settingsStep, setSettingsStep] = useQueryState('settingsStep');

  return (
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
          href="#"
          onClick={() => setSettingsStep(item.step)}
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
  );
}
