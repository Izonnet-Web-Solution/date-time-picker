import { useState, useMemo, useCallback } from 'react';
import type {
  CalendarDayCell,
  DatePickerLocale,
  DisabledDateCheck,
  DateRange,
} from '../types';
import {
  buildCalendarGrid,
  getOrderedWeekdays,
} from '../utils/calendarUtils';
import {
  addMonths,
  getStartOfMonth,
  getEndOfMonth,
  stripTime,
} from '../utils/dateUtils';

export interface UseCalendarProps {
  initialDate?: Date | null;
  selectedDate?: Date | null;
  range?: DateRange;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minimumDate?: Date;
  maximumDate?: Date;
  disabledDates?: (Date | string)[] | DisabledDateCheck;
  disabledWeekdays?: number[];
  locale: DatePickerLocale;
}

export interface UseCalendarReturn {
  currentYear: number;
  currentMonth: number;
  currentMonthName: string;
  days: CalendarDayCell[];
  weekdays: { index: number; name: string; short: string; min: string }[];
  canGoPrevMonth: boolean;
  canGoNextMonth: boolean;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  setMonth: (monthIndex: number) => void;
  setYear: (year: number) => void;
  jumpToDate: (date: Date) => void;
}

export const useCalendar = ({
  initialDate,
  selectedDate,
  range,
  firstDayOfWeek = 0,
  minimumDate,
  maximumDate,
  disabledDates,
  disabledWeekdays,
  locale,
}: UseCalendarProps): UseCalendarReturn => {
  const baseDate = initialDate || selectedDate || range?.startDate || new Date();

  const [viewDate, setViewDate] = useState<Date>(() => getStartOfMonth(baseDate));

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const currentMonthName = useMemo(() => {
    return locale.months[currentMonth] || '';
  }, [locale.months, currentMonth]);

  const canGoPrevMonth = useMemo(() => {
    if (!minimumDate) return true;
    const startOfPrevMonth = getEndOfMonth(addMonths(viewDate, -1));
    return stripTime(startOfPrevMonth).getTime() >= stripTime(minimumDate).getTime();
  }, [minimumDate, viewDate]);

  const canGoNextMonth = useMemo(() => {
    if (!maximumDate) return true;
    const startOfNextMonth = getStartOfMonth(addMonths(viewDate, 1));
    return stripTime(startOfNextMonth).getTime() <= stripTime(maximumDate).getTime();
  }, [maximumDate, viewDate]);

  const goToPrevMonth = useCallback(() => {
    if (canGoPrevMonth) {
      setViewDate((prev) => addMonths(prev, -1));
    }
  }, [canGoPrevMonth]);

  const goToNextMonth = useCallback(() => {
    if (canGoNextMonth) {
      setViewDate((prev) => addMonths(prev, 1));
    }
  }, [canGoNextMonth]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setViewDate(getStartOfMonth(today));
  }, []);

  const setMonth = useCallback((monthIndex: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), monthIndex, 1, 0, 0, 0, 0));
  }, []);

  const setYear = useCallback((year: number) => {
    setViewDate((prev) => new Date(year, prev.getMonth(), 1, 0, 0, 0, 0));
  }, []);

  const jumpToDate = useCallback((date: Date) => {
    setViewDate(getStartOfMonth(date));
  }, []);

  const days = useMemo(() => {
    return buildCalendarGrid({
      year: currentYear,
      month: currentMonth,
      firstDayOfWeek,
      selectedDate,
      range,
      minimumDate,
      maximumDate,
      disabledDates,
      disabledWeekdays,
    });
  }, [
    currentYear,
    currentMonth,
    firstDayOfWeek,
    selectedDate,
    range,
    minimumDate,
    maximumDate,
    disabledDates,
    disabledWeekdays,
  ]);

  const weekdays = useMemo(() => {
    return getOrderedWeekdays(firstDayOfWeek, locale);
  }, [firstDayOfWeek, locale]);

  return {
    currentYear,
    currentMonth,
    currentMonthName,
    days,
    weekdays,
    canGoPrevMonth,
    canGoNextMonth,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    setMonth,
    setYear,
    jumpToDate,
  };
};
