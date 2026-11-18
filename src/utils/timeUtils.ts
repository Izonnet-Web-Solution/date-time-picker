import type {
  DatePickerLocale,
  SupportedLocale,
  TimeObject,
  TimePeriod,
  ValidationResult,
} from '../types';
import { getLocale } from '../localization';
import { isSameDay } from './dateUtils';

export interface TimeValidationOptions {
  minimumTime?: string | Date;
  maximumTime?: string | Date;
  selectedDate?: Date | null;
  minimumDate?: Date;
  maximumDate?: Date;
  minuteInterval?: number;
  locale?: SupportedLocale | DatePickerLocale;
}

export const padZero = (n: number, len = 2): string => {
  return String(n).padStart(len, '0');
};

/**
 * Detects if a format string specifies 24-hour mode.
 * Returns true if format contains 24h tokens (HH, H) without 12h/AM/PM indicators.
 */
export const is24HourFormat = (format?: string): boolean => {
  if (!format) return false;
  if (/hh|h\b|[Aa]/.test(format)) {
    return false;
  }
  if (/HH|H\b/.test(format)) {
    return true;
  }
  return false;
};

/**
 * Converts a 24-hour number (0-23) to 12-hour format with AM/PM.
 */
export const convert24To12 = (
  hour24: number
): { hour12: number; period: TimePeriod } => {
  const clamped = Math.max(0, Math.min(23, Math.floor(hour24)));
  if (clamped === 0) {
    return { hour12: 12, period: 'AM' };
  }
  if (clamped === 12) {
    return { hour12: 12, period: 'PM' };
  }
  if (clamped > 12) {
    return { hour12: clamped - 12, period: 'PM' };
  }
  return { hour12: clamped, period: 'AM' };
};

/**
 * Converts a 12-hour number (1-12) and AM/PM period to 24-hour (0-23).
 */
export const convert12To24 = (hour12: number, period: TimePeriod): number => {
  const clamped = Math.max(1, Math.min(12, Math.floor(hour12)));
  if (period === 'AM') {
    return clamped === 12 ? 0 : clamped;
  } else {
    return clamped === 12 ? 12 : clamped + 12;
  }
};

/**
 * Returns a new Date with updated time components while preserving year, month, date.
 */
export const setTimeOnDate = (
  date: Date,
  hours: number,
  minutes: number,
  seconds = 0,
  ms = 0
): Date => {
  const result = new Date(date);
  result.setHours(hours, minutes, seconds, ms);
  return result;
};

/**
 * Extracts TimeObject from a Date.
 */
export const getTimeFromDate = (
  date: Date,
  is24Hour = false
): TimeObject => {
  const h24 = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  if (is24Hour) {
    return {
      hours: h24,
      minutes,
      seconds,
      is24Hour: true,
      period: h24 >= 12 ? 'PM' : 'AM',
    };
  }

  const { hour12, period } = convert24To12(h24);
  return {
    hours: hour12,
    minutes,
    seconds,
    period,
    is24Hour: false,
  };
};

/**
 * Parses time string (e.g. "14:30", "02:30 PM", "9:45 AM", "23:59:59")
 */
export const parseTimeString = (
  text: string
): {
  hours24: number;
  hours: number;
  minutes: number;
  seconds: number;
  is24Hour: boolean;
  period?: TimePeriod;
} | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // Match 12h: "02:30 PM", "2:30:15 pm", "11:00 AM"
  const match12 = trimmed.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|am|pm)$/i
  );
  if (match12) {
    const rawH = parseInt(match12[1], 10);
    const m = parseInt(match12[2], 10);
    const s = match12[3] ? parseInt(match12[3], 10) : 0;
    const period = match12[4].toUpperCase() as TimePeriod;

    if (rawH < 1 || rawH > 12 || m < 0 || m > 59 || s < 0 || s > 59) {
      return null;
    }

    const hours24 = convert12To24(rawH, period);
    return {
      hours24,
      hours: rawH,
      minutes: m,
      seconds: s,
      is24Hour: false,
      period,
    };
  }

  // Match 24h: "14:30", "09:15:30", "00:00"
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (match24) {
    const rawH = parseInt(match24[1], 10);
    const m = parseInt(match24[2], 10);
    const s = match24[3] ? parseInt(match24[3], 10) : 0;

    if (rawH < 0 || rawH > 23 || m < 0 || m > 59 || s < 0 || s > 59) {
      return null;
    }

    return {
      hours24: rawH,
      hours: rawH,
      minutes: m,
      seconds: s,
      is24Hour: true,
      period: rawH >= 12 ? 'PM' : 'AM',
    };
  }

  return null;
};

/**
 * Converts a time representation (string, Date, or TimeObject) to total minutes from midnight (0..1439).
 */
export const getMinutesFromMidnight = (
  time: string | Date | { hours: number; minutes: number; period?: TimePeriod; is24Hour?: boolean }
): number | null => {
  if (time instanceof Date) {
    return time.getHours() * 60 + time.getMinutes();
  }

  if (typeof time === 'string') {
    const parsed = parseTimeString(time);
    if (!parsed) return null;
    return parsed.hours24 * 60 + parsed.minutes;
  }

  if (typeof time === 'object' && time !== null) {
    let h24 = time.hours;
    if (!time.is24Hour && time.period) {
      h24 = convert12To24(time.hours, time.period);
    }
    return h24 * 60 + time.minutes;
  }

  return null;
};

/**
 * Formats minutes from midnight into a display string.
 */
export const formatMinutesFromMidnight = (
  totalMinutes: number,
  is24Hour = false
): string => {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;

  if (is24Hour) {
    return `${padZero(h24)}:${padZero(m)}`;
  }

  const { hour12, period } = convert24To12(h24);
  return `${padZero(hour12)}:${padZero(m)} ${period}`;
};

/**
 * Validates time strictly against ranges, boundaries, and interval rules.
 */
export const validateTime = (
  time: {
    hours: number;
    minutes: number;
    seconds?: number;
    period?: TimePeriod;
    is24Hour?: boolean;
  },
  is24Hour: boolean,
  options?: TimeValidationOptions
): ValidationResult => {
  const { hours, minutes, seconds = 0, period } = time;
  const locale = getLocale(options?.locale);

  // 1. Basic hour boundaries
  if (is24Hour) {
    if (!Number.isInteger(hours) || hours < 0 || hours > 23) {
      return {
        isValid: false,
        errorCode: 'INVALID_HOUR',
        error: locale.errors.invalidTime || 'Hour must be between 00 and 23.',
      };
    }
  } else {
    if (!Number.isInteger(hours) || hours < 1 || hours > 12) {
      return {
        isValid: false,
        errorCode: 'INVALID_HOUR',
        error: locale.errors.invalidTime || 'Hour must be between 01 and 12.',
      };
    }
    if (!period || (period !== 'AM' && period !== 'PM')) {
      return {
        isValid: false,
        errorCode: 'INVALID_TIME',
        error: locale.errors.invalidTime || 'Period must be AM or PM.',
      };
    }
  }

  // 2. Minute boundaries
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
    return {
      isValid: false,
      errorCode: 'INVALID_MINUTE',
      error: locale.errors.invalidTime || 'Minute must be between 00 and 59.',
    };
  }

  // 3. Second boundaries
  if (!Number.isInteger(seconds) || seconds < 0 || seconds > 59) {
    return {
      isValid: false,
      errorCode: 'INVALID_SECOND',
      error: locale.errors.invalidTime || 'Second must be between 00 and 59.',
    };
  }

  const hour24 = is24Hour ? hours : convert12To24(hours, period as TimePeriod);
  const currentTotalMinutes = hour24 * 60 + minutes;

  // 4. Standalone minimumTime check
  if (options?.minimumTime) {
    const minMinutes = getMinutesFromMidnight(options.minimumTime);
    if (minMinutes !== null && currentTotalMinutes < minMinutes) {
      const formattedMin = formatMinutesFromMidnight(minMinutes, is24Hour);
      return {
        isValid: false,
        errorCode: 'MIN_TIME',
        error: locale.errors.minTime.replace('{min}', formattedMin),
      };
    }
  }

  // 5. Standalone maximumTime check
  if (options?.maximumTime) {
    const maxMinutes = getMinutesFromMidnight(options.maximumTime);
    if (maxMinutes !== null && currentTotalMinutes > maxMinutes) {
      const formattedMax = formatMinutesFromMidnight(maxMinutes, is24Hour);
      return {
        isValid: false,
        errorCode: 'MAX_TIME',
        error: locale.errors.maxTime.replace('{max}', formattedMax),
      };
    }
  }

  // 6. DateTime minimumDate constraint (if date is same day as minimumDate)
  if (options?.selectedDate && options.minimumDate && isSameDay(options.selectedDate, options.minimumDate)) {
    const minDateMinutes = options.minimumDate.getHours() * 60 + options.minimumDate.getMinutes();
    if (currentTotalMinutes < minDateMinutes) {
      const formattedMin = formatMinutesFromMidnight(minDateMinutes, is24Hour);
      return {
        isValid: false,
        errorCode: 'MIN_TIME',
        error: locale.errors.minTime.replace('{min}', formattedMin),
      };
    }
  }

  // 7. DateTime maximumDate constraint (if date is same day as maximumDate)
  if (options?.selectedDate && options.maximumDate && isSameDay(options.selectedDate, options.maximumDate)) {
    const maxDateMinutes = options.maximumDate.getHours() * 60 + options.maximumDate.getMinutes();
    if (currentTotalMinutes > maxDateMinutes) {
      const formattedMax = formatMinutesFromMidnight(maxDateMinutes, is24Hour);
      return {
        isValid: false,
        errorCode: 'MAX_TIME',
        error: locale.errors.maxTime.replace('{max}', formattedMax),
      };
    }
  }

  return { isValid: true };
};

/**
 * Checks if a specific hour is disabled under constraints.
 */
export const isHourDisabled = (
  hour: number,
  is24Hour: boolean,
  period?: TimePeriod,
  options?: TimeValidationOptions
): boolean => {
  const h24 = is24Hour ? hour : convert12To24(hour, period || 'AM');
  const hourStartMinutes = h24 * 60;
  const hourEndMinutes = h24 * 60 + 59;

  if (options?.minimumTime) {
    const min = getMinutesFromMidnight(options.minimumTime);
    if (min !== null && hourEndMinutes < min) return true;
  }

  if (options?.maximumTime) {
    const max = getMinutesFromMidnight(options.maximumTime);
    if (max !== null && hourStartMinutes > max) return true;
  }

  if (options?.selectedDate && options.minimumDate && isSameDay(options.selectedDate, options.minimumDate)) {
    const min = options.minimumDate.getHours() * 60 + options.minimumDate.getMinutes();
    if (hourEndMinutes < min) return true;
  }

  if (options?.selectedDate && options.maximumDate && isSameDay(options.selectedDate, options.maximumDate)) {
    const max = options.maximumDate.getHours() * 60 + options.maximumDate.getMinutes();
    if (hourStartMinutes > max) return true;
  }

  return false;
};

/**
 * Checks if a specific minute is disabled for a given hour under constraints.
 */
export const isMinuteDisabled = (
  minute: number,
  hour: number,
  is24Hour: boolean,
  period?: TimePeriod,
  options?: TimeValidationOptions
): boolean => {
  const h24 = is24Hour ? hour : convert12To24(hour, period || 'AM');
  const totalMinutes = h24 * 60 + minute;

  if (options?.minimumTime) {
    const min = getMinutesFromMidnight(options.minimumTime);
    if (min !== null && totalMinutes < min) return true;
  }

  if (options?.maximumTime) {
    const max = getMinutesFromMidnight(options.maximumTime);
    if (max !== null && totalMinutes > max) return true;
  }

  if (options?.selectedDate && options.minimumDate && isSameDay(options.selectedDate, options.minimumDate)) {
    const min = options.minimumDate.getHours() * 60 + options.minimumDate.getMinutes();
    if (totalMinutes < min) return true;
  }

  if (options?.selectedDate && options.maximumDate && isSameDay(options.selectedDate, options.maximumDate)) {
    const max = options.maximumDate.getHours() * 60 + options.maximumDate.getMinutes();
    if (totalMinutes > max) return true;
  }

  return false;
};
