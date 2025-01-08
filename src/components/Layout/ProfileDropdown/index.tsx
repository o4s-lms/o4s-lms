'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useAuth } from '@/providers/Auth';
import { useTranslate } from '@tolgee/react';
import { getClientSideURL } from '@/utilities/getURL';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { StaticImageData } from 'next/image';
import { checkRole } from '@/access/checkRole';
import { BadgeCheck, BookUser, CreditCard, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProfileDropdown() {
  const { user, isSignedIn, isLoaded } = useAuth();
  const { t } = useTranslate();
  const router = useRouter();

  let src: StaticImageData | string = '';

  if (!isLoaded) return null;

  if (!isSignedIn && isLoaded) return null;

  if (user?.avatar && typeof user?.avatar === 'object') {
    const { url } = user?.avatar;

    src = `${getClientSideURL()}${url}`;
  }

  if (src === '') {
    src = createAvatar(lorelei, {
      seed: user?.name || '',
      size: 128,
      // ... other options
    }).toDataUri();
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={src} alt={user?.name ? user.name : 'O4S'} />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {checkRole('admin', user) && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/app-admin">
                  <BadgeCheck />
                  App Admin
                  <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href="/dashboard/courses">
              <BookUser />
              {t('courses')}
              <DropdownMenuShortcut>⇧⌘C</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <CreditCard />
              {t('billing')}
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings/account">
              <Settings />
              {t('settings')}
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            router.push(`/log-out`);
          }}
        >
          <LogOut />
          {t('log-out')}
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
