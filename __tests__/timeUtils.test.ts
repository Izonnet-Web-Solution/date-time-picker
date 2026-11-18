import {
  convert24To12,
  convert12To24,
  is24HourFormat,
  setTimeOnDate,
  getTimeFromDate,
  parseTimeString,
  validateTime,
  isHourDisabled,
  isMinuteDisabled,
} from '../src/utils/timeUtils';
import { formatDate } from '../src/utils/dateFormatting';
import { parseDateStrict, parseTimeStrict } from '../src/utils/dateParsing';
import { enLocale } from '../src/localization/en';

describe('Time Utilities & Formatting', () => {
  describe('convert24To12 and convert12To24', () => {
    it('correctly converts midnight (0 hours) to 12 AM and back', () => {
      const conv = convert24To12(0);
      expect(conv.hour12).toBe(12);
      expect(conv.period).toBe('AM');

      const h24 = convert12To24(12, 'AM');
      expect(h24).toBe(0);
    });

    it('correctly converts noon (12 hours) to 12 PM and back', () => {
      const conv = convert24To12(12);
      expect(conv.hour12).toBe(12);
      expect(conv.period).toBe('PM');

      const h24 = convert12To24(12, 'PM');
      expect(h24).toBe(12);
    });

    it('correctly converts morning hours (e.g. 9 AM)', () => {
      const conv = convert24To12(9);
      expect(conv.hour12).toBe(9);
      expect(conv.period).toBe('AM');

      const h24 = convert12To24(9, 'AM');
      expect(h24).toBe(9);
    });

    it('correctly converts afternoon/evening hours (e.g. 15 -> 3 PM)', () => {
      const conv = convert24To12(15);
      expect(conv.hour12).toBe(3);
      expect(conv.period).toBe('PM');

      const h24 = convert12To24(3, 'PM');
      expect(h24).toBe(15);
    });

    it('correctly converts late night hours (e.g. 23 -> 11 PM)', () => {
      const conv = convert24To12(23);
      expect(conv.hour12).toBe(11);
      expect(conv.period).toBe('PM');

      const h24 = convert12To24(11, 'PM');
      expect(h24).toBe(23);
    });

    it('setTimeOnDate updates hours, minutes, and seconds on a date', () => {
      const base = new Date(2026, 10, 18, 0, 0, 0);
      const updated = setTimeOnDate(base, 15, 45, 30);
      expect(updated.getHours()).toBe(15);
      expect(updated.getMinutes()).toBe(45);
      expect(updated.getSeconds()).toBe(30);
      expect(updated.getDate()).toBe(18);
    });

    it('getTimeFromDate extracts 12h and 24h time objects', () => {
      const date = new Date(2026, 10, 18, 15, 30, 0);
      const t12 = getTimeFromDate(date, false);
      expect(t12.hours).toBe(3);
      expect(t12.period).toBe('PM');
      expect(t12.minutes).toBe(30);

      const t24 = getTimeFromDate(date, true);
      expect(t24.hours).toBe(15);
      expect(t24.minutes).toBe(30);
    });
  });

  describe('is24HourFormat detection', () => {
    it('detects 24-hour formats correctly', () => {
      expect(is24HourFormat('HH:mm')).toBe(true);
      expect(is24HourFormat('H:m')).toBe(true);
      expect(is24HourFormat('DD/MM/YYYY HH:mm')).toBe(true);
      expect(is24HourFormat('YYYY-MM-DD HH:mm:ss')).toBe(true);
    });

    it('detects 12-hour AM/PM formats correctly', () => {
      expect(is24HourFormat('hh:mm A')).toBe(false);
      expect(is24HourFormat('h:m a')).toBe(false);
      expect(is24HourFormat('DD/MM/YYYY hh:mm A')).toBe(false);
      expect(is24HourFormat('DD/MM/YYYY')).toBe(false);
    });
  });

  describe('formatDate with time tokens', () => {
    const testDate = new Date(2026, 10, 18, 14, 5, 9); // 18 Nov 2026, 14:05:09 (02:05:09 PM)

    it('formats 24-hour time: HH:mm and HH:mm:ss', () => {
      expect(formatDate(testDate, 'HH:mm')).toBe('14:05');
      expect(formatDate(testDate, 'HH:mm:ss')).toBe('14:05:09');
    });

    it('formats 12-hour time with AM/PM: hh:mm A and hh:mm:ss A', () => {
      expect(formatDate(testDate, 'hh:mm A')).toBe('02:05 PM');
      expect(formatDate(testDate, 'hh:mm:ss A')).toBe('02:05:09 PM');
      expect(formatDate(testDate, 'h:m a')).toBe('2:5 pm');
    });

    it('formats midnight correctly in 12h: 12:00 AM', () => {
      const midnight = new Date(2026, 10, 18, 0, 0, 0);
      expect(formatDate(midnight, 'hh:mm A')).toBe('12:00 AM');
      expect(formatDate(midnight, 'HH:mm')).toBe('00:00');
    });

    it('formats noon correctly in 12h: 12:00 PM', () => {
      const noon = new Date(2026, 10, 18, 12, 0, 0);
      expect(formatDate(noon, 'hh:mm A')).toBe('12:00 PM');
      expect(formatDate(noon, 'HH:mm')).toBe('12:00');
    });

    it('formats combined date and time: DD/MM/YYYY HH:mm and DD/MM/YYYY hh:mm A', () => {
      expect(formatDate(testDate, 'DD/MM/YYYY HH:mm')).toBe('18/11/2026 14:05');
      expect(formatDate(testDate, 'DD/MM/YYYY hh:mm A')).toBe('18/11/2026 02:05 PM');
    });

    it('supports bracket-escaped literals without collision', () => {
      expect(formatDate(testDate, '[Time is] HH:mm [hours]')).toBe('Time is 14:05 hours');
    });
  });

  describe('parseTimeString and parseTimeStrict', () => {
    it('parses 24-hour time strings', () => {
      const parsed = parseTimeString('14:30');
      expect(parsed).not.toBeNull();
      expect(parsed?.hours24).toBe(14);
      expect(parsed?.minutes).toBe(30);
      expect(parsed?.is24Hour).toBe(true);
    });

    it('parses 12-hour time strings with AM/PM', () => {
      const parsedPM = parseTimeString('02:30 PM');
      expect(parsedPM).not.toBeNull();
      expect(parsedPM?.hours24).toBe(14);
      expect(parsedPM?.hours).toBe(2);
      expect(parsedPM?.minutes).toBe(30);
      expect(parsedPM?.period).toBe('PM');

      const parsedAM = parseTimeString('09:15 AM');
      expect(parsedAM).not.toBeNull();
      expect(parsedAM?.hours24).toBe(9);
      expect(parsedAM?.period).toBe('AM');
    });

    it('parses strict time via parseTimeStrict', () => {
      const res = parseTimeStrict('18:45', 'HH:mm', enLocale);
      expect(res.validation.isValid).toBe(true);
      expect(res.date?.getHours()).toBe(18);
      expect(res.date?.getMinutes()).toBe(45);
    });

    it('parses combined DateTime via parseDateStrict', () => {
      const res = parseDateStrict('25/12/2024 14:30', 'DD/MM/YYYY HH:mm', enLocale);
      expect(res.validation.isValid).toBe(true);
      expect(res.date?.getFullYear()).toBe(2024);
      expect(res.date?.getMonth()).toBe(11);
      expect(res.date?.getDate()).toBe(25);
      expect(res.date?.getHours()).toBe(14);
      expect(res.date?.getMinutes()).toBe(30);
    });
  });

  describe('validateTime conditions & constraints', () => {
    it('validates normal 24h hours (0..23) and rejects invalid ones', () => {
      const valid = validateTime({ hours: 14, minutes: 30 }, true);
      expect(valid.isValid).toBe(true);

      const invalidH = validateTime({ hours: 25, minutes: 30 }, true);
      expect(invalidH.isValid).toBe(false);
      expect(invalidH.errorCode).toBe('INVALID_HOUR');

      const negativeH = validateTime({ hours: -1, minutes: 30 }, true);
      expect(negativeH.isValid).toBe(false);
      expect(negativeH.errorCode).toBe('INVALID_HOUR');
    });

    it('validates normal 12h hours (1..12) and rejects invalid ones', () => {
      const valid = validateTime({ hours: 2, minutes: 30, period: 'PM' }, false);
      expect(valid.isValid).toBe(true);

      const invalid0 = validateTime({ hours: 0, minutes: 30, period: 'AM' }, false);
      expect(invalid0.isValid).toBe(false);
      expect(invalid0.errorCode).toBe('INVALID_HOUR');

      const invalid13 = validateTime({ hours: 13, minutes: 30, period: 'PM' }, false);
      expect(invalid13.isValid).toBe(false);
      expect(invalid13.errorCode).toBe('INVALID_HOUR');
    });

    it('enforces minimumTime constraint', () => {
      // minimumTime: "09:00"
      const earlier = validateTime({ hours: 8, minutes: 30 }, true, { minimumTime: '09:00' });
      expect(earlier.isValid).toBe(false);
      expect(earlier.errorCode).toBe('MIN_TIME');

      const equalOrLater = validateTime({ hours: 9, minutes: 0 }, true, { minimumTime: '09:00' });
      expect(equalOrLater.isValid).toBe(true);
    });

    it('enforces maximumTime constraint', () => {
      // maximumTime: "18:00"
      const later = validateTime({ hours: 18, minutes: 30 }, true, { maximumTime: '18:00' });
      expect(later.isValid).toBe(false);
      expect(later.errorCode).toBe('MAX_TIME');

      const within = validateTime({ hours: 17, minutes: 45 }, true, { maximumTime: '18:00' });
      expect(within.isValid).toBe(true);
    });

    it('correctly disables hours outside boundary via isHourDisabled', () => {
      // minimumTime: "10:00" -> hour 9 should be disabled
      expect(isHourDisabled(9, true, undefined, { minimumTime: '10:00' })).toBe(true);
      expect(isHourDisabled(10, true, undefined, { minimumTime: '10:00' })).toBe(false);
    });

    it('correctly disables minutes outside boundary via isMinuteDisabled', () => {
      // minimumTime: "10:30" -> for hour 10, minutes < 30 disabled
      expect(isMinuteDisabled(15, 10, true, undefined, { minimumTime: '10:30' })).toBe(true);
      expect(isMinuteDisabled(30, 10, true, undefined, { minimumTime: '10:30' })).toBe(false);
      expect(isMinuteDisabled(45, 10, true, undefined, { minimumTime: '10:30' })).toBe(false);
    });
  });
});
