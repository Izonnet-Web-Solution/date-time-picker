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

  // Model 0: Time Dial Modal (Open mode with 12:34 and 05 examples)
  const [dialModalOpen, setDialModalOpen] = useState<boolean>(false);
  const [dialTime, setDialTime] = useState<Date | null>(() => {
    const d = new Date();
    d.setHours(12);
    d.setMinutes(34); // Default example: 12:34 PM
    d.setSeconds(0);
    return d;
  });

  // Model 1: Calendar Date
  const [calendarDate, setCalendarDate] = useState<Date | null>(new Date());

  // Model 2: Wheel Date
  const [wheelDate, setWheelDate] = useState<Date | null>(new Date());

  // Model 3: Date Range
  const [range, setRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  });

  // Model 4: Input Date
  const [inputDate, setInputDate] = useState<Date | null>(new Date());

  // Model 5: Manual Date
  const [manualDate, setManualDate] = useState<Date | null>(new Date(2024, 1, 29));
  const [manualType, setManualType] = useState<'single' | 'split'>('single');

  // Model 6: 12-Hour Time (AM/PM)
  const [time12, setTime12] = useState<Date | null>(new Date());
  const [minuteStep12, setMinuteStep12] = useState<number>(5);

  // Model 7: 24-Hour Time
  const [time24, setTime24] = useState<Date | null>(new Date());
  const [showSeconds24, setShowSeconds24] = useState<boolean>(false);

  // Model 8: DateTime (Combined)
  const [dateTimeVal, setDateTimeVal] = useState<Date | null>(new Date());
  const [dateTimeIs24, setDateTimeIs24] = useState<boolean>(false);

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
            { id: 'time-constraints', label: '🔒 Constraints' },
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
            <View style={styles.cardHeader}>
              <View style={styles.badgeRow}>
                <View style={[styles.tagBadge, { backgroundColor: `${primaryColor}18` }]}>
                  <Text style={[styles.tagBadgeText, { color: primaryColor }]}>MODAL OPEN MODE</Text>
                </View>
                <View style={[styles.tagBadge, { backgroundColor: '#10B98118' }]}>
                  <Text style={[styles.tagBadgeText, { color: '#10B981' }]}>CLOCK DIAL</Text>
                </View>
              </View>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Select Time: Dial Mode (Open / Modal)
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Interactive analog clock face with precision minute selection. Demonstrates selecting exact minute numbers like :05 and :34 (e.g. 12:34), plus fine-tuning for minutes 1, 2, 3, 4.
              </Text>
            </View>

            {/* Quick Test Presets: 12:34 PM, 09:05 AM, 12:04 PM */}
            <View style={styles.presetSection}>
              <Text style={[styles.subControlLabel, { color: subtextColor, marginBottom: 8 }]}>
                Test Time Examples:
              </Text>
              <View style={styles.examplePillsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    const d = new Date();
                    d.setHours(12);
                    d.setMinutes(25);
                    d.setSeconds(0);
                    setDialTime(d);
                  }}
                  style={[
                    styles.exampleBtn,
                    {
                      backgroundColor: dialTime?.getMinutes() === 25 ? primaryColor : `${primaryColor}15`,
                      borderColor: primaryColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.exampleBtnText,
                      { color: dialTime?.getMinutes() === 25 ? '#FFFFFF' : primaryColor },
                    ]}
                  >
                    🔥 12:25 PM (Move to :27)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    const d = new Date();
                    d.setHours(12);
                    d.setMinutes(34);
                    d.setSeconds(0);
                    setDialTime(d);
                  }}
                  style={[
                    styles.exampleBtn,
                    {
                      backgroundColor: dialTime?.getMinutes() === 34 ? primaryColor : `${primaryColor}15`,
                      borderColor: primaryColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.exampleBtnText,
                      { color: dialTime?.getMinutes() === 34 ? '#FFFFFF' : primaryColor },
                    ]}
                  >
                    ⏰ Example: 12:34 PM
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    const d = new Date();
                    d.setHours(9);
                    d.setMinutes(5);
                    d.setSeconds(0);
                    setDialTime(d);
                  }}
                  style={[
                    styles.exampleBtn,
                    {
                      backgroundColor: dialTime?.getMinutes() === 5 ? primaryColor : `${primaryColor}15`,
                      borderColor: primaryColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.exampleBtnText,
                      { color: dialTime?.getMinutes() === 5 ? '#FFFFFF' : primaryColor },
                    ]}
                  >
                    ⏱️ Example: 09:05 AM
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    const d = new Date();
                    d.setHours(12);
                    d.setMinutes(4);
                    d.setSeconds(0);
                    setDialTime(d);
                  }}
                  style={[
                    styles.exampleBtn,
                    {
                      backgroundColor: dialTime?.getMinutes() === 4 ? primaryColor : `${primaryColor}15`,
                      borderColor: primaryColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.exampleBtnText,
                      { color: dialTime?.getMinutes() === 4 ? '#FFFFFF' : primaryColor },
                    ]}
                  >
                    🎯 Example: 12:04 (1,2,3,4 min)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

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
                  Open Dial TimePicker (Modal Mode)
                </Text>
                <Text style={styles.openModalButtonSubtitle}>
                  Current: {dialTime ? formatDate(dialTime, 'hh:mm A', currentLocale) : 'Tap to open'}
                </Text>
              </View>
              <Text style={styles.openModalArrow}>→</Text>
            </TouchableOpacity>

            {/* Modal DatePicker instance */}
            <DatePicker
              modal
              open={dialModalOpen}
              mode="time"
              timePickerLayout="spinner"
              value={dialTime}
              onChange={setDialTime}
              onConfirm={(d) => {
                setDialTime(d);
                setDialModalOpen(false);
              }}
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

            {/* Inline Dial View Preview */}
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.subControlLabel, { color: subtextColor, marginBottom: 10 }]}>
                INLINE INTERACTIVE CLOCK DIAL:
              </Text>
              <DatePicker
                mode="time"
                timePickerLayout="spinner"
                value={dialTime}
                onChange={setDialTime}
                theme={themeMode}
                locale={currentLocale}
                format="hh:mm A"
              />
            </View>
          </View>
        )}

        {/* --- DEMO 1: 12-HOUR TIME PICKER (AM/PM) --- */}
        {activeTab === 'time-12h' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                12-Hour Time Picker with AM / PM
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Includes 3 interactive modes: Cupertino-style 3D Wheel, Analog Clock Dial, and Precise Steppers.
              </Text>
            </View>

            {/* Minute Interval Filter Chips */}
            <View style={styles.subControlRow}>
              <Text style={[styles.subControlLabel, { color: subtextColor }]}>Minute Step:</Text>
              <View style={styles.intervalRow}>
                {[1, 5, 15, 30].map((step) => {
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
                          { color: isSel ? primaryColor : subtextColor, fontWeight: isSel ? '800' : '600' },
                        ]}
                      >
                        {step}m
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <DatePicker
              mode="time"
              value={time12}
              onChange={setTime12}
              is24Hour={false}
              minuteInterval={minuteStep12}
              theme={themeMode}
              locale={currentLocale}
              format="hh:mm A"
            />

            {/* Live Result Ticket Card */}
            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>LIVE OUTPUT (12H)</Text>
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
              <Text style={[styles.cardTitle, { color: textColor }]}>
                24-Hour Military Time Picker
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Full continuous range from 00:00 to 23:59. Toggle seconds precision on or off with 1 tap.
              </Text>
            </View>

            <View style={styles.subControlRow}>
              <Text style={[styles.subControlLabel, { color: subtextColor }]}>Precision:</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowSeconds24(!showSeconds24)}
                style={[
                  styles.toggleChip,
                  {
                    backgroundColor: showSeconds24 ? `${primaryColor}18` : 'transparent',
                    borderColor: showSeconds24 ? primaryColor : borderColor,
                  },
                ]}
              >
                <Text style={[styles.toggleChipText, { color: showSeconds24 ? primaryColor : subtextColor }]}>
                  {showSeconds24 ? '✓ Seconds Enabled (HH:mm:ss)' : '+ Enable Seconds'}
                </Text>
              </TouchableOpacity>
            </View>

            <DatePicker
              mode="time"
              value={time24}
              onChange={setTime24}
              is24Hour={true}
              showSeconds={showSeconds24}
              theme={themeMode}
              locale={currentLocale}
              format={showSeconds24 ? 'HH:mm:ss' : 'HH:mm'}
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>LIVE OUTPUT (24H)</Text>
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
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Combined Date & Time Picker
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Synchronized Calendar and Clock tabs emitting a single unified JavaScript Date object.
              </Text>
            </View>

            <View style={styles.subControlRow}>
              <Text style={[styles.subControlLabel, { color: subtextColor }]}>Time Clock:</Text>
              <View style={[styles.intervalRow]}>
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
                  <Text style={[styles.intervalPillText, { color: !dateTimeIs24 ? primaryColor : subtextColor }]}>
                    12h AM/PM
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
                  <Text style={[styles.intervalPillText, { color: dateTimeIs24 ? primaryColor : subtextColor }]}>
                    24h
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <DatePicker
              mode="datetime"
              value={dateTimeVal}
              onChange={setDateTimeVal}
              is24Hour={dateTimeIs24}
              theme={themeMode}
              locale={currentLocale}
              format={dateTimeIs24 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY hh:mm A'}
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>FULL COMBINED TIMESTAMP</Text>
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
        {activeTab === 'time-constraints' && (
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
        )}

        {/* --- DEMO 5: CALENDAR DATE PICKER --- */}
        {activeTab === 'calendar' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Interactive Calendar Date Picker
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Month navigation, selected day highlighting, disabled weekends (Sundays disabled), and action buttons.
              </Text>
            </View>

            <DatePicker
              mode="calendar"
              value={calendarDate}
              onChange={setCalendarDate}
              theme={themeMode}
              locale={currentLocale}
              format="DD/MM/YYYY"
              allowManualEntry={true}
              disabledWeekdays={[0]}
              minimumDate={new Date(2020, 0, 1)}
              maximumDate={new Date(2030, 11, 31)}
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>SELECTED CALENDAR DATE</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {calendarDate ? formatDate(calendarDate, 'DD MMMM YYYY', currentLocale) : 'None'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 6: WHEEL DATE PICKER --- */}
        {activeTab === 'wheel' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Wheel Date Picker (Day / Month / Year)
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Smooth scrolling columns for Day, Month, and Year with leap year day synchronization.
              </Text>
            </View>

            <DatePicker
              mode="wheel"
              value={wheelDate}
              onChange={setWheelDate}
              theme={themeMode}
              locale={currentLocale}
              minYear={1970}
              maxYear={2040}
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>WHEEL DATE OUTPUT</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {wheelDate ? formatDate(wheelDate, 'DD/MM/YYYY', currentLocale) : 'None'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 7: DATE RANGE PICKER --- */}
        {activeTab === 'range' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Date Range Picker
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Start and End date selection with ribbon highlights and maxRangeDays constraints.
              </Text>
            </View>

            <DatePicker
              mode="range"
              startDate={range.startDate}
              endDate={range.endDate}
              onRangeChange={setRange}
              maxRangeDays={14}
              theme={themeMode}
              locale={currentLocale}
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>SELECTED RANGE</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {range.startDate ? formatDate(range.startDate, 'DD/MM/YYYY', currentLocale) : '--'}
                {'  →  '}
                {range.endDate ? formatDate(range.endDate, 'DD/MM/YYYY', currentLocale) : '--'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 8: INPUT MODAL PICKER --- */}
        {activeTab === 'input' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Input Field with Modal Popup
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Tap the text field to open a smooth pop-up calendar modal.
              </Text>
            </View>

            <DatePicker
              mode="input"
              value={inputDate}
              onChange={setInputDate}
              label="Appointment Date"
              format="DD/MM/YYYY"
              allowManualEntry={true}
              theme={themeMode}
              locale={currentLocale}
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>CURRENT DATE VALUE</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {inputDate ? formatDate(inputDate, 'DD/MM/YYYY', currentLocale) : 'None'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 9: CUSTOM MANUAL DATE ENTRY --- */}
        {activeTab === 'manual' && (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: textColor }]}>
                Custom Manual Date Typing
              </Text>
              <Text style={[styles.cardDesc, { color: subtextColor }]}>
                Strict date entry with immediate feedback for leap year days and month bounds.
              </Text>
            </View>

            <View style={styles.subControlRow}>
              <Text style={[styles.subControlLabel, { color: subtextColor }]}>Field Layout:</Text>
              <View style={styles.intervalRow}>
                <TouchableOpacity
                  onPress={() => setManualType('single')}
                  style={[
                    styles.intervalPill,
                    {
                      backgroundColor: manualType === 'single' ? `${primaryColor}18` : 'transparent',
                      borderColor: manualType === 'single' ? primaryColor : borderColor,
                    },
                  ]}
                >
                  <Text style={[styles.intervalPillText, { color: manualType === 'single' ? primaryColor : subtextColor }]}>
                    Single Field
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setManualType('split')}
                  style={[
                    styles.intervalPill,
                    {
                      backgroundColor: manualType === 'split' ? `${primaryColor}18` : 'transparent',
                      borderColor: manualType === 'split' ? primaryColor : borderColor,
                    },
                  ]}
                >
                  <Text style={[styles.intervalPillText, { color: manualType === 'split' ? primaryColor : subtextColor }]}>
                    Split Boxes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <DatePicker
              mode="calendar"
              value={manualDate}
              onChange={setManualDate}
              allowManualEntry={true}
              manualEntryType={manualType}
              format="DD/MM/YYYY"
              theme={themeMode}
              locale={currentLocale}
            />

            <View style={[styles.resultTicket, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderColor }]}>
              <View style={styles.ticketTopRow}>
                <Text style={[styles.ticketLabel, { color: subtextColor }]}>SYNCHRONIZED CALENDAR VALUE</Text>
                <View style={[styles.activeDot, { backgroundColor: '#10B981' }]} />
              </View>
              <Text style={[styles.ticketValue, { color: textColor }]}>
                {manualDate ? formatDate(manualDate, 'DD MMMM YYYY', currentLocale) : 'None'}
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
