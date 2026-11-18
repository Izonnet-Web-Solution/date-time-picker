import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { DatePickerTheme, DatePickerLocale } from '../../types';
import { IconButton } from '../common/IconButton';
import { Modal } from '../common/Modal';

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
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const years: number[] = [];
  for (let y = minYear; y <= maxYear; y++) {
    years.push(y);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsSelectorOpen(true)}
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

      {/* Month & Year Selection Modal */}
      <Modal
        visible={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        theme={theme}
      >
        <View style={styles.selectorContainer}>
          <View style={styles.selectorHeader}>
            <Text
              style={[
                styles.selectorTitle,
                { color: theme.textColor, fontSize: theme.fontSize.title },
              ]}
            >
              {locale.selectDate}
            </Text>
            <IconButton
              icon="close"
              color={theme.secondaryTextColor}
              size={18}
              onPress={() => setIsSelectorOpen(false)}
            />
          </View>

          <View style={styles.selectorColumns}>
            {/* Months List */}
            <View style={styles.columnHalf}>
              <Text
                style={[
                  styles.columnLabel,
                  { color: theme.secondaryTextColor },
                ]}
              >
                {locale.monthLabel}
              </Text>
              <ScrollView style={styles.columnScroll} showsVerticalScrollIndicator={false}>
                {locale.months.map((monthName, idx) => {
                  const isSelected = idx === currentMonth;
                  return (
                    <TouchableOpacity
                      key={monthName}
                      style={[
                        styles.pickerItem,
                        isSelected && {
                          backgroundColor: theme.surfaceColor,
                          borderRadius: 6,
                        },
                      ]}
                      onPress={() => onSelectMonth(idx)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color: isSelected ? theme.primaryColor : theme.textColor,
                            fontWeight: isSelected ? '700' : '400',
                          },
                        ]}
                      >
                        {monthName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Years List */}
            <View style={styles.columnHalf}>
              <Text
                style={[
                  styles.columnLabel,
                  { color: theme.secondaryTextColor },
                ]}
              >
                {locale.yearLabel}
              </Text>
              <ScrollView style={styles.columnScroll} showsVerticalScrollIndicator={false}>
                {years.map((yearNum) => {
                  const isSelected = yearNum === currentYear;
                  return (
                    <TouchableOpacity
                      key={yearNum}
                      style={[
                        styles.pickerItem,
                        isSelected && {
                          backgroundColor: theme.surfaceColor,
                          borderRadius: 6,
                        },
                      ]}
                      onPress={() => onSelectYear(yearNum)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color: isSelected ? theme.primaryColor : theme.textColor,
                            fontWeight: isSelected ? '700' : '400',
                          },
                        ]}
                      >
                        {yearNum}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
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
  selectorContainer: {
    padding: 16,
    maxHeight: 400,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectorTitle: {
    fontWeight: '700',
  },
  selectorColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 280,
  },
  columnHalf: {
    flex: 1,
    paddingHorizontal: 4,
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  columnScroll: {
    flex: 1,
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  pickerItemText: {
    fontSize: 14,
  },
});
