import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import type { DatePickerTheme } from '../../types';

export interface WheelItem {
  label: string;
  value: number;
}

export interface WheelColumnProps {
  items: WheelItem[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  theme: DatePickerTheme;
  itemHeight?: number;
  visibleItems?: number;
  accessibilityLabel?: string;
}

export const WheelColumn: React.FC<WheelColumnProps> = ({
  items,
  selectedValue,
  onValueChange,
  theme,
  itemHeight = 44,
  visibleItems = 5,
  accessibilityLabel,
}) => {
  const flatListRef = useRef<FlatList<WheelItem>>(null);
  const isUserScrolling = useRef(false);
  const isMomentumScrolling = useRef(false);
  const scrollTimeoutRef = useRef<any>(null);
  const isSelfTriggered = useRef(false);

  const containerHeight = itemHeight * visibleItems;
  const paddingVertical = (containerHeight - itemHeight) / 2;

  // Find index of selected item, defaulting to closest or 0
  const selectedIndex = items.findIndex((item) => item.value === selectedValue);

  // Guarantee correct scroll position on initial mount (especially inside Modal)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (flatListRef.current && selectedIndex >= 0) {
        flatListRef.current.scrollToOffset({
          offset: selectedIndex * itemHeight,
          animated: false,
        });
      }
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Sync scroll position when selectedValue changes externally
  useEffect(() => {
    if (isSelfTriggered.current) {
      isSelfTriggered.current = false;
      return;
    }

    if (
      !isUserScrolling.current &&
      !isMomentumScrolling.current &&
      selectedIndex >= 0 &&
      flatListRef.current
    ) {
      flatListRef.current.scrollToOffset({
        offset: selectedIndex * itemHeight,
        animated: true,
      });
    }
  }, [selectedIndex, itemHeight]);

  const snapToOffset = (offsetY: number) => {
    const index = Math.round(offsetY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    const targetItem = items[clampedIndex];

    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: clampedIndex * itemHeight,
        animated: true,
      });
    }

    if (targetItem && targetItem.value !== selectedValue) {
      isSelfTriggered.current = true;
      onValueChange(targetItem.value);
    }

    isUserScrolling.current = false;
    isMomentumScrolling.current = false;
  };

  const handleScrollBegin = () => {
    isUserScrolling.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  };

  const handleScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const velocity = Math.abs(e.nativeEvent.velocity?.y || 0);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // If momentum is active with high velocity, let onMomentumScrollEnd handle the snap
    if (velocity > 0.1) {
      return;
    }

    // For stationary release or small drag, snap smoothly
    scrollTimeoutRef.current = setTimeout(() => {
      if (!isMomentumScrolling.current) {
        snapToOffset(offsetY);
      }
    }, 50);
  };

  const handleMomentumScrollBegin = () => {
    isMomentumScrolling.current = true;
  };

  const handleMomentumScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    isMomentumScrolling.current = false;
    snapToOffset(e.nativeEvent.contentOffset.y);
  };

  const renderItem = ({ item, index }: { item: WheelItem; index: number }) => {
    const isSelected = item.value === selectedValue;
    const distance = Math.abs(index - (selectedIndex >= 0 ? selectedIndex : 0));
    const opacity = isSelected ? 1 : Math.max(0.25, 1 - distance * 0.3);
    const scale = isSelected ? 1.08 : 0.92;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          isUserScrolling.current = false;
          isMomentumScrolling.current = false;
          snapToOffset(index * itemHeight);
        }}
        style={[styles.itemContainer, { height: itemHeight }]}
      >
        <Text
          style={[
            styles.itemText,
            {
              color: isSelected ? theme.primaryColor : theme.textColor,
              fontSize: isSelected
                ? theme.fontSize.large + 2
                : theme.fontSize.medium,
              fontWeight: isSelected ? '700' : '500',
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.container, { height: containerHeight }]}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
    >
      {/* Center highlight lens */}
      <View
        pointerEvents="none"
        style={[
          styles.highlightIndicator,
          {
            top: paddingVertical,
            height: itemHeight,
            borderColor: `${theme.primaryColor}40`,
            backgroundColor: `${theme.primaryColor}14`,
            borderRadius: 8,
          },
        ]}
      />

      {/* Top subtle fade overlay */}
      <View
        pointerEvents="none"
        style={[
          styles.fadeOverlay,
          styles.topFade,
          {
            height: paddingVertical,
            backgroundColor: theme.surfaceColor,
            opacity: 0.75,
          },
        ]}
      />

      {/* Bottom subtle fade overlay */}
      <View
        pointerEvents="none"
        style={[
          styles.fadeOverlay,
          styles.bottomFade,
          {
            height: paddingVertical,
            backgroundColor: theme.surfaceColor,
            opacity: 0.75,
          },
        ]}
      />

      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.value)}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        nestedScrollEnabled={true}
        overScrollMode="never"
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollBegin={handleMomentumScrollBegin}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{
          paddingVertical,
        }}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        initialScrollIndex={selectedIndex >= 0 ? selectedIndex : 0}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({
              offset: info.index * itemHeight,
              animated: false,
            });
          }, 50);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  highlightIndicator: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    zIndex: 1,
  },
  fadeOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  topFade: {
    top: 0,
  },
  bottomFade: {
    bottom: 0,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    textAlign: 'center',
  },
});
