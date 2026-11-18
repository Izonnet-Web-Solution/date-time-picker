import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
} from 'react-native';
import type { DatePickerTheme, TimePeriod } from '../../types';
import {
  padZero,
  isHourDisabled,
  isMinuteDisabled,
  TimeValidationOptions,
} from '../../utils/timeUtils';

export interface ClockDialProps {
  mode: 'hours' | 'minutes';
  value: number; // current hours (1..12 or 0..23) or minutes (0..59)
  is24Hour?: boolean;
  period?: TimePeriod;
  onSelect: (value: number) => void;
  theme: DatePickerTheme;
  validationOptions?: TimeValidationOptions;
  size?: number;
}

export const ClockDial: React.FC<ClockDialProps> = ({
  mode,
  value,
  is24Hour = false,
  period = 'AM',
  onSelect,
  theme,
  validationOptions,
  size = 260,
}) => {
  const center = size / 2;
  const radius = size / 2 - 28;
  const innerRadius = radius - 36; // for 24h secondary inner circle

  const dialRef = useRef<View>(null);
  const dialLayoutRef = useRef<{ pageX: number; pageY: number }>({
    pageX: 0,
    pageY: 0,
  });

  // Keep latest props in refs for pan responder callbacks
  const stateRef = useRef({
    mode,
    value,
    is24Hour,
    period,
    validationOptions,
    onSelect,
    center,
    radius,
    innerRadius,
  });

  useEffect(() => {
    stateRef.current = {
      mode,
      value,
      is24Hour,
      period,
      validationOptions,
      onSelect,
      center,
      radius,
      innerRadius,
    };
  }, [mode, value, is24Hour, period, validationOptions, onSelect, center, radius, innerRadius]);

  const updateDialPosition = () => {
    dialRef.current?.measureInWindow((x, y) => {
      if (x !== undefined && y !== undefined) {
        dialLayoutRef.current = { pageX: x, pageY: y };
      }
    });
  };

  // Convert touch screen coordinates to selected hour or minute
  const handleTouchCoord = (pageX: number, pageY: number) => {
    const s = stateRef.current;
    const { pageX: dialX, pageY: dialY } = dialLayoutRef.current;
    const touchX = pageX - dialX;
    const touchY = pageY - dialY;
    const dx = touchX - s.center;
    const dy = touchY - s.center;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 12) return; // ignore center pivot

    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;

    if (s.mode === 'minutes') {
      const selectedMinute = Math.round(angle / 6) % 60;
      if (!isMinuteDisabled(selectedMinute, s.value, s.is24Hour, s.period, s.validationOptions)) {
        s.onSelect(selectedMinute);
      }
    } else {
      if (s.is24Hour) {
        const isInnerTouch = dist < (s.radius + s.innerRadius) / 2;
        let h = Math.round(angle / 30) % 12;
        if (isInnerTouch) {
          h = h === 0 ? 12 : h + 12;
        }
        if (!isHourDisabled(h, true, undefined, s.validationOptions)) {
          s.onSelect(h);
        }
      } else {
        let h = Math.round(angle / 30) % 12;
        if (h === 0) h = 12;
        if (!isHourDisabled(h, false, s.period, s.validationOptions)) {
          s.onSelect(h);
        }
      }
    }
  };

  // PanResponder to track continuous drag gestures (e.g. smoothly moving from 25 to 27)
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const { pageX, pageY, locationX, locationY } = evt.nativeEvent;
          if (dialLayoutRef.current.pageX === 0 && dialLayoutRef.current.pageY === 0) {
            dialLayoutRef.current = {
              pageX: pageX - locationX,
              pageY: pageY - locationY,
            };
          }
          updateDialPosition();
          handleTouchCoord(pageX, pageY);
        },
        onPanResponderMove: (evt) => {
          handleTouchCoord(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        },
        onPanResponderRelease: (evt) => {
          handleTouchCoord(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
        },
      }),
    []
  );

  // Calculate clock hand angle and radius based on mode and current value
  const { handAngleDeg, currentR } = useMemo(() => {
    if (mode === 'hours') {
      if (is24Hour) {
        if (value >= 12) {
          const idx = value - 12;
          return { handAngleDeg: idx * 30 - 90, currentR: innerRadius };
        } else {
          const idx = value === 0 ? 0 : value;
          return { handAngleDeg: idx * 30 - 90, currentR: radius };
        }
      } else {
        const idx = value === 12 ? 0 : value;
        return { handAngleDeg: idx * 30 - 90, currentR: radius };
      }
    } else {
      // Minutes: 0..59, each minute is exactly 6 degrees (e.g. 25 = 60°, 27 = 72°)
      const deg = (value % 60) * 6 - 90;
      return { handAngleDeg: deg, currentR: radius };
    }
  }, [mode, value, is24Hour, innerRadius, radius]);

  const handAngleRad = handAngleDeg * (Math.PI / 180);
  const handTipX = center + currentR * Math.cos(handAngleRad);
  const handTipY = center + currentR * Math.sin(handAngleRad);

  // Numbers to display on the dial
  const majorItems = useMemo(() => {
    if (mode === 'hours') {
      if (is24Hour) {
        // Outer ring: 00..11, Inner ring: 12..23
        const outer = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h, i) => {
          const actualH = h === 12 ? 0 : h;
          const disabled = isHourDisabled(actualH, true, undefined, validationOptions);
          return { num: actualH, label: padZero(actualH), index: i, isInner: false, disabled };
        });
        const inner = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((h, i) => {
          const disabled = isHourDisabled(h, true, undefined, validationOptions);
          return { num: h, label: String(h), index: i, isInner: true, disabled };
        });
        return [...outer, ...inner];
      } else {
        // 1..12 in outer ring
        return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h, i) => {
          const disabled = isHourDisabled(h, false, period, validationOptions);
          return { num: h, label: String(h), index: i, isInner: false, disabled };
        });
      }
    } else {
      // Minutes: 00, 05, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55
      return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m, i) => {
        const disabled = isMinuteDisabled(m, value, is24Hour, period, validationOptions);
        return { num: m, label: padZero(m), index: i, isInner: false, disabled };
      });
    }
  }, [mode, is24Hour, period, value, validationOptions]);

  // Minute tick marks (1..59 excluding multiples of 5)
  const minuteTicks = useMemo(() => {
    if (mode !== 'minutes') return [];
    const ticks = [];
    for (let m = 0; m < 60; m++) {
      if (m % 5 !== 0) {
        const disabled = isMinuteDisabled(m, value, is24Hour, period, validationOptions);
        ticks.push({
          num: m,
          angle: (m * 6 - 90) * (Math.PI / 180),
          disabled,
        });
      }
    }
    return ticks;
  }, [mode, value, is24Hour, period, validationOptions]);

  return (
    <View
      ref={dialRef}
      onLayout={() => updateDialPosition()}
      {...panResponder.panHandlers}
      style={[
        styles.clockContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `${theme.primaryColor}06`,
          borderColor: `${theme.primaryColor}22`,
        },
      ]}
    >
      {/* Decorative Minute Track Ring */}
      <View
        pointerEvents="none"
        style={[
          styles.trackRing,
          {
            left: center - radius,
            top: center - radius,
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            borderColor: `${theme.primaryColor}14`,
          },
        ]}
      />

      {/* 24h Inner Track Ring if applicable */}
      {mode === 'hours' && is24Hour && (
        <View
          pointerEvents="none"
          style={[
            styles.trackRing,
            {
              left: center - innerRadius,
              top: center - innerRadius,
              width: innerRadius * 2,
              height: innerRadius * 2,
              borderRadius: innerRadius,
              borderColor: `${theme.primaryColor}14`,
            },
          ]}
        />
      )}

      {/* Center Pivot Point */}
      <View
        pointerEvents="none"
        style={[
          styles.centerPivot,
          {
            left: center - 5,
            top: center - 5,
            backgroundColor: theme.primaryColor,
            borderColor: '#FFFFFF',
          },
        ]}
      />

      {/* Clock Hand Pointer Line */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: center,
          top: center - 1.5,
          width: currentR,
          height: 3,
          backgroundColor: theme.primaryColor,
          transformOrigin: 'left center',
          transform: [{ rotate: `${handAngleDeg}deg` }],
        }}
      />

      {/* Hand Tip Highlight Bubble with Glowing Effect */}
      <View
        pointerEvents="none"
        style={[
          styles.handTipBubble,
          {
            left: handTipX - 17,
            top: handTipY - 17,
            backgroundColor: theme.primaryColor,
            shadowColor: theme.primaryColor,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.45,
            shadowRadius: 5,
            elevation: 5,
          },
        ]}
      >
        <Text style={styles.handTipText}>
          {mode === 'minutes' ? padZero(value) : (is24Hour ? padZero(value) : String(value))}
        </Text>
      </View>

      {/* Minute Tick Marks (pointerEvents="none" so gesture stays on main surface) */}
      {minuteTicks.map((tick) => {
        const tx = center + radius * Math.cos(tick.angle);
        const ty = center + radius * Math.sin(tick.angle);
        const isSelected = tick.num === value;

        return (
          <View
            key={`tick-${tick.num}`}
            pointerEvents="none"
            style={[
              styles.tickDot,
              {
                left: tx - (isSelected ? 3.5 : 1.5),
                top: ty - (isSelected ? 3.5 : 1.5),
                width: isSelected ? 7 : 3,
                height: isSelected ? 7 : 3,
                borderRadius: isSelected ? 3.5 : 1.5,
                backgroundColor: isSelected
                  ? theme.primaryColor
                  : tick.disabled
                  ? `${theme.textColor}12`
                  : `${theme.textColor}35`,
              },
            ]}
          />
        );
      })}

      {/* Major Numbers (00, 05, 10... 55) */}
      {majorItems.map((item) => {
        const r = item.isInner ? innerRadius : radius;
        const angle = (item.index * 30 - 90) * (Math.PI / 180);
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        const isSelected = item.num === value;
        const btnSize = item.isInner ? 28 : 34;

        return (
          <View
            key={`${item.num}-${item.isInner}`}
            pointerEvents="none"
            style={[
              styles.numberNode,
              {
                left: x - btnSize / 2,
                top: y - btnSize / 2,
                width: btnSize,
                height: btnSize,
                borderRadius: btnSize / 2,
                backgroundColor: isSelected ? theme.primaryColor : 'transparent',
                opacity: item.disabled ? 0.3 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.numberText,
                {
                  color: isSelected
                    ? '#FFFFFF'
                    : item.isInner
                    ? theme.secondaryTextColor
                    : theme.textColor,
                  fontSize: item.isInner ? 11 : 13,
                  fontWeight: isSelected ? '800' : '600',
                },
              ]}
            >
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  clockContainer: {
    borderWidth: 1.5,
    position: 'relative',
    alignSelf: 'center',
    marginVertical: 12,
  },
  trackRing: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  centerPivot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    zIndex: 6,
  },
  handTipBubble: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 12,
  },
  handTipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
  tickDot: {
    position: 'absolute',
    zIndex: 8,
  },
  numberNode: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  numberText: {
    textAlign: 'center',
  },
});
