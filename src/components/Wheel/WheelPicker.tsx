import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import type {
  DatePickerTheme,
  DatePickerLocale,
  ValidationResult,
  DisabledDateCheck,
} from '../../types';
import { getDaysInMonth, createLocalDate } from '../../utils/dateUtils';
import { validateDate } from '../../utils/dateValidation';
import { WheelColumn, WheelItem } from './WheelColumn';
import { Button } from '../common/Button';
import { DateValidationMessage } from '../ManualDateInput/DateValidationMessage';

export interface WheelPickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  minimumDate?: Date;
  maximumDate?: Date;
  disabledDates?: (Date | string)[] | DisabledDateCheck;
  disabledWeekdays?: number[];
  minYear?: number;
  maxYear?: number;
  itemHeight?: number;
  visibleItems?: number;
  showActionButtons?: boolean;
  showTodayButton?: boolean;
  showClearButton?: boolean;
  onConfirm?: (date: Date | null) => void;
  onCancel?: () => void;
  onClear?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const WheelPicker: React.FC<WheelPickerProps> = ({
  value,
  onChange,
  theme,
  locale,
  minimumDate,
  maximumDate,
  disabledDates,
  disabledWeekdays,
  minYear = 1950,
  maxYear = 2050,
  itemHeight = 44,
  visibleItems = 5,
  showActionButtons = true,
  showTodayButton = true,
  showClearButton = true,
  onConfirm,
  onCancel,
  onClear,
  style,
}) => {
  const currentDate = value || new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed
  const currentDay = currentDate.getDate();

  // 1. Months column items
  const monthItems: WheelItem[] = useMemo(() => {
    return locale.months.map((name, index) => ({
      label: name,
      value: index,
    }));
  }, [locale.months]);

  // 2. Years column items
  const yearItems: WheelItem[] = useMemo(() => {
    const list: WheelItem[] = [];
    const min = minimumDate ? Math.max(minYear, minimumDate.getFullYear()) : minYear;
    const max = maximumDate ? Math.min(maxYear, maximumDate.getFullYear()) : maxYear;
    for (let y = min; y <= max; y++) {
      list.push({ label: String(y), value: y });
    }
    return list;
  }, [minYear, maxYear, minimumDate, maximumDate]);

  // 3. Days column items dynamically computed based on selected Year and Month
  const dayItems: WheelItem[] = useMemo(() => {
    const daysCount = getDaysInMonth(currentYear, currentMonth);
    const list: WheelItem[] = [];
    for (let d = 1; d <= daysCount; d++) {
      list.push({ label: String(d).padStart(2, '0'), value: d });
    }
    return list;
  }, [currentYear, currentMonth]);

  // Update date safely with day clamping
  const updateDateComponents = (y: number, m: number, d: number) => {
    const maxDays = getDaysInMonth(y, m);
    const clampedDay = Math.min(d, maxDays);
    const newDate = createLocalDate(y, m, clampedDay);
    onChange(newDate);
  };

  const handleYearChange = (newYear: number) => {
    updateDateComponents(newYear, currentMonth, currentDay);
  };

  const handleMonthChange = (newMonth: number) => {
    updateDateComponents(currentYear, newMonth, currentDay);
  };

  const handleDayChange = (newDay: number) => {
    updateDateComponents(currentYear, currentMonth, newDay);
  };

  const validationResult: ValidationResult = useMemo(() => {
    if (!value) return { isValid: true };
    return validateDate(value, {
      minimumDate,
      maximumDate,
      disabledDates,
      disabledWeekdays,
      locale,
    });
  }, [value, minimumDate, maximumDate, disabledDates, disabledWeekdays, locale]);

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
      <View style={styles.columnsRow}>
        {/* Day Column */}
        <WheelColumn
          items={dayItems}
          selectedValue={currentDay}
          onValueChange={handleDayChange}
          theme={theme}
          itemHeight={itemHeight}
          visibleItems={visibleItems}
          accessibilityLabel={locale.dayLabel}
        />

        {/* Month Column */}
        <WheelColumn
          items={monthItems}
          selectedValue={currentMonth}
          onValueChange={handleMonthChange}
          theme={theme}
          itemHeight={itemHeight}
          visibleItems={visibleItems}
          accessibilityLabel={locale.monthLabel}
        />

        {/* Year Column */}
        <WheelColumn
          items={yearItems}
          selectedValue={currentYear}
          onValueChange={handleYearChange}
          theme={theme}
          itemHeight={itemHeight}
          visibleItems={visibleItems}
          accessibilityLabel={locale.yearLabel}
        />
      </View>

      <DateValidationMessage validation={validationResult} theme={theme} />

      {showActionButtons && (
        <View style={styles.actionsFooter}>
          <View style={styles.leftActions}>
            {showTodayButton && (
              <Button
                title={locale.today}
                variant="text"
                size="small"
                theme={theme}
                onPress={() => onChange(new Date())}
              />
            )}
            {showClearButton && (
              <Button
                title={locale.clear}
                variant="text"
                size="small"
                theme={theme}
                onPress={() => {
                  onChange(null);
                  onClear?.();
                }}
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
                disabled={!validationResult.isValid}
                onPress={() => onConfirm(value)}
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
  columnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
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
