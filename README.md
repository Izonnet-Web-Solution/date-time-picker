# @izonnet-web-solution/react-native-date-picker-kit

A modern, highly customizable, and lightweight React Native Date & Time Picker library for iOS and Android. Built with pure TypeScript and React Native components, offering zero native dependencies and seamless cross-platform performance.

---

## Capabilities Overview

1. **Calendar Date Picker**: Full month view with previous/next month navigation, quick month/year picker, date constraints, and action shortcuts.
2. **Wheel Date Picker**: Smooth scrolling Day, Month, and Year columns with inertia snapping, leap year support, and automatic day-count synchronization.
3. **Date Range Picker**: Continuous range selection with start/end indicators, ribbon highlight connector, and max range limits.
4. **Input Date Picker**: Text field with calendar icon, input masking, popup modal, and bidirectional synchronization.
5. **Custom Manual Date Entry**: Strict date typing (single or split fields) with immediate validation feedback for leap years and month boundaries without silent normalization.
6. **12-Hour Time Picker (with AM/PM)**: Interactive 12-hour clock navigation (01-12) with AM/PM selector, minute intervals (1m, 5m, 15m, 30m), and digital/wheel layouts.
7. **24-Hour Time Picker**: Complete 24-hour military clock navigation (00-23) with optional seconds display.
8. **Combined Date + Time Picker (DateTime)**: Unified synchronization of calendar date and clock time in a single component with tab switching and comprehensive validation.
9. **Time Constraints & Boundaries**: Strict validation for `minimumTime`, `maximumTime`, and boundary enforcement when paired with `minimumDate` and `maximumDate`.

---

## Installation

```bash
npm install @izonnet-web-solution/react-native-date-picker-kit
```

or with yarn:

```bash
yarn add @izonnet-web-solution/react-native-date-picker-kit
```

### Peer Dependencies

Ensure your project has the required peer dependencies installed:

```bash
npm install react react-native
```

- React: `>=18.0.0`
- React Native: `>=0.68.0`

---

## Usage Examples

### 1. Calendar Date Picker

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { DatePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function CalendarDemo() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 16 }}>
      <DatePicker
        mode="calendar"
        value={date}
        onChange={setDate}
        theme="light"
        locale="en"
        firstDayOfWeek={0}
        minimumDate={new Date(2020, 0, 1)}
        maximumDate={new Date(2030, 11, 31)}
        accentColor="#2563EB"
      />
    </View>
  );
}
```

### 2. 12-Hour Time Picker (with AM/PM)

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { DatePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function Time12Demo() {
  const [time, setTime] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 16 }}>
      <DatePicker
        mode="time"
        value={time}
        onChange={setTime}
        is24Hour={false}
        minuteInterval={5}
        format="hh:mm A"
        theme="light"
        locale="en"
      />
    </View>
  );
}
```

### 3. 24-Hour Time Picker

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { DatePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function Time24Demo() {
  const [time, setTime] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 16 }}>
      <DatePicker
        mode="time"
        value={time}
        onChange={setTime}
        is24Hour={true}
        showSeconds={false}
        format="HH:mm"
        theme="dark"
      />
    </View>
  );
}
```

### 4. Combined Date + Time Picker (DateTime)

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { DatePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function DateTimeDemo() {
  const [dateTime, setDateTime] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 16 }}>
      <DatePicker
        mode="datetime"
        value={dateTime}
        onChange={setDateTime}
        is24Hour={false}
        minuteInterval={15}
        format="DD/MM/YYYY hh:mm A"
      />
    </View>
  );
}
```

### 5. Time Constraints (Min / Max Time)

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { DatePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function TimeConstraintsDemo() {
  const [time, setTime] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 16 }}>
      {/* Restricts selection between 09:00 AM and 06:00 PM */}
      <DatePicker
        mode="time"
        value={time}
        onChange={setTime}
        is24Hour={false}
        minimumTime="09:00 AM"
        maximumTime="06:00 PM"
      />
    </View>
  );
}
```

### 6. Date Range Picker

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { DatePicker, DateRange } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function RangeDemo() {
  const [range, setRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return (
    <View style={{ padding: 16 }}>
      <DatePicker
        mode="range"
        startDate={range.startDate}
        endDate={range.endDate}
        onRangeChange={setRange}
        maxRangeDays={14}
      />
    </View>
  );
}
```

---

## Supported Formats

### Date Tokens
- `YYYY`: 4-digit year (e.g. 2026)
- `YY`: 2-digit year (e.g. 26)
- `MMMM`: Full month name (e.g. November)
- `MMM`: Short month name (e.g. Nov)
- `MM`: 2-digit month (01-12)
- `M`: 1-digit month (1-12)
- `DD`: 2-digit day of month (01-31)
- `D`: 1-digit day of month (1-31)
- `dddd`: Full day of week (e.g. Wednesday)
- `ddd`: Short day of week (e.g. Wed)

### Time Tokens
- `HH`: 2-digit 24-hour clock (00-23)
- `H`: 1-digit 24-hour clock (0-23)
- `hh`: 2-digit 12-hour clock (01-12)
- `h`: 1-digit 12-hour clock (1-12)
- `mm`: 2-digit minute (00-59)
- `m`: 1-digit minute (0-59)
- `ss`: 2-digit second (00-59)
- `s`: 1-digit second (0-59)
- `A`: Uppercase meridiem (`AM` / `PM`)
- `a`: Lowercase meridiem (`am` / `pm`)

### Combined Formats
- `DD/MM/YYYY HH:mm` (e.g. 18/11/2026 14:30)
- `DD/MM/YYYY hh:mm A` (e.g. 18/11/2026 02:30 PM)
- `YYYY-MM-DD HH:mm:ss` (e.g. 2026-11-18 14:30:00)

---

## Localization

Built-in languages:
- English (`en`) - Default
- Hindi (`hi`)
- Gujarati (`gu`)

### Example:

```tsx
<DatePicker
  mode="datetime"
  locale="hi"
  value={date}
  onChange={setDate}
/>
```

Or pass a custom `DatePickerLocale` object to provide your own language dictionary.

---

## Themes & Customization

Switch between preset themes or provide custom color overrides:

```tsx
<DatePicker
  theme="dark"
  accentColor="#10B981"
  textColor="#F9FAFB"
  backgroundColor="#111827"
  borderRadius={16}
/>
```

---

## Props Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `'calendar' \| 'wheel' \| 'range' \| 'input' \| 'time' \| 'datetime'` | `'calendar'` | Picker display model |
| `value` | `Date \| null` | `null` | Selected date/time value |
| `onChange` | `(date: Date \| null) => void` | `undefined` | Callback on date/time change |
| `is24Hour` | `boolean` | `false` | Enable 24-hour mode (00-23) or 12-hour mode with AM/PM |
| `minuteInterval` | `number` | `1` | Minute step interval (e.g. 1, 5, 10, 15, 30) |
| `minimumTime` | `string \| Date` | `undefined` | Earliest selectable time (e.g. "09:00 AM" or "09:00") |
| `maximumTime` | `string \| Date` | `undefined` | Latest selectable time (e.g. "06:00 PM" or "18:00") |
| `showSeconds` | `boolean` | `false` | Show seconds selector in time modes |
| `timePickerLayout` | `'segmented' \| 'wheel'` | `'segmented'` | Time layout presentation (digital steppers or wheel columns) |
| `startDate` | `Date \| null` | `null` | Range start date (range mode) |
| `endDate` | `Date \| null` | `null` | Range end date (range mode) |
| `onRangeChange`| `(range: DateRange) => void` | `undefined` | Callback on range change |
| `maxRangeDays` | `number` | `undefined` | Maximum allowed range span |
| `format` | `DateFormat` | `'DD/MM/YYYY'` | Date/Time format pattern |
| `locale` | `'en' \| 'hi' \| 'gu' \| DatePickerLocale` | `'en'` | Active language |
| `theme` | `'light' \| 'dark' \| Partial<DatePickerTheme>` | `'light'` | Color theme |
| `accentColor` | `string` | `undefined` | Accent color override |
| `minimumDate` | `Date` | `undefined` | Earliest selectable date |
| `maximumDate` | `Date` | `undefined` | Latest selectable date |
| `disabledDates`| `(Date \| string)[] \| ((d: Date) => boolean)` | `undefined` | Specific disabled dates |
| `disabledWeekdays` | `number[]` | `undefined` | Disabled days of week (0 = Sun, 6 = Sat) |
| `firstDayOfWeek`| `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Calendar column start day |
| `allowManualEntry`| `boolean` | `false` | Enable keyboard date typing |
| `manualEntryType` | `'single' \| 'split'` | `'single'` | Single input vs 3 separate inputs |
| `showActionButtons`| `boolean` | `true` | Show Today/Now, Clear, Confirm buttons |

---

## License

MIT © Izonnet Web Solution
#   d a t e - t i m e - p i c k e r  
 