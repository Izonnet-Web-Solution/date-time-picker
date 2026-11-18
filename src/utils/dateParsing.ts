import type { DateFormat, DatePickerLocale, SupportedLocale, ValidationResult } from '../types';
import { enLocale } from '../localization/en';
import { getLocale } from '../localization';
import { validateDateComponents } from './dateValidation';
import { createLocalDate } from './dateUtils';
import {
  parseTimeString,
  validateTime,
  is24HourFormat,
  setTimeOnDate,
} from './timeUtils';

export interface ParseResult {
  date: Date | null;
  validation: ValidationResult;
}

/**
 * Strict time string parsing according to format.
 * Supports 24-hour (HH:mm, HH:mm:ss) and 12-hour (hh:mm A, hh:mm:ss A).
 */
export const parseTimeStrict = (
  text: string,
  format: DateFormat = 'hh:mm A',
  locale: SupportedLocale | DatePickerLocale = enLocale,
  baseDate: Date = new Date()
): ParseResult => {
  const activeLocale = getLocale(locale);
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      date: null,
      validation: {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        error: activeLocale.errors.invalidTime || 'Please enter a valid time.',
      },
    };
  }

  const is24 = is24HourFormat(format);
  const parsed = parseTimeString(trimmed);

  if (!parsed) {
    return {
      date: null,
      validation: {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        error: activeLocale.errors.invalidTime || 'Please enter a valid time.',
      },
    };
  }

  const validation = validateTime(
    {
      hours: parsed.hours,
      minutes: parsed.minutes,
      seconds: parsed.seconds,
      period: parsed.period,
      is24Hour: parsed.is24Hour,
    },
    is24,
    { locale: activeLocale }
  );

  if (!validation.isValid) {
    return {
      date: null,
      validation,
    };
  }

  const resultDate = setTimeOnDate(
    baseDate,
    parsed.hours24,
    parsed.minutes,
    parsed.seconds
  );

  return {
    date: resultDate,
    validation: { isValid: true },
  };
};

/**
 * Strict date string parsing according to format.
 * Supports date-only, time-only, and combined datetime formats.
 * Never calls new Date(text) with ambiguous strings.
 * Never silently normalizes impossible dates.
 */
export const parseDateStrict = (
  text: string,
  format: DateFormat = 'DD/MM/YYYY',
  locale: SupportedLocale | DatePickerLocale = enLocale
): ParseResult => {
  const activeLocale = getLocale(locale);
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      date: null,
      validation: {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        error: activeLocale.errors.invalidDate,
      },
    };
  }

  const hasDatePart = /Y|D|M/i.test(format.replace(/mm/g, ''));
  const hasTimePart = /H|h|m|s|[Aa]/.test(format);

  // 1. Time-only format (e.g. HH:mm, hh:mm A)
  if (!hasDatePart && hasTimePart) {
    return parseTimeStrict(trimmed, format, activeLocale);
  }

  // 2. DateTime format (e.g. DD/MM/YYYY HH:mm, DD/MM/YYYY hh:mm A)
  if (hasDatePart && hasTimePart) {
    let dateStr = '';
    let timeStr = '';
    let dateFormatStr = '';
    let timeFormatStr = '';

    if (format.includes(' ')) {
      const formatSpaceIdx = format.indexOf(' ');
      dateFormatStr = format.slice(0, formatSpaceIdx).trim();
      timeFormatStr = format.slice(formatSpaceIdx + 1).trim();

      const textSpaceIdx = trimmed.indexOf(' ');
      if (textSpaceIdx > 0) {
        dateStr = trimmed.slice(0, textSpaceIdx).trim();
        timeStr = trimmed.slice(textSpaceIdx + 1).trim();
      }
    } else if (format.includes('T')) {
      const formatParts = format.split('T');
      dateFormatStr = formatParts[0];
      timeFormatStr = formatParts[1];
      const textParts = trimmed.split('T');
      dateStr = textParts[0];
      timeStr = textParts[1] || '';
    }

    if (!dateStr || !timeStr) {
      return {
        date: null,
        validation: {
          isValid: false,
          errorCode: 'INVALID_FORMAT',
          error: activeLocale.errors.invalidDate,
        },
      };
    }

    const dateResult = parseDateStrict(dateStr, dateFormatStr, activeLocale);
    if (!dateResult.validation.isValid || !dateResult.date) {
      return dateResult;
    }

    const timeResult = parseTimeStrict(timeStr, timeFormatStr, activeLocale, dateResult.date);
    return timeResult;
  }

  // 3. Date-only format (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD-MM-YYYY)
  let separator = '/';
  if (format.includes('-')) {
    separator = '-';
  } else if (format.includes('.')) {
    separator = '.';
  }

  const parts = trimmed.split(separator);
  const formatParts = format.split(separator);

  if (parts.length !== 3 || formatParts.length !== 3) {
    return {
      date: null,
      validation: {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        error: activeLocale.errors.invalidDate,
      },
    };
  }

  let day: number | null = null;
  let month: number | null = null;
  let year: number | null = null;

  for (let i = 0; i < 3; i++) {
    const part = parts[i].trim();
    const token = formatParts[i].trim().toUpperCase();

    // Verify all chars are numeric
    if (!/^\d+$/.test(part)) {
      return {
        date: null,
        validation: {
          isValid: false,
          errorCode: 'INVALID_FORMAT',
          error: activeLocale.errors.invalidDate,
        },
      };
    }

    const num = parseInt(part, 10);

    if (token.startsWith('D')) {
      if (part.length > 2) {
        return {
          date: null,
          validation: {
            isValid: false,
            errorCode: 'INVALID_DAY',
            error: activeLocale.errors.invalidDate,
          },
        };
      }
      day = num;
    } else if (token.startsWith('M')) {
      if (part.length > 2) {
        return {
          date: null,
          validation: {
            isValid: false,
            errorCode: 'INVALID_MONTH',
            error: activeLocale.errors.invalidDate,
          },
        };
      }
      month = num;
    } else if (token.startsWith('Y')) {
      if (token === 'YYYY' && part.length !== 4) {
        return {
          date: null,
          validation: {
            isValid: false,
            errorCode: 'INVALID_YEAR',
            error: activeLocale.errors.invalidDate,
          },
        };
      }
      if (token === 'YY' && part.length !== 2) {
        return {
          date: null,
          validation: {
            isValid: false,
            errorCode: 'INVALID_YEAR',
            error: activeLocale.errors.invalidDate,
          },
        };
      }
      year = token === 'YY' ? 2000 + num : num;
    }
  }

  if (day === null || month === null || year === null) {
    return {
      date: null,
      validation: {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        error: activeLocale.errors.invalidDate,
      },
    };
  }

  // Strictly validate day, month, leap year, days in month
  const componentValidation = validateDateComponents(year, month, day, activeLocale);
  if (!componentValidation.isValid) {
    return {
      date: null,
      validation: componentValidation,
    };
  }

  try {
    const constructedDate = createLocalDate(year, month - 1, day);
    return {
      date: constructedDate,
      validation: { isValid: true },
    };
  } catch (err: any) {
    return {
      date: null,
      validation: {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        error: err?.message || activeLocale.errors.invalidDate,
      },
    };
  }
};

/**
 * Automatically applies mask separators as the user types digits.
 * Supports date and time formats.
 */
export const formatMaskedInput = (
  rawText: string,
  format: DateFormat = 'DD/MM/YYYY'
): string => {
  // Time format mask (HH:mm)
  if (format === 'HH:mm') {
    const digitsOnly = rawText.replace(/\D/g, '');
    const h = digitsOnly.slice(0, 2);
    const m = digitsOnly.slice(2, 4);
    if (m) return `${h}:${m}`;
    return h;
  }

  const digitsOnly = rawText.replace(/\D/g, '');
  const separator = format.includes('-') ? '-' : '/';

  if (format.startsWith('YYYY')) {
    // YYYY-MM-DD
    const y = digitsOnly.slice(0, 4);
    const m = digitsOnly.slice(4, 6);
    const d = digitsOnly.slice(6, 8);

    if (d) return `${y}${separator}${m}${separator}${d}`;
    if (m) return `${y}${separator}${m}`;
    return y;
  } else {
    // DD/MM/YYYY or MM/DD/YYYY or DD-MM-YYYY
    const p1 = digitsOnly.slice(0, 2);
    const p2 = digitsOnly.slice(2, 4);
    const p3 = digitsOnly.slice(4, 8);

    if (p3) return `${p1}${separator}${p2}${separator}${p3}`;
    if (p2) return `${p1}${separator}${p2}`;
    return p1;
  }
};
