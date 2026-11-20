import { useState, useCallback, useMemo, useEffect } from 'react';
import type {
  DateFormat,
  DatePickerLocale,
  ValidationResult,
  DisabledDateCheck,
} from '../types';
import { formatDate } from '../utils/dateFormatting';
import { parseDateStrict, formatMaskedInput } from '../utils/dateParsing';
import { validateDate } from '../utils/dateValidation';
import { isSameDay, toValidDate } from '../utils/dateUtils';

export interface UseDatePickerProps {
  value?: Date | string | number | null;
  defaultValue?: Date | string | number | null;
  onChange?: (date: Date | null) => void;
  format?: DateFormat;
  locale: DatePickerLocale;
  minimumDate?: Date;
  maximumDate?: Date;
  disabledDates?: (Date | string)[] | DisabledDateCheck;
  disabledWeekdays?: number[];
  allowManualEntry?: boolean;
  defaultManualMode?: boolean;
}

export interface UseDatePickerReturn {
  selectedDate: Date | null;
  manualText: string;
  isManualMode: boolean;
  validationResult: ValidationResult;
  selectDate: (date: Date | null) => void;
  handleManualInputChange: (text: string) => void;
  toggleManualMode: () => void;
  setIsManualMode: (manual: boolean) => void;
  clear: () => void;
  resetValidation: () => void;
}

export const useDatePicker = ({
  value: controlledValue,
  defaultValue = null,
  onChange,
  format = 'DD/MM/YYYY',
  locale,
  minimumDate,
  maximumDate,
  disabledDates,
  disabledWeekdays,
  defaultManualMode = false,
}: UseDatePickerProps): UseDatePickerReturn => {
  const isControlled = controlledValue !== undefined;

  const normalizedDefault = useMemo(() => toValidDate(defaultValue), [defaultValue]);
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | null>(normalizedDefault);

  const selectedDate = useMemo<Date | null>(() => {
    return isControlled ? toValidDate(controlledValue) : uncontrolledValue;
  }, [isControlled, controlledValue, uncontrolledValue]);

  const [manualText, setManualText] = useState<string>(() => {
    return selectedDate ? formatDate(selectedDate, format, locale) : '';
  });

  const [isManualMode, setIsManualMode] = useState<boolean>(Boolean(defaultManualMode));

  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
  });

  // Keep manual text in sync when external selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const currentFormatted = formatDate(selectedDate, format, locale);
      setManualText(currentFormatted);
      setValidationResult({ isValid: true });
    } else {
      setManualText('');
    }
  }, [selectedDate, format, locale]);

  const selectDate = useCallback(
    (newDate: Date | null) => {
      if (newDate) {
        const validation = validateDate(newDate, {
          minimumDate,
          maximumDate,
          disabledDates,
          disabledWeekdays,
          locale,
        });

        setValidationResult(validation);

        if (!validation.isValid) {
          return;
        }

        const formatted = formatDate(newDate, format, locale);
        setManualText(formatted);
      } else {
        setManualText('');
        setValidationResult({ isValid: true });
      }

      if (!isControlled) {
        setUncontrolledValue(newDate);
      }

      if (onChange) {
        onChange(newDate);
      }
    },
    [
      isControlled,
      onChange,
      format,
      locale,
      minimumDate,
      maximumDate,
      disabledDates,
      disabledWeekdays,
    ]
  );

  const handleManualInputChange = useCallback(
    (text: string) => {
      const masked = formatMaskedInput(text, format);
      setManualText(masked);

      // If user completely cleared the input
      if (!masked.trim()) {
        setValidationResult({ isValid: true });
        if (!isControlled) {
          setUncontrolledValue(null);
        }
        if (onChange) {
          onChange(null);
        }
        return;
      }

      // Check if user has entered the expected length of characters for a full date
      // DD/MM/YYYY is 10 chars, YYYY-MM-DD is 10 chars
      const isCompleteLength = masked.length >= 10;

      if (isCompleteLength) {
        const parsed = parseDateStrict(masked, format, locale);
        if (!parsed.validation.isValid || !parsed.date) {
          setValidationResult(parsed.validation);
          return;
        }

        // Validate date boundaries and constraints
        const constraintValidation = validateDate(parsed.date, {
          minimumDate,
          maximumDate,
          disabledDates,
          disabledWeekdays,
          locale,
        });

        setValidationResult(constraintValidation);

        if (constraintValidation.isValid) {
          if (!isSameDay(selectedDate, parsed.date)) {
            if (!isControlled) {
              setUncontrolledValue(parsed.date);
            }
            if (onChange) {
              onChange(parsed.date);
            }
          }
        }
      } else {
        // While typing incomplete date, don't show red error yet unless characters exceed limits
        setValidationResult({ isValid: true });
      }
    },
    [
      format,
      locale,
      isControlled,
      onChange,
      selectedDate,
      minimumDate,
      maximumDate,
      disabledDates,
      disabledWeekdays,
    ]
  );

  const toggleManualMode = useCallback(() => {
    setIsManualMode((prev) => !prev);
  }, []);

  const clear = useCallback(() => {
    selectDate(null);
  }, [selectDate]);

  const resetValidation = useCallback(() => {
    setValidationResult({ isValid: true });
  }, []);

  return {
    selectedDate,
    manualText,
    isManualMode,
    validationResult,
    selectDate,
    handleManualInputChange,
    toggleManualMode,
    setIsManualMode,
    clear,
    resetValidation,
  };
};
