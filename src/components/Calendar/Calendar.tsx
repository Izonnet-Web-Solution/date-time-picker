import React, { useEffect } from 'react';
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

  // Jump view to selected date when changed externally
  useEffect(() => {
    if (selectedDate) {
      jumpToDate(selectedDate);
    }
  }, [selectedDate, jumpToDate]);

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
    padding: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  manualContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  actionsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  leftActions: {
    flexDirection: 'row',
  },
  rightActions: {
    flexDirection: 'row',
  },
  actionBtn: {
    marginHorizontal: 3,
  },
});
