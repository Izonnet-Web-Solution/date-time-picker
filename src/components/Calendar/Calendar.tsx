import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import type {
  DatePickerTheme,
  DatePickerLocale,
  DateFormat,
  DisabledDateCheck,
  ValidationResult,
} from '../../types';
import { useCalendar } from '../../hooks/useCalendar';
import { CalendarHeader } from './CalendarHeader';
import { WeekDays } from './WeekDays';
import { CalendarGrid } from './CalendarGrid';
import { ManualDateInput } from '../ManualDateInput/ManualDateInput';
import { Button } from '../common/Button';

export interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  format?: DateFormat;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  minimumDate?: Date;
  maximumDate?: Date;
  disabledDates?: (Date | string)[] | DisabledDateCheck;
  disabledWeekdays?: number[];
  allowManualEntry?: boolean;
  manualEntryType?: 'single' | 'split';
  manualText?: string;
  isManualMode?: boolean;
  validationResult?: ValidationResult;
  onManualTextChange?: (text: string) => void;
  onToggleManualMode?: () => void;
  showActionButtons?: boolean;
  showTodayButton?: boolean;
  showClearButton?: boolean;
  onConfirm?: (date: Date | null) => void;
  onCancel?: () => void;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
  onOpenMonthYearSelector?: () => void;
  viewYear?: number;
  viewMonth?: number;
  onViewYearMonthChange?: (year: number, month: number) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onSelectDate,
  theme,
  locale,
  format = 'DD/MM/YYYY',
  firstDayOfWeek = 0,
  minimumDate,
  maximumDate,
  disabledDates,
  disabledWeekdays,
  allowManualEntry = false,
  manualEntryType = 'single',
  manualText = '',
  isManualMode = false,
  validationResult = { isValid: true },
  onManualTextChange,
  onToggleManualMode,
  showActionButtons = true,
  showTodayButton = true,
  showClearButton = true,
  onConfirm,
  onCancel,
  onClear,
  style,
  onOpenMonthYearSelector,
  viewYear,
  viewMonth,
  onViewYearMonthChange,
}) => {
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
    goToToday,
    setMonth,
    setYear,
    jumpToDate,
  } = useCalendar({
    initialDate: selectedDate,
    selectedDate,
    firstDayOfWeek,
    minimumDate,
    maximumDate,
    disabledDates,
    disabledWeekdays,
    locale,
  });

  // Track previous selectedDate timestamp to avoid redundant jumpToDate calls
  const prevSelectedDateRef = useRef<number | null>(
    selectedDate ? selectedDate.getTime() : null
  );

  useEffect(() => {
    const time = selectedDate ? selectedDate.getTime() : null;
    if (time !== null && time !== prevSelectedDateRef.current) {
      prevSelectedDateRef.current = time;
      jumpToDate(new Date(time));
    }
  }, [selectedDate, jumpToDate]);

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

  // Notify parent of view changes (e.g. prev/next month chevrons) only when values actually change
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

  const handleTodayPress = () => {
    goToToday();
    const today = new Date();
    onSelectDate(today);
  };

  const handleClearPress = () => {
    if (onClear) {
      onClear();
    } else {
      onSelectDate(null);
    }
  };

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
        allowManualEntry={allowManualEntry}
        isManualMode={isManualMode}
        onToggleManualMode={onToggleManualMode}
        onOpenMonthYearSelector={onOpenMonthYearSelector}
      />

      {isManualMode ? (
        <View style={styles.manualContainer}>
          <ManualDateInput
            value={manualText}
            onChangeText={(t) => onManualTextChange?.(t)}
            validation={validationResult}
            format={format}
            theme={theme}
            locale={locale}
            type={manualEntryType}
          />
        </View>
      ) : (
        <>
          <WeekDays weekdays={weekdays} theme={theme} />
          <CalendarGrid
            days={days}
            theme={theme}
            locale={locale}
            onSelectDate={onSelectDate}
          />
        </>
      )}

      {showActionButtons && (
        <View style={styles.actionsFooter}>
          <View style={styles.leftActions}>
            {showTodayButton && (
              <Button
                title={locale.today}
                variant="text"
                size="small"
                theme={theme}
                onPress={handleTodayPress}
                style={styles.actionBtn}
              />
            )}
            {showClearButton && (
              <Button
                title={locale.clear}
                variant="text"
                size="small"
                theme={theme}
                onPress={handleClearPress}
                style={styles.actionBtn}
              />
            )}
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
                title={locale.confirm}
                variant="primary"
                size="small"
                theme={theme}
                onPress={() => onConfirm(selectedDate)}
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
    padding: 10,
    borderWidth: 1,
    overflow: 'hidden',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  manualContainer: {
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 4,
    flex: 1,
    justifyContent: 'flex-start',
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
    marginHorizontal: 0,
  },
});
