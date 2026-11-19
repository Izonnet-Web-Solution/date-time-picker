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

  useEffect(() => {
    if (visible) {
      setDraftDate(selectedDate);
    }
  }, [visible, selectedDate]);

  const handleConfirm = (date: Date | null) => {
    const finalDate = date !== undefined ? date : draftDate;
    onSelectDate(finalDate);
    onConfirm?.(finalDate);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} theme={theme}>
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
        />
      </View>
    </Modal>
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
