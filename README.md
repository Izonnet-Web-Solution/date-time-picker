# @izonnet-web-solution/react-native-date-picker-kit

A modern, highly customizable, and lightweight React Native Date & Time Picker library for iOS and Android. Built with 100% pure TypeScript and React Native components, offering zero native dependencies, smooth 60 FPS animations, and full cross-platform parity.

---

## ✨ Features

- 📅 **Calendar Picker**: Interactive month view with smooth navigation, quick year/month selection, minimum/maximum date boundaries, and disabled date filters.
- 🕒 **12-Hour Time Picker (with AM/PM)**: Full 12-hour clock navigation (01–12) with AM/PM toggle, configurable minute intervals (1m, 5m, 15m, 30m), quick presets, and live preview.
- ⏰ **24-Hour Time Picker**: Complete 24-hour military clock navigation (00–23) with optional seconds support.
- 🧭 **Interactive Clock Dial**: Analog circular clock face with smooth angle calculation, dual-circle 24h layout, and visual hands.
- 🎡 **3D Wheel Time & Date Picker**: Inertial scrolling wheel columns for hours, minutes, seconds, meridiem, day, month, and year with haptic-ready snap physics.
- 🗓️ **Combined Date + Time Picker (DateTime)**: Unified synchronization of calendar date and time in one cohesive component with live preview ticket header.
- ↔️ **Date Range Picker**: Continuous range selection with start/end indicators, range highlight ribbon, and max-range limit enforcement.
- ⌨️ **Strict Manual Date Entry**: Strict date typing with instant validation feedback for leap years and month boundaries without silent normalization.
- ⏳ **Time Constraints**: Enforce `minimumTime` and `maximumTime` boundaries with automatic integration with `minimumDate` and `maximumDate`.
- 🌐 **Multilingual Localization**: Built-in support for English (`en`), Hindi (`hi`), and Gujarati (`gu`), plus extensible custom dictionaries.
- 🎨 **Adaptive Themes**: Beautiful Light and Dark themes out of the box, with complete color palette customization.

---

## 📦 Installation

```bash
npm install @izonnet-web-solution/react-native-date-picker-kit
```

or with Yarn:

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

## 🚀 Quick Start & Usage Examples

### 1. 12-Hour Time Picker (with AM/PM & Quick Presets)

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

---

### 2. 24-Hour Time Picker (with Seconds)

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
        showSeconds={true}
        format="HH:mm:ss"
        theme="dark"
      />
    </View>
  );
}
```

---

### 3. Combined Date + Time Picker (DateTime)

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
        minimumDate={new Date()}
        accentColor="#2563EB"
      />
    </View>
  );
}
```

---

### 4. Interactive Analog Clock Dial

You can also import standalone time components directly:

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { TimePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function AnalogClockDemo() {
  const [time, setTime] = useState<Date>(new Date());

  return (
    <View style={{ padding: 16 }}>
      <TimePicker
        value={time}
        onChange={setTime}
        is24Hour={false}
        initialView="dial"
        allowViewSwitch={true}
      />
    </View>
  );
}
```

---

### 5. Calendar Date Picker

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

---

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
        accentColor="#4F46E5"
      />
    </View>
  );
}
```

---

### 7. Time Constraints & Operating Hours Enforcement

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { DatePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function BusinessHoursDemo() {
  const [time, setTime] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 16 }}>
      {/* Restricts selection strictly between 09:00 AM and 06:00 PM */}
      <DatePicker
        mode="time"
        value={time}
        onChange={setTime}
        is24Hour={false}
        minimumTime="09:00 AM"
        maximumTime="06:00 PM"
        minuteInterval={15}
      />
    </View>
  );
}
```

---

## 🔤 Formatting & Tokens Reference

### Date Tokens
| Token | Description | Example |
|---|---|---|
| `YYYY` | 4-digit full year | `2026` |
| `YY` | 2-digit year | `26` |
| `MMMM` | Full month name | `November` |
| `MMM` | Short month name | `Nov` |
| `MM` | 2-digit month with leading zero | `01` – `12` |
| `M` | 1-digit month | `1` – `12` |
| `DD` | 2-digit day of month | `01` – `31` |
| `D` | 1-digit day of month | `1` – `31` |
| `dddd` | Full day of week | `Wednesday` |
| `ddd` | Short day of week | `Wed` |

### Time Tokens
| Token | Description | Example |
|---|---|---|
| `HH` | 2-digit 24-hour clock | `00` – `23` |
| `H` | 1-digit 24-hour clock | `0` – `23` |
| `hh` | 2-digit 12-hour clock | `01` – `12` |
| `h` | 1-digit 12-hour clock | `1` – `12` |
| `mm` | 2-digit minute | `00` – `59` |
| `m` | 1-digit minute | `0` – `59` |
| `ss` | 2-digit second | `00` – `59` |
| `s` | 1-digit second | `0` – `59` |
| `A` | Uppercase meridiem | `AM` / `PM` |
| `a` | Lowercase meridiem | `am` / `pm` |

---

## 🌐 Localization

The library includes built-in translations for:
- English (`en`) - Default
- Hindi (`hi`)
- Gujarati (`gu`)

```tsx
<DatePicker
  mode="datetime"
  locale="hi"
  value={date}
  onChange={setDate}
/>
```

### Custom Localization Dictionary

Pass a custom `DatePickerLocale` object:

```tsx
const customLocale = {
  months: ['Janvier', 'Février', 'Mars', ...],
  monthsShort: ['Jan', 'Fév', 'Mar', ...],
  weekdays: ['Dimanche', 'Lundi', 'Mardi', ...],
  weekdaysShort: ['Dim', 'Lun', 'Mar', ...],
  weekdaysMin: ['Di', 'Lu', 'Ma', ...],
  today: "Aujourd'hui",
  clear: 'Effacer',
  confirm: 'Confirmer',
  am: 'AM',
  pm: 'PM',
};

<DatePicker locale={customLocale} ... />
```

---

## 🎨 Themes & Customization

```tsx
// Using dark theme with custom accent color
<DatePicker
  theme="dark"
  accentColor="#10B981"
  textColor="#F9FAFB"
  backgroundColor="#111827"
  borderRadius={16}
/>
```

---

## 📖 Props Reference

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `'calendar' \| 'wheel' \| 'range' \| 'input' \| 'time' \| 'datetime'` | `'calendar'` | Picker presentation mode |
| `value` | `Date \| null` | `null` | Selected date/time value |
| `onChange` | `(date: Date \| null) => void` | `undefined` | Callback fired on value change |
| `is24Hour` | `boolean` | `false` | Enable 24-hour clock or 12-hour AM/PM mode |
| `minuteInterval` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 10 \| 12 \| 15 \| 20 \| 30` | `1` | Minute step interval |
| `minimumTime` | `string \| Date` | `undefined` | Earliest allowable time (e.g. `"09:00 AM"` or `"09:00"`) |
| `maximumTime` | `string \| Date` | `undefined` | Latest allowable time (e.g. `"06:00 PM"` or `"18:00"`) |
| `showSeconds` | `boolean` | `false` | Enable seconds selector in time modes |
| `timePickerLayout` | `'segmented' \| 'wheel'` | `'segmented'` | Time layout presentation (digital steppers or wheel columns) |
| `startDate` | `Date \| null` | `null` | Range start date (`mode="range"`) |
| `endDate` | `Date \| null` | `null` | Range end date (`mode="range"`) |
| `onRangeChange` | `(range: DateRange) => void` | `undefined` | Callback on date range selection |
| `maxRangeDays` | `number` | `undefined` | Maximum allowed range span in days |
| `format` | `DateFormat` | `'DD/MM/YYYY'` | Date / Time display format string (`'DD/MM/YYYY'`, `'MM/DD/YYYY'`, `'YYYY/DD/MM'`, `'YYYY/MM/DD'`) |
| `showFormatSelector` | `boolean` | `false` | Display dynamic format switcher bar (DD/MM/YYYY, MM/DD/YYYY, YYYY/DD/MM, YYYY/MM/DD) |
| `supportedFormats` | `DateFormat[]` | `['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/DD/MM', 'YYYY/MM/DD']` | List of formats in switcher |
| `onFormatChange` | `(format: DateFormat) => void` | `undefined` | Callback fired when user switches format |
| `modal` | `boolean` | `false` | Open picker in a popup modal dialog |
| `open` | `boolean` | `false` | Control modal visibility |
| `locale` | `'en' \| 'hi' \| 'gu' \| DatePickerLocale` | `'en'` | Active language or custom locale dictionary |
| `theme` | `'light' \| 'dark' \| Partial<DatePickerTheme>` | `'light'` | Color theme |
| `accentColor` | `string` | `undefined` | Primary highlight color override |
| `minimumDate` | `Date` | `undefined` | Earliest selectable date |
| `maximumDate` | `Date` | `undefined` | Latest selectable date |
| `disabledDates` | `(Date \| string)[] \| ((d: Date) => boolean)` | `undefined` | Specific disabled dates or filter function |
| `disabledWeekdays` | `number[]` | `undefined` | Disabled days of week (0 = Sun, 6 = Sat) |
| `firstDayOfWeek` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Calendar column start day |
| `allowManualEntry` | `boolean` | `false` | Enable direct keyboard date typing |
| `manualEntryType` | `'single' \| 'split'` | `'single'` | Single text field vs 3 separate Day/Month/Year fields |
| `showActionButtons` | `boolean` | `true` | Show Today/Now, Clear, and Confirm action buttons |

---

## 📄 License

Jenil © [Izonnet Web Solution](https://github.com/Izonnet-Web-Solution)
