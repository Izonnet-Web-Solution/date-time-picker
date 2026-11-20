import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type DatePickerMode =
  | 'calendar'
  | 'wheel'
  | 'range'
  | 'input'
  | 'time'
  | 'datetime';

export type StandardDateFormat =
  | 'DD/MM/YYYY'
  | 'MM/DD/YYYY'
  | 'YYYY/DD/MM'
  | 'YYYY/MM/DD';

export type DateFormat =
  | StandardDateFormat
  | 'DD MMMM YYYY'
  | 'YYYY-MM-DD'
  | 'DD-MM-YYYY'
  | 'HH:mm'
  | 'HH:mm:ss'
  | 'hh:mm A'
  | 'hh:mm:ss A'
  | 'DD/MM/YYYY HH:mm'
  | 'DD/MM/YYYY hh:mm A'
  | 'MM/DD/YYYY HH:mm'
  | 'MM/DD/YYYY hh:mm A'
  | 'YYYY-MM-DD HH:mm'
  | (string & {});

export type SupportedLocale = 'en' | 'hi' | 'gu';

export type TimePeriod = 'AM' | 'PM';

export type TimeMode = '12h' | '24h';

export type TimePickerLayout = 'wheel' | 'spinner' | 'input' | 'segmented';

export interface TimeObject {
  hours: number;
  minutes: number;
  seconds?: number;
  period?: TimePeriod;
  is24Hour?: boolean;
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface CalendarDayCell {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  isDisabled: boolean;
}

export type DisabledDateCheck = (date: Date) => boolean;

export interface DatePickerTheme {
  backgroundColor: string;
  surfaceColor: string;
  cardColor: string;
  primaryColor: string;
  primaryTextColor: string;
  textColor: string;
  secondaryTextColor: string;
  disabledTextColor: string;
  borderColor: string;
  selectedDayBackgroundColor: string;
  selectedDayTextColor: string;
  todayBorderColor: string;
  todayTextColor: string;
  rangeBetweenBackgroundColor: string;
  rangeBetweenTextColor: string;
  errorColor: string;
  errorBackgroundColor: string;
  borderRadius: number;
  fontSize: {
    small: number;
    medium: number;
    large: number;
    title: number;
  };
}

export interface DatePickerLocaleErrors {
  invalidDate: string;
  outOfRange: string;
  minDate: string;
  maxDate: string;
  disabledDate: string;
  disabledWeekday: string;
  startDateAfterEndDate: string;
  maxRangeExceeded: string;
  invalidTime: string;
  minTime: string;
  maxTime: string;
}

export interface DatePickerLocale {
  code: string;
  months: string[];
  monthsShort: string[];
  weekdays: string[];
  weekdaysShort: string[];
  weekdaysMin: string[];
  today: string;
  clear: string;
  cancel: string;
  confirm: string;
  apply: string;
  selectDate: string;
  startDate: string;
  endDate: string;
  placeholder: string;
  dayLabel: string;
  monthLabel: string;
  yearLabel: string;
  switchManual: string;
  switchCalendar: string;
  am: string;
  pm: string;
  hourLabel: string;
  minuteLabel: string;
  secondLabel: string;
  selectTime: string;
  timeLabel: string;
  errors: DatePickerLocaleErrors;
}

export type ValidationErrorCode =
  | 'INVALID_FORMAT'
  | 'INVALID_DAY'
  | 'INVALID_MONTH'
  | 'INVALID_YEAR'
  | 'LEAP_YEAR'
  | 'MIN_DATE'
  | 'MAX_DATE'
  | 'DISABLED_DATE'
  | 'DISABLED_WEEKDAY'
  | 'START_AFTER_END'
  | 'RANGE_EXCEEDED'
  | 'INVALID_TIME'
  | 'INVALID_HOUR'
  | 'INVALID_MINUTE'
  | 'INVALID_SECOND'
  | 'MIN_TIME'
  | 'MAX_TIME';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errorCode?: ValidationErrorCode;
}

export interface BaseDatePickerProps {
  /**
   * Picker mode: calendar, wheel, range, input, time, or datetime
   * @default 'calendar'
   */
  mode?: DatePickerMode;

  /**
   * Theme name ('light' | 'dark') or a custom theme object
   * @default 'light'
   */
  theme?: 'light' | 'dark' | Partial<DatePickerTheme>;

  /**
   * Localization language code ('en' | 'hi' | 'gu') or custom locale definition
   * @default 'en'
   */
  locale?: SupportedLocale | DatePickerLocale;

  /**
   * Primary accent color override
   */
  accentColor?: string;

  /**
   * General text color override
   */
  textColor?: string;

  /**
   * Background color override
   */
  backgroundColor?: string;

  /**
   * Card / modal container background color override
   */
  cardColor?: string;

  /**
   * Dedicated modal container background color override
   */
  modalBackgroundColor?: string;

  /**
   * Custom style for the inner modal card container
   */
  modalContentStyle?: StyleProp<ViewStyle>;

  /**
   * Border radius override
   */
  borderRadius?: number;

  /**
   * Minimum allowable date
   */
  minimumDate?: Date;

  /**
   * Maximum allowable date
   */
  maximumDate?: Date;

  /**
   * Specific dates to disable or a predicate function
   */
  disabledDates?: (Date | string)[] | DisabledDateCheck;

  /**
   * Days of the week to disable: 0 (Sunday) to 6 (Saturday)
   */
  disabledWeekdays?: number[];

  /**
   * First day of the week: 0 (Sunday), 1 (Monday), etc.
   * @default 0
   */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Display date format
   * @default 'DD/MM/YYYY'
   */
  format?: DateFormat;

  /**
   * Whether to display an interactive format selection bar above the picker.
   * Allows users to dynamically switch between formats (DD/MM/YYYY, MM/DD/YYYY, YYYY/DD/MM, YYYY/MM/DD).
   * @default false
   */
  showFormatSelector?: boolean;

  /**
   * List of supported date formats available in the format selector bar.
   * @default ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/DD/MM', 'YYYY/MM/DD']
   */
  supportedFormats?: DateFormat[];

  /**
   * Callback fired when user switches the date format via the format selector bar.
   */
  onFormatChange?: (format: DateFormat) => void;

  /**
   * 24-hour mode (true) vs 12-hour AM/PM mode (false).
   * If omitted, will be inferred from format string (HH/H -> true, hh/h/A/a -> false) or default to false (12-hour).
   */
  is24Hour?: boolean;

  /**
   * Step interval for minute selection (e.g. 1, 5, 10, 15, 30).
   * @default 1
   */
  minuteInterval?: number;

  /**
   * Minimum allowed time. Can be a string ("HH:mm", "hh:mm A") or a Date.
   */
  minimumTime?: string | Date;

  /**
   * Maximum allowed time. Can be a string ("HH:mm", "hh:mm A") or a Date.
   */
  maximumTime?: string | Date;

  /**
   * Whether to display seconds in time mode.
   * @default false
   */
  showSeconds?: boolean;

  /**
   * UI presentation for Time Picker: 'wheel', 'segmented', or 'spinner'.
   * @default 'segmented'
   */
  timePickerLayout?: TimePickerLayout;

  /**
   * Whether to present the picker inside a modal dialog popup.
   * @default false
   */
  modal?: boolean;

  /**
   * When modal is true, controls whether the modal dialog is currently open / visible.
   * @default false
   */
  open?: boolean;

  /**
   * Whether to automatically close the modal when a date or time is selected.
   * If false, selection must be finalized via the Confirm action button.
   * @default false
   */
  autoCloseOnSelect?: boolean;

  /**
   * Callback fired when modal is closed (either by selecting date/time, tapping backdrop, or cancel)
   */
  onClose?: () => void;

  /**
   * Enable manual typing mode
   * @default false
   */
  allowManualEntry?: boolean;

  /**
   * Whether to start directly in manual typing mode when allowManualEntry is enabled
   * @default false
   */
  defaultManualMode?: boolean;

  /**
   * Manual input layout type ('single' formatted box vs 'split' day/month/year boxes)
   * @default 'single'
   */
  manualEntryType?: 'single' | 'split';

  /**
   * Show bottom action buttons (Today/Now, Clear, Cancel, Confirm)
   * @default true
   */
  showActionButtons?: boolean;

  /**
   * Show 'Today' or 'Now' shortcut button
   * @default true
   */
  showTodayButton?: boolean;

  /**
   * Show 'Clear' button
   * @default true
   */
  showClearButton?: boolean;

  /**
   * Callback when action cancel is tapped
   */
  onCancel?: () => void;

  /**
   * Callback when clear is tapped
   */
  onClear?: () => void;

  /**
   * Style for the outer container
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for automation
   */
  testID?: string;
}

export interface SingleDatePickerProps extends BaseDatePickerProps {
  mode?: 'calendar';
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  defaultValue?: Date | null;
  onConfirm?: (date: Date | null) => void;
}

export interface RangeDatePickerProps extends BaseDatePickerProps {
  mode: 'range';
  startDate?: Date | null;
  endDate?: Date | null;
  onRangeChange?: (range: DateRange) => void;
  defaultStartDate?: Date | null;
  defaultEndDate?: Date | null;
  maxRangeDays?: number;
  onConfirm?: (range: DateRange | null) => void;
}

export interface InputDatePickerProps extends BaseDatePickerProps {
  mode: 'input';
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  defaultValue?: Date | null;
  placeholder?: string;
  label?: string;
  editable?: boolean;
  popupTitle?: string;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  onConfirm?: (date: Date | null) => void;
}

export interface WheelDatePickerProps extends BaseDatePickerProps {
  mode: 'wheel';
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  defaultValue?: Date | null;
  minYear?: number;
  maxYear?: number;
  itemHeight?: number;
  visibleItems?: number;
  onConfirm?: (date: Date | null) => void;
}

export interface TimePickerComponentProps extends BaseDatePickerProps {
  mode: 'time';
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  defaultValue?: Date | null;
  onConfirm?: (date: Date | null) => void;
}

export interface DateTimePickerProps extends BaseDatePickerProps {
  mode: 'datetime';
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  defaultValue?: Date | null;
  initialTab?: 'date' | 'time';
  onConfirm?: (date: Date | null) => void;
}

export type DatePickerProps =
  | SingleDatePickerProps
  | RangeDatePickerProps
  | InputDatePickerProps
  | WheelDatePickerProps
  | TimePickerComponentProps
  | DateTimePickerProps;
