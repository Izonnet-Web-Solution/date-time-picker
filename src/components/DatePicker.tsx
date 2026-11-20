import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type {
  DateFormat,
  DatePickerProps,
  SingleDatePickerProps,
  RangeDatePickerProps,
  InputDatePickerProps,
  WheelDatePickerProps,
  TimePickerComponentProps,
  DateTimePickerProps,
  ValidationResult,
} from '../types';
import { resolveTheme } from '../themes';
import { getLocale } from '../localization';
import { useDatePicker } from '../hooks/useDatePicker';
import { formatDate } from '../utils/dateFormatting';
import { parseDateStrict, formatMaskedInput } from '../utils/dateParsing';
import { validateDate } from '../utils/dateValidation';
import { Calendar } from './Calendar/Calendar';
import { WheelPicker } from './Wheel/WheelPicker';
import { RangePicker } from './Range/RangePicker';
import { DateInput } from './Input/DateInput';
import { DateInputField } from './ManualDateInput/DateInputField';
import { TimePicker } from './Time/TimePicker';
import { DateTimePicker } from './Time/DateTimePicker';
import { Modal } from './common/Modal';
import { MonthYearSelectorModal } from './Calendar/MonthYearSelectorModal';

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  const {
    mode = 'calendar',
    theme: themeProp = 'light',
    locale: localeProp = 'en',
    accentColor,
    textColor,
    backgroundColor,
    cardColor,
    modalBackgroundColor,
    modalContentStyle,
    borderRadius,
    minimumDate,
    maximumDate,
    disabledDates,
    disabledWeekdays,
    firstDayOfWeek = 0,
    format,
    showFormatSelector = false,
    supportedFormats,
    onFormatChange,
    is24Hour,
    minuteInterval = 1,
    minimumTime,
    maximumTime,
    showSeconds = false,
    timePickerLayout = 'wheel',
    modal = false,
    open = false,
    autoCloseOnSelect = false,
    onClose,
    allowManualEntry = false,
    defaultManualMode = false,
    manualEntryType = 'single',
    showActionButtons = true,
    showTodayButton = true,
    showClearButton = true,
    onConfirm,
    onCancel,
    onClear,
    style,
    testID,
  } = props;

  const theme = resolveTheme(themeProp, {
    accentColor,
    textColor,
    backgroundColor,
    cardColor,
    modalBackgroundColor,
    borderRadius,
  });

  const locale = getLocale(localeProp);

  // Single date picker hook for calendar mode
  const singleProps = props as SingleDatePickerProps;
  const defaultFormat = mode === 'time'
    ? (is24Hour ? 'HH:mm' : 'hh:mm A')
    : (mode === 'datetime'
      ? (is24Hour ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY hh:mm A')
      : 'DD/MM/YYYY');

  const [activeFormat, setActiveFormat] = useState<DateFormat>(() => format || defaultFormat);

  useEffect(() => {
    if (format) {
      setActiveFormat(format);
    }
  }, [format]);

  const {
    selectedDate,
    manualText,
    isManualMode,
    validationResult,
    selectDate,
    handleManualInputChange,
    toggleManualMode,
    clear,
  } = useDatePicker({
    value: singleProps.value,
    defaultValue: singleProps.defaultValue,
    onChange: singleProps.onChange,
    format: activeFormat,
    locale,
    minimumDate,
    maximumDate,
    disabledDates,
    disabledWeekdays,
    allowManualEntry,
    defaultManualMode,
  });

  // Check if component is in modal presentation mode
  const hasModalProp = 'modal' in props && props.modal !== undefined;
  const isModalMode = hasModalProp
    ? (open !== undefined ? Boolean(modal) : true)
    : (Boolean(modal) || open !== undefined);
  const isVisible = open !== undefined ? Boolean(open) : Boolean(modal);

  // Draft value while modal is open, so changes are only committed when Confirm button is pressed
  const [draftValue, setDraftValue] = useState<any>(() => {
    if (mode === 'range') {
      const rp = props as RangeDatePickerProps;
      return {
        startDate: rp.startDate ?? rp.defaultStartDate ?? null,
        endDate: rp.endDate ?? rp.defaultEndDate ?? null,
      };
    }
    return singleProps.value ?? singleProps.defaultValue ?? null;
  });

  const [draftDateText, setDraftDateText] = useState<string>(() => {
    const initial = singleProps.value ?? singleProps.defaultValue ?? null;
    return initial ? formatDate(initial, activeFormat, locale) : '';
  });

  const [draftValidation, setDraftValidation] = useState<ValidationResult>({ isValid: true });

  // Track month & year selector modal state for seamless modal-to-modal handoff
  const [isMonthYearSelectorOpen, setIsMonthYearSelectorOpen] = useState(false);
  const [modalViewYear, setModalViewYear] = useState<number>(() => {
    const initial = singleProps.value ?? singleProps.defaultValue ?? new Date();
    return (initial instanceof Date && !isNaN(initial.getTime()))
      ? initial.getFullYear()
      : new Date().getFullYear();
  });
  const [modalViewMonth, setModalViewMonth] = useState<number>(() => {
    const initial = singleProps.value ?? singleProps.defaultValue ?? new Date();
    return (initial instanceof Date && !isNaN(initial.getTime()))
      ? initial.getMonth()
      : new Date().getMonth();
  });

  // Track modal open transition so draft value is only initialized when modal initially opens
  const prevIsVisibleRef = React.useRef(false);

  // Re-sync draft value and draft text whenever modal opens or external value changes
  useEffect(() => {
    const justOpened = isVisible && !prevIsVisibleRef.current;
    prevIsVisibleRef.current = isVisible;

    if (justOpened) {
      setIsMonthYearSelectorOpen(false);
      if (mode === 'range') {
        const rp = props as RangeDatePickerProps;
        const start = rp.startDate ?? rp.defaultStartDate ?? null;
        const end = rp.endDate ?? rp.defaultEndDate ?? null;
        setDraftValue({
          startDate: start,
          endDate: end,
        });
        const target = start || new Date();
        setModalViewYear(target.getFullYear());
        setModalViewMonth(target.getMonth());
      } else {
        const initialDate = singleProps.value ?? singleProps.defaultValue ?? null;
        setDraftValue(initialDate);
        setDraftDateText(initialDate ? formatDate(initialDate, activeFormat, locale) : '');
        setDraftValidation({ isValid: true });
        const target = initialDate || new Date();
        setModalViewYear(target.getFullYear());
        setModalViewMonth(target.getMonth());
      }
    }
  }, [isVisible, mode, singleProps.value, singleProps.defaultValue, activeFormat, locale]);

  // Synchronize draft text if active format changes while a date is selected
  useEffect(() => {
    if (draftValue instanceof Date && !isNaN(draftValue.getTime())) {
      setDraftDateText(formatDate(draftValue, activeFormat, locale));
    }
  }, [activeFormat, locale]);

  // Stable callback for calendar month/year view changes
  const handleViewYearMonthChange = useCallback((y: number, m: number) => {
    setModalViewYear((prevY) => (prevY !== y ? y : prevY));
    setModalViewMonth((prevM) => (prevM !== m ? m : prevM));
  }, []);

  // Commit selected Month and Year from MonthYearSelectorModal to draftValue
  const handleMonthYearConfirm = useCallback(
    (newYear: number, newMonth: number) => {
      setModalViewYear(newYear);
      setModalViewMonth(newMonth);

      if (draftValue instanceof Date && !isNaN(draftValue.getTime())) {
        const currentDay = draftValue.getDate();
        const maxDaysInNewMonth = new Date(newYear, newMonth + 1, 0).getDate();
        const clampedDay = Math.min(currentDay, maxDaysInNewMonth);
        const updated = new Date(
          newYear,
          newMonth,
          clampedDay,
          draftValue.getHours(),
          draftValue.getMinutes(),
          draftValue.getSeconds()
        );
        setDraftValue(updated);
        setDraftDateText(formatDate(updated, activeFormat, locale));
        setDraftValidation({ isValid: true });
      }

      setIsMonthYearSelectorOpen(false);
    },
    [draftValue, activeFormat, locale]
  );

  // Modal close handlers
  const handleModalClose = useCallback(() => {
    onClose?.();
    onCancel?.();
  }, [onClose, onCancel]);

  const handleConfirmAndClose = useCallback(
    (confirmedValue: any) => {
      if (mode === 'range') {
        const rp = props as RangeDatePickerProps;
        rp.onRangeChange?.(confirmedValue);
      } else {
        singleProps.onChange?.(confirmedValue);
      }
      (onConfirm as ((v: any) => void) | undefined)?.(confirmedValue);
      onClose?.();
    },
    [mode, singleProps, onConfirm, onClose]
  );

  // Synchronized date selection inside modal dialog (calendar cell click or Today button tap)
  const handleModalDateSelect = useCallback(
    (newDate: Date | null) => {
      setDraftValue(newDate);
      if (newDate) {
        const validation = validateDate(newDate, {
          minimumDate,
          maximumDate,
          disabledDates,
          disabledWeekdays,
          locale,
        });
        setDraftValidation(validation);
        setDraftDateText(formatDate(newDate, activeFormat, locale));
      } else {
        setDraftDateText('');
        setDraftValidation({ isValid: true });
      }
      if (autoCloseOnSelect && newDate) {
        handleConfirmAndClose(newDate);
      }
    },
    [
      activeFormat,
      locale,
      minimumDate,
      maximumDate,
      disabledDates,
      disabledWeekdays,
      autoCloseOnSelect,
      handleConfirmAndClose,
    ]
  );

  // Synchronized text input change inside modal dialog (typing into DateInputField)
  const handleModalTextInputChange = useCallback(
    (text: string) => {
      const masked = manualEntryType === 'split' ? text : formatMaskedInput(text, activeFormat);
      setDraftDateText(masked);

      if (!masked.trim()) {
        setDraftValidation({ isValid: true });
        setDraftValue(null);
        return;
      }

      const isCompleteLength = masked.length >= 10;
      if (isCompleteLength) {
        const parsed = parseDateStrict(masked, activeFormat, locale);
        if (!parsed.validation.isValid || !parsed.date) {
          setDraftValidation(parsed.validation);
          return;
        }

        const constraintValidation = validateDate(parsed.date, {
          minimumDate,
          maximumDate,
          disabledDates,
          disabledWeekdays,
          locale,
        });

        setDraftValidation(constraintValidation);
        if (constraintValidation.isValid) {
          setDraftValue(parsed.date);
        }
      } else {
        setDraftValidation({ isValid: true });
      }
    },
    [
      manualEntryType,
      activeFormat,
      locale,
      minimumDate,
      maximumDate,
      disabledDates,
      disabledWeekdays,
    ]
  );

  // Seamless styling inside modal dialog: strip nested border and background
  const pickerStyle: StyleProp<ViewStyle> = isModalMode
    ? [
      {
        borderWidth: 0,
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
        padding: 0,
        flex: 1,
        justifyContent: 'space-between',
      },
      style,
    ]
    : style;

  const renderContent = () => {
    // 1. Dedicated Time Picker Mode
    if (mode === 'time') {
      const timeProps = props as TimePickerComponentProps;
      return (
        <TimePicker
          value={
            isModalMode
              ? (draftValue !== undefined ? draftValue : selectedDate)
              : (timeProps.value !== undefined ? timeProps.value : selectedDate)
          }
          defaultValue={timeProps.defaultValue}
          onChange={(d) => {
            if (isModalMode) {
              setDraftValue(d);
            } else {
              selectDate(d);
              timeProps.onChange?.(d);
            }
          }}
          is24Hour={is24Hour}
          minuteInterval={minuteInterval}
          minimumTime={minimumTime}
          maximumTime={maximumTime}
          selectedDate={isModalMode ? (draftValue ?? selectedDate) : selectedDate}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          showSeconds={showSeconds}
          timePickerLayout={timePickerLayout}
          format={activeFormat}
          theme={theme}
          locale={locale}
          showActionButtons={showActionButtons}
          showNowButton={showTodayButton}
          showClearButton={showClearButton}
          onConfirm={(d) => {
            handleConfirmAndClose(d ?? draftValue);
          }}
          onCancel={handleModalClose}
          onClear={() => {
            if (isModalMode) setDraftValue(null);
            clear();
            onClear?.();
          }}
          autoCloseOnSelect={isModalMode && autoCloseOnSelect}
          onClose={handleModalClose}
          style={pickerStyle}
        />
      );
    }

    // 2. Combined DateTime Picker Mode
    if (mode === 'datetime') {
      const dateTimeProps = props as DateTimePickerProps;
      return (
        <DateTimePicker
          value={
            isModalMode
              ? (draftValue !== undefined ? draftValue : selectedDate)
              : (dateTimeProps.value !== undefined ? dateTimeProps.value : selectedDate)
          }
          defaultValue={dateTimeProps.defaultValue}
          onChange={(d) => {
            if (isModalMode) {
              setDraftValue(d);
            } else {
              selectDate(d);
              dateTimeProps.onChange?.(d);
            }
          }}
          format={activeFormat}
          is24Hour={is24Hour}
          minuteInterval={minuteInterval}
          minimumTime={minimumTime}
          maximumTime={maximumTime}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          disabledDates={disabledDates}
          disabledWeekdays={disabledWeekdays}
          firstDayOfWeek={firstDayOfWeek}
          showSeconds={showSeconds}
          timePickerLayout={timePickerLayout}
          allowManualEntry={allowManualEntry}
          theme={theme}
          locale={locale}
          initialTab={dateTimeProps.initialTab}
          showActionButtons={showActionButtons}
          onConfirm={(d) => {
            handleConfirmAndClose(d ?? draftValue);
          }}
          onCancel={handleModalClose}
          onClear={() => {
            if (isModalMode) setDraftValue(null);
            clear();
            onClear?.();
          }}
          style={pickerStyle}
        />
      );
    }

    // 3. Wheel Picker Mode
    if (mode === 'wheel') {
      const wheelProps = props as WheelDatePickerProps;
      return (
        <WheelPicker
          value={isModalMode ? (draftValue ?? wheelProps.value ?? selectedDate) : (wheelProps.value ?? selectedDate)}
          onChange={(d) => {
            if (isModalMode) {
              setDraftValue(d);
            } else {
              selectDate(d);
              wheelProps.onChange?.(d);
            }
          }}
          theme={theme}
          locale={locale}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          disabledDates={disabledDates}
          disabledWeekdays={disabledWeekdays}
          minYear={wheelProps.minYear}
          maxYear={wheelProps.maxYear}
          itemHeight={wheelProps.itemHeight}
          visibleItems={wheelProps.visibleItems}
          showActionButtons={showActionButtons}
          showTodayButton={showTodayButton}
          showClearButton={showClearButton}
          onConfirm={(d) => {
            handleConfirmAndClose(d ?? draftValue);
          }}
          onCancel={handleModalClose}
          onClear={() => {
            if (isModalMode) setDraftValue(null);
            onClear?.();
          }}
          style={pickerStyle}
        />
      );
    }

    // 4. Date Range Mode
    if (mode === 'range') {
      const rangeProps = props as RangeDatePickerProps;
      return (
        <RangePicker
          startDate={isModalMode ? draftValue?.startDate : rangeProps.startDate}
          endDate={isModalMode ? draftValue?.endDate : rangeProps.endDate}
          defaultStartDate={rangeProps.defaultStartDate}
          defaultEndDate={rangeProps.defaultEndDate}
          onRangeChange={(range) => {
            if (isModalMode) {
              setDraftValue(range);
            } else {
              rangeProps.onRangeChange?.(range);
            }
          }}
          maxRangeDays={rangeProps.maxRangeDays}
          format={activeFormat}
          theme={theme}
          locale={locale}
          firstDayOfWeek={firstDayOfWeek}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          disabledDates={disabledDates}
          disabledWeekdays={disabledWeekdays}
          showActionButtons={showActionButtons}
          onConfirm={(range) => {
            handleConfirmAndClose(range ?? draftValue);
          }}
          onCancel={handleModalClose}
          style={pickerStyle}
          viewYear={isModalMode ? modalViewYear : undefined}
          viewMonth={isModalMode ? modalViewMonth : undefined}
          onViewYearMonthChange={isModalMode ? handleViewYearMonthChange : undefined}
          onOpenMonthYearSelector={isModalMode ? () => setIsMonthYearSelectorOpen(true) : undefined}
        />
      );
    }

    // 5. Input Mode
    if (mode === 'input') {
      const inputProps = props as InputDatePickerProps;

      // When presented in modal dialog mode (<DatePicker modal open={...} mode="input" />)
      if (isModalMode) {
        return (
          <View style={styles.modalInputWrapper}>
            <View style={styles.modalInputTopSection}>
              <DateInputField
                value={draftDateText}
                onChangeText={handleModalTextInputChange}
                format={activeFormat}
                theme={theme}
                locale={locale}
                type={manualEntryType}
                placeholder={inputProps.placeholder}
                label={inputProps.label}
                isError={!draftValidation.isValid}
                editable={inputProps.editable !== false}
              />
            </View>

            <Calendar
              selectedDate={draftValue !== undefined ? draftValue : selectedDate}
              onSelectDate={handleModalDateSelect}
              theme={theme}
              locale={locale}
              format={activeFormat}
              firstDayOfWeek={firstDayOfWeek}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              disabledDates={disabledDates}
              disabledWeekdays={disabledWeekdays}
              showActionButtons={showActionButtons}
              showTodayButton={showTodayButton}
              showClearButton={showClearButton}
              onConfirm={(d) => {
                if (!draftValidation.isValid) return;
                handleConfirmAndClose(d ?? draftValue ?? selectedDate);
              }}
              onCancel={handleModalClose}
              onClear={() => {
                handleModalDateSelect(null);
                clear();
                onClear?.();
              }}
              style={pickerStyle}
              viewYear={modalViewYear}
              viewMonth={modalViewMonth}
              onViewYearMonthChange={handleViewYearMonthChange}
              onOpenMonthYearSelector={() => setIsMonthYearSelectorOpen(true)}
            />
          </View>
        );
      }

      // Inline mode: renders the interactive text input that triggers the popup modal
      return (
        <DateInput
          value={inputProps.value !== undefined ? inputProps.value : selectedDate}
          defaultValue={inputProps.defaultValue}
          onChange={(d) => {
            selectDate(d);
            inputProps.onChange?.(d);
          }}
          onConfirm={(d) => {
            selectDate(d);
            inputProps.onChange?.(d);
            inputProps.onConfirm?.(d);
          }}
          onCancel={handleModalClose}
          onClear={() => {
            clear();
            onClear?.();
          }}
          format={activeFormat}
          theme={theme}
          locale={locale}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          disabledDates={disabledDates}
          disabledWeekdays={disabledWeekdays}
          firstDayOfWeek={firstDayOfWeek}
          allowManualEntry={allowManualEntry}
          manualEntryType={manualEntryType}
          placeholder={inputProps.placeholder}
          label={inputProps.label}
          editable={inputProps.editable}
          style={pickerStyle}
          inputStyle={inputProps.inputStyle}
          inputContainerStyle={inputProps.inputContainerStyle}
        />
      );
    }

    // 6. Default mode: 'calendar'
    return (
      <Calendar
        selectedDate={isModalMode ? (draftValue !== undefined ? draftValue : selectedDate) : selectedDate}
        onSelectDate={isModalMode ? handleModalDateSelect : selectDate}
        theme={theme}
        locale={locale}
        format={activeFormat}
        firstDayOfWeek={firstDayOfWeek}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        disabledDates={disabledDates}
        disabledWeekdays={disabledWeekdays}
        allowManualEntry={allowManualEntry}
        manualEntryType={manualEntryType}
        manualText={isModalMode ? draftDateText : manualText}
        isManualMode={isManualMode}
        validationResult={isModalMode ? draftValidation : validationResult}
        onManualTextChange={isModalMode ? handleModalTextInputChange : handleManualInputChange}
        onToggleManualMode={toggleManualMode}
        showActionButtons={showActionButtons}
        showTodayButton={showTodayButton}
        showClearButton={showClearButton}
        onConfirm={(d) => {
          if (isModalMode && !draftValidation.isValid) return;
          handleConfirmAndClose(d ?? draftValue ?? selectedDate);
        }}
        onCancel={handleModalClose}
        onClear={() => {
          if (isModalMode) handleModalDateSelect(null);
          clear();
          onClear?.();
        }}
        style={pickerStyle}
        viewYear={isModalMode ? modalViewYear : undefined}
        viewMonth={isModalMode ? modalViewMonth : undefined}
        onViewYearMonthChange={isModalMode ? handleViewYearMonthChange : undefined}
        onOpenMonthYearSelector={isModalMode ? () => setIsMonthYearSelectorOpen(true) : undefined}
      />
    );
  };

  const renderFormatSelector = () => {
    if (!showFormatSelector) return null;

    const availableFormats = supportedFormats || [
      'DD/MM/YYYY',
      'MM/DD/YYYY',
      'YYYY/DD/MM',
      'YYYY/MM/DD',
    ];

    return (
      <View
        style={[
          styles.formatSelectorContainer,
          {
            borderColor: theme.borderColor,
            backgroundColor: `${theme.primaryColor}06`,
          },
        ]}
      >
        <Text style={[styles.formatSelectorTitle, { color: theme.secondaryTextColor }]}>
          FORMAT:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.formatPillsRow}
        >
          {availableFormats.map((fmt) => {
            const isSelected = activeFormat === fmt;
            return (
              <TouchableOpacity
                key={fmt}
                activeOpacity={0.75}
                onPress={() => {
                  setActiveFormat(fmt);
                  onFormatChange?.(fmt);
                }}
                style={[
                  styles.formatPill,
                  {
                    backgroundColor: isSelected ? theme.primaryColor : `${theme.primaryColor}12`,
                    borderColor: isSelected ? theme.primaryColor : `${theme.primaryColor}24`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.formatPillText,
                    {
                      color: isSelected ? '#FFFFFF' : theme.primaryColor,
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {fmt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const content = (
    <View testID={testID} style={[styles.container, isModalMode && styles.modalContainer]}>
      {renderFormatSelector()}
      {renderContent()}
    </View>
  );

  if (isModalMode) {
    const isManualModal = isManualMode && mode === 'calendar';
    return (
      <>
        {/* Main Picker Modal - Automatically closes when Month & Year selector opens */}
        <Modal
          visible={isVisible && !isMonthYearSelectorOpen}
          onClose={handleModalClose}
          theme={theme}
          contentStyle={[isManualModal ? styles.manualModalCard : undefined, modalContentStyle]}
        >
          {content}
        </Modal>

        {/* Month & Year Selection Modal - Re-opens the main modal upon Close or Confirm */}
        <MonthYearSelectorModal
          visible={isVisible && isMonthYearSelectorOpen}
          onClose={() => setIsMonthYearSelectorOpen(false)}
          currentYear={modalViewYear}
          currentMonth={modalViewMonth}
          theme={theme}
          locale={locale}
          onConfirm={handleMonthYearConfirm}
        />
      </>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  manualModalCard: {
    minHeight: 270,
    maxHeight: 340,
  },
  formatSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  formatSelectorTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginRight: 8,
  },
  formatPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  formatPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  formatPillText: {
    fontSize: 11,
  },
  modalInputWrapper: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  modalInputTopSection: {
    marginBottom: 4,
  },
});
