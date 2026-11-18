/**
 * Robust date utility functions using local calendar units.
 * Never compares dates using formatted strings or ambiguous date string parsing.
 */

export const isLeapYear = (year: number): boolean => {
  if (!Number.isInteger(year) || year < 1) {
    return false;
  }
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getDaysInMonth = (year: number, monthIndex: number): number => {
  if (monthIndex < 0 || monthIndex > 11) {
    return 0;
  }
  const daysPerMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysPerMonth[monthIndex];
};

export const createLocalDate = (year: number, monthIndex: number, day: number): Date => {
  const date = new Date(year, monthIndex, day, 0, 0, 0, 0);
  // Guard against JavaScript date rollover (e.g. Feb 30 -> March 2)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid calendar date components: ${year}-${monthIndex + 1}-${day}`);
  }
  return date;
};

export const stripTime = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
};

export const isSameDay = (date1: Date | null | undefined, date2: Date | null | undefined): boolean => {
  if (!date1 || !date2 || isNaN(date1.getTime()) || isNaN(date2.getTime())) {
    return false;
  }
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isBeforeDay = (date1: Date, date2: Date): boolean => {
  const d1 = stripTime(date1);
  const d2 = stripTime(date2);
  return d1.getTime() < d2.getTime();
};

export const isAfterDay = (date1: Date, date2: Date): boolean => {
  const d1 = stripTime(date1);
  const d2 = stripTime(date2);
  return d1.getTime() > d2.getTime();
};

export const isDateInRange = (date: Date, startDate: Date | null, endDate: Date | null): boolean => {
  if (!startDate || !endDate) {
    return false;
  }
  const d = stripTime(date).getTime();
  const start = stripTime(startDate).getTime();
  const end = stripTime(endDate).getTime();
  return d >= start && d <= end;
};

export const addDays = (date: Date, amount: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

export const addMonths = (date: Date, amount: number): Date => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const targetDate = new Date(year, month + amount, 1);
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();
  const maxDays = getDaysInMonth(targetYear, targetMonth);

  return new Date(targetYear, targetMonth, Math.min(day, maxDays), 0, 0, 0, 0);
};

export const addYears = (date: Date, amount: number): Date => {
  const year = date.getFullYear() + amount;
  const month = date.getMonth();
  const day = date.getDate();
  const maxDays = getDaysInMonth(year, month);
  return new Date(year, month, Math.min(day, maxDays), 0, 0, 0, 0);
};

export const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
};

export const getEndOfMonth = (date: Date): Date => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month, getDaysInMonth(year, month), 23, 59, 59, 999);
};

export const getDaysDifference = (start: Date, end: Date): number => {
  const s = stripTime(start).getTime();
  const e = stripTime(end).getTime();
  const msInDay = 86400000;
  return Math.round(Math.abs(e - s) / msInDay) + 1; // inclusive count
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};
