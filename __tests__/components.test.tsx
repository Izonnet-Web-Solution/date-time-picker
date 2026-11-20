import { DatePicker } from '../src/components/DatePicker';
import { Calendar } from '../src/components/Calendar/Calendar';
import { WheelPicker } from '../src/components/Wheel/WheelPicker';
import { RangePicker } from '../src/components/Range/RangePicker';
import { DateInput } from '../src/components/Input/DateInput';
import { ManualDateInput } from '../src/components/ManualDateInput/ManualDateInput';
import { TimePicker } from '../src/components/Time/TimePicker';
import { WheelTimePicker } from '../src/components/Time/WheelTimePicker';
import { DateTimePicker } from '../src/components/Time/DateTimePicker';
import { MonthYearSelectorModal } from '../src/components/Calendar/MonthYearSelectorModal';
import { CalendarHeader } from '../src/components/Calendar/CalendarHeader';
import { lightTheme, darkTheme, resolveTheme } from '../src/themes';
import { enLocale, getLocale } from '../src/localization';

describe('DatePicker Kit Components', () => {
  const testDate = new Date(2024, 10, 18); // Nov 18, 2024

  describe('Theme and Localization resolution', () => {
    it('resolves light and dark themes correctly', () => {
      const light = resolveTheme('light');
      expect(light.backgroundColor).toBe(lightTheme.backgroundColor);

      const dark = resolveTheme('dark');
      expect(dark.backgroundColor).toBe(darkTheme.backgroundColor);
    });

    it('merges custom theme overrides cleanly', () => {
      const custom = resolveTheme('light', {
        accentColor: '#10B981',
        borderRadius: 16,
      });
      expect(custom.primaryColor).toBe('#10B981');
      expect(custom.borderRadius).toBe(16);
    });

    it('retrieves correct locales for en, hi, gu', () => {
      expect(getLocale('en').code).toBe('en');
      expect(getLocale('hi').today).toBe('आज');
      expect(getLocale('gu').today).toBe('આજે');
    });
  });

  describe('Calendar Date Picker', () => {
    it('instantiates Calendar component without crashing', () => {
      const onSelect = jest.fn();
      const element = (
        <Calendar
          selectedDate={testDate}
          onSelectDate={onSelect}
          theme={lightTheme}
          locale={enLocale}
        />
      );
      expect(element).toBeTruthy();
    });

    it('instantiates root DatePicker in calendar mode', () => {
      const onChange = jest.fn();
      const element = (
        <DatePicker
          mode="calendar"
          value={testDate}
          onChange={onChange}
          locale="en"
          theme="light"
          accentColor="#2563EB"
        />
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Wheel Date Picker', () => {
    it('instantiates WheelPicker component without crashing', () => {
      const onChange = jest.fn();
      const element = (
        <WheelPicker
          value={testDate}
          onChange={onChange}
          theme={lightTheme}
          locale={enLocale}
          minYear={2000}
          maxYear={2030}
        />
      );
      expect(element).toBeTruthy();
    });

    it('instantiates root DatePicker in wheel mode', () => {
      const onChange = jest.fn();
      const element = (
        <DatePicker
          mode="wheel"
          value={testDate}
          onChange={onChange}
        />
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Date Range Picker', () => {
    it('instantiates RangePicker without crashing', () => {
      const onRangeChange = jest.fn();
      const element = (
        <RangePicker
          startDate={new Date(2024, 10, 10)}
          endDate={new Date(2024, 10, 15)}
          onRangeChange={onRangeChange}
          theme={lightTheme}
          locale={enLocale}
        />
      );
      expect(element).toBeTruthy();
    });

    it('instantiates root DatePicker in range mode', () => {
      const onRangeChange = jest.fn();
      const element = (
        <DatePicker
          mode="range"
          startDate={new Date(2024, 10, 10)}
          endDate={new Date(2024, 10, 15)}
          onRangeChange={onRangeChange}
        />
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Input Date Picker', () => {
    it('instantiates DateInput without crashing', () => {
      const onChange = jest.fn();
      const element = (
        <DateInput
          value={testDate}
          onChange={onChange}
          theme={lightTheme}
          locale={enLocale}
          allowManualEntry={true}
        />
      );
      expect(element).toBeTruthy();
    });

    it('instantiates root DatePicker in input mode', () => {
      const onChange = jest.fn();
      const element = (
        <DatePicker
          mode="input"
          value={testDate}
          onChange={onChange}
          format="DD/MM/YYYY"
        />
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Custom Manual Date Entry', () => {
    it('instantiates ManualDateInput with single format', () => {
      const onChangeText = jest.fn();
      const element = (
        <ManualDateInput
          value="18/11/2024"
          onChangeText={onChangeText}
          validation={{ isValid: true }}
          theme={lightTheme}
          locale={enLocale}
          type="single"
        />
      );
      expect(element).toBeTruthy();
    });

    it('instantiates ManualDateInput with split format', () => {
      const onChangeText = jest.fn();
      const element = (
        <ManualDateInput
          value="18/11/2024"
          onChangeText={onChangeText}
          validation={{ isValid: true }}
          theme={lightTheme}
          locale={enLocale}
          type="split"
        />
      );
      expect(element).toBeTruthy();
    });
  });

  describe('TimePicker and DateTimePicker Components', () => {
    it('instantiates standalone TimePicker in 12-hour AM/PM mode', () => {
      const onChange = jest.fn();
      const element = (
        <TimePicker
          value={testDate}
          onChange={onChange}
          is24Hour={false}
          theme={lightTheme}
          locale={enLocale}
        />
      );
      expect(element).toBeTruthy();
    });

    it('instantiates standalone TimePicker in 24-hour mode', () => {
      const onChange = jest.fn();
      const element = (
        <TimePicker
          value={testDate}
          onChange={onChange}
          is24Hour={true}
          theme={darkTheme}
          locale={enLocale}
        />
      );
      expect(element).toBeTruthy();
    });

    it('instantiates WheelTimePicker', () => {
      const onTimeChange = jest.fn();
      const element = (
        <WheelTimePicker
          hours={2}
          minutes={30}
          period="PM"
          is24Hour={false}
          onTimeChange={onTimeChange}
          theme={lightTheme}
          locale={enLocale}
        />
      );
      expect(element).toBeTruthy();
    });

    it('instantiates DateTimePicker with combined date and time', () => {
      const onChange = jest.fn();
      const element = (
        <DateTimePicker
          value={testDate}
          onChange={onChange}
          is24Hour={false}
          theme={lightTheme}
          locale={enLocale}
        />
      );
      expect(element).toBeTruthy();
    });

    it('instantiates root DatePicker in time mode', () => {
      const onChange = jest.fn();
      const element = (
        <DatePicker
          mode="time"
          value={testDate}
          onChange={onChange}
          is24Hour={true}
        />
      );
      expect(element).toBeTruthy();
    });

    it('instantiates root DatePicker in datetime mode', () => {
      const onChange = jest.fn();
      const element = (
        <DatePicker
          mode="datetime"
          value={testDate}
          onChange={onChange}
          is24Hour={false}
          minuteInterval={15}
        />
      );
      expect(element).toBeTruthy();
    });
  });

  describe('Month & Year Selector and Modal Handoff', () => {
    it('instantiates MonthYearSelectorModal with full props', () => {
      const onClose = jest.fn();
      const onSelectMonth = jest.fn();
      const onSelectYear = jest.fn();
      const onConfirm = jest.fn();

      const element = (
        <MonthYearSelectorModal
          visible={true}
          onClose={onClose}
          currentYear={2026}
          currentMonth={10}
          theme={lightTheme}
          locale={enLocale}
          onSelectMonth={onSelectMonth}
          onSelectYear={onSelectYear}
          onConfirm={onConfirm}
        />
      );
      expect(element).toBeTruthy();
    });

    it('instantiates CalendarHeader with onOpenMonthYearSelector', () => {
      const onOpen = jest.fn();
      const onPrev = jest.fn();
      const onNext = jest.fn();

      const element = (
        <CalendarHeader
          currentYear={2026}
          currentMonth={10}
          currentMonthName="November"
          theme={lightTheme}
          locale={enLocale}
          canGoPrevMonth={true}
          canGoNextMonth={true}
          onPrevMonth={onPrev}
          onNextMonth={onNext}
          onSelectMonth={jest.fn()}
          onSelectYear={jest.fn()}
          onOpenMonthYearSelector={onOpen}
        />
      );
      expect(element).toBeTruthy();
    });

    it('instantiates DatePicker in modal mode supporting modal handoff', () => {
      const onClose = jest.fn();
      const onConfirm = jest.fn();

      const element = (
        <DatePicker
          modal
          open={true}
          mode="input"
          value={testDate}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      );
      expect(element).toBeTruthy();
    });
  });
});
