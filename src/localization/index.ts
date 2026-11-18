import { enLocale } from './en';
import { hiLocale } from './hi';
import { guLocale } from './gu';
import type { DatePickerLocale, SupportedLocale } from '../types';

export const locales: Record<SupportedLocale, DatePickerLocale> = {
  en: enLocale,
  hi: hiLocale,
  gu: guLocale,
};

export const getLocale = (
  locale?: SupportedLocale | DatePickerLocale
): DatePickerLocale => {
  if (!locale) {
    return enLocale;
  }
  if (typeof locale === 'string') {
    return locales[locale as SupportedLocale] || enLocale;
  }
  return {
    ...enLocale,
    ...locale,
    errors: {
      ...enLocale.errors,
      ...(locale.errors || {}),
    },
  };
};

export { enLocale, hiLocale, guLocale };
