'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useState } from 'react';

import type { Theme } from './types';

import { useTheme } from '..';
import { themeLocalStorageKey } from './types';
import { ChevronDown, Moon, Sun } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme();
  const [value, setValue] = useState('');

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null);
      setValue('auto');
    } else {
      setTheme(themeToSet);
      setValue(themeToSet);
    }
  };

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey);
    setValue(preference ?? 'auto');
  }, []);

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger
        aria-label="Select a theme"
        className="w-auto gap-2 border-none bg-transparent pl-0 md:pl-3"
      >
        <SelectValue placeholder="Theme">
          <Moon className="size-[1.2rem] rotate-0 scale-100 transition-all dark:hidden dark:-rotate-90 dark:scale-0" />
          <Sun className="size-[1.2rem] rotate-90 scale-0 transition-all dark:flex dark:rotate-0 dark:scale-100" />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">Auto</SelectItem>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
      </SelectContent>
    </Select>
  );
};
