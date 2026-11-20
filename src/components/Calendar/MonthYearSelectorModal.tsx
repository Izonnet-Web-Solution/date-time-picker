import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { DatePickerTheme, DatePickerLocale } from '../../types';
import { Modal } from '../common/Modal';

export interface MonthYearSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  currentYear: number;
  currentMonth: number;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  onSelectMonth?: (monthIndex: number) => void;
  onSelectYear?: (year: number) => void;
  onConfirm?: (year: number, month: number) => void;
  minYear?: number;
  maxYear?: number;
}

export const MonthYearSelectorModal: React.FC<MonthYearSelectorModalProps> = ({
  visible,
  onClose,
  currentYear,
  currentMonth,
  theme,
  locale,
  onSelectMonth,
  onSelectYear,
  onConfirm,
  minYear = 1970,
  maxYear = 2050,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);

  const years: number[] = [];
  for (let y = minYear; y <= maxYear; y++) {
    years.push(y);
  }

  // Sync internal selected month and year when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedMonth(currentMonth);
      setSelectedYear(currentYear);
    }
  }, [visible, currentMonth, currentYear]);

  // Auto-scroll to current/selected month and year when modal opens
  useEffect(() => {
    if (!visible) {
      return undefined;
    }
    const timer = setTimeout(() => {
      const ITEM_HEIGHT = 40;
      if (monthScrollRef.current && selectedMonth > 1) {
        monthScrollRef.current.scrollTo({
          y: Math.max(0, (selectedMonth - 1) * ITEM_HEIGHT),
          animated: false,
        });
      }
      const yearIndex = years.indexOf(selectedYear);
      if (yearScrollRef.current && yearIndex > 1) {
        yearScrollRef.current.scrollTo({
          y: Math.max(0, (yearIndex - 1) * ITEM_HEIGHT),
          animated: false,
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [visible, selectedMonth, selectedYear, years]);

  const handleMonthPress = (idx: number) => {
    setSelectedMonth(idx);
    onSelectMonth?.(idx);
  };

  const handleYearPress = (yearNum: number) => {
    setSelectedYear(yearNum);
    onSelectYear?.(yearNum);
  };

  const handleConfirmPress = () => {
    if (onConfirm) {
      onConfirm(selectedYear, selectedMonth);
    } else {
      onSelectMonth?.(selectedMonth);
      onSelectYear?.(selectedYear);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      theme={theme}
      contentStyle={styles.selectorModalCard}
    >
      <View style={styles.selectorContainer}>
        {/* Header with Title & Close Icon */}
        <View style={styles.selectorHeader}>
          <View style={styles.titleBadgeRow}>
            <Text style={styles.calendarIcon}>📅</Text>
            <Text
              style={[
                styles.selectorTitle,
                { color: theme.textColor, fontSize: theme.fontSize.title },
              ]}
            >
              {locale.selectDate}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: `${theme.textColor}12` }]}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={[styles.closeIcon, { color: theme.secondaryTextColor }]}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Two Structured Columns: Month & Year */}
        <View style={styles.selectorColumns}>
          {/* Months List Column */}
          <View
            style={[
              styles.columnCard,
              {
                backgroundColor: `${theme.primaryColor}06`,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <View
              style={[
                styles.columnHeader,
                {
                  borderBottomColor: theme.borderColor,
                  backgroundColor: `${theme.primaryColor}0A`,
                },
              ]}
            >
              <Text
                style={[
                  styles.columnLabel,
                  { color: theme.secondaryTextColor },
                ]}
              >
                {locale.monthLabel}
              </Text>
            </View>
            <ScrollView
              ref={monthScrollRef}
              style={styles.columnScroll}
              contentContainerStyle={styles.columnScrollContent}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {locale.months.map((monthName, idx) => {
                const isSelected = idx === selectedMonth;
                return (
                  <TouchableOpacity
                    key={monthName}
                    activeOpacity={0.7}
                    style={[
                      styles.pickerItem,
                      isSelected && [
                        styles.pickerItemSelected,
                        {
                          backgroundColor: theme.primaryColor,
                          shadowColor: theme.primaryColor,
                        },
                      ],
                    ]}
                    onPress={() => handleMonthPress(idx)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        {
                          color: isSelected ? '#FFFFFF' : theme.textColor,
                          fontWeight: isSelected ? '800' : '500',
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

          {/* Years List Column */}
          <View
            style={[
              styles.columnCard,
              {
                backgroundColor: `${theme.primaryColor}06`,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <View
              style={[
                styles.columnHeader,
                {
                  borderBottomColor: theme.borderColor,
                  backgroundColor: `${theme.primaryColor}0A`,
                },
              ]}
            >
              <Text
                style={[
                  styles.columnLabel,
                  { color: theme.secondaryTextColor },
                ]}
              >
                {locale.yearLabel}
              </Text>
            </View>
            <ScrollView
              ref={yearScrollRef}
              style={styles.columnScroll}
              contentContainerStyle={styles.columnScrollContent}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {years.map((yearNum) => {
                const isSelected = yearNum === selectedYear;
                return (
                  <TouchableOpacity
                    key={yearNum}
                    activeOpacity={0.7}
                    style={[
                      styles.pickerItem,
                      isSelected && [
                        styles.pickerItemSelected,
                        {
                          backgroundColor: theme.primaryColor,
                          shadowColor: theme.primaryColor,
                        },
                      ],
                    ]}
                    onPress={() => handleYearPress(yearNum)}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        {
                          color: isSelected ? '#FFFFFF' : theme.textColor,
                          fontWeight: isSelected ? '800' : '500',
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

        {/* Confirm / Done Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleConfirmPress}
          style={[
            styles.doneButton,
            {
              backgroundColor: theme.primaryColor,
              shadowColor: theme.primaryColor,
            },
          ]}
        >
          <Text style={[styles.doneButtonText, { color: theme.primaryTextColor || '#FFFFFF' }]}>
            {locale.confirm || 'Confirm'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  selectorModalCard: {
    maxHeight: 460,
    minHeight: 400,
    width: '92%',
    maxWidth: 380,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectorContainer: {
    width: '100%',
    flex: 1,
    paddingVertical: 4,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarIcon: {
    fontSize: 18,
  },
  selectorTitle: {
    fontWeight: '700',
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 13,
    fontWeight: '700',
  },
  selectorColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 260,
    gap: 12,
    marginBottom: 12,
  },
  columnCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  columnHeader: {
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
  },
  columnLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  columnScroll: {
    flex: 1,
  },
  columnScrollContent: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  pickerItem: {
    paddingVertical: 9,
    paddingHorizontal: 6,
    marginVertical: 2,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemSelected: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerItemText: {
    fontSize: 14,
    textAlign: 'center',
  },
  doneButton: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
