import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  DatePicker,
  DateRange,
  SupportedLocale,
  formatDate,
} from '../src';

type DemoTab = 'calendar' | 'wheel' | 'range' | 'input' | 'manual';

export default function ExampleApp() {
  const [activeTab, setActiveTab] = useState<DemoTab>('calendar');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>('en');

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

  const isDark = themeMode === 'dark';
  const bgColor = isDark ? '#0F172A' : '#F8FAFC';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const primaryColor = '#2563EB';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bgColor}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>
            Date Picker Kit
          </Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            @izonnet-web-solution/react-native-date-picker-kit
          </Text>
        </View>

        {/* Global Controls: Theme & Localization */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>
            Global Settings
          </Text>

          <View style={styles.controlRow}>
            <Text style={[styles.controlLabel, { color: subtextColor }]}>
              Theme:
            </Text>
            <View style={styles.pillGroup}>
              <TouchableOpacity
                onPress={() => setThemeMode('light')}
                style={[
                  styles.pill,
                  themeMode === 'light' && { backgroundColor: primaryColor },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: themeMode === 'light' ? '#FFF' : subtextColor },
                  ]}
                >
                  Light
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setThemeMode('dark')}
                style={[
                  styles.pill,
                  themeMode === 'dark' && { backgroundColor: primaryColor },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: themeMode === 'dark' ? '#FFF' : subtextColor },
                  ]}
                >
                  Dark
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.controlRow}>
            <Text style={[styles.controlLabel, { color: subtextColor }]}>
              Locale:
            </Text>
            <View style={styles.pillGroup}>
              {(['en', 'hi', 'gu'] as SupportedLocale[]).map((loc) => (
                <TouchableOpacity
                  key={loc}
                  onPress={() => setCurrentLocale(loc)}
                  style={[
                    styles.pill,
                    currentLocale === loc && { backgroundColor: primaryColor },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: currentLocale === loc ? '#FFF' : subtextColor },
                    ]}
                  >
                    {loc === 'en' ? 'English' : loc === 'hi' ? 'हिंदी' : 'ગુજરાતી'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Navigation Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {[
            { id: 'calendar', label: '1. Calendar' },
            { id: 'wheel', label: '2. Wheel' },
            { id: 'range', label: '3. Range' },
            { id: 'input', label: '4. Input' },
            { id: 'manual', label: '5. Manual' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as DemoTab)}
                style={[
                  styles.tabButton,
                  isActive && {
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    { color: isActive ? '#FFFFFF' : subtextColor },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* --- DEMO 1: CALENDAR DATE PICKER --- */}
        {activeTab === 'calendar' && (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>
              1. Calendar Date Picker
            </Text>
            <Text style={[styles.cardDesc, { color: subtextColor }]}>
              Monthly grid navigation, selected date highlighting, minimum &
              maximum constraints, disabled weekends (Sundays disabled), and action
              shortcuts.
            </Text>

            <DatePicker
              mode="calendar"
              value={calendarDate}
              onChange={setCalendarDate}
              theme={themeMode}
              locale={currentLocale}
              format="DD/MM/YYYY"
              allowManualEntry={true}
              disabledWeekdays={[0]} // Disable Sundays
              minimumDate={new Date(2020, 0, 1)}
              maximumDate={new Date(2030, 11, 31)}
            />

            <View style={styles.resultBox}>
              <Text style={[styles.resultLabel, { color: subtextColor }]}>
                Selected Date:
              </Text>
              <Text style={[styles.resultValue, { color: textColor }]}>
                {calendarDate ? formatDate(calendarDate, 'DD MMMM YYYY') : 'None'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 2: WHEEL DATE PICKER --- */}
        {activeTab === 'wheel' && (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>
              2. Wheel Date Picker
            </Text>
            <Text style={[styles.cardDesc, { color: subtextColor }]}>
              Smooth scrolling columns for Day, Month, and Year. Automatically
              synchronizes days according to leap years and month lengths.
            </Text>

            <DatePicker
              mode="wheel"
              value={wheelDate}
              onChange={setWheelDate}
              theme={themeMode}
              locale={currentLocale}
              minYear={1970}
              maxYear={2040}
            />

            <View style={styles.resultBox}>
              <Text style={[styles.resultLabel, { color: subtextColor }]}>
                Selected Wheel Date:
              </Text>
              <Text style={[styles.resultValue, { color: textColor }]}>
                {wheelDate ? formatDate(wheelDate, 'DD/MM/YYYY') : 'None'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 3: DATE RANGE PICKER --- */}
        {activeTab === 'range' && (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>
              3. Date Range Picker
            </Text>
            <Text style={[styles.cardDesc, { color: subtextColor }]}>
              Select Start and End dates with highlighted continuous range ribbons.
              Prevents end date before start date and supports maxRangeDays.
            </Text>

            <DatePicker
              mode="range"
              startDate={range.startDate}
              endDate={range.endDate}
              onRangeChange={setRange}
              maxRangeDays={14}
              theme={themeMode}
              locale={currentLocale}
            />

            <View style={styles.resultBox}>
              <Text style={[styles.resultLabel, { color: subtextColor }]}>
                Selected Range:
              </Text>
              <Text style={[styles.resultValue, { color: textColor }]}>
                {range.startDate ? formatDate(range.startDate, 'DD/MM/YYYY') : '--'}{' '}
                to{' '}
                {range.endDate ? formatDate(range.endDate, 'DD/MM/YYYY') : '--'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 4: INPUT DATE PICKER --- */}
        {activeTab === 'input' && (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>
              4. Input Date Picker
            </Text>
            <Text style={[styles.cardDesc, { color: subtextColor }]}>
              Formatted text input field with calendar icon popup. Direct manual
              typing is automatically synchronized with the calendar modal.
            </Text>

            <DatePicker
              mode="input"
              value={inputDate}
              onChange={setInputDate}
              label="Date"
              format="DD/MM/YYYY"
              allowManualEntry={true}
              theme={themeMode}
              locale={currentLocale}
            />

            <View style={styles.resultBox}>
              <Text style={[styles.resultLabel, { color: subtextColor }]}>
                Current Date:
              </Text>
              <Text style={[styles.resultValue, { color: textColor }]}>
                {inputDate ? formatDate(inputDate, 'DD/MM/YYYY') : 'None'}
              </Text>
            </View>
          </View>
        )}

        {/* --- DEMO 5: CUSTOM MANUAL DATE ENTRY --- */}
        {activeTab === 'manual' && (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.cardTitle, { color: textColor }]}>
              5. Custom Manual Date Entry
            </Text>
            <Text style={[styles.cardDesc, { color: subtextColor }]}>
              Strict manual date parsing and validation. Try entering February 29
              on a non-leap year (e.g. 29/02/2023) or an invalid day (31/04/2024) to
              observe immediate validation feedback without silent normalization.
            </Text>

            <View style={[styles.controlRow, { marginBottom: 12 }]}>
              <Text style={[styles.controlLabel, { color: subtextColor }]}>
                Entry Layout:
              </Text>
              <View style={styles.pillGroup}>
                <TouchableOpacity
                  onPress={() => setManualType('single')}
                  style={[
                    styles.pill,
                    manualType === 'single' && { backgroundColor: primaryColor },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: manualType === 'single' ? '#FFF' : subtextColor },
                    ]}
                  >
                    Single Field
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setManualType('split')}
                  style={[
                    styles.pill,
                    manualType === 'split' && { backgroundColor: primaryColor },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      { color: manualType === 'split' ? '#FFF' : subtextColor },
                    ]}
                  >
                    Split Fields
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

            <View style={styles.resultBox}>
              <Text style={[styles.resultLabel, { color: subtextColor }]}>
                Synchronized Calendar Date:
              </Text>
              <Text style={[styles.resultValue, { color: textColor }]}>
                {manualDate ? formatDate(manualDate, 'DD MMMM YYYY') : 'None'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  pillGroup: {
    flexDirection: 'row',
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 6,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabsScroll: {
    marginBottom: 16,
  },
  tabsContent: {
    flexDirection: 'row',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  resultBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
});
