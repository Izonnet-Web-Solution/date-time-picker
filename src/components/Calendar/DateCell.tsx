import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import type { CalendarDayCell, DatePickerTheme, DatePickerLocale } from '../../types';
import { formatDate } from '../../utils/dateFormatting';

export interface DateCellProps {
  cell: CalendarDayCell;
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  onPress: (date: Date) => void;
  size?: number;
}

export const DateCell: React.FC<DateCellProps> = ({
  cell,
  theme,
  locale,
  onPress,
  size = 40,
}) => {
  const {
    date,
    dayNumber,
    isCurrentMonth,
    isToday,
    isSelected,
    isDisabled,
  } = cell;

  const accessibleDateLabel = formatDate(date, 'DD MMMM YYYY', locale);

  const getTextColor = (): string => {
    if (isDisabled) {
      return theme.disabledTextColor;
    }
    if (isSelected) {
      return theme.selectedDayTextColor;
    }
    if (isToday) {
      return theme.todayTextColor;
    }
    if (!isCurrentMonth) {
      return theme.secondaryTextColor;
    }
    return theme.textColor;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      onPress={() => onPress(date)}
      accessibilityRole="button"
      accessibilityLabel={accessibleDateLabel}
      accessibilityState={{
        selected: isSelected,
        disabled: isDisabled,
      }}
      style={[
        styles.cellWrapper,
        {
          width: `${100 / 7}%`,
          height: size,
        },
      ]}
    >
      <View
        style={[
          styles.cellCircle,
          {
            width: size * 0.85,
            height: size * 0.85,
            borderRadius: (size * 0.85) / 2,
            backgroundColor: isSelected
              ? theme.selectedDayBackgroundColor
              : 'transparent',
            borderWidth: isToday && !isSelected ? 1.5 : 0,
            borderColor: isToday && !isSelected ? theme.todayBorderColor : 'transparent',
            opacity: !isCurrentMonth ? 0.45 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: getTextColor(),
              fontSize: theme.fontSize.medium,
              fontWeight: isSelected || isToday ? '700' : '400',
            },
          ]}
        >
          {dayNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cellWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  cellCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    textAlign: 'center',
  },
});
