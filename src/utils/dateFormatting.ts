import type { DateFormat, DatePickerLocale, SupportedLocale, StandardDateFormat } from '../types';

export const STANDARD_DATE_FORMATS: StandardDateFormat[] = [
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'YYYY/DD/MM',
  'YYYY/MM/DD',
];
import { enLocale } from '../localization/en';
import { getLocale } from '../localization';
import { convert24To12, padZero } from './timeUtils';

/**
 * Format a Date object to string based on format pattern and locale.
 * Supports date, 24-hour, and 12-hour AM/PM formats.
 * Safely accepts locale as a string code ('en', 'hi', 'gu') or a DatePickerLocale object.
 * Uses a single-pass regex replacement to completely prevent token collision.
 * Never throws on valid Date.
 */
export const formatDate = (
  date: Date | null | undefined,
  format: DateFormat = 'DD/MM/YYYY',
  locale: SupportedLocale | DatePickerLocale = enLocale
): string => {
  if (!date || isNaN(date.getTime())) {
    return '';
  }

  const activeLocale = getLocale(locale);

  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();
  const dayOfWeek = date.getDay();

  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const { hour12, period } = convert24To12(hours24);
  const localizedPeriod =
    period === 'AM' ? activeLocale.am || 'AM' : activeLocale.pm || 'PM';

  const tokenMap: Record<string, string> = {
    YYYY: String(year),
    YY: String(year).slice(-2),
    MMMM: activeLocale.months?.[month] || '',
    MMM: activeLocale.monthsShort?.[month] || '',
    MM: padZero(month + 1),
    M: String(month + 1),
    DD: padZero(day),
    D: String(day),
    dddd: activeLocale.weekdays?.[dayOfWeek] || '',
    ddd: activeLocale.weekdaysShort?.[dayOfWeek] || '',
    HH: padZero(hours24),
    H: String(hours24),
    hh: padZero(hour12),
    h: String(hour12),
    mm: padZero(minutes),
    m: String(minutes),
    ss: padZero(seconds),
    s: String(seconds),
    A: localizedPeriod,
    a: localizedPeriod.toLowerCase(),
  };

  // Match tokens or bracket-escaped strings in a single pass
  const regex = /(\[.*?\]|YYYY|YY|MMMM|MMM|MM|M|dddd|ddd|DD|D|HH|H|hh|h|mm|m|ss|s|A|a)/g;

  return format.replace(regex, (match) => {
    if (match.startsWith('[') && match.endsWith(']')) {
      return match.slice(1, -1);
    }
    return tokenMap[match] !== undefined ? tokenMap[match] : match;
  });
};

/**
 * Returns user-friendly placeholder based on format
 */
export const getPlaceholderForFormat = (format: DateFormat = 'DD/MM/YYYY'): string => {
  switch (format) {
    case 'DD/MM/YYYY':
      return 'DD/MM/YYYY';
    case 'MM/DD/YYYY':
      return 'MM/DD/YYYY';
    case 'YYYY/DD/MM':
      return 'YYYY/DD/MM';
    case 'YYYY/MM/DD':
      return 'YYYY/MM/DD';
    case 'YYYY-MM-DD':
      return 'YYYY-MM-DD';
    case 'DD-MM-YYYY':
      return 'DD-MM-YYYY';
    case 'HH:mm':
      return 'HH:mm (24h)';
    case 'hh:mm A':
      return 'hh:mm AM/PM';
    case 'DD/MM/YYYY HH:mm':
      return 'DD/MM/YYYY HH:mm';
    case 'DD/MM/YYYY hh:mm A':
      return 'DD/MM/YYYY hh:mm AM/PM';
    default:
      return format;
  }
};
