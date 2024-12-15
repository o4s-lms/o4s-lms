'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import { Separator } from '@/components/ui/separator';
import {
  Database,
  GitBranch,
  Home,
  LucideMousePointerClick,
  Settings,
} from 'lucide-react';
import { ThemeSelector } from '@/providers/Theme/ThemeSelector';

type Props = {};

const menuOptions = [
  { name: 'Dashboard', Component: Home, href: '/dashboard' },
  //{ name: 'Workflows', Component: Workflows, href: '/workflows' },
  { name: 'Account', Component: Settings, href: '/dashboard/account' },
  //{ name: 'Connections', Component: Category, href: '/connections' },
  //{ name: 'Billing', Component: Payment, href: '/billing' },
  //{ name: 'Templates', Component: Templates, href: '/templates' },
  //{ name: 'Logs', Component: Logs, href: '/logs' },
];

const MenuOptions = (props: Props) => {
  const pathName = usePathname();

  return (
    <nav className="flex h-screen flex-col items-center justify-between gap-10 overflow-scroll px-2 py-6 dark:bg-black">
      <div className="flex flex-col items-center justify-center gap-8">
        <Link className="flex flex-row font-bold" href="/">
          O4S
        </Link>
        <TooltipProvider>
          {menuOptions.map((menuItem) => (
            <ul key={menuItem.name}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <li>
                    <Link
                      href={menuItem.href}
                      className={clsx(
                        'group flex h-8 w-8 scale-[1.5] cursor-pointer items-center justify-center rounded-lg p-[3px]',
                        {
                          'bg-[#EEE0FF] dark:bg-[#2F006B]':
                            pathName === menuItem.href,
                        },
                      )}
                    >
                      <menuItem.Component
                        selected={pathName === menuItem.href}
                      />
                    </Link>
                  </li>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-black/10 backdrop-blur-xl"
                >
                  <p>{menuItem.name}</p>
                </TooltipContent>
              </Tooltip>
            </ul>
          ))}
        </TooltipProvider>
        <Separator />
        <div className="flex h-56 flex-col items-center gap-9 overflow-scroll rounded-full border-[1px] px-2 py-4 dark:bg-[#353346]/30">
          <div className="relative rounded-full border-[1px] p-2 dark:border-t-[2px] dark:border-t-[#353346] dark:bg-[#353346]/70">
            <LucideMousePointerClick className="dark:text-white" size={18} />
            <div className="absolute -bottom-[30px] left-1/2 h-6 translate-x-[-50%] transform border-l-2 border-muted-foreground/50" />
          </div>
          <div className="relative rounded-full border-[1px] p-2 dark:border-t-[2px] dark:border-t-[#353346] dark:bg-[#353346]/70">
            <GitBranch className="text-muted-foreground" size={18} />
            <div className="absolute -bottom-[30px] left-1/2 h-6 translate-x-[-50%] transform border-l-2 border-muted-foreground/50"></div>
          </div>
          <div className="relative rounded-full border-[1px] p-2 dark:border-t-[2px] dark:border-t-[#353346] dark:bg-[#353346]/70">
            <Database className="text-muted-foreground" size={18} />
            <div className="absolute -bottom-[30px] left-1/2 h-6 translate-x-[-50%] transform border-l-2 border-muted-foreground/50"></div>
          </div>
          <div className="relative rounded-full border-[1px] p-2 dark:border-t-[2px] dark:border-t-[#353346] dark:bg-[#353346]/70">
            <GitBranch className="text-muted-foreground" size={18} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <ThemeSelector />
      </div>
    </nav>
  );
};

export default MenuOptions;
