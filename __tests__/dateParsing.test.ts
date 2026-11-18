import { parseDateStrict, formatMaskedInput } from '../src/utils/dateParsing';
import { formatDate } from '../src/utils/dateFormatting';
import { enLocale } from '../src/localization/en';

describe('dateParsing & dateFormatting', () => {
  describe('parseDateStrict', () => {
    it('parses valid DD/MM/YYYY date', () => {
      const res = parseDateStrict('25/12/2024', 'DD/MM/YYYY');
      expect(res.validation.isValid).toBe(true);
      expect(res.date).not.toBeNull();
      expect(res.date?.getFullYear()).toBe(2024);
      expect(res.date?.getMonth()).toBe(11);
      expect(res.date?.getDate()).toBe(25);
    });

    it('parses valid MM/DD/YYYY date', () => {
      const res = parseDateStrict('12/25/2024', 'MM/DD/YYYY');
      expect(res.validation.isValid).toBe(true);
      expect(res.date?.getFullYear()).toBe(2024);
      expect(res.date?.getMonth()).toBe(11);
      expect(res.date?.getDate()).toBe(25);
    });

    it('parses valid YYYY-MM-DD date', () => {
      const res = parseDateStrict('2024-02-29', 'YYYY-MM-DD');
      expect(res.validation.isValid).toBe(true);
      expect(res.date?.getFullYear()).toBe(2024);
      expect(res.date?.getMonth()).toBe(1);
      expect(res.date?.getDate()).toBe(29);
    });

    it('parses valid DD-MM-YYYY date', () => {
      const res = parseDateStrict('29-02-2024', 'DD-MM-YYYY');
      expect(res.validation.isValid).toBe(true);
      expect(res.date?.getFullYear()).toBe(2024);
      expect(res.date?.getMonth()).toBe(1);
      expect(res.date?.getDate()).toBe(29);
    });

    it('parses valid YYYY/MM/DD date', () => {
      const res = parseDateStrict('2024/02/29', 'YYYY/MM/DD');
      expect(res.validation.isValid).toBe(true);
      expect(res.date?.getFullYear()).toBe(2024);
      expect(res.date?.getMonth()).toBe(1);
      expect(res.date?.getDate()).toBe(29);
    });

    it('parses valid YYYY/DD/MM date', () => {
      const res = parseDateStrict('2024/29/02', 'YYYY/DD/MM');
      expect(res.validation.isValid).toBe(true);
      expect(res.date?.getFullYear()).toBe(2024);
      expect(res.date?.getMonth()).toBe(1);
      expect(res.date?.getDate()).toBe(29);
    });

    it('rejects invalid leap year date (Feb 29 on non-leap year)', () => {
      const res = parseDateStrict('29/02/2023', 'DD/MM/YYYY');
      expect(res.validation.isValid).toBe(false);
      expect(res.validation.errorCode).toBe('LEAP_YEAR');
      expect(res.date).toBeNull();
    });

    it('rejects invalid day (e.g. 31/04/2024 - April has 30 days)', () => {
      const res = parseDateStrict('31/04/2024', 'DD/MM/YYYY');
      expect(res.validation.isValid).toBe(false);
      expect(res.validation.errorCode).toBe('INVALID_DAY');
      expect(res.date).toBeNull();
    });

    it('rejects invalid month (e.g. 15/13/2024)', () => {
      const res = parseDateStrict('15/13/2024', 'DD/MM/YYYY');
      expect(res.validation.isValid).toBe(false);
      expect(res.validation.errorCode).toBe('INVALID_MONTH');
      expect(res.date).toBeNull();
    });

    it('rejects incomplete or non-numeric strings', () => {
      expect(parseDateStrict('ab/cd/efgh', 'DD/MM/YYYY').validation.isValid).toBe(false);
      expect(parseDateStrict('12/2024', 'DD/MM/YYYY').validation.isValid).toBe(false);
      expect(parseDateStrict('', 'DD/MM/YYYY').validation.isValid).toBe(false);
    });
  });

  describe('formatDate', () => {
    const sampleDate = new Date(2024, 1, 29); // 29 Feb 2024

    it('formats DD/MM/YYYY', () => {
      expect(formatDate(sampleDate, 'DD/MM/YYYY')).toBe('29/02/2024');
    });

    it('formats MM/DD/YYYY', () => {
      expect(formatDate(sampleDate, 'MM/DD/YYYY')).toBe('02/29/2024');
    });

    it('formats YYYY-MM-DD', () => {
      expect(formatDate(sampleDate, 'YYYY-MM-DD')).toBe('2024-02-29');
    });

    it('formats YYYY/MM/DD', () => {
      expect(formatDate(sampleDate, 'YYYY/MM/DD')).toBe('2024/02/29');
    });

    it('formats YYYY/DD/MM', () => {
      expect(formatDate(sampleDate, 'YYYY/DD/MM')).toBe('2024/29/02');
    });

    it('formats with month names MMMM', () => {
      const formatted = formatDate(sampleDate, 'DD MMMM YYYY', enLocale);
      expect(formatted).toBe('29 February 2024');
    });
  });

  describe('formatMaskedInput', () => {
    it('applies slashes automatically for DD/MM/YYYY', () => {
      expect(formatMaskedInput('18', 'DD/MM/YYYY')).toBe('18');
      expect(formatMaskedInput('1811', 'DD/MM/YYYY')).toBe('18/11');
      expect(formatMaskedInput('18112026', 'DD/MM/YYYY')).toBe('18/11/2026');
    });

    it('applies hyphens automatically for YYYY-MM-DD', () => {
      expect(formatMaskedInput('2026', 'YYYY-MM-DD')).toBe('2026');
      expect(formatMaskedInput('202611', 'YYYY-MM-DD')).toBe('2026-11');
      expect(formatMaskedInput('20261118', 'YYYY-MM-DD')).toBe('2026-11-18');
    });

    it('applies slashes automatically for YYYY/MM/DD', () => {
      expect(formatMaskedInput('2026', 'YYYY/MM/DD')).toBe('2026');
      expect(formatMaskedInput('202611', 'YYYY/MM/DD')).toBe('2026/11');
      expect(formatMaskedInput('20261118', 'YYYY/MM/DD')).toBe('2026/11/18');
    });

    it('applies slashes automatically for YYYY/DD/MM', () => {
      expect(formatMaskedInput('2026', 'YYYY/DD/MM')).toBe('2026');
      expect(formatMaskedInput('202618', 'YYYY/DD/MM')).toBe('2026/18');
      expect(formatMaskedInput('20261811', 'YYYY/DD/MM')).toBe('2026/18/11');
    });
  });
});
