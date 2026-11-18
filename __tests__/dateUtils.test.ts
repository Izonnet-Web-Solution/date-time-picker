import {
  isLeapYear,
  getDaysInMonth,
  createLocalDate,
  stripTime,
  isSameDay,
  isBeforeDay,
  isAfterDay,
  isDateInRange,
  addDays,
  addMonths,
  addYears,
  getDaysDifference,
} from '../src/utils/dateUtils';

describe('dateUtils', () => {
  describe('isLeapYear', () => {
    it('correctly identifies leap years', () => {
      expect(isLeapYear(2024)).toBe(true);
      expect(isLeapYear(2000)).toBe(true);
      expect(isLeapYear(2020)).toBe(true);
      expect(isLeapYear(1600)).toBe(true);
    });

    it('correctly identifies non-leap years', () => {
      expect(isLeapYear(2023)).toBe(false);
      expect(isLeapYear(1900)).toBe(false);
      expect(isLeapYear(2100)).toBe(false);
      expect(isLeapYear(2025)).toBe(false);
    });
  });

  describe('getDaysInMonth', () => {
    it('returns 29 days for Feb in leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });

    it('returns 28 days for Feb in non-leap year', () => {
      expect(getDaysInMonth(2023, 1)).toBe(28);
      expect(getDaysInMonth(1900, 1)).toBe(28);
    });

    it('returns 31 days for Jan, Mar, May, Jul, Aug, Oct, Dec', () => {
      [0, 2, 4, 6, 7, 9, 11].forEach((monthIndex) => {
        expect(getDaysInMonth(2024, monthIndex)).toBe(31);
      });
    });

    it('returns 30 days for Apr, Jun, Sep, Nov', () => {
      [3, 5, 8, 10].forEach((monthIndex) => {
        expect(getDaysInMonth(2024, monthIndex)).toBe(30);
      });
    });
  });

  describe('createLocalDate', () => {
    it('creates exact local date at midnight without rollover', () => {
      const d = createLocalDate(2024, 1, 29);
      expect(d.getFullYear()).toBe(2024);
      expect(d.getMonth()).toBe(1);
      expect(d.getDate()).toBe(29);
      expect(d.getHours()).toBe(0);
    });

    it('throws error when trying to create impossible date like Feb 30', () => {
      expect(() => createLocalDate(2024, 1, 30)).toThrow();
      expect(() => createLocalDate(2023, 1, 29)).toThrow();
      expect(() => createLocalDate(2024, 3, 31)).toThrow(); // April has 30 days
    });
  });

  describe('stripTime', () => {
    it('clears hours, minutes, seconds and ms', () => {
      const d = new Date(2024, 5, 15, 14, 30, 45, 123);
      const stripped = stripTime(d);
      expect(stripped.getHours()).toBe(0);
      expect(stripped.getMinutes()).toBe(0);
      expect(stripped.getSeconds()).toBe(0);
      expect(stripped.getMilliseconds()).toBe(0);
      expect(stripped.getDate()).toBe(15);
    });
  });

  describe('isSameDay', () => {
    it('returns true for same day regardless of time', () => {
      const d1 = new Date(2024, 10, 18, 9, 0);
      const d2 = new Date(2024, 10, 18, 23, 59);
      expect(isSameDay(d1, d2)).toBe(true);
    });

    it('returns false for different days', () => {
      const d1 = new Date(2024, 10, 18);
      const d2 = new Date(2024, 10, 19);
      expect(isSameDay(d1, d2)).toBe(false);
    });

    it('handles null and undefined safely', () => {
      expect(isSameDay(null, new Date())).toBe(false);
      expect(isSameDay(new Date(), undefined)).toBe(false);
      expect(isSameDay(null, null)).toBe(false);
    });
  });

  describe('isBeforeDay & isAfterDay', () => {
    it('compares calendar dates correctly', () => {
      const d1 = new Date(2024, 5, 10);
      const d2 = new Date(2024, 5, 11);
      expect(isBeforeDay(d1, d2)).toBe(true);
      expect(isAfterDay(d2, d1)).toBe(true);
      expect(isBeforeDay(d1, d1)).toBe(false);
    });
  });

  describe('isDateInRange', () => {
    it('returns true when date is between start and end (inclusive)', () => {
      const start = new Date(2024, 0, 10);
      const end = new Date(2024, 0, 20);
      expect(isDateInRange(new Date(2024, 0, 10), start, end)).toBe(true);
      expect(isDateInRange(new Date(2024, 0, 15), start, end)).toBe(true);
      expect(isDateInRange(new Date(2024, 0, 20), start, end)).toBe(true);
      expect(isDateInRange(new Date(2024, 0, 9), start, end)).toBe(false);
      expect(isDateInRange(new Date(2024, 0, 21), start, end)).toBe(false);
    });
  });

  describe('addDays, addMonths, addYears', () => {
    it('adds and subtracts days correctly across month boundaries', () => {
      const d = new Date(2024, 0, 31);
      const nextDay = addDays(d, 1);
      expect(nextDay.getMonth()).toBe(1);
      expect(nextDay.getDate()).toBe(1);
    });

    it('adds months and clips to last valid day of month', () => {
      const d = new Date(2024, 0, 31); // Jan 31, 2024
      const nextMonth = addMonths(d, 1); // Feb in 2024 has 29 days
      expect(nextMonth.getMonth()).toBe(1);
      expect(nextMonth.getDate()).toBe(29);
    });

    it('adds years correctly and adjusts leap year to Feb 28', () => {
      const leapDay = new Date(2024, 1, 29);
      const nextYear = addYears(leapDay, 1);
      expect(nextYear.getFullYear()).toBe(2025);
      expect(nextYear.getMonth()).toBe(1);
      expect(nextYear.getDate()).toBe(28);
    });
  });

  describe('getDaysDifference', () => {
    it('calculates inclusive day difference', () => {
      const start = new Date(2024, 0, 1);
      const end = new Date(2024, 0, 5);
      expect(getDaysDifference(start, end)).toBe(5);
    });
  });
});
