import type {
  DatePickerLocale,
  ValidationResult,
  DisabledDateCheck,
} from '../types';
import {
  isLeapYear,
  getDaysInMonth,
  isBeforeDay,
  isAfterDay,
  isSameDay,
  getDaysDifference,
} from './dateUtils';
import { validateTime, getTimeFromDate } from './timeUtils';

export interface DateValidationOptions {
  minimumDate?: Date;
  maximumDate?: Date;
  disabledDates?: (Date | string)[] | DisabledDateCheck;
  disabledWeekdays?: number[];
  minimumTime?: string | Date;
  maximumTime?: string | Date;
  is24Hour?: boolean;
  validateTimeComponent?: boolean;
  locale?: DatePickerLocale;
}

export interface RangeValidationOptions extends DateValidationOptions {
  maxRangeDays?: number;
}

/**
 * Validates individual numeric components of a date strictly.
 */
export const validateDateComponents = (
  year: number,
  month1Indexed: number,
  day: number,
  locale?: DatePickerLocale
): ValidationResult => {
  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    return {
      isValid: false,
      errorCode: 'INVALID_YEAR',
      error: locale?.errors.invalidDate || 'Invalid year. Must be a 4-digit year.',
    };
  }

  if (!Number.isInteger(month1Indexed) || month1Indexed < 1 || month1Indexed > 12) {
    return {
      isValid: false,
      errorCode: 'INVALID_MONTH',
      error: locale?.errors.invalidDate || 'Invalid month. Must be between 1 and 12.',
    };
  }

  const monthIndex = month1Indexed - 1;
  const maxDays = getDaysInMonth(year, monthIndex);

  if (month1Indexed === 2 && day === 29 && !isLeapYear(year)) {
    return {
      isValid: false,
      errorCode: 'LEAP_YEAR',
      error: locale?.errors.invalidDate || `${year} is not a leap year. February has 28 days.`,
    };
  }

  if (!Number.isInteger(day) || day < 1 || day > maxDays) {
    return {
      isValid: false,
      errorCode: 'INVALID_DAY',
      error:
        locale?.errors.invalidDate ||
        `Invalid day for the selected month. Day must be between 1 and ${maxDays}.`,
    };
  }

  return { isValid: true };
};

/**
 * Checks if a specific date is disabled by disabledDates array or function
 */
export const isDateDisabled = (
  date: Date,
  disabledDates?: (Date | string)[] | DisabledDateCheck
): boolean => {
  if (!disabledDates) {
    return false;
  }

  if (typeof disabledDates === 'function') {
    return disabledDates(date);
  }

  if (Array.isArray(disabledDates)) {
    return disabledDates.some((disabled) => {
      if (disabled instanceof Date) {
        return isSameDay(disabled, date);
      }
      if (typeof disabled === 'string') {
        const [y, m, d] = disabled.split('-').map(Number);
        if (y && m && d) {
          return (
            date.getFullYear() === y &&
            date.getMonth() === m - 1 &&
            date.getDate() === d
          );
        }
      }
      return false;
    });
  }

  return false;
};

/**
 * Checks if day of the week is disabled (0 = Sunday, 6 = Saturday)
 */
export const isWeekdayDisabled = (
  date: Date,
  disabledWeekdays?: number[]
): boolean => {
  if (!disabledWeekdays || !Array.isArray(disabledWeekdays)) {
    return false;
  }
  return disabledWeekdays.includes(date.getDay());
};

/**
 * Validates a Date object against all date and time constraints
 */
export const validateDate = (
  date: Date | null | undefined,
  options?: DateValidationOptions
): ValidationResult => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return {
      isValid: false,
      errorCode: 'INVALID_FORMAT',
      error: options?.locale?.errors.invalidDate || 'Invalid date value.',
    };
  }

  const {
    minimumDate,
    maximumDate,
    disabledDates,
    disabledWeekdays,
    minimumTime,
    maximumTime,
    is24Hour = false,
    validateTimeComponent = false,
    locale,
  } = options || {};

  // 1. Day-level minimum date check
  if (minimumDate && isBeforeDay(date, minimumDate)) {
    const minFormatted = `${minimumDate.getDate()}/${minimumDate.getMonth() + 1}/${minimumDate.getFullYear()}`;
    const errorMsg =
      locale?.errors.minDate.replace('{min}', minFormatted) ||
      `Date cannot be earlier than ${minFormatted}.`;
    return {
      isValid: false,
      errorCode: 'MIN_DATE',
      error: errorMsg,
    };
  }

  // 2. Day-level maximum date check
  if (maximumDate && isAfterDay(date, maximumDate)) {
    const maxFormatted = `${maximumDate.getDate()}/${maximumDate.getMonth() + 1}/${maximumDate.getFullYear()}`;
    const errorMsg =
      locale?.errors.maxDate.replace('{max}', maxFormatted) ||
      `Date cannot be later than ${maxFormatted}.`;
    return {
      isValid: false,
      errorCode: 'MAX_DATE',
      error: errorMsg,
    };
  }

  // 3. Disabled specific dates
  if (isDateDisabled(date, disabledDates)) {
    return {
      isValid: false,
      errorCode: 'DISABLED_DATE',
      error: locale?.errors.disabledDate || 'This date is unavailable.',
    };
  }

  // 4. Disabled weekdays
  if (isWeekdayDisabled(date, disabledWeekdays)) {
    return {
      isValid: false,
      errorCode: 'DISABLED_WEEKDAY',
      error: locale?.errors.disabledWeekday || 'This day of the week is disabled.',
    };
  }

  // 5. Time validation (when validateTimeComponent is active or time boundaries are set)
  if (validateTimeComponent || minimumTime || maximumTime) {
    const timeObj = getTimeFromDate(date, is24Hour);
    const timeVal = validateTime(timeObj, is24Hour, {
      minimumTime,
      maximumTime,
      selectedDate: date,
      minimumDate,
      maximumDate,
      locale,
    });
    if (!timeVal.isValid) {
      return timeVal;
    }
  }

  return { isValid: true };
};

/**
 * Validates a Date Range against constraints
 */
export const validateDateRange = (
  startDate: Date | null | undefined,
  endDate: Date | null | undefined,
  options?: RangeValidationOptions
): ValidationResult => {
  const { maxRangeDays, locale } = options || {};

  if (!startDate && !endDate) {
    return { isValid: true };
  }

  if (startDate) {
    const startVal = validateDate(startDate, options);
    if (!startVal.isValid) {
      return startVal;
    }
  }

  if (endDate) {
    const endVal = validateDate(endDate, options);
    if (!endVal.isValid) {
      return endVal;
    }
  }

  if (startDate && endDate) {
    if (isAfterDay(startDate, endDate)) {
      return {
        isValid: false,
        errorCode: 'START_AFTER_END',
        error:
          locale?.errors.startDateAfterEndDate ||
          'Start date cannot be after end date.',
      };
    }

    if (maxRangeDays && maxRangeDays > 0) {
      const days = getDaysDifference(startDate, endDate);
      if (days > maxRangeDays) {
        const errorMsg =
          locale?.errors.maxRangeExceeded.replace('{days}', String(maxRangeDays)) ||
          `Selected range exceeds maximum allowed limit of ${maxRangeDays} days.`;
        return {
          isValid: false,
          errorCode: 'RANGE_EXCEEDED',
          error: errorMsg,
        };
      }
    }
  }

  return { isValid: true };
};
