import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type {
  DateFormat,
  DatePickerProps,
  SingleDatePickerProps,
  RangeDatePickerProps,
  InputDatePickerProps,
  WheelDatePickerProps,
  TimePickerComponentProps,
  DateTimePickerProps,
} from '../types';
import { resolveTheme } from '../themes';
import { getLocale } from '../localization';
import { useDatePicker } from '../hooks/useDatePicker';
import { Calendar } from './Calendar/Calendar';
import { WheelPicker } from './Wheel/WheelPicker';
import { RangePicker } from './Range/RangePicker';
import { DateInput } from './Input/DateInput';
import { TimePicker } from './Time/TimePicker';
import { DateTimePicker } from './Time/DateTimePicker';
import { Modal } from './common/Modal';

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  const {
    mode = 'calendar',
    theme: themeProp = 'light',
    locale: localeProp = 'en',
    accentColor,
    textColor,
    backgroundColor,
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
    allowManualEntry = false,
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
  });

  const renderContent = () => {
    // 1. Dedicated Time Picker Mode
    if (mode === 'time') {
      const timeProps = props as TimePickerComponentProps;
      return (
        <TimePicker
          value={timeProps.value !== undefined ? timeProps.value : selectedDate}
          defaultValue={timeProps.defaultValue}
          onChange={(d) => {
            selectDate(d);
            timeProps.onChange?.(d);
          }}
          is24Hour={is24Hour}
          minuteInterval={minuteInterval}
          minimumTime={minimumTime}
          maximumTime={maximumTime}
          selectedDate={selectedDate}
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
          onConfirm={onConfirm as ((range: any) => void) | undefined}
          onCancel={onCancel}
          onClear={() => {
            clear();
            onClear?.();
          }}
          style={style}
        />
      );
    }

    // 2. Combined DateTime Picker Mode
    if (mode === 'datetime') {
      const dateTimeProps = props as DateTimePickerProps;
      return (
        <DateTimePicker
          value={dateTimeProps.value !== undefined ? dateTimeProps.value : selectedDate}
          defaultValue={dateTimeProps.defaultValue}
          onChange={(d) => {
            selectDate(d);
            dateTimeProps.onChange?.(d);
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
          onConfirm={onConfirm as ((range: any) => void) | undefined}
          onCancel={onCancel}
          onClear={() => {
            clear();
            onClear?.();
          }}
          style={style}
        />
      );
    }

    // 3. Wheel Picker Mode
    if (mode === 'wheel') {
      const wheelProps = props as WheelDatePickerProps;
      return (
        <WheelPicker
          value={wheelProps.value ?? selectedDate}
          onChange={(d) => {
            selectDate(d);
            wheelProps.onChange?.(d);
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
          onConfirm={onConfirm as ((range: any) => void) | undefined}
          onCancel={onCancel}
          style={style}
        />
      );
    }

    // 4. Date Range Mode
    if (mode === 'range') {
      const rangeProps = props as RangeDatePickerProps;
      return (
        <RangePicker
          startDate={rangeProps.startDate}
          endDate={rangeProps.endDate}
          defaultStartDate={rangeProps.defaultStartDate}
          defaultEndDate={rangeProps.defaultEndDate}
          onRangeChange={rangeProps.onRangeChange}
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
          onConfirm={onConfirm as ((range: any) => void) | undefined}
          onCancel={onCancel}
          style={style}
        />
      );
    }

    // 5. Input Mode
    if (mode === 'input') {
      const inputProps = props as InputDatePickerProps;
      return (
        <DateInput
          value={inputProps.value}
          defaultValue={inputProps.defaultValue}
          onChange={inputProps.onChange}
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
          style={style}
          inputStyle={inputProps.inputStyle}
          inputContainerStyle={inputProps.inputContainerStyle}
        />
      );
    }

    // 6. Default mode: 'calendar'
    return (
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={selectDate}
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
        manualText={manualText}
        isManualMode={isManualMode}
        validationResult={validationResult}
        onManualTextChange={handleManualInputChange}
        onToggleManualMode={toggleManualMode}
        showActionButtons={showActionButtons}
        showTodayButton={showTodayButton}
        showClearButton={showClearButton}
        onConfirm={onConfirm as ((date: Date | null) => void) | undefined}
        onCancel={onCancel}
        onClear={() => {
          clear();
          onClear?.();
        }}
        style={style}
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
    <View testID={testID} style={styles.container}>
      {/* {renderFormatSelector()} */}
      {renderContent()}
    </View>
  );

  if (modal) {
    return (
      <Modal
        visible={open}
        onClose={() => {
          onCancel?.();
        }}
        theme={theme}
      >
        {content}
      </Modal>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  formatSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
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
});
