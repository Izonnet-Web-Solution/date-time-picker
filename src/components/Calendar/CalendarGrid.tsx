import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { CalendarDayCell, DatePickerTheme, DatePickerLocale } from '../../types';
import { DateCell } from './DateCell';

export interface CalendarGridProps {
  days: CalendarDayCell[];
  theme: DatePickerTheme;
  locale: DatePickerLocale;
  onSelectDate: (date: Date) => void;
  cellSize?: number;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  theme,
  locale,
  onSelectDate,
  cellSize,
}) => {
  return (
    <View style={styles.grid}>
      {days.map((cell) => {
        const key = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
        return (
          <DateCell
            key={key}
            cell={cell}
            theme={theme}
            locale={locale}
            onPress={onSelectDate}
            size={cellSize}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    paddingVertical: 6,
  },
});
