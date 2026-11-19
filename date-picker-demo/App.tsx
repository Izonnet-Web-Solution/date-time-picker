import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  DatePicker,
  DateRange,
  SupportedLocale,
  DateFormat,
  TimePickerLayout,
  formatDate,
} from '@izonnet-web-solution/react-native-date-picker-kit';

type DemoTab =
  | 'time-dial-modal'
  | 'time-12h'
  | 'time-24h'
  | 'datetime'
  | 'time-constraints'
  | 'calendar'
  | 'wheel'
  | 'range'
  | 'input'
  | 'manual';

function DatePickerDemoApp() {
  const systemColorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<DemoTab>('time-dial-modal');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    systemColorScheme === 'dark' ? 'dark' : 'light'
  );
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>('en');
  const [selectedDateFormat, setSelectedDateFormat] = useState<DateFormat>('DD/MM/YYYY');

  // Model 0: Time Dial Modal (Open mode with 12:34 and 05 examples)
  const [dialModalOpen, setDialModalOpen] = useState<boolean>(false);
  const [dialLayout, setDialLayout] = useState<TimePickerLayout>('spinner');
  const [dialTime, setDialTime] = useState<Date | null>(() => {
    const d = new Date();
    d.setHours(12);
    d.setMinutes(34); // Default example: 12:34 PM
    d.setSeconds(0);
    return d;
  });

  // Model 1: Calendar Date
  const [calendarDate, setCalendarDate] = useState<Date | null>(new Date());
  const [calendarModalOpen, setCalendarModalOpen] = useState<boolean>(false);

  // Model 2: Wheel Date
  const [wheelDate, setWheelDate] = useState<Date | null>(new Date());
  const [wheelModalOpen, setWheelModalOpen] = useState<boolean>(false);

  // Model 3: Date Range
  const [range, setRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  });
  const [rangeModalOpen, setRangeModalOpen] = useState<boolean>(false);

  // Model 4: Input Date
  const [inputDate, setInputDate] = useState<Date | null>(new Date());
  const [inputModalOpen, setInputModalOpen] = useState<boolean>(false);

  // Model 5: Manual Date
  const [manualDate, setManualDate] = useState<Date | null>(new Date(2024, 1, 29));
  const [manualType, setManualType] = useState<'single' | 'split'>('single');
  const [manualModalOpen, setManualModalOpen] = useState<boolean>(false);

  // Model 6: 12-Hour Time (AM/PM)
  const [time12, setTime12] = useState<Date | null>(new Date());
  const [minuteStep12, setMinuteStep12] = useState<number>(5);
  const [time12ModalOpen, setTime12ModalOpen] = useState<boolean>(false);

  // Model 7: 24-Hour Time
  const [time24, setTime24] = useState<Date | null>(new Date());
  const [showSeconds24, setShowSeconds24] = useState<boolean>(false);
  const [time24ModalOpen, setTime24ModalOpen] = useState<boolean>(false);

  // Model 8: DateTime (Combined)
  const [dateTimeVal, setDateTimeVal] = useState<Date | null>(new Date());
  const [dateTimeIs24, setDateTimeIs24] = useState<boolean>(false);
  const [dateTimeModalOpen, setDateTimeModalOpen] = useState<boolean>(false);

  // Model 9: Time Constraints (Min & Max boundaries)
  const [constrainedTime, setConstrainedTime] = useState<Date | null>(
    new Date(2026, 10, 18, 10, 30, 0)
  );

  const isDark = themeMode === 'dark';
  const bgColor = isDark ? '#0B0F19' : '#F8FAFC';
  const cardBg = isDark ? '#151D2F' : '#FFFFFF';
  const textColor = isDark ? '#F1F5F9' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const primaryColor = '#4F46E5'; // Modern Indigo
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* App Top Branding Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={[styles.logoIcon, { backgroundColor: primaryColor }]}>
              <Text style={styles.logoIconText}>📅</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.titleBadgeRow}>
                <Text style={[styles.title, { color: textColor }]}>
                  DatePicker Kit
                </Text>
                <View style={[styles.versionBadge, { backgroundColor: `${primaryColor}18` }]}>
                  <Text style={[styles.versionText, { color: primaryColor }]}>v1.2.0</Text>
                </View>
              </View>
              <Text style={[styles.subtitle, { color: subtextColor }]}>
                Production-grade Date & Time Components
              </Text>
            </View>
          </View>
        </View>

        {/* Global Controls Card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardSectionLabel, { color: subtextColor }]}>
              GLOBAL CONFIGURATION
            </Text>
          </View>

          {/* Theme Selector */}
          <View style={styles.controlRow}>
            <Text style={[styles.controlLabel, { color: textColor }]}>Appearance:</Text>
            <View style={[styles.pillGroup, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setThemeMode('light')}
                style={[
                  styles.pill,
                  themeMode === 'light' && {
                    backgroundColor: cardBg,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: themeMode === 'light' ? primaryColor : subtextColor, fontWeight: themeMode === 'light' ? '800' : '600' },
                  ]}
                >
                  ☀️ Light
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setThemeMode('dark')}
                style={[
                  styles.pill,
                  themeMode === 'dark' && {
                    backgroundColor: cardBg,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.15,
                    shadowRadius: 2,
                    elevation: 2,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: themeMode === 'dark' ? primaryColor : subtextColor, fontWeight: themeMode === 'dark' ? '800' : '600' },
                  ]}
                >
                  🌙 Dark
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Locale Selector */}
          <View style={[styles.controlRow, { marginTop: 10 }]}>
            <Text style={[styles.controlLabel, { color: textColor }]}>Language:</Text>
            <View style={[styles.pillGroup, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'gu', label: 'ગુજરાતી' },
              ].map((loc) => {
                const isSelected = currentLocale === loc.code;
                return (
                  <TouchableOpacity
                    key={loc.code}
                    activeOpacity={0.8}
                    onPress={() => setCurrentLocale(loc.code as SupportedLocale)}
                    style={[
                      styles.pill,
                      isSelected && {
                        backgroundColor: cardBg,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        { color: isSelected ? primaryColor : subtextColor, fontWeight: isSelected ? '800' : '600' },
                      ]}
                    >
                      {loc.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Date Format Selector */}
          <View style={[styles.controlRow, { marginTop: 10 }]}>
            <Text style={[styles.controlLabel, { color: textColor }]}>Format:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.pillGroup,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', gap: 4 },
              ]}
            >
              {[
                'DD/MM/YYYY',
                'MM/DD/YYYY',
                'YYYY/DD/MM',
                'YYYY/MM/DD',
              ].map((fmt) => {
                const isSelected = selectedDateFormat === fmt;
                return (
                  <TouchableOpacity
                    key={fmt}
                    activeOpacity={0.8}
                    onPress={() => setSelectedDateFormat(fmt as DateFormat)}
                    style={[
                      styles.pill,
                      isSelected && {
                        backgroundColor: cardBg,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        {
                          color: isSelected ? primaryColor : subtextColor,
                          fontWeight: isSelected ? '800' : '600',
                          fontSize: 11,
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
        </View>

        {/* Feature Category Navigation Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {[
            { id: 'time-dial-modal', label: '🧭 Dial (Open Mode)' },
            { id: 'time-12h', label: '⏰ 12h AM/PM' },
            { id: 'time-24h', label: '⏱️ 24h Military' },
            { id: 'datetime', label: '📅⏰ Date+Time' },
            { id: 'calendar', label: '1. Calendar' },
            { id: 'wheel', label: '2. Wheel Date' },
            { id: 'range', label: '3. Range' },
            { id: 'input', label: '4. Input Modal' },
            { id: 'manual', label: '5. Manual Input' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab.id as DemoTab)}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: isActive ? primaryColor : cardBg,
                    borderColor: isActive ? primaryColor : borderColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    { color: isActive ? '#FFFFFF' : subtextColor, fontWeight: isActive ? '800' : '600' },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* --- DEMO 0: TIME DIAL PICKER (OPEN / MODAL MODE) --- */}
        {activeTab === 'time-dial-modal' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            {/* Prominent Modal Launch Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setDialModalOpen(true)}
              style={[
                styles.openModalButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: primaryColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                },
              ]}
            >
              <Text style={styles.openModalButtonIcon}>🧭</Text>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.openModalButtonTitle}>
                  Open TimePicker (Modal Mode)
                </Text>
                <Text style={styles.openModalButtonSubtitle}>
                  Layout: {dialLayout.toUpperCase()} | Time: {dialTime ? formatDate(dialTime, 'hh:mm A', currentLocale) : 'Tap to open'}
                </Text>
              </View>
              <Text style={styles.openModalArrow}>→</Text>
            </TouchableOpacity>

            {/* Modal DatePicker instance */}
            <DatePicker
              modal
              open={dialModalOpen}
              mode="time"
              timePickerLayout={"spinner"}
              value={dialTime}
              onChange={setDialTime}
              onConfirm={(d) => {
                setDialTime(d);
                setDialModalOpen(false);
              }}
              onClose={() => setDialModalOpen(false)}
              onCancel={() => setDialModalOpen(false)}
              theme={themeMode}
              locale={currentLocale}
              format="hh:mm A"
            />

            {/* Live Result Ticket Card */}
            <View
              style={[
                styles.resultTicket,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  borderColor,
                  marginTop: 16,
                },
              ]}
            >
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>
                  SELECTED DIAL TIME
                </Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {dialTime ? formatDate(dialTime, 'hh:mm A', currentLocale) : 'None'}
              </Text>
              <View style={styles.dialBreakdownRow}>
                <View style={[styles.breakdownChip, { backgroundColor: `${primaryColor}12` }]}>
                  <Text style={[styles.breakdownLabel, { color: primaryColor }]}>
                    Hour: {dialTime ? dialTime.getHours() % 12 || 12 : '--'}
                  </Text>
                </View>
                <View style={[styles.breakdownChip, { backgroundColor: `${primaryColor}12` }]}>
                  <Text style={[styles.breakdownLabel, { color: primaryColor }]}>
                    Minute: {dialTime ? String(dialTime.getMinutes()).padStart(2, '0') : '--'}
                  </Text>
                </View>
                <View style={[styles.breakdownChip, { backgroundColor: `${primaryColor}12` }]}>
                  <Text style={[styles.breakdownLabel, { color: primaryColor }]}>
                    Period: {dialTime ? (dialTime.getHours() >= 12 ? 'PM' : 'AM') : '--'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* --- DEMO 1: 12-HOUR TIME PICKER (AM/PM) --- */}
        {activeTab === 'time-12h' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeRow}>
                <View style={[styles.tagBadge, { backgroundColor: `${primaryColor}18` }]}>
                  <Text style={[styles.tagBadgeText, { color: primaryColor }]}>12H AM/PM</Text>
                </View>
                <View style={[styles.tagBadge, { backgroundColor: '#10B98118' }]}>
                  <Text style={[styles.tagBadgeText, { color: '#10B981' }]}>CONFIRM TO SET</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                12-Hour Time Picker (AM/PM)
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Click below to open the modal. Inside modal, use Now, Clear, Cancel, and Confirm buttons.
              </Text>
            </View>

            {/* Minute Interval Selector */}
            <View style={styles.subControlRow}>
              <Text style={[styles.subControlLabel, { color: subtextColor }]}>Minute Step:</Text>
              <View style={styles.intervalRow}>
                {[1, 5, 10, 15, 30].map((step) => {
                  const isSel = minuteStep12 === step;
                  return (
                    <TouchableOpacity
                      key={step}
                      onPress={() => setMinuteStep12(step)}
                      style={[
                        styles.intervalPill,
                        {
                          backgroundColor: isSel ? `${primaryColor}18` : 'transparent',
                          borderColor: isSel ? primaryColor : borderColor,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.intervalPillText,
                          {
                            color: isSel ? primaryColor : subtextColor,
                            fontWeight: isSel ? '800' : '600',
                          },
                        ]}
                      >
                        {step}m
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Modal Launch Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setTime12ModalOpen(true)}
              style={[
                styles.openModalButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: primaryColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                  marginBottom: 16,
                },
              ]}
            >
              <Text style={styles.openModalButtonIcon}>⏰</Text>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.openModalButtonTitle}>
                  Open 12h TimePicker (Modal Mode)
                </Text>
                <Text style={styles.openModalButtonSubtitle}>
                  Time: {time12 ? formatDate(time12, 'hh:mm A', currentLocale) : 'Tap to open & select'}
                </Text>
              </View>
              <Text style={styles.openModalArrow}>→</Text>
            </TouchableOpacity>

            {/* Modal DatePicker instance */}
            <DatePicker
              modal
              open={time12ModalOpen}
              mode="time"
              timePickerLayout="wheel"
              value={time12}
              onChange={setTime12}
              onConfirm={(d) => {
                setTime12(d);
                setTime12ModalOpen(false);
              }}
              onClose={() => setTime12ModalOpen(false)}
              onCancel={() => setTime12ModalOpen(false)}
              is24Hour={false}
              minuteInterval={minuteStep12}
              theme={themeMode}
              locale={currentLocale}
              format="hh:mm A"
            />

            {/* Live Result Ticket Card */}
            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>CONFIRMED OUTPUT (12H)</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {time12 ? formatDate(time12, 'hh:mm A', currentLocale) : 'None'}
              </Text>
              <Text style={[styles.ticketMeta, { color: subtextColor }]}>
                ISO: {time12 ? time12.toLocaleTimeString() : '--'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 2: 24-HOUR TIME PICKER --- */}
        {activeTab === 'time-24h' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeRow}>
                <View style={[styles.tagBadge, { backgroundColor: `${primaryColor}18` }]}>
                  <Text style={[styles.tagBadgeText, { color: primaryColor }]}>24H MILITARY</Text>
                </View>
                <View style={[styles.tagBadge, { backgroundColor: '#10B98118' }]}>
                  <Text style={[styles.tagBadgeText, { color: '#10B981' }]}>CONFIRM TO SET</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                24-Hour Military Time Picker
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                00:00 to 23:59 military time format. Click below to open modal with Now, Clear, Cancel, and Confirm buttons.
              </Text>
            </View>

            {/* Seconds Toggle */}
            <View style={styles.subControlRow}>
              <Text style={[styles.subControlLabel, { color: subtextColor }]}>Seconds Display:</Text>
              <TouchableOpacity
                onPress={() => setShowSeconds24((s) => !s)}
                style={[
                  styles.intervalPill,
                  {
                    backgroundColor: showSeconds24 ? `${primaryColor}18` : 'transparent',
                    borderColor: showSeconds24 ? primaryColor : borderColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.intervalPillText,
                    {
                      color: showSeconds24 ? primaryColor : subtextColor,
                      fontWeight: showSeconds24 ? '800' : '600',
                    },
                  ]}
                >
                  {showSeconds24 ? '⏱️ Seconds: ON' : '⏱️ Seconds: OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Modal Launch Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setTime24ModalOpen(true)}
              style={[
                styles.openModalButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: primaryColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                  marginBottom: 16,
                },
              ]}
            >
              <Text style={styles.openModalButtonIcon}>⏱️</Text>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.openModalButtonTitle}>
                  Open 24h TimePicker (Modal Mode)
                </Text>
                <Text style={styles.openModalButtonSubtitle}>
                  Time: {time24 ? formatDate(time24, showSeconds24 ? 'HH:mm:ss' : 'HH:mm', currentLocale) : 'Tap to open & select'}
                </Text>
              </View>
              <Text style={styles.openModalArrow}>→</Text>
            </TouchableOpacity>

            {/* Modal DatePicker instance */}
            <DatePicker
              modal
              open={time24ModalOpen}
              mode="time"
              value={time24}
              onChange={setTime24}
              onConfirm={(d) => {
                setTime24(d);
                setTime24ModalOpen(false);
              }}
              onClose={() => setTime24ModalOpen(false)}
              onCancel={() => setTime24ModalOpen(false)}
              is24Hour={true}
              showSeconds={showSeconds24}
              theme={themeMode}
              locale={currentLocale}
              format={showSeconds24 ? 'HH:mm:ss' : 'HH:mm'}
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>CONFIRMED OUTPUT (24H)</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {time24
                  ? formatDate(
                    time24,
                    showSeconds24 ? 'HH:mm:ss' : 'HH:mm',
                    currentLocale
                  )
                  : 'None'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 3: COMBINED DATE + TIME PICKER --- */}
        {activeTab === 'datetime' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeRow}>
                <View style={[styles.tagBadge, { backgroundColor: `${primaryColor}18` }]}>
                  <Text style={[styles.tagBadgeText, { color: primaryColor }]}>DATE + TIME</Text>
                </View>
                <View style={[styles.tagBadge, { backgroundColor: '#10B98118' }]}>
                  <Text style={[styles.tagBadgeText, { color: '#10B981' }]}>CONFIRM TO SET</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Date + Time Combined Picker
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Unified modal with tabbed Date and Time controls. Changes committed only upon Confirm button tap.
              </Text>
            </View>

            {/* 12h vs 24h toggle */}
            <View style={styles.subControlRow}>
              <Text style={[styles.subControlLabel, { color: subtextColor }]}>Clock Format:</Text>
              <View style={styles.intervalRow}>
                <TouchableOpacity
                  onPress={() => setDateTimeIs24(false)}
                  style={[
                    styles.intervalPill,
                    {
                      backgroundColor: !dateTimeIs24 ? `${primaryColor}18` : 'transparent',
                      borderColor: !dateTimeIs24 ? primaryColor : borderColor,
                    },
                  ]}
                >
                  <Text style={[styles.intervalPillText, { color: !dateTimeIs24 ? primaryColor : subtextColor, fontWeight: !dateTimeIs24 ? '800' : '600' }]}>
                    12H (AM/PM)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDateTimeIs24(true)}
                  style={[
                    styles.intervalPill,
                    {
                      backgroundColor: dateTimeIs24 ? `${primaryColor}18` : 'transparent',
                      borderColor: dateTimeIs24 ? primaryColor : borderColor,
                    },
                  ]}
                >
                  <Text style={[styles.intervalPillText, { color: dateTimeIs24 ? primaryColor : subtextColor, fontWeight: dateTimeIs24 ? '800' : '600' }]}>
                    24H (Military)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Modal Launch Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setDateTimeModalOpen(true)}
              style={[
                styles.openModalButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: primaryColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                  marginBottom: 16,
                },
              ]}
            >
              <Text style={styles.openModalButtonIcon}>📅⏰</Text>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.openModalButtonTitle}>
                  Open Date+Time Picker (Modal Mode)
                </Text>
                <Text style={styles.openModalButtonSubtitle}>
                  Current: {dateTimeVal ? formatDate(dateTimeVal, dateTimeIs24 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY hh:mm A', currentLocale) : 'Tap to open & select'}
                </Text>
              </View>
              <Text style={styles.openModalArrow}>→</Text>
            </TouchableOpacity>

            {/* Modal DatePicker instance */}
            <DatePicker
              modal
              open={dateTimeModalOpen}
              mode="datetime"
              value={dateTimeVal}
              onChange={setDateTimeVal}
              onConfirm={(d) => {
                setDateTimeVal(d);
                setDateTimeModalOpen(false);
              }}
              onClose={() => setDateTimeModalOpen(false)}
              onCancel={() => setDateTimeModalOpen(false)}
              is24Hour={dateTimeIs24}
              theme={themeMode}
              locale={currentLocale}
              format={dateTimeIs24 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY hh:mm A'}
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>CONFIRMED TIMESTAMP</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {dateTimeVal
                  ? formatDate(
                    dateTimeVal,
                    dateTimeIs24
                      ? 'DD MMMM YYYY, HH:mm'
                      : 'DD MMMM YYYY, hh:mm A',
                    currentLocale
                  )
                  : 'None'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 4: TIME CONSTRAINTS & BOUNDARIES --- */}
        {/* {activeTab === 'time-constraints' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Working Hours Constraints
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Enforces business opening hours: Minimum allowed is <Text style={{ fontWeight: '800' }}>09:00 AM</Text> and Maximum is <Text style={{ fontWeight: '800' }}>06:00 PM</Text>.
              </Text>
            </View>

            <DatePicker
              mode="time"
              value={constrainedTime}
              onChange={setConstrainedTime}
              is24Hour={false}
              minimumTime="09:00 AM"
              maximumTime="06:00 PM"
              theme={themeMode}
              locale={currentLocale}
              format="hh:mm A"
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>VALIDATED APPOINTMENT TIME</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {constrainedTime ? formatDate(constrainedTime, 'hh:mm A', currentLocale) : 'None'}
              </Text>
            </View>
          </View>
        )} */}

        {/* --- DEMO 5: CALENDAR DATE PICKER --- */}
        {activeTab === 'calendar' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            {/* Modal Launch Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setCalendarModalOpen(true)}
              style={[
                styles.openModalButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: primaryColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                  marginBottom: 12,
                },
              ]}
            >
              <Text style={styles.openModalButtonIcon}>📅</Text>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.openModalButtonTitle}>
                  Open Calendar (Modal Dialog)
                </Text>
                <Text style={styles.openModalButtonSubtitle}>
                  Date: {calendarDate ? formatDate(calendarDate, selectedDateFormat, currentLocale) : 'Tap to select date'}
                </Text>
              </View>
              <Text style={styles.openModalArrow}>→</Text>
            </TouchableOpacity>

            {/* Modal DatePicker instance with auto-close */}
            <DatePicker
              modal
              open={calendarModalOpen}
              mode="calendar"
              value={calendarDate}
              onChange={setCalendarDate}
              onConfirm={(d) => {
                setCalendarDate(d);
                setCalendarModalOpen(false);
              }}
              onClose={() => setCalendarModalOpen(false)}
              onCancel={() => setCalendarModalOpen(false)}
              theme={themeMode}
              locale={currentLocale}
              format={selectedDateFormat}
              allowManualEntry={true}
              disabledWeekdays={[0]}
              minimumDate={new Date(2020, 0, 1)}
              maximumDate={new Date(2030, 11, 31)}
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor, marginTop: 12 }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>SELECTED CALENDAR DATE</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {calendarDate ? formatDate(calendarDate, selectedDateFormat, currentLocale) : 'None'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 6: WHEEL DATE PICKER --- */}
        {activeTab === 'wheel' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeRow}>
                <View style={[styles.tagBadge, { backgroundColor: `${primaryColor}18` }]}>
                  <Text style={[styles.tagBadgeText, { color: primaryColor }]}>WHEEL DATE</Text>
                </View>
                <View style={[styles.tagBadge, { backgroundColor: '#10B98118' }]}>
                  <Text style={[styles.tagBadgeText, { color: '#10B981' }]}>CONFIRM TO SET</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Wheel Date Picker
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Smooth Day, Month, and Year spinning wheels. Click below to open modal with Today, Clear, Cancel, and Confirm buttons.
              </Text>
            </View>

            {/* Modal Launch Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setWheelModalOpen(true)}
              style={[
                styles.openModalButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: primaryColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                  marginBottom: 16,
                },
              ]}
            >
              <Text style={styles.openModalButtonIcon}>🎡</Text>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.openModalButtonTitle}>
                  Open Wheel DatePicker (Modal Mode)
                </Text>
                <Text style={styles.openModalButtonSubtitle}>
                  Date: {wheelDate ? formatDate(wheelDate, selectedDateFormat, currentLocale) : 'Tap to open & select'}
                </Text>
              </View>
              <Text style={styles.openModalArrow}>→</Text>
            </TouchableOpacity>

            {/* Modal DatePicker instance */}
            <DatePicker
              modal
              open={wheelModalOpen}
              mode="wheel"
              value={wheelDate}
              onChange={setWheelDate}
              onConfirm={(d) => {
                setWheelDate(d);
                setWheelModalOpen(false);
              }}
              onClose={() => setWheelModalOpen(false)}
              onCancel={() => setWheelModalOpen(false)}
              theme={themeMode}
              locale={currentLocale}
              minYear={1970}
              maxYear={2040}
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>CONFIRMED WHEEL DATE ({selectedDateFormat})</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {wheelDate ? formatDate(wheelDate, selectedDateFormat, currentLocale) : 'None'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 7: DATE RANGE PICKER --- */}
        {activeTab === 'range' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeRow}>
                <View style={[styles.tagBadge, { backgroundColor: `${primaryColor}18` }]}>
                  <Text style={[styles.tagBadgeText, { color: primaryColor }]}>DATE RANGE</Text>
                </View>
                <View style={[styles.tagBadge, { backgroundColor: '#10B98118' }]}>
                  <Text style={[styles.tagBadgeText, { color: '#10B981' }]}>CONFIRM TO SET</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Date Range Picker
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Start and End date selection with ribbon highlights. Click below to open modal with Clear, Cancel, and Apply buttons.
              </Text>
            </View>

            {/* Modal Launch Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setRangeModalOpen(true)}
              style={[
                styles.openModalButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: primaryColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                  marginBottom: 16,
                },
              ]}
            >
              <Text style={styles.openModalButtonIcon}>📊</Text>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.openModalButtonTitle}>
                  Open Date Range Picker (Modal Mode)
                </Text>
                <Text style={styles.openModalButtonSubtitle}>
                  Range: {range.startDate ? formatDate(range.startDate, 'DD/MM/YYYY', currentLocale) : '--'} - {range.endDate ? formatDate(range.endDate, 'DD/MM/YYYY', currentLocale) : '--'}
                </Text>
              </View>
              <Text style={styles.openModalArrow}>→</Text>
            </TouchableOpacity>

            {/* Modal DatePicker instance */}
            <DatePicker
              modal
              open={rangeModalOpen}
              mode="range"
              startDate={range.startDate}
              endDate={range.endDate}
              onRangeChange={setRange}
              onConfirm={(r) => {
                if (r) setRange(r);
                setRangeModalOpen(false);
              }}
              onClose={() => setRangeModalOpen(false)}
              onCancel={() => setRangeModalOpen(false)}
              maxRangeDays={14}
              theme={themeMode}
              locale={currentLocale}
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>CONFIRMED DATE RANGE</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {range.startDate ? formatDate(range.startDate, 'DD/MM/YYYY', currentLocale) : 'Start'}
                {' → '}
                {range.endDate ? formatDate(range.endDate, 'DD/MM/YYYY', currentLocale) : 'End'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 8: INPUT MODAL PICKER --- */}
        {activeTab === 'input' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeRow}>
                <View style={[styles.tagBadge, { backgroundColor: `${primaryColor}18` }]}>
                  <Text style={[styles.tagBadgeText, { color: primaryColor }]}>INPUT MODAL</Text>
                </View>
                <View style={[styles.tagBadge, { backgroundColor: '#10B98118' }]}>
                  <Text style={[styles.tagBadgeText, { color: '#10B981' }]}>CONFIRM TO SET</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Input Modal Picker
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Tap the prominent launch card or the input calendar icon to open the modal dialog with Today, Clear, Cancel, and Confirm buttons.
              </Text>
            </View>

            {/* Prominent Modal Launch Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setInputModalOpen(true)}
              style={[
                styles.openModalButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: primaryColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                  marginBottom: 16,
                },
              ]}
            >
              <Text style={styles.openModalButtonIcon}>📝</Text>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.openModalButtonTitle}>
                  Open Input Picker (Modal Mode)
                </Text>
                <Text style={styles.openModalButtonSubtitle}>
                  Format: {selectedDateFormat} | Date: {inputDate ? formatDate(inputDate, selectedDateFormat, currentLocale) : 'Tap to open'}
                </Text>
              </View>
              <Text style={styles.openModalArrow}>→</Text>
            </TouchableOpacity>

            {/* Modal DatePicker instance */}
            <DatePicker
              modal
              open={inputModalOpen}
              mode="input"
              value={inputDate}
              onChange={setInputDate}
              onConfirm={(d) => {
                setInputDate(d);
                setInputModalOpen(false);
              }}
              onClose={() => setInputModalOpen(false)}
              onCancel={() => setInputModalOpen(false)}
              label="Date"
              format={selectedDateFormat}
              allowManualEntry={true}
              theme={themeMode}
              locale={currentLocale}
            />

            {/* Inline Interactive Input Field Preview */}
            <View style={{ marginTop: 6, marginBottom: 16 }}>
              <Text style={[styles.subControlLabel, { color: subtextColor, marginBottom: 8 }]}>
                INLINE INTERACTIVE FIELD (TAP ICON TO OPEN):
              </Text>
              <DatePicker
                mode="input"
                value={inputDate}
                onChange={setInputDate}
                onConfirm={setInputDate}
                label="Date"
                format={selectedDateFormat}
                allowManualEntry={true}
                theme={themeMode}
                locale={currentLocale}
              />
            </View>

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>CONFIRMED APPOINTMENT DATE</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {inputDate ? formatDate(inputDate, selectedDateFormat, currentLocale) : 'None'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 9: DATEPICKER MODAL & MANUAL ENTRY --- */}
        {activeTab === 'manual' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeRow}>
                <View style={[styles.tagBadge, { backgroundColor: `${primaryColor}18` }]}>
                  <Text style={[styles.tagBadgeText, { color: primaryColor }]}>MANUAL INPUT</Text>
                </View>
                <View style={[styles.tagBadge, { backgroundColor: '#10B98118' }]}>
                  <Text style={[styles.tagBadgeText, { color: '#10B981' }]}>CONFIRM TO SET</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                DatePicker Modal & Manual Entry
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Interactive calendar modal dialog supporting Single Box and Split input formats with Today, Clear, Cancel, and Confirm buttons.
              </Text>
            </View>

            {/* Manual Entry Type Switcher */}
            <View style={styles.subControlRow}>
              <Text style={[styles.subControlLabel, { color: subtextColor }]}>Input Style:</Text>
              <View style={styles.intervalRow}>
                {[
                  { key: 'single', label: '📝 Single Box' },
                  { key: 'split', label: '📑 Split Boxes' },
                ].map((item) => {
                  const isSel = manualType === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => setManualType(item.key as 'single' | 'split')}
                      style={[
                        styles.intervalPill,
                        {
                          backgroundColor: isSel ? `${primaryColor}18` : 'transparent',
                          borderColor: isSel ? primaryColor : borderColor,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.intervalPillText,
                          {
                            color: isSel ? primaryColor : subtextColor,
                            fontWeight: isSel ? '800' : '600',
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Prominent Modal Launch Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setManualModalOpen(true)}
              style={[
                styles.openModalButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: primaryColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                  marginBottom: 12,
                },
              ]}
            >
              <Text style={styles.openModalButtonIcon}>📅</Text>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.openModalButtonTitle}>
                  Open DatePicker (Modal Mode)
                </Text>
                <Text style={styles.openModalButtonSubtitle}>
                  Date: {manualDate ? formatDate(manualDate, selectedDateFormat, currentLocale) : 'Tap to enter date'}
                </Text>
              </View>
              <Text style={styles.openModalArrow}>→</Text>
            </TouchableOpacity>

            {/* Modal DatePicker instance */}
            <DatePicker
              modal
              open={manualModalOpen}
              mode="calendar"
              defaultManualMode={true}
              value={manualDate}
              onChange={setManualDate}
              onConfirm={(d) => {
                setManualDate(d);
                setManualModalOpen(false);
              }}
              onClose={() => setManualModalOpen(false)}
              onCancel={() => setManualModalOpen(false)}
              allowManualEntry={true}
              manualEntryType={manualType}
              format={selectedDateFormat}
              theme={themeMode}
              locale={currentLocale}
            />

            {/* Inline Live Manual Input Preview */}
            <View style={{ marginTop: 4, marginBottom: 12 }}>
              <Text style={[styles.subControlLabel, { color: subtextColor, marginBottom: 6 }]}>
                INTERACTIVE MANUAL INPUT PREVIEW ({manualType.toUpperCase()}):
              </Text>
              <DatePicker
                mode="calendar"
                defaultManualMode={true}
                allowManualEntry={true}
                manualEntryType={manualType}
                value={manualDate}
                onChange={setManualDate}
                format={selectedDateFormat}
                theme={themeMode}
                locale={currentLocale}
              />
            </View>

            {/* Live Result Output */}
            <View
              style={[
                styles.resultTicket,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  borderColor,
                  marginTop: 12,
                },
              ]}
            >
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>
                  SELECTED DATE
                </Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {manualDate ? formatDate(manualDate, selectedDateFormat, currentLocale) : 'None'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <DatePickerDemoApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoIconText: {
    fontSize: 22,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  versionBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    marginBottom: 10,
  },
  cardSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  pillGroup: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 12,
  },
  subControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  subControlLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  intervalRow: {
    flexDirection: 'row',
    gap: 6,
  },
  intervalPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  intervalPillText: {
    fontSize: 12,
  },
  toggleChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  toggleChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabsScroll: {
    marginBottom: 16,
  },
  tabsContent: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabButtonText: {
    fontSize: 13,
  },
  resultTicket: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  ticketTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ticketLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  ticketValue: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  ticketMeta: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  presetSection: {
    marginBottom: 14,
  },
  examplePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  exampleBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  openModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 4,
  },
  openModalButtonIcon: {
    fontSize: 24,
  },
  openModalButtonTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  openModalButtonSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  openModalArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
  },
  dialBreakdownRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  breakdownChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  breakdownLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
});
