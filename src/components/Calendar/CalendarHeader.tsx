import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { DatePickerTheme, DatePickerLocale } from '../../types';
import { IconButton } from '../common/IconButton';
import { MonthYearSelectorModal } from './MonthYearSelectorModal';

export interface CalendarHeaderProps {
  currentYear: number;
  currentMonth: number;
  currentMonthName: string;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  canGoPrevMonth: boolean;
  canGoNextMonth: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectMonth: (monthIndex: number) => void;
  onSelectYear: (year: number) => void;
  allowManualEntry?: boolean;
  isManualMode?: boolean;
  onToggleManualMode?: () => void;
  minYear?: number;
  maxYear?: number;
  onOpenMonthYearSelector?: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentYear,
  currentMonth,
  currentMonthName,
  theme,
  locale,
  canGoPrevMonth,
  canGoNextMonth,
  onPrevMonth,
  onNextMonth,
  onSelectMonth,
  onSelectYear,
  allowManualEntry = false,
  isManualMode = false,
  onToggleManualMode,
  minYear = 1970,
  maxYear = 2050,
  onOpenMonthYearSelector,
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const handleTitlePress = () => {
    if (onOpenMonthYearSelector) {
      onOpenMonthYearSelector();
    } else {
      setIsSelectorOpen(true);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleTitlePress}
        style={styles.titleContainer}
        accessibilityRole="button"
        accessibilityLabel={`${currentMonthName} ${currentYear}, tap to change month and year`}
      >
        <Text
          style={[
            styles.titleText,
            {
              color: theme.textColor,
              fontSize: theme.fontSize.large,
            },
          ]}
        >
          {`${currentMonthName} ${currentYear}`}
        </Text>
        <View style={styles.dropdownCaret}>
          <Text style={[styles.caretText, { color: theme.secondaryTextColor }]}>
            ▾
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        {allowManualEntry && onToggleManualMode && (
          <IconButton
            icon={isManualMode ? 'calendar' : 'keyboard'}
            color={theme.primaryColor}
            onPress={onToggleManualMode}
            size={18}
            accessibilityLabel={
              isManualMode ? locale.switchCalendar : locale.switchManual
            }
            style={styles.actionButton}
          />
        )}

        <IconButton
          icon="chevron-left"
          disabled={!canGoPrevMonth}
          color={canGoPrevMonth ? theme.textColor : theme.disabledTextColor}
          onPress={onPrevMonth}
          size={18}
          accessibilityLabel="Previous month"
          style={styles.actionButton}
        />

        <IconButton
          icon="chevron-right"
          disabled={!canGoNextMonth}
          color={canGoNextMonth ? theme.textColor : theme.disabledTextColor}
          onPress={onNextMonth}
          size={18}
          accessibilityLabel="Next month"
          style={styles.actionButton}
        />
      </View>

      {/* Internal Month & Year Selection Modal (fallback when not managed externally by parent modal) */}
      {!onOpenMonthYearSelector && (
        <MonthYearSelectorModal
          visible={isSelectorOpen}
          onClose={() => setIsSelectorOpen(false)}
          currentYear={currentYear}
          currentMonth={currentMonth}
          theme={theme}
          locale={locale}
          onSelectMonth={onSelectMonth}
          onSelectYear={onSelectYear}
          onConfirm={(y, m) => {
            onSelectYear(y);
            onSelectMonth(m);
            setIsSelectorOpen(false);
          }}
          minYear={minYear}
          maxYear={maxYear}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontWeight: '700',
  },
  dropdownCaret: {
    marginLeft: 6,
    marginBottom: 2,
  },
  caretText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 2,
  },
});
