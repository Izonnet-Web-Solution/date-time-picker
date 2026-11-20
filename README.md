# @izonnet-web-solution/react-native-date-picker-kit

<div align="center">

![npm version](https://img.shields.io/badge/version-1.0.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.68%2B-61DAFB?logo=react&logoColor=black)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-brightgreen.svg)
![Tests](https://img.shields.io/badge/Tests-98%20passed-success.svg)
![Zero Native Dependencies](https://img.shields.io/badge/Dependencies-Zero%20Native-orange.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
[![GitHub Repository](https://img.shields.io/badge/GitHub-date--time--picker-181717?logo=github)](https://github.com/Izonnet-Web-Solution/date-time-picker)
[![Issues](https://img.shields.io/github/issues/Izonnet-Web-Solution/date-time-picker)](https://github.com/Izonnet-Web-Solution/date-time-picker/issues)

**A production-grade, highly customizable, and lightweight React Native Date & Time Picker library.**  
Built entirely in 100% pure TypeScript and React Native core components — zero native linking, zero `pod install`, works seamlessly with bare React Native and Expo Go with 60 FPS performance.

</div>

---

## 📸 Live Visual Previews

<div align="center">

### Date Pickers & Month/Year Selector
| Calendar (Violet) | Calendar (Sky Blue) | Wheel Date Picker | Month & Year Fast Modal |
|:---:|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/calendar-picker.jpg" width="200" alt="Calendar Picker Violet" /> | <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/calendar-picker-blue.jpg" width="200" alt="Calendar Picker Sky Blue" /> | <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/wheel-date-picker.jpg" width="200" alt="Wheel Date Picker" /> | <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/month-year-selector-modal.jpg" width="200" alt="Month Year Selector Modal" /> |

### Time & DateTime Pickers
| 12-Hour Time (Wheel) | 24-Hour Military Time | DateTime (Date Tab) | DateTime (Time Tab) |
|:---:|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/time-12h-wheel.jpg" width="200" alt="12-Hour Time Picker" /> | <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/time-24h-military-blue.jpg" width="200" alt="24-Hour Military Time" /> | <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/datetime-picker-date.jpg" width="200" alt="DateTime Picker Date Tab" /> | <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/datetime-picker-time-blue.jpg" width="200" alt="DateTime Picker Time Tab" /> |

### Range & Manual Keyboard Entry Pickers
| Date Range Picker | Input Modal Picker | Manual Entry (Single Box) | Manual Entry (Split Pods) |
|:---:|:---:|:---:|:---:|
| <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/range-picker.jpg" width="200" alt="Date Range Picker" /> | <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/input-modal-picker.jpg" width="200" alt="Input Modal Picker" /> | <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/manual-entry-single.jpg" width="200" alt="Manual Entry Single Box" /> | <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/manual-entry-split.jpg" width="200" alt="Manual Entry Split Pods" /> |

</div>

---

## 📋 Table of Contents

- [Live Visual Previews](#-live-visual-previews)
- [Features](#-features)
- [Architecture & Highlights](#-architecture--highlights)
- [Installation](#-installation)
- [Modes Overview](#-modes-overview)
- [Quick Start & Code Examples](#-quick-start--code-examples)
  - [1. Calendar Date Picker (Modal Dialog)](#1-calendar-date-picker-modal-dialog)
  - [2. Wheel Date Picker (3D Inertial Scroll)](#2-wheel-date-picker-3d-inertial-scroll)
  - [3. 12-Hour Time Picker (with AM/PM & Intervals)](#3-12-hour-time-picker-with-ampm--intervals)
  - [4. 24-Hour Military Time Picker (with Seconds)](#4-24-hour-military-time-picker-with-seconds)
  - [5. Analog Clock Dial & Spinner Layout](#5-analog-clock-dial--spinner-layout)
  - [6. Combined Date + Time Picker (DateTime)](#6-combined-date--time-picker-datetime)
  - [7. Date Range Picker (with Ribbon Highlights & Limit)](#7-date-range-picker-with-ribbon-highlights--limit)
  - [8. Input Modal Picker (Tap-to-Open Field)](#8-input-modal-picker-tap-to-open-field)
  - [9. Strict Manual Keyboard Entry (Single Box & Split Pods)](#9-strict-manual-keyboard-entry-single-box--split-pods)
  - [10. Date & Time Boundary Constraints](#10-date--time-boundary-constraints)
  - [11. Disabling Specific Dates & Weekdays](#11-disabling-specific-dates--weekdays)
  - [12. Custom Action Buttons & Auto-Close on Select](#12-custom-action-buttons--auto-close-on-select)
  - [13. Standalone Component Usage](#13-standalone-component-usage)
- [🌍 Automatic UTC & ISO 8601 Support](#-automatic-utc--iso-8601-support)
- [🎨 Modal & Color Customization](#-modal--color-customization)
- [🗂️ Month & Year Fast Navigator Modal](#-month--year-fast-navigator-modal)
- [🔤 Dynamic Format Switcher Bar](#-dynamic-format-switcher-bar)
- [🔤 Formatting Tokens Reference](#-formatting-tokens-reference)
- [🌐 Multilingual Localization](#-multilingual-localization)
- [🎨 Themes & Styling Reference](#-themes--styling-reference)
- [📖 Comprehensive Props Reference](#-comprehensive-props-reference)
  - [Base / Common Props](#base--common-props)
  - [Single Date & Calendar Props](#single-date--calendar-props)
  - [Date Range Props](#date-range-props)
  - [Time & DateTime Props](#time--datetime-props)
  - [Wheel Picker Props](#wheel-picker-props)
  - [Input & Manual Entry Props](#input--manual-entry-props)
  - [Action Buttons & Callback Props](#action-buttons--callback-props)
- [🪝 Headless Custom Hooks](#-headless-custom-hooks)
  - [1. `useDatePicker`](#1-usedatepicker)
  - [2. `useCalendar`](#2-usecalendar)
  - [3. `useDateRange`](#3-usedaterange)
  - [4. `useTimePicker`](#4-usetimepicker)
- [🛠️ Utility Functions Reference](#-utility-functions-reference)
  - [Date Arithmetic & Comparison](#date-arithmetic--comparison)
  - [Time Helpers & Conversions](#time-helpers--conversions)
  - [Parsing, Masking & Formatting](#parsing-masking--formatting)
  - [Validation Engine](#validation-engine)
- [🧪 Testing & Quality Assurance](#-testing--quality-assurance)
- [🔗 Links & Resources](#-links--resources)
- [📄 License](#-license)

---

## ✨ Features

- 📅 **Interactive Calendar Picker**: Full-featured monthly grid with smooth month navigation, previous/next jump, disable filters, and current day indicator.
- 🎡 **3D Wheel Date & Time Picker**: Inertial scrolling wheel columns for Day, Month, Year, Hours, Minutes, and AM/PM with realistic physics and snap feedback.
- 🕒 **12-Hour Time Picker (AM/PM)**: 12-hour digital/wheel clock (01–12) with instant AM/PM toggle, configurable minute intervals (1m, 2m, 3m, 5m, 10m, 15m, 30m), and live preview.
- ⏱️ **24-Hour Military Time Picker**: Military clock navigation (00–23) with optional seconds support (`HH:mm:ss`).
- 🧭 **Analog Clock Dial & Spinner**: Circular analog clock face with fluid angle calculation, dual-circle 24h layout, and visual needle pointers.
- 🗓️ **Unified DateTime Picker**: Seamless synchronization of calendar date and time in one unified tabbed component.
- 🌍 **Automatic UTC & ISO 8601 Support**: Seamlessly accepts UTC ISO strings directly from APIs, converts to local device time for user interaction, and provides helpers to format back to standard UTC strings for server storage.
- ↔️ **Continuous Date Range Picker**: Interactive start/end selection cards, continuous highlight ribbon between dates, and `maxRangeDays` limits.
- 📝 **Input Modal & Inline Field**: Clean text input with calendar popup trigger, auto-formatting, and error validation badge.
- ⌨️ **Strict Manual Keyboard Date Entry**:
  - **Single Box**: Format-guided smart typing with auto-masking.
  - **Split Pods**: 3 discrete boxes for Day, Month, and Year with auto-advance focus.
- 🚫 **Comprehensive Date & Time Constraints**:
  - `minimumDate` and `maximumDate` boundaries.
  - `minimumTime` and `maximumTime` boundary enforcement for operating hours.
  - Specific disabled dates (array or dynamic callback predicate).
  - Disabled weekdays (e.g. disabling weekends).
- 🗂️ **Nested Month & Year Selector Modal**: Dedicated 2-column scrollable sheet that automatically closes the parent modal cleanly and restores state without flicker or loop issues.
- 🎨 **Live Modal Color Customization**: Complete dynamic color customization (`accentColor`, `primaryColor`, `cardColor`, `modalBackgroundColor`, `modalContentStyle`, `borderRadius`).
- 🔘 **Flexible Action Buttons**: `Today` / `Now`, `Clear`, `Cancel`, and `Confirm` / `Apply` buttons with independent visibility toggles and optional `autoCloseOnSelect`.
- 🔤 **Dynamic Format Switcher**: Real-time format switching bar supporting `DD/MM/YYYY`, `MM/DD/YYYY`, `YYYY/DD/MM`, and `YYYY/MM/DD`.
- 🌐 **Built-in Multilingual Localization**: English (`en`), Hindi (`hi`), and Gujarati (`gu`) with custom dictionary support.
- 🌓 **Adaptive Light & Dark Themes**: Pixel-perfect dark and light themes with automatic contrast calculations.
- 🚀 **Zero Native Code**: Runs everywhere React Native runs — iOS, Android, Expo Go, Web (with React Native Web).

---

## 🛠️ Architecture & Highlights

| Feature | Details |
|---|---|
| **Dependencies** | **0 native dependencies**. Pure React Native core (`View`, `Text`, `TouchableOpacity`, `ScrollView`, `Modal`, `StyleSheet`). |
| **Expo Compatibility** | **100% Expo Go ready**. No prebuild, no config plugins, no native modules. |
| **TypeScript** | Written in 100% strict TypeScript with comprehensive type definitions exported. |
| **Performance** | Optimized rendering with `useCallback`, `useMemo`, and ref comparison guards to eliminate unnecessary re-renders (60 FPS scroll & snap). |
| **Test Coverage** | 98 Jest unit tests covering date arithmetic, time parsing, boundary constraints, component rendering, and UTC conversion. |

---

## 📦 Installation

Install via npm:

```bash
npm install @izonnet-web-solution/react-native-date-picker-kit
```

Or via yarn:

```bash
yarn add @izonnet-web-solution/react-native-date-picker-kit
```

Or via pnpm:

```bash
pnpm add @izonnet-web-solution/react-native-date-picker-kit
```

### Peer Dependencies

Ensure your project has React and React Native installed:

```bash
npm install react react-native
```

- React: `>=18.0.0`
- React Native: `>=0.68.0`

> [!NOTE]
> No `pod install` or native module configuration is required!

---

## 🎯 Modes Overview

The library provides 8 primary modes through the unified `<DatePicker>` component:

| Mode | `mode="..."` | Primary Use Case |
|---|---|---|
| **Calendar** | `'calendar'` | Standard date selection with calendar grid and month navigation |
| **Wheel** | `'wheel'` | Spinning 3D wheel columns for Day, Month, and Year |
| **Time (12h)** | `'time'` (`is24Hour={false}`) | 12-hour time picker with AM/PM toggle and minute intervals |
| **Time (24h)** | `'time'` (`is24Hour={true}`) | 24-hour military time picker with optional seconds |
| **DateTime** | `'datetime'` | Combined Date + Time tabbed picker in one dialog |
| **Range** | `'range'` | Date range selection with start/end cards and highlight ribbon |
| **Input** | `'input'` | Text input field with tap-to-open calendar popup |
| **Manual Entry** | `'calendar'` + `allowManualEntry` | Direct numeric typing via Single Box or Split Pods |

---

## 🚀 Quick Start & Code Examples

### 1. Calendar Date Picker (Modal Dialog)

<div align="center">
  <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/calendar-picker.jpg" width="220" alt="Calendar Picker" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/calendar-picker-blue.jpg" width="220" alt="Calendar Picker Blue" />
</div>

Opens an interactive calendar dialog with Today, Clear, Cancel, and Confirm buttons:

```tsx
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { DatePicker, formatDate } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function CalendarModalDemo() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 20 }}>
      <Button title="Open Calendar" onPress={() => setOpen(true)} />
      <Text style={{ marginTop: 10 }}>
        Selected: {date ? formatDate(date, 'DD/MM/YYYY') : 'None'}
      </Text>

      <DatePicker
        modal
        open={open}
        mode="calendar"
        value={date}
        onChange={setDate}
        onConfirm={(selected) => {
          setDate(selected);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        accentColor="#4F46E5"
        theme="dark"
        locale="en"
        format="DD/MM/YYYY"
        minimumDate={new Date(2020, 0, 1)}
        maximumDate={new Date(2030, 11, 31)}
      />
    </View>
  );
}
```

---

### 2. Wheel Date Picker (3D Inertial Scroll)

<div align="center">
  <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/wheel-date-picker.jpg" width="220" alt="Wheel Date Picker" />
</div>

Smooth Day, Month, and Year spinning wheel columns with inertial snap physics:

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { DatePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function WheelDateDemo() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 20 }}>
      <Button title="Open Wheel Picker" onPress={() => setOpen(true)} />

      <DatePicker
        modal
        open={open}
        mode="wheel"
        value={date}
        onChange={setDate}
        onConfirm={(d) => {
          setDate(d);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        accentColor="#8B5CF6"
        minYear={1970}
        maxYear={2050}
        theme="dark"
      />
    </View>
  );
}
```

---

### 3. 12-Hour Time Picker (with AM/PM & Intervals)

<div align="center">
  <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/time-12h-wheel.jpg" width="220" alt="12-Hour Time Picker" />
</div>

12-hour clock layout with configurable minute intervals (1m, 2m, 5m, 10m, 15m, 30m):

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { DatePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function Time12Demo() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 20 }}>
      <Button title="Pick 12-Hour Time" onPress={() => setOpen(true)} />

      <DatePicker
        modal
        open={open}
        mode="time"
        value={time}
        onChange={setTime}
        onConfirm={(t) => {
          setTime(t);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        is24Hour={false}
        minuteInterval={5}
        timePickerLayout="wheel"
        accentColor="#8B5CF6"
        format="hh:mm A"
      />
    </View>
  );
}
```

---

### 4. 24-Hour Military Time Picker (with Seconds)

<div align="center">
  <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/time-24h-military-blue.jpg" width="220" alt="24-Hour Military Time" />
</div>

Complete 24-hour clock (00–23) with optional seconds display:

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { DatePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function Time24Demo() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 20 }}>
      <Button title="Pick 24-Hour Time" onPress={() => setOpen(true)} />

      <DatePicker
        modal
        open={open}
        mode="time"
        value={time}
        onChange={setTime}
        onConfirm={(t) => {
          setTime(t);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        is24Hour={true}
        showSeconds={true}
        format="HH:mm:ss"
        accentColor="#0EA5E9"
        theme="dark"
      />
    </View>
  );
}
```

---

### 5. Analog Clock Dial & Spinner Layout

Analog circular clock face with smooth angle calculation and visual needle pointers:

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { DatePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function AnalogClockDemo() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 20 }}>
      <Button title="Open Analog Clock" onPress={() => setOpen(true)} />

      <DatePicker
        modal
        open={open}
        mode="time"
        timePickerLayout="spinner"
        value={time}
        onChange={setTime}
        onConfirm={(t) => {
          setTime(t);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        accentColor="#F59E0B"
        format="hh:mm A"
      />
    </View>
  );
}
```

---

### 6. Combined Date + Time Picker (DateTime)

<div align="center">
  <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/datetime-picker-date.jpg" width="220" alt="DateTime Picker Date" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/datetime-picker-time-blue.jpg" width="220" alt="DateTime Picker Time" />
</div>

Cohesive date and time synchronization in one unified dialog:

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { DatePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function DateTimeDemo() {
  const [open, setOpen] = useState(false);
  const [dateTime, setDateTime] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 20 }}>
      <Button title="Pick Date & Time" onPress={() => setOpen(true)} />

      <DatePicker
        modal
        open={open}
        mode="datetime"
        value={dateTime}
        onChange={setDateTime}
        onConfirm={(dt) => {
          setDateTime(dt);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        is24Hour={false}
        minuteInterval={15}
        format="DD/MM/YYYY hh:mm A"
        accentColor="#4F46E5"
        theme="dark"
      />
    </View>
  );
}
```

---

### 7. Date Range Picker (with Ribbon Highlights & Limit)

<div align="center">
  <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/range-picker.jpg" width="220" alt="Date Range Picker" />
</div>

Select start date and end date with interactive cards, direction arrow, range highlight ribbon, and maximum span limits:

```tsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { DatePicker, DateRange } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function DateRangeDemo() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return (
    <View style={{ padding: 20 }}>
      <Button title="Select Date Range" onPress={() => setOpen(true)} />

      <DatePicker
        modal
        open={open}
        mode="range"
        startDate={range.startDate}
        endDate={range.endDate}
        onRangeChange={setRange}
        onConfirm={(r) => {
          if (r) setRange(r);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
        maxRangeDays={14}
        accentColor="#8B5CF6"
        theme="dark"
      />
    </View>
  );
}
```

---

### 8. Input Modal Picker (Tap-to-Open Field)

<div align="center">
  <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/input-modal-picker.jpg" width="220" alt="Input Modal Picker" />
</div>

A clean interactive input box with calendar icon that opens a synchronized popup picker:

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { DatePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

export default function InputPickerDemo() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <View style={{ padding: 20 }}>
      <DatePicker
        mode="input"
        value={date}
        onChange={setDate}
        onConfirm={setDate}
        label="Appointment Date"
        format="DD/MM/YYYY"
        allowManualEntry={true}
        accentColor="#8B5CF6"
      />
    </View>
  );
}
```

---

### 9. Strict Manual Keyboard Entry (Single Box & Split Pods)

<div align="center">
  <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/manual-entry-single.jpg" width="220" alt="Manual Entry Single Box" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/manual-entry-split.jpg" width="220" alt="Manual Entry Split Pods" />
</div>

Enables direct numeric typing with validation feedback for leap years and month boundaries:

#### Single Box Mode:
```tsx
<DatePicker
  modal
  open={open}
  mode="calendar"
  defaultManualMode={true}
  allowManualEntry={true}
  manualEntryType="single"
  value={date}
  onChange={setDate}
  format="DD/MM/YYYY"
  accentColor="#4F46E5"
/>
```

#### Split Pods Mode (Day, Month, Year discrete boxes with auto-focus):
```tsx
<DatePicker
  modal
  open={open}
  mode="calendar"
  defaultManualMode={true}
  allowManualEntry={true}
  manualEntryType="split"
  value={date}
  onChange={setDate}
  format="DD/MM/YYYY"
  accentColor="#4F46E5"
/>
```

---

### 10. Date & Time Boundary Constraints

Restrict selectable dates and operating hours (e.g., booking office appointments between 09:00 AM and 06:00 PM within a specific date window):

```tsx
<DatePicker
  modal
  open={open}
  mode="datetime"
  value={date}
  onChange={setDate}
  // Date boundaries:
  minimumDate={new Date()}                         // From today onward
  maximumDate={new Date(Date.now() + 30 * 86400000)} // Up to 30 days ahead
  // Time boundaries (Business hours):
  minimumTime="09:00 AM"                           // Earliest selectable time
  maximumTime="06:00 PM"                           // Latest selectable time
  minuteInterval={15}                              // 15-minute booking slots
  onConfirm={(d) => {
    setDate(d);
    setOpen(false);
  }}
/>
```

---

### 11. Disabling Specific Dates & Weekdays

Easily disable holidays, weekends, or specific calendar dates:

```tsx
<DatePicker
  modal
  open={open}
  mode="calendar"
  value={date}
  onChange={setDate}
  // Disable weekends: 0 = Sunday, 6 = Saturday
  disabledWeekdays={[0, 6]}
  // Start the calendar column on Monday (1) instead of Sunday (0):
  firstDayOfWeek={1}
  // Disable specific holiday dates (array or predicate function):
  disabledDates={[
    new Date(2026, 11, 25), // Christmas
    new Date(2027, 0, 1),   // New Year's Day
    '2026-12-31',           // ISO string format is supported
  ]}
  // OR dynamic callback filter:
  // disabledDates={(d) => d.getDate() % 2 === 0} // e.g. Disable even days
/>
```

---

### 12. Custom Action Buttons & Auto-Close on Select

Customize or hide the bottom footer action buttons, or enable instant closing upon selecting a day:

```tsx
<DatePicker
  modal
  open={open}
  mode="calendar"
  value={date}
  // Auto-close as soon as user taps a day on calendar:
  autoCloseOnSelect={true}
  // Control footer buttons independently:
  showActionButtons={true}
  showTodayButton={true}    // Show 'Today' jump button
  showClearButton={false}   // Hide 'Clear' button
  showCancelButton={true}   // Show 'Cancel' button
  showConfirmButton={true}  // Show 'Confirm' button
  onConfirm={(d) => setOpen(false)}
  onClose={() => setOpen(false)}
  onClear={() => setDate(null)}
/>
```

---

### 13. Standalone Component Usage

All sub-components are exported independently for custom layouts or inline embedding:

```tsx
import {
  Calendar,
  WheelPicker,
  RangePicker,
  TimePicker,
  ClockDial,
  WheelTimePicker,
  DateTimePicker,
  DateInput,
  ManualDateInput,
  MonthYearSelectorModal,
  Modal,
  Button,
  IconButton,
} from '@izonnet-web-solution/react-native-date-picker-kit';
```

---

## 🌍 Automatic UTC & ISO 8601 Support

Modern apps receive timestamps from backends in UTC / ISO 8601 strings (e.g. `"2026-11-20T09:30:00.000Z"`).  
`<DatePicker>` natively accepts `Date`, ISO 8601 `string`, or numeric epoch timestamps, automatically converting them to the user's local timezone.

### 1. Direct Binding with API Payloads:
```tsx
import { DatePicker, toUTCISOString } from '@izonnet-web-solution/react-native-date-picker-kit';

function EventScheduler({ apiEvent }) {
  const [selectedDate, setSelectedDate] = useState(apiEvent.startTimeUtc); // "2026-11-20T09:30:00.000Z"
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DatePicker
      modal
      open={isOpen}
      mode="datetime"
      value={selectedDate} // Automatically converted to local device time!
      onConfirm={(localDate) => {
        setIsOpen(false);
        if (localDate) {
          // Convert back to UTC ISO string to send to server:
          const payload = toUTCISOString(localDate); // "2026-11-20T09:30:00.000Z"
          saveToServer({ startTimeUtc: payload });
        }
      }}
    />
  );
}
```

### 2. Built-in Conversion Utilities:
```tsx
import { formatDate, toValidDate, toUTCISOString } from '@izonnet-web-solution/react-native-date-picker-kit';

// Safely convert any UTC string, number, or Date into a local Date object:
const localDate = toValidDate("2026-11-20T09:30:00.000Z");

// Format UTC ISO string directly into local device representation:
const displayTime = formatDate("2026-11-20T09:30:00.000Z", "DD MMM YYYY, hh:mm A");
// Result in IST (UTC+5:30): "20 Nov 2026, 03:00 PM"

// Convert local Date object back to standard UTC ISO string:
const utcString = toUTCISOString(localDate);
// Result: "2026-11-20T09:30:00.000Z"
```

---

## 🎨 Modal & Color Customization

The library provides fine-grained control over colors and styles. When you specify `accentColor`, all primary components automatically adapt:

```tsx
<DatePicker
  modal
  open={open}
  accentColor="#F43F5E"           // Selected circles, buttons, highlights, dial needle
  cardColor="#1E293B"             // Modal dialog background color
  modalBackgroundColor="#1E293B" // Dedicated modal container background
  textColor="#F8FAFC"             // Primary text color
  borderRadius={20}               // Modal & button corner radius
  modalContentStyle={{            // Custom styling for inner modal container
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  }}
  theme="dark"
/>
```

### What `accentColor` Controls:
1. **Calendar**: Selected date circle background, Today indicator border and text.
2. **Month & Year Selector**: Active month and year pill background, Confirm button background.
3. **Range Picker**: Start and end date circles, connection ribbon background (`${accentColor}20`).
4. **Time Picker / Clock Dial**: Selected hour/minute pills, analog clock needle, AM/PM active switch.
5. **Action Buttons**: `Confirm` / `Apply` button background, `Today` and `Clear` button text, `Cancel` button border.
6. **Input Fields**: Focus borders and calendar accessory icons.

---

## 🗂️ Month & Year Fast Navigator Modal

<div align="center">
  <img src="https://raw.githubusercontent.com/Izonnet-Web-Solution/date-time-picker/main/assets/screenshots/month-year-selector-modal.jpg" width="220" alt="Month & Year Selector Modal" />
</div>

Tap the month header (e.g. **"November 2026 ▾"**) on any calendar to open the dedicated Month & Year selection sheet:
- Two smooth scrollable columns: **MONTH** (January to December) and **YEAR** (minYear to maxYear).
- **Auto-scroll**: Automatically scrolls to the currently selected month and year on open.
- **Nested Modal Transition**: If the calendar is inside a modal dialog, the parent modal hides smoothly while the Month & Year selector is open and re-opens seamlessly upon Confirm or Close — preventing stacked modal conflicts or selection loss.

---

## 🔤 Dynamic Format Switcher Bar

Allow users to switch date formats on the fly by enabling `showFormatSelector`:

```tsx
<DatePicker
  mode="calendar"
  showFormatSelector={true}
  supportedFormats={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/DD/MM', 'YYYY/MM/DD']}
  onFormatChange={(newFormat) => console.log('Format changed:', newFormat)}
/>
```

---

## 🔤 Formatting Tokens Reference

### Date Tokens
| Token | Description | Example |
|---|---|---|
| `YYYY` | 4-digit full year | `2026` |
| `YY` | 2-digit short year | `26` |
| `MMMM` | Full month name | `November` |
| `MMM` | Short 3-letter month name | `Nov` |
| `MM` | 2-digit month with leading zero | `01` – `12` |
| `M` | 1-digit month | `1` – `12` |
| `DD` | 2-digit day of month | `01` – `31` |
| `D` | 1-digit day of month | `1` – `31` |
| `dddd` | Full weekday name | `Friday` |
| `ddd` | Short weekday name | `Fri` |
| `dd` | Minimized weekday name | `Fr` |

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

## 🌐 Multilingual Localization

Built-in translation dictionaries:
- **English** (`'en'`) — Default
- **Hindi** (`'hi'`)
- **Gujarati** (`'gu'`)

```tsx
<DatePicker
  locale="hi"    // Hindi labels ("आज", "साफ़ करें", "रद्द करें", "पुष्टि करें")
/>
```

### Custom Locale Dictionary
Pass any custom `DatePickerLocale` object (e.g. French, Spanish, German):

```tsx
import type { DatePickerLocale } from '@izonnet-web-solution/react-native-date-picker-kit';

const frenchLocale: DatePickerLocale = {
  code: 'fr',
  months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  weekdaysMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
  today: "Aujourd'hui",
  clear: 'Effacer',
  cancel: 'Annuler',
  confirm: 'Confirmer',
  apply: 'Appliquer',
  selectDate: 'Sélectionner une date',
  startDate: 'Date de début',
  endDate: 'Date de fin',
  placeholder: 'JJ/MM/AAAA',
  dayLabel: 'JOUR',
  monthLabel: 'MOIS',
  yearLabel: 'ANNÉE',
  switchManual: 'Saisie manuelle',
  switchCalendar: 'Afficher le calendrier',
  am: 'AM',
  pm: 'PM',
  hourLabel: 'HEURE',
  minuteLabel: 'MINUTE',
  secondLabel: 'SECONDE',
  selectTime: 'Sélectionner une heure',
  timeLabel: 'Heure',
  errors: {
    invalidDate: 'Date invalide',
    outOfRange: 'Date hors limites',
    minDate: 'La date ne peut pas être antérieure au minimum',
    maxDate: 'La date ne peut pas dépasser le maximum',
    disabledDate: 'Cette date est désactivée',
    disabledWeekday: 'Ce jour est désactivé',
    startDateAfterEndDate: 'La date de début doit précéder la date de fin',
    maxRangeExceeded: 'Plage maximale dépassée',
    invalidTime: 'Heure invalide',
    minTime: "L'heure ne peut pas être antérieure au minimum",
    maxTime: "L'heure ne peut pas dépasser le maximum",
  },
};

<DatePicker locale={frenchLocale} />
```

---

## 🎨 Themes & Styling Reference

### Predefined Themes
- `theme="light"` (Default clean white background with slate text)
- `theme="dark"` (High-contrast obsidian theme with subtle borders)

### `DatePickerTheme` Object Properties

```typescript
interface DatePickerTheme {
  backgroundColor: string;
  surfaceColor: string;
  cardColor: string;
  primaryColor: string;
  primaryTextColor: string;
  textColor: string;
  secondaryTextColor: string;
  disabledTextColor: string;
  borderColor: string;
  selectedDayBackgroundColor: string;
  selectedDayTextColor: string;
  todayBorderColor: string;
  todayTextColor: string;
  rangeBetweenBackgroundColor: string;
  rangeBetweenTextColor: string;
  errorColor: string;
  errorBackgroundColor: string;
  borderRadius: number;
  fontSize: {
    small: number;
    medium: number;
    large: number;
    title: number;
  };
}
```

---

## 📖 Comprehensive Props Reference

### Base / Common Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `'calendar' \| 'wheel' \| 'range' \| 'input' \| 'time' \| 'datetime'` | `'calendar'` | Primary picker mode |
| `modal` | `boolean` | `false` | When `true`, presents picker in a popup modal dialog |
| `open` | `boolean` | `false` | Controls visibility in modal mode |
| `format` | `DateFormat` | `'DD/MM/YYYY'` | Date/Time format string |
| `theme` | `'light' \| 'dark' \| Partial<DatePickerTheme>` | `'light'` | Color theme or partial theme object |
| `locale` | `'en' \| 'hi' \| 'gu' \| DatePickerLocale` | `'en'` | Active language code or custom locale dictionary |
| `accentColor` | `string` | `undefined` | Live primary accent color override |
| `primaryColor` | `string` | `undefined` | Alias for `accentColor` |
| `textColor` | `string` | `undefined` | Primary text color override |
| `backgroundColor` | `string` | `undefined` | Container background color override |
| `cardColor` | `string` | `undefined` | Card / modal container background color |
| `modalBackgroundColor`| `string` | `undefined` | Dedicated modal container background override |
| `modalContentStyle` | `StyleProp<ViewStyle>` | `undefined` | Custom style applied to the modal dialog card |
| `borderRadius` | `number` | `12` | Corner radius override for cards and buttons |
| `style` | `StyleProp<ViewStyle>` | `undefined` | Custom container style |
| `testID` | `string` | `undefined` | Test identifier for automated testing |

### Single Date & Calendar Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `Date \| string \| number \| null` | `null` | Currently selected date value (Date object or UTC ISO string) |
| `defaultValue` | `Date \| string \| number \| null` | `null` | Initial date value |
| `onChange` | `(date: Date \| null) => void` | `undefined` | Fired when date selection changes |
| `onConfirm` | `(date: Date \| null) => void` | `undefined` | Fired on Confirm button press |
| `minimumDate` | `Date` | `undefined` | Earliest selectable date boundary |
| `maximumDate` | `Date` | `undefined` | Latest selectable date boundary |
| `disabledDates` | `(Date \| string)[] \| ((d: Date) => boolean)` | `undefined` | Array of disabled dates or filter function |
| `disabledWeekdays` | `number[]` | `undefined` | Days of week to disable (`0` = Sun, `6` = Sat) |
| `firstDayOfWeek` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `0` | Column start day (`0` = Sun, `1` = Mon) |
| `autoCloseOnSelect` | `boolean` | `false` | Automatically confirm and close modal upon date cell tap |

### Date Range Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `startDate` | `Date \| string \| null` | `null` | Range start date (Date object or UTC ISO string) |
| `endDate` | `Date \| string \| null` | `null` | Range end date (Date object or UTC ISO string) |
| `defaultStartDate` | `Date \| string \| null` | `null` | Initial start date |
| `defaultEndDate` | `Date \| string \| null` | `null` | Initial end date |
| `onRangeChange` | `(range: DateRange) => void` | `undefined` | Fired when range changes |
| `onConfirm` | `(range: DateRange \| null) => void` | `undefined` | Fired on Confirm button press with final selected range |
| `maxRangeDays` | `number` | `undefined` | Maximum allowed range span in days |

### Time & DateTime Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `is24Hour` | `boolean` | `false` | Enable 24-hour military clock or 12-hour AM/PM mode |
| `minuteInterval` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 10 \| 12 \| 15 \| 20 \| 30` | `1` | Minute step intervals |
| `minimumTime` | `string \| Date` | `undefined` | Earliest allowable time (e.g. `"09:00 AM"` or `"09:00"`) |
| `maximumTime` | `string \| Date` | `undefined` | Latest allowable time (e.g. `"06:00 PM"` or `"18:00"`) |
| `showSeconds` | `boolean` | `false` | Show seconds column in time modes |
| `timePickerLayout` | `'wheel' \| 'spinner' \| 'input' \| 'segmented'` | `'wheel'` | Time picker presentation style |
| `initialTab` | `'date' \| 'time'` | `'date'` | Default active tab in datetime mode |

### Wheel Picker Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `minYear` | `number` | `1970` | Minimum selectable year |
| `maxYear` | `number` | `2050` | Maximum selectable year |
| `itemHeight` | `number` | `44` | Height of each wheel item in pixels |
| `visibleItems` | `number` | `5` | Number of visible wheel items at one time |

### Input & Manual Entry Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `allowManualEntry` | `boolean` | `false` | Show keyboard toggle button in calendar header |
| `defaultManualMode` | `boolean` | `false` | Start with manual input view enabled by default |
| `manualEntryType` | `'single' \| 'split'` | `'single'` | Single text box vs 3 separate Day/Month/Year boxes |
| `placeholder` | `string` | `undefined` | Input placeholder text (`mode="input"`) |
| `label` | `string` | `undefined` | Input field label (`mode="input"`) |
| `editable` | `boolean` | `true` | Enable or disable input editing (`mode="input"`) |
| `popupTitle` | `string` | `undefined` | Header title for the popup dialog in input mode |
| `inputStyle` | `StyleProp<TextStyle>` | `undefined` | Custom style for input text element |
| `inputContainerStyle`| `StyleProp<ViewStyle>` | `undefined` | Custom style for input outer container |

### Action Buttons & Callback Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `showActionButtons` | `boolean` | `true` | Show footer action button row |
| `showTodayButton` | `boolean` | `true` | Show `Today` / `Now` button |
| `showClearButton` | `boolean` | `true` | Show `Clear` button |
| `showCancelButton` | `boolean` | `true` | Show `Cancel` button |
| `showConfirmButton` | `boolean` | `true` | Show `Confirm` / `Apply` button |
| `onConfirm` | `(value: any) => void` | `undefined` | Callback fired on Confirm / Apply press |
| `onCancel` | `() => void` | `undefined` | Callback fired on Cancel press |
| `onClear` | `() => void` | `undefined` | Callback fired on Clear press |
| `onClose` | `() => void` | `undefined` | Callback fired when modal is dismissed |

---

## 🪝 Headless Custom Hooks

For developers building bespoke UI designs or completely custom layouts, all internal state machine hooks are exported:

### 1. `useDatePicker`

Manages single date selection, manual typing synchronization, and error validation:

```tsx
import { useDatePicker, getLocale } from '@izonnet-web-solution/react-native-date-picker-kit';

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
  value: date,
  onChange: setDate,
  format: 'DD/MM/YYYY',
  locale: getLocale('en'),
  minimumDate: new Date(2020, 0, 1),
  maximumDate: new Date(2030, 11, 31),
});
```

### 2. `useCalendar`

Manages monthly matrix rendering, leap years, month navigation, and cell states:

```tsx
import { useCalendar, getLocale } from '@izonnet-web-solution/react-native-date-picker-kit';

const {
  currentYear,
  currentMonth,
  currentMonthName,
  days,         // Array of CalendarDayCell objects for the 7x6 month grid
  weekdays,     // Formatted column headers according to firstDayOfWeek
  canGoPrevMonth,
  canGoNextMonth,
  goToPrevMonth,
  goToNextMonth,
  goToToday,
  setMonth,
  setYear,
  jumpToDate,
} = useCalendar({
  selectedDate: date,
  firstDayOfWeek: 0,
  locale: getLocale('en'),
});
```

### 3. `useDateRange`

Manages multi-day continuous range selection, start/end date logic, and span constraints:

```tsx
import { useDateRange, getLocale } from '@izonnet-web-solution/react-native-date-picker-kit';

const {
  range,              // { startDate: Date | null, endDate: Date | null }
  selectDate,         // Handles first click (start) and second click (end)
  clearRange,
  validationResult,
  isSelectingEndDate,
} = useDateRange({
  startDate: range.startDate,
  endDate: range.endDate,
  onRangeChange: setRange,
  maxRangeDays: 14,
  locale: getLocale('en'),
});
```

### 4. `useTimePicker`

Manages 12h/24h time extraction, AM/PM transitions, clock hand angles, and minute steps:

```tsx
import { useTimePicker } from '@izonnet-web-solution/react-native-date-picker-kit';

const {
  time,           // TimeObject: { hours, minutes, seconds, period, is24Hour }
  date,           // Synced Date instance
  setHours,
  setMinutes,
  setSeconds,
  setPeriod,      // 'AM' | 'PM'
  setTimeFromDate,
  hoursAngle,     // Angular degree (0-360°) for analog hour needle
  minutesAngle,   // Angular degree (0-360°) for analog minute needle
} = useTimePicker({
  value: timeDate,
  is24Hour: false,
  minuteInterval: 5,
});
```

---

## 🛠️ Utility Functions Reference

The package exports over 25 zero-dependency math and calendar utility functions:

### Date Arithmetic & Comparison

```typescript
import {
  isLeapYear,
  getDaysInMonth,
  createLocalDate,
  stripTime,
  isSameDay,
  isBeforeDay,
  isAfterDay,
  isDateInRange,
  isToday,
  addDays,
  addMonths,
  addYears,
  getStartOfMonth,
  getEndOfMonth,
  getDaysDifference,
  toValidDate,
  toUTCISOString,
} from '@izonnet-web-solution/react-native-date-picker-kit';

isLeapYear(2024);                  // true
isLeapYear(2025);                  // false
getDaysInMonth(2024, 1);           // 29 (February in leap year)
stripTime(new Date());             // Date with 00:00:00.000
isSameDay(dateA, dateB);           // boolean
isDateInRange(date, start, end);   // boolean
addDays(new Date(), 7);            // Date + 7 days
getDaysDifference(start, end);     // number of days between
toValidDate("2026-11-20T09:30:00Z"); // Safe Date object in local timezone
toUTCISOString(new Date());        // Standard ISO 8601 UTC string
```

### Time Helpers & Conversions

```typescript
import {
  convert24To12,
  convert12To24,
  setTimeOnDate,
  getTimeFromDate,
  is24HourFormat,
  padZero,
} from '@izonnet-web-solution/react-native-date-picker-kit';

convert24To12(15);         // { hour12: 3, period: 'PM' }
convert24To12(0);          // { hour12: 12, period: 'AM' }
convert12To24(3, 'PM');    // 15
convert12To24(12, 'AM');   // 0
padZero(5);                // "05"
is24HourFormat("HH:mm");   // true
is24HourFormat("hh:mm A"); // false
```

### Parsing, Masking & Formatting

```typescript
import {
  formatDate,
  parseDate,
  parseDateStrict,
  formatMaskedInput,
} from '@izonnet-web-solution/react-native-date-picker-kit';

formatDate(new Date(), 'DD/MM/YYYY');           // "20/11/2026"
formatDate(new Date(), 'dddd, MMMM D, YYYY');   // "Friday, November 20, 2026"
formatMaskedInput("20112026", "DD/MM/YYYY");    // "20/11/2026"
parseDate("20/11/2026", "DD/MM/YYYY");          // Date object
```

### Validation Engine

```typescript
import {
  validateDate,
  validateDateRange,
  validateTime,
  validateDateComponents,
  isDateDisabled,
  isWeekdayDisabled,
} from '@izonnet-web-solution/react-native-date-picker-kit';

// Strict validation of numeric date components (guards leap year rollover):
validateDateComponents(2024, 2, 29); // { isValid: true }
validateDateComponents(2025, 2, 29); // { isValid: false, errorCode: 'LEAP_YEAR' }

// Validate against boundaries and rules:
const result = validateDate(targetDate, {
  minimumDate: new Date(2026, 0, 1),
  maximumDate: new Date(2026, 11, 31),
  disabledWeekdays: [0, 6],
});
if (!result.isValid) {
  console.error(result.error); // E.g. "This day is disabled"
}
```

---

## 🧪 Testing & Quality Assurance

The library comes with comprehensive Jest unit test suites covering:
- Date arithmetic & leap year calculations
- Format token parsing and serialization
- Range boundaries and max days constraint validation
- Business hours & operating time constraints
- Component mounting, user interactions, and callbacks
- UTC & ISO 8601 normalization and conversions

Run the test suite:

```bash
npm test
```

Build declarations and bundles:

```bash
npm run build
```

---

## 🔗 Links & Resources

- 📦 **GitHub Repository**: [https://github.com/Izonnet-Web-Solution/date-time-picker](https://github.com/Izonnet-Web-Solution/date-time-picker)
- 📖 **Documentation & Readme**: [https://github.com/Izonnet-Web-Solution/date-time-picker#readme](https://github.com/Izonnet-Web-Solution/date-time-picker#readme)
- 🐛 **Issue Tracker & Bug Reports**: [https://github.com/Izonnet-Web-Solution/date-time-picker/issues](https://github.com/Izonnet-Web-Solution/date-time-picker/issues)

---

## 📄 License

MIT © [Izonnet Web Solution](https://github.com/Izonnet-Web-Solution)  
Repository: [date-time-picker](https://github.com/Izonnet-Web-Solution/date-time-picker)  
Authored by Jenil.
