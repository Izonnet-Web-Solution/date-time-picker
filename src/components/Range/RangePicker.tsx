import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import type {
  DatePickerTheme,
  DatePickerLocale,
  DateRange,
  DisabledDateCheck,
  DateFormat,
} from '../../types';
import { useCalendar } from '../../hooks/useCalendar';
import { useDateRange } from '../../hooks/useDateRange';
import { CalendarHeader } from '../Calendar/CalendarHeader';
import { WeekDays } from '../Calendar/WeekDays';
import { RangeDateCell } from './RangeDateCell';
import { Button } from '../common/Button';
import { DateValidationMessage } from '../ManualDateInput/DateValidationMessage';
import { formatDate } from '../../utils/dateFormatting';

export interface RangePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  defaultStartDate?: Date | null;
  defaultEndDate?: Date | null;
  onRangeChange?: (range: DateRange) => void;
  maxRangeDays?: number;
  format?: DateFormat;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minimumDate?: Date;
  maximumDate?: Date;
  disabledDates?: (Date | string)[] | DisabledDateCheck;
  disabledWeekdays?: number[];
  showActionButtons?: boolean;
  onConfirm?: (range: DateRange) => void;
  onCancel?: () => void;
  style?: StyleProp<ViewStyle>;
  onOpenMonthYearSelector?: () => void;
  viewYear?: number;
  viewMonth?: number;
  onViewYearMonthChange?: (year: number, month: number) => void;
}

export const RangePicker: React.FC<RangePickerProps> = ({
  startDate,
  endDate,
  defaultStartDate,
  defaultEndDate,
  onRangeChange,
  maxRangeDays,
  format = 'DD/MM/YYYY',
  theme,
  locale,
  firstDayOfWeek = 0,
  minimumDate,
  maximumDate,
  disabledDates,
  disabledWeekdays,
  showActionButtons = true,
  onConfirm,
  onCancel,
  style,
  onOpenMonthYearSelector,
  viewYear,
  viewMonth,
  onViewYearMonthChange,
}) => {
  const {
    range,
    selectDate,
    clearRange,
    validationResult,
    isSelectingEndDate,
  } = useDateRange({
    startDate,
    endDate,
    defaultStartDate,
    defaultEndDate,
    onRangeChange,
    maxRangeDays,
    minimumDate,
    maximumDate,
    disabledDates,
    disabledWeekdays,
    locale,
  });

  const {
    currentYear,
    currentMonth,
    currentMonthName,
    days,
    weekdays,
    canGoPrevMonth,
    canGoNextMonth,
    goToPrevMonth,
    goToNextMonth,
    setMonth,
    setYear,
    jumpToDate,
  } = useCalendar({
    initialDate: range.startDate || new Date(),
    range,
    firstDayOfWeek,
    minimumDate,
    maximumDate,
    disabledDates,
    disabledWeekdays,
    locale,
  });

  // Synchronize calendar view with external viewYear & viewMonth when provided
  const prevViewYearRef = useRef<number | undefined>(viewYear);
  const prevViewMonthRef = useRef<number | undefined>(viewMonth);

  useEffect(() => {
    if (viewYear !== undefined && viewMonth !== undefined) {
      if (
        viewYear !== prevViewYearRef.current ||
        viewMonth !== prevViewMonthRef.current
      ) {
        prevViewYearRef.current = viewYear;
        prevViewMonthRef.current = viewMonth;
        if (currentYear !== viewYear || currentMonth !== viewMonth) {
          jumpToDate(new Date(viewYear, viewMonth, 1));
        }
      }
    }
  }, [viewYear, viewMonth, currentYear, currentMonth, jumpToDate]);

  // Notify parent of view changes (e.g. prev/next month chevrons)
  const onViewYearMonthChangeRef = useRef(onViewYearMonthChange);
  useEffect(() => {
    onViewYearMonthChangeRef.current = onViewYearMonthChange;
  }, [onViewYearMonthChange]);

  const prevReportedYearRef = useRef<number>(currentYear);
  const prevReportedMonthRef = useRef<number>(currentMonth);

  useEffect(() => {
    if (
      currentYear !== prevReportedYearRef.current ||
      currentMonth !== prevReportedMonthRef.current
    ) {
      prevReportedYearRef.current = currentYear;
      prevReportedMonthRef.current = currentMonth;
      onViewYearMonthChangeRef.current?.(currentYear, currentMonth);
    }
  }, [currentYear, currentMonth]);

  const formattedStart = range.startDate
    ? formatDate(range.startDate, format, locale)
    : '--/--/----';
  const formattedEnd = range.endDate
    ? formatDate(range.endDate, format, locale)
    : '--/--/----';

  const isSelectingEnd = isSelectingEndDate;
  const isSelectingStart = !range.startDate || Boolean(range.startDate && range.endDate);
  const defaultBorderColor = theme.borderColor === '#E2E8F0' ? '#CBD5E1' : theme.borderColor;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardColor,
          borderColor: theme.borderColor,
          borderRadius: theme.borderRadius,
        },
        style,
      ]}
    >
      {/* Range Status Header */}
      <View style={styles.rangeHeaderContainer}>
        {/* Start Date Card Box */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (range.startDate && range.endDate) {
              clearRange();
            }
          }}
          style={[
            styles.dateCard,
            {
              backgroundColor: isSelectingStart && !range.startDate
                ? `${theme.primaryColor}0C`
                : (theme.cardColor || theme.surfaceColor),
              borderColor: isSelectingStart && !range.startDate
                ? theme.primaryColor
                : (range.startDate ? `${theme.primaryColor}80` : defaultBorderColor),
            },
          ]}
        >
          <View style={styles.dateCardHeader}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: range.startDate
                    ? theme.primaryColor
                    : (isSelectingStart ? theme.primaryColor : theme.disabledTextColor),
                },
              ]}
            />
            <Text
              style={[
                styles.dateCardLabel,
                {
                  color: range.startDate || isSelectingStart
                    ? theme.primaryColor
                    : theme.secondaryTextColor,
                },
              ]}
              numberOfLines={1}
            >
              {locale.startDate}
            </Text>
          </View>
          <Text
            style={[
              styles.dateCardValue,
              {
                color: range.startDate ? theme.textColor : theme.disabledTextColor,
                fontSize: theme.fontSize.medium,
              },
            ]}
            numberOfLines={1}
          >
            {formattedStart}
          </Text>
        </TouchableOpacity>

        {/* Center Arrow Connector */}
        <View
          style={[
            styles.arrowBadge,
            {
              backgroundColor: `${theme.primaryColor}12`,
              borderColor: `${theme.primaryColor}30`,
            },
          ]}
        >
          <Text style={[styles.arrowText, { color: theme.primaryColor }]}>→</Text>
        </View>

        {/* End Date Card Box */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.dateCard,
            {
              backgroundColor: isSelectingEnd
                ? `${theme.primaryColor}0C`
                : (theme.cardColor || theme.surfaceColor),
              borderColor: isSelectingEnd
                ? theme.primaryColor
                : (range.endDate ? `${theme.primaryColor}80` : defaultBorderColor),
            },
          ]}
        >
          <View style={styles.dateCardHeader}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: range.endDate
                    ? theme.primaryColor
                    : (isSelectingEnd ? theme.primaryColor : theme.disabledTextColor),
                },
              ]}
            />
            <Text
              style={[
                styles.dateCardLabel,
                {
                  color: range.endDate || isSelectingEnd
                    ? theme.primaryColor
                    : theme.secondaryTextColor,
                },
              ]}
              numberOfLines={1}
            >
              {locale.endDate}
            </Text>
          </View>
          <Text
            style={[
              styles.dateCardValue,
              {
                color: range.endDate
                  ? theme.textColor
                  : (isSelectingEnd ? theme.primaryColor : theme.disabledTextColor),
                fontSize: theme.fontSize.medium,
                fontWeight: isSelectingEnd ? '600' : '700',
              },
            ]}
            numberOfLines={1}
          >
            {isSelectingEnd ? locale.selectDate : formattedEnd}
          </Text>
        </TouchableOpacity>
      </View>

      <CalendarHeader
        currentYear={currentYear}
        currentMonth={currentMonth}
        currentMonthName={currentMonthName}
        theme={theme}
        locale={locale}
        canGoPrevMonth={canGoPrevMonth}
        canGoNextMonth={canGoNextMonth}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onSelectMonth={setMonth}
        onSelectYear={setYear}
        onOpenMonthYearSelector={onOpenMonthYearSelector}
      />

      <WeekDays weekdays={weekdays} theme={theme} />

      <View style={styles.grid}>
        {days.map((cell) => {
          const key = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
          return (
            <RangeDateCell
              key={key}
              cell={cell}
              theme={theme}
              locale={locale}
              onPress={selectDate}
            />
          );
        })}
      </View>

      <DateValidationMessage validation={validationResult} theme={theme} />

      {showActionButtons && (
        <View style={styles.actionsFooter}>
          <View style={styles.leftActions}>
            <Button
              title={locale.today}
              variant="text"
              size="small"
              theme={theme}
              onPress={() => {
                const today = new Date();
                selectDate(today);
              }}
            />
            <Button
              title={locale.clear}
              variant="text"
              size="small"
              theme={theme}
              onPress={clearRange}
            />
          </View>

          <View style={styles.rightActions}>
            {onCancel && (
              <Button
                title={locale.cancel}
                variant="outline"
                size="small"
                theme={theme}
                onPress={onCancel}
                style={styles.actionBtn}
              />
            )}
            {onConfirm && (
              <Button
                title={locale.apply}
                variant="primary"
                size="small"
                theme={theme}
                disabled={!range.startDate || !range.endDate || !validationResult.isValid}
                onPress={() => onConfirm(range)}
                style={styles.actionBtn}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderWidth: 1,
    overflow: 'hidden',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  rangeHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 4,
    paddingBottom: 2,
    marginBottom: 10,
  },
  dateCard: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,

  },
  dateCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dateCardLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateCardValue: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  arrowBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  arrowText: {
    fontSize: 14,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    paddingVertical: 6,
  },
  actionsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 2,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    marginLeft: 0,
  },
});
