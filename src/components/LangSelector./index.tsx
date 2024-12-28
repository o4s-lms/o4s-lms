'use client';

import { setLanguage } from '@/tolgee/language';
import { useCallback, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/utilities/cn';
import { ALL_LANGUAGES as LANGUAGES } from '@/tolgee/shared';
import { Languages, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTolgee } from '@tolgee/react';

const getLocaleDisplayName = (locale: string, displayLocale?: string) => {
  const displayName = new Intl.DisplayNames([displayLocale || locale], {
    type: 'language',
  }).of(locale)!;
  return displayName.charAt(0).toLocaleUpperCase() + displayName.slice(1);
};

export function LanguageSelector() {
  const isMobile = useIsMobile();
  const tolgee = useTolgee(['language']);
  const currentLanguage = tolgee.getLanguage();

  const localesAndNames = useMemo(() => {
    return LANGUAGES.map((locale) => ({
      locale,
      name: getLocaleDisplayName(locale),
    }));
  }, []);

  const languageChanged = useCallback(async (locale: string) => {
    setLanguage(locale);
  }, []);

  return (
    <div className="flex items-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="ghost">
            <Languages size={18} />
            <span className={`${isMobile ? 'hidden' : ''}`}>
              {' '}
              {currentLanguage && getLocaleDisplayName(currentLanguage)}
            </span>
            <ChevronDown size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {localesAndNames.map(({ locale, name }) => {
            const isSelected = currentLanguage === locale;
            return (
              <DropdownMenuItem
                key={locale}
                onClick={() => languageChanged(locale)}
              >
                <span
                  className={cn(
                    `block truncate`,
                    isSelected && 'font-bold text-primary',
                  )}
                >
                  {name}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
