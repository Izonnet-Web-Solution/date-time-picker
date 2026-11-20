import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import type {
  DatePickerTheme,
  DatePickerLocale,
  DateFormat,
  DisabledDateCheck,
  ValidationResult,
} from '../../types';
import { Modal } from '../common/Modal';
import { Calendar } from '../Calendar/Calendar';
import { MonthYearSelectorModal } from '../Calendar/MonthYearSelectorModal';

export interface CalendarPopupProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  format?: DateFormat;
  minimumDate?: Date;
  maximumDate?: Date;
  disabledDates?: (Date | string)[] | DisabledDateCheck;
  disabledWeekdays?: number[];
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  allowManualEntry?: boolean;
  manualEntryType?: 'single' | 'split';
  manualText?: string;
  isManualMode?: boolean;
  validationResult?: ValidationResult;
  onManualTextChange?: (text: string) => void;
  onToggleManualMode?: () => void;
  onConfirm?: (date: Date | null) => void;
}

export const CalendarPopup: React.FC<CalendarPopupProps> = ({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
  theme,
  locale,
  format,
  minimumDate,
  maximumDate,
  disabledDates,
  disabledWeekdays,
  firstDayOfWeek,
  allowManualEntry,
  manualEntryType,
  manualText,
  isManualMode,
  validationResult,
  onManualTextChange,
  onToggleManualMode,
  onConfirm,
}) => {
  const [draftDate, setDraftDate] = useState<Date | null>(selectedDate);
  const [isMonthYearOpen, setIsMonthYearOpen] = useState(false);
  const [viewYear, setViewYear] = useState<number>(() => (selectedDate || new Date()).getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => (selectedDate || new Date()).getMonth());

  useEffect(() => {
    if (visible) {
      setDraftDate(selectedDate);
      const d = selectedDate || new Date();
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
      setIsMonthYearOpen(false);
    }
  }, [visible, selectedDate]);

  const handleConfirm = (date: Date | null) => {
    const finalDate = date !== undefined ? date : draftDate;
    onSelectDate(finalDate);
    onConfirm?.(finalDate);
    onClose();
  };

  const handleViewYearMonthChange = (y: number, m: number) => {
    setViewYear((prevY) => (prevY !== y ? y : prevY));
    setViewMonth((prevM) => (prevM !== m ? m : prevM));
  };

  const handleMonthYearConfirm = (newYear: number, newMonth: number) => {
    setViewYear(newYear);
    setViewMonth(newMonth);

    if (draftDate instanceof Date && !isNaN(draftDate.getTime())) {
      const currentDay = draftDate.getDate();
      const maxDaysInNewMonth = new Date(newYear, newMonth + 1, 0).getDate();
      const clampedDay = Math.min(currentDay, maxDaysInNewMonth);
      const updated = new Date(
        newYear,
        newMonth,
        clampedDay,
        draftDate.getHours(),
        draftDate.getMinutes(),
        draftDate.getSeconds()
      );
      setDraftDate(updated);
    }

    setIsMonthYearOpen(false);
  };

  return (
    <>
      <Modal visible={visible && !isMonthYearOpen} onClose={onClose} theme={theme}>
        <View style={styles.calendarWrapper}>
          <Calendar
            selectedDate={draftDate}
            onSelectDate={setDraftDate}
            theme={theme}
            locale={locale}
            format={format}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            disabledDates={disabledDates}
            disabledWeekdays={disabledWeekdays}
            firstDayOfWeek={firstDayOfWeek}
            allowManualEntry={allowManualEntry}
            manualEntryType={manualEntryType}
            manualText={manualText}
            isManualMode={isManualMode}
            validationResult={validationResult}
            onManualTextChange={onManualTextChange}
            onToggleManualMode={onToggleManualMode}
            showActionButtons={true}
            showTodayButton={true}
            showClearButton={true}
            onConfirm={handleConfirm}
            onCancel={onClose}
            onClear={() => setDraftDate(null)}
            style={styles.calendarInner}
            viewYear={viewYear}
            viewMonth={viewMonth}
            onViewYearMonthChange={handleViewYearMonthChange}
            onOpenMonthYearSelector={() => setIsMonthYearOpen(true)}
          />
        </View>
      </Modal>

      <MonthYearSelectorModal
        visible={visible && isMonthYearOpen}
        onClose={() => setIsMonthYearOpen(false)}
        currentYear={viewYear}
        currentMonth={viewMonth}
        theme={theme}
        locale={locale}
        onConfirm={handleMonthYearConfirm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  calendarWrapper: {
    width: '100%',
    flex: 1,
  },
  calendarInner: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    padding: 0,
  },
});
