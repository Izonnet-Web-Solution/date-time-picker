# Changelog

All notable changes to `@izonnet-web-solution/react-native-date-picker-kit` will be documented in this file.

## [1.0.0] - 2026-11-18

### Features
- **Calendar Date Picker**:
  - Monthly view navigation with previous and next month controls.
  - Interactive month and year quick selector.
  - Configurable first day of week.
  - Date highlighting for selected date and today's date.
  - Minimum date, maximum date, disabled dates, and disabled weekdays.
  - Action buttons: Today shortcut, Clear, Confirm, Cancel.
- **Wheel Date Picker**:
  - Smooth-scrolling Day, Month, and Year columns with inertia snapping.
  - Automatic synchronization between day, month, and year with leap year and day clamping.
  - Zero external native dependencies.
- **Date Range Picker**:
  - Selection of start and end dates with connected range ribbon highlights.
  - Automatic prevention of end date before start date.
  - Maximum range length limit (`maxRangeDays`).
- **Input Date Picker**:
  - Formatted text input field with calendar icon and popup modal.
  - Real-time format masking and bidirectional sync between input and calendar.
- **Custom Manual Date Entry**:
  - Single formatted input or split day/month/year fields.
  - Strict validation preventing impossible dates (such as 29/02 on non-leap years or 31/04).
  - Clear validation alert messages without silent date normalization.
- **Theming & Design**:
  - Built-in Light and Dark themes.
  - Full customization support for accent color, text color, background color, and border radius.
- **Localization**:
  - Out-of-the-box support for English (`en`), Hindi (`hi`), and Gujarati (`gu`).
  - Extensible locale interface.
