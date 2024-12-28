export const getLocaleDisplayName = (locale: string, displayLocale?: string) => {
  const displayName = new Intl.DisplayNames([displayLocale || locale], {
    type: 'language',
  }).of(locale)!;
  return displayName.charAt(0).toLocaleUpperCase() + displayName.slice(1);
};
