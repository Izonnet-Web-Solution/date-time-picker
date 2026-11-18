import type {
  DatePickerLocale,
  DisabledDateCheck,
  DateRange,
  CalendarDayCell,
} from '../types';
import {
  getDaysInMonth,
  createLocalDate,
  isSameDay,
  isToday,
  isDateInRange,
  stripTime,
} from './dateUtils';
import { isDateDisabled, isWeekdayDisabled } from './dateValidation';

export interface CalendarGridOptions {
  year: number;
  month: number; // 0-indexed
  firstDayOfWeek?: number; // 0 = Sunday, 1 = Monday
  selectedDate?: Date | null;
  range?: DateRange;
  minimumDate?: Date;
  maximumDate?: Date;
  disabledDates?: (Date | string)[] | DisabledDateCheck;
  disabledWeekdays?: number[];
}

/**
 * Builds an array of 35 or 42 day cells representing the monthly calendar grid,
 * with leading days from the previous month and trailing days from the next month.
 */
export const buildCalendarGrid = (options: CalendarGridOptions): CalendarDayCell[] => {
  const {
    year,
    month,
    firstDayOfWeek = 0,
    selectedDate,
    range,
    minimumDate,
    maximumDate,
    disabledDates,
    disabledWeekdays,
  } = options;

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayInstance = createLocalDate(year, month, 1);
  const firstDayWeekday = firstDayInstance.getDay(); // 0 = Sun ... 6 = Sat

  // Calculate leading offset
  const leadingOffset = (firstDayWeekday - firstDayOfWeek + 7) % 7;

  // Previous month info
  const prevMonthIndex = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonthIndex);

  const cells: CalendarDayCell[] = [];

  // Helper to evaluate disability
  const checkIsDisabled = (date: Date): boolean => {
    if (minimumDate && stripTime(date).getTime() < stripTime(minimumDate).getTime()) {
      return true;
    }
    if (maximumDate && stripTime(date).getTime() > stripTime(maximumDate).getTime()) {
      return true;
    }
    if (isDateDisabled(date, disabledDates)) {
      return true;
    }
    if (isWeekdayDisabled(date, disabledWeekdays)) {
      return true;
    }
    return false;
  };

  // 1. Leading days from previous month
  for (let i = leadingOffset - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const date = createLocalDate(prevYear, prevMonthIndex, dayNum);
    cells.push({
      date,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: isSameDay(date, selectedDate),
      isRangeStart: isSameDay(date, range?.startDate),
      isRangeEnd: isSameDay(date, range?.endDate),
      isInRange: isDateInRange(date, range?.startDate ?? null, range?.endDate ?? null),
      isDisabled: checkIsDisabled(date),
    });
  }

  // 2. Days of current month
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const date = createLocalDate(year, month, day);
    cells.push({
      date,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: isToday(date),
      isSelected: isSameDay(date, selectedDate),
      isRangeStart: isSameDay(date, range?.startDate),
      isRangeEnd: isSameDay(date, range?.endDate),
      isInRange: isDateInRange(date, range?.startDate ?? null, range?.endDate ?? null),
      isDisabled: checkIsDisabled(date),
    });
  }

  // 3. Trailing days from next month to complete 7-day grid rows (35 or 42 total)
  const totalCellsNeeded = cells.length > 35 ? 42 : 35;
  const trailingDaysNeeded = totalCellsNeeded - cells.length;
  const nextMonthIndex = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  for (let day = 1; day <= trailingDaysNeeded; day++) {
    const date = createLocalDate(nextYear, nextMonthIndex, day);
    cells.push({
      date,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: isSameDay(date, selectedDate),
      isRangeStart: isSameDay(date, range?.startDate),
      isRangeEnd: isSameDay(date, range?.endDate),
      isInRange: isDateInRange(date, range?.startDate ?? null, range?.endDate ?? null),
      isDisabled: checkIsDisabled(date),
    });
  }

  return cells;
};

/**
 * Returns ordered weekday headers based on firstDayOfWeek.
 */
export const getOrderedWeekdays = (
  firstDayOfWeek = 0,
  locale: DatePickerLocale
): { index: number; name: string; short: string; min: string }[] => {
  const result = [];
  for (let i = 0; i < 7; i++) {
    const dayIndex = (firstDayOfWeek + i) % 7;
    result.push({
      index: dayIndex,
      name: locale.weekdays[dayIndex],
      short: locale.weekdaysShort[dayIndex],
      min: locale.weekdaysMin[dayIndex],
    });
  }
  return result;
};
