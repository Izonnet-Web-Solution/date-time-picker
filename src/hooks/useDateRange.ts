import { useState, useCallback, useMemo } from 'react';
import type {
  DateRange,
  DatePickerLocale,
  ValidationResult,
  DisabledDateCheck,
} from '../types';
import { isBeforeDay } from '../utils/dateUtils';
import { validateDateRange } from '../utils/dateValidation';

export interface UseDateRangeProps {
  startDate?: Date | null;
  endDate?: Date | null;
  defaultStartDate?: Date | null;
  defaultEndDate?: Date | null;
  onRangeChange?: (range: DateRange) => void;
  maxRangeDays?: number;
  minimumDate?: Date;
  maximumDate?: Date;
  disabledDates?: (Date | string)[] | DisabledDateCheck;
  disabledWeekdays?: number[];
  locale: DatePickerLocale;
}

export interface UseDateRangeReturn {
  range: DateRange;
  selectDate: (date: Date) => void;
  clearRange: () => void;
  validationResult: ValidationResult;
  isSelectingEndDate: boolean;
}

export const useDateRange = ({
  startDate: controlledStartDate,
  endDate: controlledEndDate,
  defaultStartDate = null,
  defaultEndDate = null,
  onRangeChange,
  maxRangeDays,
  minimumDate,
  maximumDate,
  disabledDates,
  disabledWeekdays,
  locale,
}: UseDateRangeProps): UseDateRangeReturn => {
  const isControlled = controlledStartDate !== undefined;

  const [uncontrolledRange, setUncontrolledRange] = useState<DateRange>({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  const range = useMemo<DateRange>(() => {
    return isControlled
      ? {
          startDate: controlledStartDate ?? null,
          endDate: controlledEndDate ?? null,
        }
      : uncontrolledRange;
  }, [isControlled, controlledStartDate, controlledEndDate, uncontrolledRange]);

  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
  });

  const isSelectingEndDate = useMemo(() => {
    return Boolean(range.startDate && !range.endDate);
  }, [range.startDate, range.endDate]);

  const updateRange = useCallback(
    (newRange: DateRange) => {
      const validation = validateDateRange(newRange.startDate, newRange.endDate, {
        maxRangeDays,
        minimumDate,
        maximumDate,
        disabledDates,
        disabledWeekdays,
        locale,
      });

      setValidationResult(validation);

      if (!isControlled) {
        setUncontrolledRange(newRange);
      }

      if (onRangeChange && validation.isValid) {
        onRangeChange(newRange);
      }
    },
    [
      isControlled,
      onRangeChange,
      maxRangeDays,
      minimumDate,
      maximumDate,
      disabledDates,
      disabledWeekdays,
      locale,
    ]
  );

  const selectDate = useCallback(
    (date: Date) => {
      // 1. If no start date or both already selected, begin new range
      if (!range.startDate || (range.startDate && range.endDate)) {
        updateRange({ startDate: date, endDate: null });
        return;
      }

      // 2. We have a start date and are selecting end date
      if (range.startDate && !range.endDate) {
        // If clicked date is before start date, restart selection with this new date as start
        if (isBeforeDay(date, range.startDate)) {
          updateRange({ startDate: date, endDate: null });
        } else {
          updateRange({ startDate: range.startDate, endDate: date });
        }
      }
    },
    [range.startDate, range.endDate, updateRange]
  );

  const clearRange = useCallback(() => {
    updateRange({ startDate: null, endDate: null });
  }, [updateRange]);

  return {
    range,
    selectDate,
    clearRange,
    validationResult,
    isSelectingEndDate,
  };
};
