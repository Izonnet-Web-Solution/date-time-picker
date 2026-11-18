import {
  validateDate,
  validateDateRange,
  isDateDisabled,
  isWeekdayDisabled,
} from '../src/utils/dateValidation';
import { enLocale } from '../src/localization/en';

describe('dateValidation', () => {
  const baseDate = new Date(2024, 5, 15); // June 15, 2024 (Saturday)

  describe('minimumDate & maximumDate', () => {
    it('validates minimumDate correctly', () => {
      const min = new Date(2024, 5, 10);
      expect(validateDate(baseDate, { minimumDate: min, locale: enLocale }).isValid).toBe(true);

      const tooEarly = new Date(2024, 5, 9);
      const res = validateDate(tooEarly, { minimumDate: min, locale: enLocale });
      expect(res.isValid).toBe(false);
      expect(res.errorCode).toBe('MIN_DATE');
    });

    it('validates maximumDate correctly', () => {
      const max = new Date(2024, 5, 20);
      expect(validateDate(baseDate, { maximumDate: max, locale: enLocale }).isValid).toBe(true);

      const tooLate = new Date(2024, 5, 21);
      const res = validateDate(tooLate, { maximumDate: max, locale: enLocale });
      expect(res.isValid).toBe(false);
      expect(res.errorCode).toBe('MAX_DATE');
    });
  });

  describe('disabledDates & disabledWeekdays', () => {
    it('detects disabled date in array', () => {
      const disabledList = [new Date(2024, 5, 15), '2024-06-20'];
      expect(isDateDisabled(baseDate, disabledList)).toBe(true);
      expect(isDateDisabled(new Date(2024, 5, 16), disabledList)).toBe(false);
    });

    it('detects disabled date with predicate function', () => {
      const predicate = (d: Date) => d.getDate() === 15;
      expect(isDateDisabled(baseDate, predicate)).toBe(true);
      expect(isDateDisabled(new Date(2024, 5, 16), predicate)).toBe(false);
    });

    it('detects disabled weekday', () => {
      // June 15, 2024 is Saturday (day 6)
      expect(isWeekdayDisabled(baseDate, [0, 6])).toBe(true); // Disable weekends
      expect(isWeekdayDisabled(new Date(2024, 5, 16), [1, 2])).toBe(false);
    });
  });

  describe('validateDateRange', () => {
    it('allows valid chronological range', () => {
      const start = new Date(2024, 5, 10);
      const end = new Date(2024, 5, 15);
      expect(validateDateRange(start, end, { locale: enLocale }).isValid).toBe(true);
    });

    it('rejects start date after end date', () => {
      const start = new Date(2024, 5, 20);
      const end = new Date(2024, 5, 10);
      const res = validateDateRange(start, end, { locale: enLocale });
      expect(res.isValid).toBe(false);
      expect(res.errorCode).toBe('START_AFTER_END');
    });

    it('enforces maxRangeDays constraint', () => {
      const start = new Date(2024, 5, 1);
      const end = new Date(2024, 5, 10); // 10 days
      const res = validateDateRange(start, end, { maxRangeDays: 7, locale: enLocale });
      expect(res.isValid).toBe(false);
      expect(res.errorCode).toBe('RANGE_EXCEEDED');
    });
  });
});
