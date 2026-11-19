import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
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

  const formattedStart = range.startDate
    ? formatDate(range.startDate, format, locale)
    : '--/--/----';
  const formattedEnd = range.endDate
    ? formatDate(range.endDate, format, locale)
    : '--/--/----';

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
      <View
        style={[
          styles.rangeHeader,
          {
            backgroundColor: theme.surfaceColor,
            borderColor: theme.borderColor,
          },
        ]}
      >
        <View style={styles.rangeColumn}>
          <Text
            style={[
              styles.rangeLabel,
              { color: theme.secondaryTextColor, fontSize: theme.fontSize.small },
            ]}
          >
            {locale.startDate}
          </Text>
          <Text
            style={[
              styles.rangeValue,
              {
                color: range.startDate ? theme.textColor : theme.disabledTextColor,
                fontSize: theme.fontSize.medium,
              },
            ]}
          >
            {formattedStart}
          </Text>
        </View>

        <Text style={[styles.arrow, { color: theme.secondaryTextColor }]}>→</Text>

        <View style={styles.rangeColumn}>
          <Text
            style={[
              styles.rangeLabel,
              { color: theme.secondaryTextColor, fontSize: theme.fontSize.small },
            ]}
          >
            {locale.endDate}
          </Text>
          <Text
            style={[
              styles.rangeValue,
              {
                color: range.endDate ? theme.textColor : theme.disabledTextColor,
                fontSize: theme.fontSize.medium,
              },
            ]}
          >
            {isSelectingEndDate ? locale.selectDate : formattedEnd}
          </Text>
        </View>
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
  rangeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  rangeColumn: {
    flex: 1,
  },
  rangeLabel: {
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  rangeValue: {
    fontWeight: '700',
  },
  arrow: {
    fontSize: 18,
    marginHorizontal: 8,
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
    paddingTop: 12,
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
