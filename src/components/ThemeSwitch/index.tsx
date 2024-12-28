'use client';

import { useEffect, useState } from 'react';
import { IconCheck, IconMoon, IconSun } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/providers/Theme';
import { Theme, themeLocalStorageKey } from './types';

export function ThemeSwitch() {
  const { setTheme } = useTheme();
  const [value, setValue] = useState('');

  const onThemeChange = (themeToSet: Theme & 'system') => {
    if (themeToSet === 'system') {
      setTheme(null);
      setValue('system');
    } else {
      setTheme(themeToSet);
      setValue(themeToSet);
    }
  };

  useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey);
    setValue(preference ?? 'auto');
  }, []);

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = value === 'dark' ? '#020817' : '#fff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
  }, [value]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="scale-95 rounded-full">
          <IconSun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <IconMoon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onThemeChange('light')}>
          Light{' '}
          <IconCheck
            size={14}
            className={cn('ml-auto', value !== 'light' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onThemeChange('dark')}>
          Dark
          <IconCheck
            size={14}
            className={cn('ml-auto', value !== 'dark' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onThemeChange('system')}>
          System
          <IconCheck
            size={14}
            className={cn('ml-auto', value !== 'system' && 'hidden')}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
